import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { buildQuiz, parseQuiz, renderQuiz } from "../src/components/quiz/render.js"

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const FIXTURE = "test/fixtures/quiz-valido.md"
const FIXTURE_TEXTO = "test/fixtures/quiz-texto.md"

/** As funções de build reclamam no console; nos testes de erro isso é ruído. */
function semRuido(fn) {
  const original = console.error
  console.error = () => {}
  try {
    return fn()
  } finally {
    console.error = original
  }
}

function lerFixture() {
  return fs.readFileSync(path.join(RAIZ, FIXTURE), "utf8")
}

function lerFixtureTexto() {
  return fs.readFileSync(path.join(RAIZ, FIXTURE_TEXTO), "utf8")
}

/* ───────────────────────── parser ───────────────────────── */

test("quiz: interpreta escolha única, múltipla escolha, dica e explicação", () => {
  const quiz = parseQuiz(lerFixture(), { id: "exemplo" })

  assert.equal(quiz.id, "exemplo")
  assert.equal(quiz.title, "Quiz de exemplo")
  assert.equal(quiz.questions.length, 2)

  const [unica, multipla] = quiz.questions

  assert.equal(unica.tipo, "single")
  assert.equal(unica.options.length, 3)
  assert.equal(unica.options.filter((opcao) => opcao.correta).length, 1)
  assert.match(unica.prompt, /Qual comando executa os testes\?/)
  assert.match(unica.dica, /Dica:/)
  assert.match(unica.explicacao, /runner usado neste projeto/)
  assert.match(unica.options[0].texto, /<code>pytest<\/code>/)
  assert.match(unica.options[0].feedback, /Correto:/)

  assert.equal(multipla.tipo, "multiple")
  assert.equal(multipla.options.length, 4)
  assert.equal(multipla.options.filter((opcao) => opcao.correta).length, 2)
  assert.match(multipla.explicacao, /tmp_path/)
})

