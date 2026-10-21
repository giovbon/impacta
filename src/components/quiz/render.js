import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { ROOT, asList, markdown } from "../../_lib/content.js"

/**
 * Componente `quiz` — quiz de múltipla escolha corrigido no navegador.
 *
 * Frontmatter da página:
 *   quiz: "quizzes/ast01.md"
 *   quiz:
 *     - "quizzes/ast01.md"
 *     - "quizzes/ast02.md"
 *
 * O arquivo do quiz usa uma sintaxe inspirada no Quizdown (que é a referência
 * de autoria, não uma dependência):
 *
 *   ---
 *   title: Fundamentos de pytest   # opcional
 *   shuffleQuestions: false        # opcional
 *   shuffleAnswers: false          # opcional
 *   ---
 *
 *   ### Qual comando executa os testes?
 *
 *   > Dica: é o comando que descobre testes automaticamente.
 *
 *   1. [x] `pytest`
 *       > Correto: o pytest descobre e executa os testes.
 *   1. [ ] `python`
 *   1. [ ] `pip`
 *
 *   > Explicação mostrada depois de conferir.
 *
 * Regras da sintaxe:
 *  - cada título (`#`, `##`, ...) começa uma questão;
 *  - lista ordenada (`1. [x]`) = escolha única;
 *  - lista não ordenada (`- [x]`) = múltipla escolha;
 *  - blockquote antes das opções = dica;
 *  - blockquote depois das opções = explicação;
 *  - blockquote indentado embaixo de uma opção = comentário daquela opção.
 *
 * Não há envio de resposta: o gabarito fica no HTML e a correção é local. Isso
 * é intencional — o quiz é um recurso didático, não uma avaliação.
 */

// O fechamento `###` só é removido quando vem separado por espaço (CommonMark):
// assim um título como "O que é C#?" preserva o `#`.
const HEADING_RE = /^(#{1,6})[ \t]+(.+?)(?:[ \t]+#*)?[ \t]*$/
const OPTION_RE = /^([ \t]*)([-*+]|\d+[.)])[ \t]+\[([ xX])\][ \t]+(.*)$/
const FENCE_RE = /^[ \t]*(`{3,}|~{3,})(.*)$/
const QUOTE_RE = /^([ \t]*)>[ \t]?(.*)$/

const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const escapeAttr = (value) => escapeHtml(value).replace(/"/g, "&quot;")

function toBool(value) {
  return value === true || value === 1 || value === "1" || String(value).toLowerCase() === "true"
}

function slugify(value) {
  return (
    String(value)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "quiz"
  )
}

function hashString(value) {
  let hash = 2166136261
  for (const char of String(value)) {
    hash ^= char.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(list, random) {
  for (let index = list.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1))
    ;[list[index], list[target]] = [list[target], list[index]]
  }
  return list
}

function renderMarkdownBlock(lines) {
  const source = lines.join("\n").trim()
  return source ? markdown.render(source) : ""
}

function renderMarkdownInline(lines) {
  const source = lines.join(" ").trim()
  return source ? markdown.renderInline(source) : ""
}

function finalizarPergunta(pergunta, indice, erros) {
  const rotulo = (pergunta.heading || `Questão ${indice + 1}`).replace(/[*_`[\]]/g, "").trim()

  if (!pergunta.heading) {
    erros.push(`Questão ${indice + 1}: o título da questão está vazio.`)
  }
  if (!pergunta.tipo) {
    erros.push(`Questão "${rotulo}": nenhuma opção encontrada (use \`- [x]\` ou \`1. [x]\`).`)
  }
  if (pergunta.options.length < 2) {
    erros.push(`Questão "${rotulo}": são necessárias pelo menos duas opções.`)
  }

  const corretas = pergunta.options.filter((opcao) => opcao.correta).length
  if (pergunta.tipo === "single" && corretas !== 1) {
    erros.push(
      `Questão "${rotulo}": escolha única precisa ter exatamente uma opção correta (tem ${corretas}).`,
    )
  }
  if (pergunta.tipo === "multiple" && corretas === 0) {
    erros.push(`Questão "${rotulo}": múltipla escolha precisa ter pelo menos uma opção correta.`)
  }

  for (const [indiceOpcao, opcao] of pergunta.options.entries()) {
    if (!opcao.texto.trim()) {
      erros.push(`Questão "${rotulo}": a opção ${indiceOpcao + 1} está vazia.`)
    }
  }

  return {
    id: `q${indice + 1}`,
    tipo: pergunta.tipo ?? "multiple",
    prompt: renderMarkdownBlock([pergunta.heading, ...pergunta.corpo]),
    dica: renderMarkdownBlock(pergunta.dica),
    explicacao: renderMarkdownBlock(pergunta.explicacao),
    options: pergunta.options.map((opcao, indiceOpcao) => ({
      id: `o${indiceOpcao + 1}`,
      texto: renderMarkdownInline([opcao.texto]),
      correta: opcao.correta,
      feedback: renderMarkdownInline(opcao.feedback),
    })),
  }
}

