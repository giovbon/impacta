import test, { describe } from "node:test"
import assert from "node:assert"
import {
  EXTENSAO_PERMITIDA,
  MAX_FILE_SIZE_BYTES,
  assinaturaEhZip,
  validarArquivoZip,
} from "./submissionFile"

const ZIP_HEADER = [0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00]
const ZIP_VAZIO_HEADER = [0x50, 0x4b, 0x05, 0x06, 0x00, 0x00]
const PDF_HEADER = [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37] // %PDF-1.7
const PY_HEADER = [0x69, 0x6d, 0x70, 0x6f, 0x72, 0x74, 0x20, 0x6f] // "import o"

const arquivo = (nome: string, bytes: number[]) => new File([new Uint8Array(bytes)], nome)

describe("assinaturaEhZip", () => {
  test("reconhece ZIP normal e ZIP vazio", () => {
    assert(assinaturaEhZip(ZIP_HEADER))
    assert(assinaturaEhZip(ZIP_VAZIO_HEADER))
  })

  test("rejeita PDF, .py e conteúdo desconhecido", () => {
    assert(!assinaturaEhZip(PDF_HEADER))
    assert(!assinaturaEhZip(PY_HEADER))
    assert(!assinaturaEhZip([0x00, 0x01, 0x02, 0x03]))
    assert(!assinaturaEhZip([]))
  })
})

describe("EXTENSAO_PERMITIDA", () => {
  test("aceita .zip (inclusive em maiúsculas)", () => {
    assert(EXTENSAO_PERMITIDA.test("entrega.zip"))
    assert(EXTENSAO_PERMITIDA.test("ENTREGA.ZIP"))
    assert(EXTENSAO_PERMITIDA.test("exercicio_ast07.tar.zip"))
  })

  test("recusa extensões não permitidas", () => {
    for (const nome of ["a.pdf", "a.py", "a.rar", "a.7z", "a.zipx", "a.txt", "a"]) {
      assert(!EXTENSAO_PERMITIDA.test(nome), `deveria recusar ${nome}`)
    }
  })
})

describe("validarArquivoZip", () => {
  test("aceita ZIP de verdade", async () => {
    assert.strictEqual(await validarArquivoZip(arquivo("entrega.zip", ZIP_HEADER)), null)
  })

  test("recusa PDF e .py enviados direto", async () => {
    const erroPdf = await validarArquivoZip(arquivo("relatorio.pdf", PDF_HEADER))
    assert.match(String(erroPdf), /Apenas arquivos \.zip/)

    const erroPy = await validarArquivoZip(arquivo("script.py", PY_HEADER))
    assert.match(String(erroPy), /Apenas arquivos \.zip/)

    const erroRar = await validarArquivoZip(arquivo("entrega.rar", ZIP_HEADER))
    assert.match(String(erroRar), /Apenas arquivos \.zip/)
  })

  test("recusa PDF/.py renomeado para .zip", async () => {
    const erroPdf = await validarArquivoZip(arquivo("relatorio.pdf.zip", PDF_HEADER))
    assert.match(String(erroPdf), /não é um ZIP válido/)

    const erroPy = await validarArquivoZip(arquivo("script.zip", PY_HEADER))
    assert.match(String(erroPy), /não é um ZIP válido/)
  })

  test("recusa arquivo vazio", async () => {
    const erro = await validarArquivoZip(arquivo("vazio.zip", []))
    assert.match(String(erro), /está vazio/)
  })

  test("recusa arquivo acima de 20MB", async () => {
    const grande = new File([new Uint8Array(MAX_FILE_SIZE_BYTES + 1)], "grande.zip")
    const erro = await validarArquivoZip(grande)
    assert.match(String(erro), /muito grande/)
  })
})
