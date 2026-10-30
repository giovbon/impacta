/**
 * Componente `quiz` — correção local, sem rede.
 *
 * O HTML já traz o gabarito em `data-correct`/`data-answers` (o quiz é
 * formativo, não uma avaliação). Este módulo cuida de marcar acertos/erros,
 * mostrar dicas, explicações, limpar, calcular a pontuação e gerar o `.txt`
 * com as questões erradas. Questões em branco não revelam o gabarito: a
 * resposta correta, os comentários e a explicação só aparecem após uma
 * tentativa.
 */

/** Mesma normalização do build: caixa, crases e espaços repetidos não contam. */
function normalizarResposta(value) {
  return String(value ?? "")
    .trim()
    .replace(/^`+|`+$/g, "")
    .replace(/^["']+|["']+$/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
}

function lerAceitas(input) {
  try {
    const valor = JSON.parse(input?.dataset.answers ?? "[]")
    return Array.isArray(valor) ? valor.map(normalizarResposta) : []
  } catch {
    return []
  }
}

/**
 * Marcas de status em símbolos de texto (✔/✘/◐/!), não em emoji colorido:
 * glifos de emoji (✅/❌) trazem a própria cor e ignoram o `color` do CSS.
 * A marca é decorativa (`aria-hidden`); o texto ao lado é o que o leitor de
 * tela anuncia.
 */
const SIMBOLO_MARCA = {
  ok: "✔",
  bad: "✘",
  partial: "◐",
  aviso: "!",
}

function escreverStatus(elemento, texto, tipo) {
  if (!elemento) return

  elemento.replaceChildren()

  if (!texto) {
    elemento.hidden = true
    return
  }

  const marca = document.createElement("span")
  marca.className = `quiz-mark quiz-mark--${tipo}`
  marca.setAttribute("aria-hidden", "true")
  marca.textContent = SIMBOLO_MARCA[tipo] ?? SIMBOLO_MARCA.aviso

  elemento.append(marca, document.createTextNode(` ${texto}`))
  elemento.hidden = false
}

function atualizarSelecionadas(pergunta) {
  for (const opcao of pergunta.querySelectorAll(".quiz-option")) {
    const input = opcao.querySelector(".quiz-option__input")
    opcao.classList.toggle("is-selected", Boolean(input?.checked))
  }
}

function limparPergunta(pergunta) {
  delete pergunta.dataset.quizStatus
  delete pergunta.dataset.quizPoints

  for (const opcao of pergunta.querySelectorAll(".quiz-option")) {
    opcao.classList.remove("is-correct", "is-incorrect", "is-missed")

    const input = opcao.querySelector(".quiz-option__input")
    input?.removeAttribute("aria-invalid")

    const status = opcao.querySelector(".quiz-option__status")
    if (status) {
      status.hidden = true
      status.textContent = ""
    }
  }

  for (const feedback of pergunta.querySelectorAll(".quiz-option__feedback")) {
    feedback.hidden = true
  }

  const resposta = pergunta.querySelector(".quiz-answer__input")
  if (resposta) {
    resposta.classList.remove("is-correct", "is-incorrect")
    resposta.removeAttribute("aria-invalid")
  }

  const feedbackPergunta = pergunta.querySelector("[data-quiz-feedback]")
  if (feedbackPergunta) {
    feedbackPergunta.hidden = true
    feedbackPergunta.classList.remove("is-empty")
    const status = feedbackPergunta.querySelector(".quiz-feedback__status")
    if (status) status.textContent = ""
    const explicacao = feedbackPergunta.querySelector(".quiz-explanation")
    if (explicacao) explicacao.hidden = false
  }
}

function esconderResultado(quiz) {
  const resultado = quiz.querySelector("[data-quiz-result]")
  if (resultado) {
    resultado.hidden = true
    resultado.replaceChildren()
  }
}

function limparQuiz(quiz, perguntas) {
  for (const pergunta of perguntas) {
    limparPergunta(pergunta)
    atualizarSelecionadas(pergunta)
  }

  esconderResultado(quiz)
  mostrarDownload(quiz, false)
}

function mostrarDownload(quiz, visivel) {
  const botao = quiz.querySelector("[data-quiz-download]")
  if (botao) botao.hidden = !visivel
}

/* ───────────────────── rascunho no navegador ───────────────────── */

/**
 * Guarda as respostas no `sessionStorage` para sobreviver a um recarregamento
 * acidental. A chave combina o id do quiz e o caminho da página, e o mapa usa
 * os ids das questões/opções (não as posições), então o shuffle do build não
 * quebra o rascunho. Nunca vai para a rede e nunca é obrigatório: qualquer
 * falha de storage (modo anônimo, cota, storage desabilitado) é ignorada.
 */
const VERSAO_RASCUNHO = 1

function chaveRascunho(quiz) {
  const id = quiz.dataset.quiz || "quiz"
  return `quiz:${id}:${window.location.pathname}`
}

function lerRespostas(quiz) {
  const questoes = {}

  for (const pergunta of quiz.querySelectorAll(".quiz-question")) {
    const id = pergunta.dataset.questionId
    if (!id) continue

    const entrada = pergunta.querySelector(".quiz-answer__input")
    if (entrada) {
      questoes[id] = { texto: entrada.value }
      continue
    }

    questoes[id] = {
      opcoes: [...pergunta.querySelectorAll(".quiz-option")]
        .filter((opcao) => opcao.querySelector(".quiz-option__input")?.checked)
        .map((opcao) => opcao.dataset.optionId),
    }
  }

  return { v: VERSAO_RASCUNHO, questoes }
}

function salvarRespostas(quiz) {
  try {
    sessionStorage.setItem(chaveRascunho(quiz), JSON.stringify(lerRespostas(quiz)))
  } catch {
    // sem persistência, o quiz continua funcionando normalmente
  }
}

function apagarRespostas(quiz) {
  try {
    sessionStorage.removeItem(chaveRascunho(quiz))
  } catch {
    // idem
  }
}

/** Repõe o rascunho sem restaurar correção: o aluno confere de novo. */
function restaurarRespostas(quiz) {
  let rascunho
  try {
    const bruto = sessionStorage.getItem(chaveRascunho(quiz))
    if (!bruto) return false
    rascunho = JSON.parse(bruto)
  } catch {
    return false
  }

  if (!rascunho || typeof rascunho !== "object") return false
  if (rascunho.v !== VERSAO_RASCUNHO || !rascunho.questoes) return false

  let restaurou = false

  for (const pergunta of quiz.querySelectorAll(".quiz-question")) {
    const id = pergunta.dataset.questionId
    const salvo = id ? rascunho.questoes[id] : null
    if (!salvo || typeof salvo !== "object") continue

    if (salvo.texto !== undefined) {
      const entrada = pergunta.querySelector(".quiz-answer__input")
      if (entrada && typeof salvo.texto === "string") {
        entrada.value = salvo.texto
        if (salvo.texto) restaurou = true
      }
      continue
    }

    const marcadas = new Set(Array.isArray(salvo.opcoes) ? salvo.opcoes : [])
    for (const opcao of pergunta.querySelectorAll(".quiz-option")) {
      const input = opcao.querySelector(".quiz-option__input")
      if (input) input.checked = marcadas.has(opcao.dataset.optionId)
    }
    if (marcadas.size > 0) restaurou = true
  }

  return restaurou
}

function esconderDicas(quiz) {
  for (const botao of quiz.querySelectorAll("[data-quiz-hint]")) {
    botao.setAttribute("aria-expanded", "false")
    botao.textContent = "Ver dica"
    const id = botao.getAttribute("aria-controls")
    const dica = id ? document.getElementById(id) : null
    if (dica) dica.hidden = true
  }
}

function mostrarDica(botao) {
  const id = botao.getAttribute("aria-controls")
  const dica = id ? document.getElementById(id) : null
  if (!dica) return

  const aberta = botao.getAttribute("aria-expanded") === "true"
  botao.setAttribute("aria-expanded", String(!aberta))
  botao.textContent = aberta ? "Ver dica" : "Ocultar dica"
  dica.hidden = aberta
}

/* ───────────────────── relatório em texto ───────────────────── */

const TAGS_BLOCO = new Set([
  "p",
  "div",
  "ul",
  "ol",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "table",
  "thead",
  "tbody",
  "tr",
  "figure",
  "figcaption",
])

/**
 * HTML do quiz → texto legível no `.txt`: blocos viram quebras de linha,
 * listas viram `-`, código preserva o conteúdo e imagens viram `[imagem: alt]`.
 */
function textoPlano(no) {
  if (!no) return ""

  const partes = []

  const visitar = (atual) => {
    if (atual.nodeType === Node.TEXT_NODE) {
      partes.push(atual.nodeValue.replace(/\s+/g, " "))
      return
    }
    if (atual.nodeType !== Node.ELEMENT_NODE) return

    const tag = atual.tagName.toLowerCase()

    if (tag === "br") {
      partes.push("\n")
      return
    }
    if (tag === "img") {
      partes.push(`[imagem${atual.alt ? `: ${atual.alt}` : ""}]`)
      return
    }
    if (tag === "pre") {
      // O site injeta um botão "copiar" dentro do <pre>; o código é o <code>.
      const codigo = atual.querySelector("code")?.textContent ?? atual.textContent
      partes.push(`\n${codigo.replace(/^\n+|\s+$/g, "")}\n`)
      return
    }
    if (tag === "li") {
      partes.push("\n- ")
      for (const filho of atual.childNodes) visitar(filho)
      return
    }

    const bloco = TAGS_BLOCO.has(tag)
    if (bloco) partes.push("\n")
    for (const filho of atual.childNodes) visitar(filho)
    if (bloco) partes.push("\n")
  }

  visitar(no)

  return partes
    .join("")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function indentar(texto, prefixo = "  ") {
  return String(texto ?? "")
    .split("\n")
    .map((linha) => (linha.trim() ? `${prefixo}${linha}` : ""))
    .join("\n")
}

function nomeDoArquivo(quiz) {
  const id = (quiz.dataset.quiz || "quiz")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return `${id || "quiz"}-resultado.txt`
}

function descreverQuestao(pergunta, indice) {
  const numero = indice + 1
  const status = pergunta.dataset.quizStatus
  const tentou = status !== "empty"
  const rotulo =
    status === "empty"
      ? "não respondida"
      : status === "partial"
        ? "parcialmente correta"
        : "incorreta"
  const linhas = [
    "",
    "-".repeat(72),
    `Questão ${numero} — ${rotulo}`,
    "-".repeat(72),
    "",
    "Enunciado:",
    indentar(textoPlano(pergunta.querySelector(".quiz-question__prompt"))),
    "",
  ]

  const entrada = pergunta.querySelector(".quiz-answer__input")

  if (entrada) {
    const digitada = entrada.value.trim()
    const esperada = entrada.dataset.answerDisplay || lerAceitas(entrada)[0] || ""
    linhas.push("Sua resposta:", digitada ? indentar(digitada) : "  (em branco)", "")

    // Sem tentativa, o relatório não entrega o gabarito.
    if (tentou) linhas.push("Resposta correta:", indentar(esperada), "")
  } else {
    const opcoes = [...pergunta.querySelectorAll(".quiz-option")]

    const marcadas = opcoes.filter(
      (opcao) => opcao.querySelector(".quiz-option__input")?.checked,
    )
    const corretas = opcoes.filter(
      (opcao) => opcao.querySelector(".quiz-option__input")?.dataset.correct === "true",
    )

    linhas.push("Sua resposta:")
    if (!tentou) {
      linhas.push("  (não respondida)", "")
    } else {
      for (const opcao of marcadas) {
        linhas.push(`  - ${textoPlano(opcao.querySelector(".quiz-option__text"))}`)
      }

      linhas.push("", "Resposta correta:")
      for (const opcao of corretas) {
        linhas.push(`  - ${textoPlano(opcao.querySelector(".quiz-option__text"))}`)
      }
      linhas.push("")

      const comentarios = opcoes
        .map((opcao) => ({
          texto: textoPlano(opcao.querySelector(".quiz-option__text")),
          comentario: textoPlano(opcao.querySelector(".quiz-option__feedback")),
        }))
        .filter((item) => item.comentario)

      if (comentarios.length > 0) {
        linhas.push("Comentários das opções:")
        for (const item of comentarios) {
          linhas.push(`  - ${item.texto}: ${item.comentario}`)
        }
        linhas.push("")
      }
    }
  }

  const dica = textoPlano(pergunta.querySelector(".quiz-hint"))
  if (dica) linhas.push("Dica:", indentar(dica), "")

  // A explicação é a resolução: só entra no relatório depois de uma tentativa.
  if (tentou) {
    const explicacao = textoPlano(pergunta.querySelector(".quiz-explanation"))
    if (explicacao) linhas.push("Explicação:", indentar(explicacao), "")
  }

  return linhas
}

function montarRelatorio(quiz, perguntas) {
  const tituloBruto = quiz.querySelector(".quiz__title")?.textContent.trim() || "Quiz"
  const titulo = tituloBruto.replace(/^quiz\s*[-—–:]\s*/i, "") || tituloBruto
  const total = perguntas.length
  const acertos = perguntas.filter((pergunta) => pergunta.dataset.quizStatus === "correct").length
  const parciais = perguntas.filter((pergunta) => pergunta.dataset.quizStatus === "partial").length
  // O percentual soma o crédito parcial de cada questão (0 a 1), não só as
  // corretas inteiras — ver `calcularPontos`.
  const somaPontos = perguntas.reduce((soma, pergunta) => soma + (Number(pergunta.dataset.quizPoints) || 0), 0)
  const percentual = total > 0 ? Math.round((somaPontos / total) * 100) : 0

  const linhas = [
    `QUIZ — ${titulo}`,
    "=".repeat(72),
    `Resultado: acertou ${acertos} de ${total} ${total === 1 ? "questão" : "questões"} (${percentual}%)`,
    `Data: ${new Date().toLocaleString("pt-BR")}`,
    `Página: ${window.location.href}`,
    "",
  ]
  if (parciais > 0) {
    linhas.push(`Questões parcialmente corretas: ${parciais}`)
  }
  linhas.push(`Questões para revisar: ${total - acertos}`)

  if (total === acertos) {
    linhas.push("", "Você acertou todas as questões. Nada para revisar.")
    return linhas.join("\r\n")
  }

  perguntas.forEach((pergunta, indice) => {
    if (pergunta.dataset.quizStatus === "correct") return
    linhas.push(...descreverQuestao(pergunta, indice))
  })

  return linhas.join("\r\n")
}

function baixarRelatorio(quiz, perguntas) {
  const texto = montarRelatorio(quiz, perguntas)
  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = nomeDoArquivo(quiz)
  link.rel = "noopener"
  document.body.append(link)
  link.click()
  link.remove()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/* ───────────────────── correção ───────────────────── */

/**
 * Pontuação de uma questão (0 a 1) para o percentual final:
 *
 *  - `single`/`text`: binário — 1 ou 0.
 *  - `multiple`: crédito parcial. Cada opção é uma "decisão" (marcar ou não
 *    marcar) e a fração de decisões corretas vira pontos fracionários. Assim,
 *    marcar uma correta entre duas não zera a questão, e marcar tudo a esmo
 *    não dá nota cheia (as não marcadas corretas também contam).
 *
 * A resposta completa continua tudo-ou-nada para o status "correta"/"incorreta"
 * — o crédito parcial só afeta a nota percentual. Sem seleção, não há pontos.
 */
function calcularPontos(pergunta, inputs) {
  const selecionadas = inputs.filter((input) => input.checked)
  const corretas = inputs.filter((input) => input.dataset.correct === "true")
  if (selecionadas.length === 0 || inputs.length === 0) return 0

  const completa =
    selecionadas.length === corretas.length &&
    selecionadas.every((input) => input.dataset.correct === "true")

  if (completa) return 1

  if (pergunta.dataset.questionType === "single") return 0

  const decisoesCorretas = inputs.filter(
    (input) => (input.dataset.correct === "true") === input.checked,
  ).length
  return decisoesCorretas / inputs.length
}

function corrigir(quiz, perguntas) {
  let acertos = 0
  let respondidas = 0
  let somaPontos = 0

  for (const pergunta of perguntas) {
    limparPergunta(pergunta)

    const entrada = pergunta.querySelector(".quiz-answer__input")

    if (entrada) {
      const normalizada = normalizarResposta(entrada.value)
      const aceitas = lerAceitas(entrada)
      const respondeu = normalizada !== ""
      const acertou = respondeu && aceitas.includes(normalizada)

      if (respondeu) respondidas += 1
      if (acertou) acertos += 1
      somaPontos += acertou ? 1 : 0
      pergunta.dataset.quizPoints = String(acertou ? 1 : 0)

      pergunta.dataset.quizStatus = acertou ? "correct" : respondeu ? "wrong" : "empty"

      entrada.classList.toggle("is-correct", acertou)
      entrada.classList.toggle("is-incorrect", respondeu && !acertou)
      if (respondeu && !acertou) entrada.setAttribute("aria-invalid", "true")

      const feedbackPergunta = pergunta.querySelector("[data-quiz-feedback]")
      const status = feedbackPergunta?.querySelector(".quiz-feedback__status")
      if (feedbackPergunta && status) {
        feedbackPergunta.hidden = false
        feedbackPergunta.classList.toggle("is-empty", !respondeu)

        const explicacao = feedbackPergunta.querySelector(".quiz-explanation")
        if (explicacao) explicacao.hidden = !respondeu

        const esperada = entrada.dataset.answerDisplay || aceitas[0] || ""
        if (!respondeu) escreverStatus(status, "Digite uma resposta.", "aviso")
        else if (acertou) escreverStatus(status, "Resposta correta.", "ok")
        else escreverStatus(status, `Resposta incorreta. Resposta esperada: ${esperada}`, "bad")
      }

      continue
    }

    const inputs = [...pergunta.querySelectorAll(".quiz-option__input")]
    const selecionadas = inputs.filter((input) => input.checked)
    const corretas = inputs.filter((input) => input.dataset.correct === "true")
    const tentou = selecionadas.length > 0
    const acertou =
      selecionadas.length > 0 &&
      selecionadas.length === corretas.length &&
      selecionadas.every((input) => input.dataset.correct === "true")
    const pontos = calcularPontos(pergunta, inputs)

    if (tentou) respondidas += 1
    if (acertou) acertos += 1
    somaPontos += pontos
    pergunta.dataset.quizPoints = String(pontos)

    pergunta.dataset.quizStatus =
      acertou ? "correct" : !tentou ? "empty" : pontos > 0 ? "partial" : "wrong"

    for (const input of inputs) {
      const opcao = input.closest(".quiz-option")
      if (!opcao) continue

      const correta = input.dataset.correct === "true"
      const marcada = input.checked

      if (correta && marcada) opcao.classList.add("is-correct")
      else if (correta && !marcada && tentou) opcao.classList.add("is-missed")
      else if (!correta && marcada) opcao.classList.add("is-incorrect")

      // O status é texto de verdade (não só cor/pseudo-elemento): leitores de
      // tela conseguem ouvir "correta"/"incorreta" ao navegar pelas opções.
      const status = opcao.querySelector(".quiz-option__status")
      if (status) {
        if (correta && marcada) escreverStatus(status, "correta", "ok")
        else if (correta && !marcada && tentou) {
          escreverStatus(status, "correta (não marcada)", "ok")
        } else if (!correta && marcada) escreverStatus(status, "incorreta", "bad")
      }

      if (!correta && marcada) input.setAttribute("aria-invalid", "true")

      // Comentários das opções aparecem só para o que foi marcado ou para a
      // resposta correta, depois que a pessoa tentou responder.
      const feedback = opcao.querySelector(".quiz-option__feedback")
      if (feedback && tentou && (marcada || correta)) feedback.hidden = false
    }

    const feedbackPergunta = pergunta.querySelector("[data-quiz-feedback]")
    const status = feedbackPergunta?.querySelector(".quiz-feedback__status")
    if (feedbackPergunta && status) {
      feedbackPergunta.hidden = false
      feedbackPergunta.classList.toggle("is-empty", !tentou)

      const explicacao = feedbackPergunta.querySelector(".quiz-explanation")
      if (explicacao) explicacao.hidden = !tentou

      if (!tentou) escreverStatus(status, "Selecione uma resposta.", "aviso")
      else if (acertou) escreverStatus(status, "Resposta correta.", "ok")
      else if (pontos > 0) escreverStatus(status, "Resposta parcialmente correta.", "partial")
      else escreverStatus(status, "Resposta incorreta.", "bad")
    }
  }

  const resultado = quiz.querySelector("[data-quiz-result]")
  if (!resultado) return

  const total = perguntas.length
  const naoRespondidas = total - respondidas
  const parciais = perguntas.filter((pergunta) => pergunta.dataset.quizStatus === "partial").length
  const percentual = total > 0 ? Math.round((somaPontos / total) * 100) : 0

  const resumo = document.createElement("strong")
  resumo.textContent = `acertou ${acertos} de ${total} ${total === 1 ? "questão" : "questões"}`

  const detalhe = document.createElement("span")
  detalhe.textContent = `${percentual}%`

  resultado.replaceChildren(resumo, document.createTextNode(" · "), detalhe)

  if (parciais > 0) {
    const nota = document.createElement("span")
    nota.className = "quiz__result-nota"
    nota.textContent = `${parciais} ${parciais === 1 ? "parcialmente correta" : "parcialmente corretas"}`
    resultado.append(document.createTextNode(" · "), nota)
  }

  if (naoRespondidas > 0) {
    const aviso = document.createElement("span")
    aviso.className = "quiz__result-nota"
    aviso.textContent = `${naoRespondidas} não ${naoRespondidas === 1 ? "respondida" : "respondidas"}`
    resultado.append(document.createTextNode(" · "), aviso)
  }

  resultado.hidden = false
  mostrarDownload(quiz, true)
}

function initQuizUnico(quiz) {
  const form = quiz.querySelector("[data-quiz-form]")
  if (!form) return

  const perguntas = [...quiz.querySelectorAll(".quiz-question")]
  if (perguntas.length === 0) return

  // Antes de pendurar os listeners: repõe o rascunho salvo (recarregar a
  // página não perde o que já foi respondido).
  if (restaurarRespostas(quiz)) {
    for (const pergunta of perguntas) atualizarSelecionadas(pergunta)
  }

  for (const botao of quiz.querySelectorAll("[data-quiz-hint]")) {
    botao.addEventListener("click", () => mostrarDica(botao))
  }

  const aoEditar = (event) => {
    const pergunta = event.target.closest?.(".quiz-question")
    if (!pergunta) return

    // Mudar uma resposta invalida a correção daquela questão (e a pontuação
    // exibida), mas não apaga as marcações das outras.
    limparPergunta(pergunta)
    atualizarSelecionadas(pergunta)
    esconderResultado(quiz)
    mostrarDownload(quiz, false)
    salvarRespostas(quiz)
  }

  form.addEventListener("change", aoEditar)
  form.addEventListener("input", (event) => {
    if (event.target.matches?.(".quiz-answer__input")) aoEditar(event)
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault()
    corrigir(quiz, perguntas)
  })

  const reset = quiz.querySelector("[data-quiz-reset]")
  reset?.addEventListener("click", () => {
    form.reset()
    limparQuiz(quiz, perguntas)
    esconderDicas(quiz)
    apagarRespostas(quiz)
  })

  const download = quiz.querySelector("[data-quiz-download]")
  download?.addEventListener("click", () => baixarRelatorio(quiz, perguntas))
}

export function initQuiz() {
  for (const quiz of document.querySelectorAll(".quiz[data-quiz]")) initQuizUnico(quiz)
}