/**
 * Converte o markdown do quiz em dados prontos para o HTML.
 * Lança `Error` com todas as inconsistências de autoria de uma vez.
 */
export function parseQuiz(texto, opcoes = {}) {
  // BOM no começo do arquivo impediria o gray-matter de reconhecer o `---`.
  const { data, content } = matter(String(texto ?? "").replace(/^\uFEFF/, ""))
  const erros = []
  const perguntas = []

  let pergunta = null
  let opcaoAtual = null
  let modo = "fora" // fora | pre | opcoes | pos
  let emCerco = false
  let cerco = ""

  const alvoDaLinha = (linha) => {
    if (!pergunta) return
    if (modo === "pre") pergunta.corpo.push(linha)
    else pergunta.explicacao.push(linha)
  }

  for (const linha of content.split(/\r?\n/)) {
    if (emCerco) {
      alvoDaLinha(linha)
      const fechamento = linha.match(FENCE_RE)
      if (fechamento && fechamento[1][0] === cerco[0] && fechamento[1].length >= cerco.length) {
        emCerco = false
      }
      continue
    }

    const abertura = linha.match(FENCE_RE)
    if (abertura) {
      emCerco = true
      cerco = abertura[1]
      alvoDaLinha(linha)
      continue
    }

    const titulo = linha.match(HEADING_RE)
    if (titulo) {
      if (pergunta) perguntas.push(finalizarPergunta(pergunta, perguntas.length, erros))
      pergunta = {
        heading: titulo[2].trim(),
        corpo: [],
        dica: [],
        explicacao: [],
        options: [],
        tipo: null,
      }
      modo = "pre"
      opcaoAtual = null
      continue
    }

    if (!pergunta) continue

    const opcao = linha.match(OPTION_RE)
    if (opcao) {
      const tipo = /^[-*+]$/.test(opcao[2]) ? "multiple" : "single"
      if (!pergunta.tipo) pergunta.tipo = tipo
      else if (pergunta.tipo !== tipo) {
        erros.push(
          `Questão "${pergunta.heading}": não misture opções de escolha única (\`1. [x]\`) ` +
            "com múltipla escolha (`- [x]`).",
        )
      }

      opcaoAtual = {
        texto: opcao[4].trim(),
        correta: /x/i.test(opcao[3]),
        feedback: [],
      }
      pergunta.options.push(opcaoAtual)
      modo = "opcoes"
      continue
    }

    const citacao = linha.match(QUOTE_RE)
    if (citacao) {
      // Recuo de 2+ espaços logo abaixo de uma opção = comentário da opção.
      if (modo === "opcoes" && opcaoAtual && citacao[1].replace(/\t/g, "    ").length >= 2) {
        opcaoAtual.feedback.push(citacao[2])
        continue
      }

      if (modo === "pre") {
        pergunta.dica.push(citacao[2])
      } else {
        pergunta.explicacao.push(citacao[2])
        modo = "pos"
        opcaoAtual = null
      }
      continue
    }

    if (linha.trim() === "") {
      if (modo === "pre") pergunta.corpo.push("")
      else if (modo === "pos") pergunta.explicacao.push("")
      continue
    }

    if (modo === "pre") {
      pergunta.corpo.push(linha)
    } else {
      pergunta.explicacao.push(linha)
      modo = "pos"
      opcaoAtual = null
    }
  }

  if (pergunta) perguntas.push(finalizarPergunta(pergunta, perguntas.length, erros))

  if (perguntas.length === 0) {
    erros.push("Nenhuma questão encontrada. Cada questão começa com um título markdown (`### ...`).")
  }

  if (erros.length > 0) throw new Error(erros.join("\n"))

  const id = slugify(data.id ?? opcoes.id ?? "quiz")
  const title = typeof data.title === "string" ? data.title.trim() : ""
  const shuffleQuestions = toBool(data.shuffleQuestions)
  const shuffleAnswers = toBool(data.shuffleAnswers)

  if (shuffleQuestions) shuffle(perguntas, mulberry32(hashString(id)))
  if (shuffleAnswers) {
    perguntas.forEach((item, indice) => {
      shuffle(item.options, mulberry32(hashString(`${id}:${indice}`)))
    })
  }

  return { id, title, questions: perguntas, shuffleQuestions, shuffleAnswers }
}

/**
 * Lê cada arquivo declarado em `quiz` (string ou lista).
 * Devolve `null` quando a chave não existe e uma entrada por arquivo,
 * com `erro` preenchido quando o arquivo não existe ou é inválido.
 */