test("quiz: preserva # no título e remove fechamento de heading", () => {
  const comSharp = parseQuiz("### O que é C#?\n\n1. [x] Uma linguagem\n1. [ ] Um editor\n")
  assert.match(comSharp.questions[0].prompt, /C#\?/)

  const comFechamento = parseQuiz("### Título ###\n\n1. [x] A\n1. [ ] B\n")
  assert.match(comFechamento.questions[0].prompt, /Título/)
  assert.doesNotMatch(comFechamento.questions[0].prompt, /###/)
})

test("quiz: interpreta resposta escrita com código e alternativas", () => {
  const [questao] = parseQuiz(lerFixtureTexto(), { id: "lacuna" }).questions

  assert.equal(questao.tipo, "text")
  assert.equal(questao.options.length, 0)
  assert.deepEqual(questao.respostas, ["-c", "--create"])
  assert.deepEqual(questao.respostasTexto, ["-c", "--create"])
  assert.match(questao.prompt, /git switch ___ feature/)
  assert.match(questao.prompt, /<pre><code/)
  assert.match(questao.prompt, /src="\/static\/quiz\/merge-tres-vias\.svg"/)
  assert.match(questao.dica, /flag curta/)
  assert.match(questao.explicacao, /forma curta de/)
})

test("quiz: resposta escrita ignora caixa e espaços repetidos", () => {
  const [questao] = parseQuiz("### Qual?\n\nResposta: Git  MERGE feature\n").questions

  assert.equal(questao.tipo, "text")
  assert.deepEqual(questao.respostas, ["git merge feature"])
})

test("quiz: resposta escrita aceita pipe literal escapado", () => {
  const [questao] = parseQuiz(
    "### Qual?\n\nResposta: git log \\| grep fixo | git log --grep\n",
  ).questions

  assert.deepEqual(questao.respostasTexto, ["git log | grep fixo", "git log --grep"])
  assert.deepEqual(questao.respostas, ["git log | grep fixo", "git log --grep"])
})

test("quiz: rejeita Resposta vazia", () => {
  assert.throws(() => parseQuiz("### Qual?\n\nResposta:\n"), /está vazia/)
})

test("quiz: rejeita mistura de Resposta e opções", () => {
  assert.throws(
    () => parseQuiz("### Qual?\n\nResposta: a\n\n1. [x] A\n1. [ ] B\n"),
    /não misture `Resposta:` com opções/,
  )
})

test("quiz: o mesmo arquivo com shuffle é determinístico", () => {
  const fonte =
    "---\nshuffleAnswers: true\n---\n### Qual?\n\n1. [x] A\n1. [ ] B\n1. [ ] C\n"
  const primeiro = parseQuiz(fonte, { id: "embaralhado" })
  const segundo = parseQuiz(fonte, { id: "embaralhado" })

  assert.deepEqual(
    primeiro.questions[0].options.map((opcao) => opcao.texto),
    segundo.questions[0].options.map((opcao) => opcao.texto),
  )
  assert.equal(primeiro.questions[0].options.filter((opcao) => opcao.correta).length, 1)
})

test("quiz: aceita frontmatter com BOM no começo", () => {
  const comBom = parseQuiz("\uFEFF---\ntitle: Com BOM\n---\n\n### Qual?\n\n1. [x] A\n1. [ ] B\n")

  assert.equal(comBom.title, "Com BOM")
  assert.equal(comBom.questions.length, 1)
})

test("quiz: rejeita escolha única com mais de uma correta", () => {
  assert.throws(
    () => parseQuiz("### Qual?\n\n1. [x] A\n1. [x] B\n"),
    /exatamente uma opção correta/,
  )
})

test("quiz: rejeita múltipla escolha sem nenhuma correta", () => {
  assert.throws(() => parseQuiz("### Qual?\n\n- [ ] A\n- [ ] B\n"), /pelo menos uma opção correta/)
})

test("quiz: rejeita questão sem opções", () => {
  assert.throws(() => parseQuiz("### Qual?\n\n> Só uma dica.\n"), /nenhuma opção encontrada/)
})

test("quiz: rejeita mistura de escolha única e múltipla escolha", () => {
  assert.throws(
    () => parseQuiz("### Qual?\n\n1. [x] A\n- [ ] B\n"),
    /não misture opções de escolha única/,
  )
})

test("quiz: rejeita arquivo sem nenhuma questão", () => {
  assert.throws(() => parseQuiz("---\ntitle: Vazio\n---\n\n"), /Nenhuma questão encontrada/)
})

/* ───────────────────────── leitura e HTML ───────────────────────── */

test("quiz: lê o arquivo do frontmatter e monta o HTML acessível", () => {
  const html = renderQuiz({ quiz: FIXTURE })

  assert.match(html, /<section class="quiz" data-quiz="quiz-valido"/)
  assert.match(html, /class="quiz__title"/)
  assert.match(html, /Quiz de exemplo/)
  assert.equal((html.match(/class="quiz-question"/g) ?? []).length, 2)
  assert.match(html, /type="radio"/)
  assert.match(html, /type="checkbox"/)
  assert.match(html, /data-correct="true"/)
  assert.match(html, /class="quiz-option__status" hidden/)
  assert.match(html, /data-question-tipo="single">Escolha 1 alternativa</)
  assert.match(html, /data-question-tipo="multiple">Escolha 1 ou mais alternativas</)
  assert.match(html, /data-quiz-hint/)
  assert.match(html, /class="quiz-explanation"/)
  assert.match(html, /Ative o JavaScript para conferir as respostas/)
  assert.match(html, /<legend class="quiz-sr-only">Questão 1<\/legend>/)
  assert.doesNotMatch(html, /\saction=/, "quiz não envia nada")
})

test("quiz: questão escrita vira input de texto com o gabarito", () => {
  const html = renderQuiz({ quiz: FIXTURE_TEXTO })

  assert.match(html, /data-question-type="text"/)
  assert.match(html, /<input class="quiz-answer__input" type="text"/)
  assert.match(html, /data-answers="\[&quot;-c&quot;,&quot;--create&quot;\]"/)
  assert.match(html, /data-answer-display="-c"/)
  assert.match(html, /Sua resposta/)
  assert.match(html, /A comparação ignora maiúsculas/)
  assert.doesNotMatch(html, /class="quiz-option"/)
  assert.doesNotMatch(html, /quiz-question__tipo/)
  assert.match(html, /1 questão · resposta escrita/)
  assert.match(html, /data-quiz-download hidden/)
  assert.match(html, /class="quiz-btn quiz-btn--download"/)
  assert.match(html, /Baixar resultado \(\.txt\)/)
})

test("quiz: uma lista no frontmatter gera um quiz por arquivo", () => {
  const html = renderQuiz({ quiz: [FIXTURE, FIXTURE] })

  assert.equal((html.match(/<section class="quiz" /g) ?? []).length, 2)
  assert.match(html, /data-quiz="quiz-valido"/)
  assert.match(html, /data-quiz="quiz-valido-2"/)
})

test("quiz: sem a chave no frontmatter não renderiza nada", () => {
  assert.equal(renderQuiz({}), "")
  assert.equal(renderQuiz(undefined), "")
  assert.equal(renderQuiz({ quiz: "" }), "")
  assert.equal(buildQuiz({}), null)
})

test("quiz: o exemplo real em quizzes/ é válido", () => {
  const [item] = buildQuiz({ quiz: "quizzes/git-branch-merge.md" })

  assert.equal(item.erro, "")
  assert.equal(item.quiz.questions.length, 5)
  const tipos = item.quiz.questions.map((q) => q.tipo)
  assert.deepEqual([...tipos].sort(), ["multiple", "single", "single", "single", "text"].sort())
  const escrita = item.quiz.questions.find((q) => q.tipo === "text")
  assert.deepEqual(escrita.respostas, ["-c", "--create"])
  const [diagrama] = item.quiz.questions.filter((q) => /merge-tres-vias\.svg/.test(q.prompt))
  assert.equal(diagrama.tipo, "single")
})

test("quiz: código e imagem do exemplo real chegam ao HTML", () => {
  const html = renderQuiz({ quiz: "quizzes/git-branch-merge.md" })

  assert.match(html, /<pre><code class="hljs language-bash" data-lang="bash">/)
  assert.match(html, /src="\/static\/quiz\/merge-tres-vias\.svg"/)
  assert.match(html, /alt="Diagrama de um merge de três vias/)
  assert.match(html, /data-quiz-download hidden/)
})

test("quiz: arquivo inexistente vira aviso na página, sem quebrar o build", () => {
  const html = semRuido(() => renderQuiz({ quiz: "quizzes/nao-existe.md" }))

  assert.match(html, /class="quiz quiz--erro"/)
  assert.match(html, /arquivo não encontrado/)
  assert.match(html, /quizzes\/nao-existe\.md/)
})
