import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { buildQuiz, parseQuiz, renderQuiz } from "../src/components/quiz/render.js"

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const FIXTURE = "test/fixtures/quiz-valido.md"

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
  assert.match(html, /data-quiz-hint/)
  assert.match(html, /class="quiz-explanation"/)
  assert.match(html, /Ative o JavaScript para conferir as respostas/)
  assert.match(html, /<legend class="quiz-sr-only">Questão 1<\/legend>/)
  assert.doesNotMatch(html, /\saction=/, "quiz não envia nada")
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
  assert.equal(item.quiz.questions.length, 3)
  assert.equal(item.quiz.questions[0].tipo, "single")
  assert.equal(item.quiz.questions[2].tipo, "multiple")
})

test("quiz: arquivo inexistente vira aviso na página, sem quebrar o build", () => {
  const html = semRuido(() => renderQuiz({ quiz: "quizzes/nao-existe.md" }))

  assert.match(html, /class="quiz quiz--erro"/)
  assert.match(html, /arquivo não encontrado/)
  assert.match(html, /quizzes\/nao-existe\.md/)
})