export function buildQuiz(frontmatter) {
  const fontes = asList(frontmatter?.quiz)
    .filter((origem) => typeof origem === "string" && origem.trim() !== "")
    .map((origem) => origem.trim())

  if (fontes.length === 0) return null

  const vistos = new Set()

  return fontes.map((origem) => {
    const relativo = origem.replace(/^\/+/, "")
    const absoluto = path.join(ROOT, relativo)

    if (!fs.existsSync(absoluto)) {
      console.error(`[quiz] arquivo não encontrado: ${relativo} (declarado no frontmatter)`)
      return { origem: relativo, erro: "arquivo não encontrado" }
    }

    try {
      const quiz = parseQuiz(fs.readFileSync(absoluto, "utf8"), {
        id: path.basename(relativo, path.extname(relativo)),
      })

      let id = quiz.id
      let sufixo = 2
      while (vistos.has(id)) id = `${quiz.id}-${sufixo++}`
      vistos.add(id)
      quiz.id = id

      return { origem: relativo, quiz, erro: "" }
    } catch (erro) {
      console.error(`[quiz] ${relativo}: ${erro.message}`)
      return { origem: relativo, erro: erro.message }
    }
  })
}

function renderErro(item) {
  return `<section class="quiz quiz--erro" role="alert">
  <p><strong>Quiz indisponível.</strong></p>
  <p>${escapeHtml(item.origem)}: ${escapeHtml(item.erro)}</p>
</section>`
}

function renderPergunta(quiz, pergunta, indice) {
  const idPergunta = `quiz-${quiz.id}-${pergunta.id}`
  const idPrompt = `${idPergunta}-prompt`
  const idDica = `${idPergunta}-dica`
  const tipoInput = pergunta.tipo === "single" ? "radio" : "checkbox"

  const opcoes = pergunta.options
    .map((opcao) => {
      const feedback = opcao.feedback
        ? `\n            <span class="quiz-option__feedback" hidden>${opcao.feedback}</span>`
        : ""
      return `        <label class="quiz-option" data-option-id="${escapeAttr(opcao.id)}">
          <input class="quiz-option__input" type="${tipoInput}" name="${escapeAttr(idPergunta)}-resposta" value="${escapeAttr(opcao.id)}" data-correct="${opcao.correta}">
          <span class="quiz-option__body">
            <span class="quiz-option__text">${opcao.texto}</span>
            <span class="quiz-option__status" hidden></span>${feedback}
          </span>
        </label>`
    })
    .join("\n")

  const dica = pergunta.dica
    ? `      <button type="button" class="quiz-hint-btn" data-quiz-hint aria-expanded="false" aria-controls="${escapeAttr(idDica)}">Ver dica</button>
      <div class="quiz-hint" id="${escapeAttr(idDica)}" hidden>${pergunta.dica}</div>`
    : ""

  const explicacao = pergunta.explicacao
    ? `\n        <div class="quiz-explanation">${pergunta.explicacao}</div>`
    : ""

  return `    <fieldset class="quiz-question" data-question-id="${escapeAttr(pergunta.id)}" data-question-type="${escapeAttr(pergunta.tipo)}" aria-labelledby="${escapeAttr(idPrompt)}">
      <legend class="quiz-sr-only">Questão ${indice + 1}</legend>
      <div class="quiz-question__prompt" id="${escapeAttr(idPrompt)}">${pergunta.prompt}</div>
${dica}
      <div class="quiz-options">
${opcoes}
      </div>
      <div class="quiz-feedback" data-quiz-feedback hidden>
        <p class="quiz-feedback__status"></p>${explicacao}
      </div>
    </fieldset>`
}

function renderSecaoQuiz(quiz) {
  const titulo = quiz.title || "Teste seus conhecimentos"
  const idTitulo = `quiz-${quiz.id}-titulo`
  const total = quiz.questions.length
  const tipos = new Set(quiz.questions.map((pergunta) => pergunta.tipo))
  const tipo =
    tipos.size > 1
      ? "escolha única e múltipla escolha"
      : tipos.has("single")
        ? "escolha única"
        : "múltipla escolha"
  const meta = `${total} ${total === 1 ? "questão" : "questões"} · ${tipo}`

  return `<section class="quiz" data-quiz="${escapeAttr(quiz.id)}" aria-labelledby="${escapeAttr(idTitulo)}">
  <header class="quiz__header">
    <p class="quiz__kicker">Quiz</p>
    <h2 class="quiz__title" id="${escapeAttr(idTitulo)}">${escapeHtml(titulo)}</h2>
    <p class="quiz__meta">${meta}</p>
  </header>
  <form class="quiz__form" data-quiz-form novalidate>
${quiz.questions.map((pergunta, indice) => renderPergunta(quiz, pergunta, indice)).join("\n")}
    <div class="quiz__actions">
      <button type="submit" class="quiz-btn quiz-btn--primary">Conferir respostas</button>
      <button type="button" class="quiz-btn quiz-btn--ghost" data-quiz-reset>Limpar</button>
    </div>
    <div class="quiz__result" data-quiz-result role="status" aria-live="polite" hidden></div>
  </form>
  <noscript><p class="quiz__noscript">Ative o JavaScript para conferir as respostas.</p></noscript>
</section>`
}

/** HTML do componente (string vazia quando não há `quiz`). */
export function renderQuiz(frontmatter) {
  const quizzes = buildQuiz(frontmatter)
  if (!quizzes) return ""

  return quizzes
    .map((item) => (item.erro ? renderErro(item) : renderSecaoQuiz(item.quiz)))
    .join("\n")
}
