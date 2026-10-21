/**
 * Componente `quiz` — correção local, sem rede.
 *
 * O HTML já traz o gabarito em `data-correct` (o quiz é formativo, não uma
 * avaliação). Este módulo só cuida de marcar acertos/erros, mostrar dicas e
 * explicações, limpar e calcular a pontuação.
 */

function atualizarSelecionadas(pergunta) {
  for (const opcao of pergunta.querySelectorAll(".quiz-option")) {
    const input = opcao.querySelector(".quiz-option__input")
    opcao.classList.toggle("is-selected", Boolean(input?.checked))
  }
}

function limparPergunta(pergunta) {
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

  const feedbackPergunta = pergunta.querySelector("[data-quiz-feedback]")
  if (feedbackPergunta) {
    feedbackPergunta.hidden = true
    feedbackPergunta.classList.remove("is-empty")
    const status = feedbackPergunta.querySelector(".quiz-feedback__status")
    if (status) status.textContent = ""
  }
}

function limparQuiz(quiz, perguntas) {
  for (const pergunta of perguntas) {
    limparPergunta(pergunta)
    atualizarSelecionadas(pergunta)
  }

  const resultado = quiz.querySelector("[data-quiz-result]")
  if (resultado) {
    resultado.hidden = true
    resultado.replaceChildren()
  }
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

function corrigir(quiz, perguntas) {
  let acertos = 0
  let respondidas = 0

  for (const pergunta of perguntas) {
    limparPergunta(pergunta)

    const inputs = [...pergunta.querySelectorAll(".quiz-option__input")]
    const selecionadas = inputs.filter((input) => input.checked)
    const corretas = inputs.filter((input) => input.dataset.correct === "true")
    const acertou =
      selecionadas.length > 0 &&
      selecionadas.length === corretas.length &&
      selecionadas.every((input) => input.dataset.correct === "true")

    if (selecionadas.length > 0) respondidas += 1
    if (acertou) acertos += 1

    for (const input of inputs) {
      const opcao = input.closest(".quiz-option")
      if (!opcao) continue

      const correta = input.dataset.correct === "true"
      const marcada = input.checked

      if (correta && marcada) opcao.classList.add("is-correct")
      else if (correta && !marcada && selecionadas.length > 0) opcao.classList.add("is-missed")
      else if (!correta && marcada) opcao.classList.add("is-incorrect")

      // O status é texto de verdade (não só cor/pseudo-elemento): leitores de
      // tela conseguem ouvir "correta"/"incorreta" ao navegar pelas opções.
      const status = opcao.querySelector(".quiz-option__status")
      if (status) {
        if (correta && marcada) status.textContent = "correta"
        else if (correta && !marcada && selecionadas.length > 0) {
          status.textContent = "correta (não marcada)"
        } else if (!correta && marcada) status.textContent = "incorreta"
        status.hidden = status.textContent === ""
      }

      if (!correta && marcada) input.setAttribute("aria-invalid", "true")

      // Comentários das opções aparecem só para o que foi marcado ou para a
      // resposta correta (revelada depois de conferir).
      const feedback = opcao.querySelector(".quiz-option__feedback")
      if (feedback && (marcada || correta)) feedback.hidden = false
    }

    const feedbackPergunta = pergunta.querySelector("[data-quiz-feedback]")
    const status = feedbackPergunta?.querySelector(".quiz-feedback__status")
    if (feedbackPergunta && status) {
      feedbackPergunta.hidden = false
      feedbackPergunta.classList.toggle("is-empty", selecionadas.length === 0)

      if (selecionadas.length === 0) status.textContent = "⚠️ Selecione uma resposta."
      else if (acertou) status.textContent = "✅ Resposta correta."
      else status.textContent = "❌ Resposta incorreta."
    }
  }

  const resultado = quiz.querySelector("[data-quiz-result]")
  if (!resultado) return

  const total = perguntas.length
  const naoRespondidas = total - respondidas
  const percentual = total > 0 ? Math.round((acertos / total) * 100) : 0

  const resumo = document.createElement("strong")
  resumo.textContent = `${acertos} de ${total} ${total === 1 ? "questão correta" : "questões corretas"}`

  const detalhe = document.createElement("span")
  detalhe.textContent = `${percentual}%`

  resultado.replaceChildren(resumo, document.createTextNode(" · "), detalhe)

  if (naoRespondidas > 0) {
    const aviso = document.createElement("span")
    aviso.className = "quiz__result-nota"
    aviso.textContent = `${naoRespondidas} não ${naoRespondidas === 1 ? "respondida" : "respondidas"}`
    resultado.append(document.createTextNode(" · "), aviso)
  }

  resultado.hidden = false
}

function initQuizUnico(quiz) {
  const form = quiz.querySelector("[data-quiz-form]")
  if (!form) return

  const perguntas = [...quiz.querySelectorAll(".quiz-question")]
  if (perguntas.length === 0) return

  for (const botao of quiz.querySelectorAll("[data-quiz-hint]")) {
    botao.addEventListener("click", () => mostrarDica(botao))
  }

  form.addEventListener("change", (event) => {
    const pergunta = event.target.closest?.(".quiz-question")
    if (!pergunta) return

    // Mudar uma resposta invalida a correção daquela questão (e a pontuação
    // exibida), mas não apaga as marcações das outras.
    limparPergunta(pergunta)
    atualizarSelecionadas(pergunta)

    const resultado = quiz.querySelector("[data-quiz-result]")
    if (resultado) {
      resultado.hidden = true
      resultado.replaceChildren()
    }
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
  })
}

export function initQuiz() {
  for (const quiz of document.querySelectorAll(".quiz[data-quiz]")) initQuizUnico(quiz)
}
