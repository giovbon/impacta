/**
 * Regras de validação do anexo do formulário de entrega (Quartz Impacta).
 *
 * Fica em um módulo separado (e não dentro do script inline) para poder ser
 * testado com `npm test`: o `submission.inline.ts` executa código de DOM
 * assim que é importado, o que impediria o teste em Node.
 */

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB
export const EXTENSAO_PERMITIDA = /\.zip$/i // apenas .zip (.rar/.7z recusados)

/**
 * Assinaturas (magic bytes) de um arquivo ZIP de verdade:
 * `PK\x03\x04` (normal), `PK\x05\x06` (vazio) e `PK\x07\x08` (segmentado).
 */
const ZIP_ASSINATURAS: number[][] = [
  [0x50, 0x4b, 0x03, 0x04],
  [0x50, 0x4b, 0x05, 0x06],
  [0x50, 0x4b, 0x07, 0x08],
]

/**
 * Confere se os primeiros bytes do arquivo correspondem à assinatura de um ZIP.
 */
export function assinaturaEhZip(bytes: ArrayLike<number>): boolean {
  return ZIP_ASSINATURAS.some((assinatura) => assinatura.every((byte, i) => bytes[i] === byte))
}

/**
 * Lê os primeiros bytes do arquivo (necessário para conferir a assinatura).
 */
export async function lerAssinatura(file: Blob): Promise<number[]> {
  const buffer = await file.slice(0, 4).arrayBuffer()
  return Array.from(new Uint8Array(buffer))
}

/**
 * Valida o anexo da entrega: extensão `.zip`, tamanho e formato real do conteúdo.
 *
 * Retorna a mensagem de erro pronta para exibição, ou `null` quando aceito.
 *
 * A checagem de assinatura (PK) existe para impedir o truque de renomear um
 * `.pdf`/`.py` para `.zip`: o atributo `accept` do input e a extensão, sozinhos,
 * não garantem o formato do conteúdo (basta escolher "Todos os arquivos" no
 * diálogo do sistema ou renomear o arquivo).
 */
export async function validarArquivoZip(file: File): Promise<string | null> {
  if (!EXTENSAO_PERMITIDA.test(file.name)) {
    return "Apenas arquivos .zip são aceitos (PDF, .py, .rar e .7z são recusados)."
  }

  if (file.size === 0) {
    return "O arquivo está vazio. Gere o .zip novamente."
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "Arquivo muito grande (máx. 20MB)."
  }

  const assinatura = await lerAssinatura(file)
  if (!assinaturaEhZip(assinatura)) {
    return "O arquivo não é um ZIP válido. Renomear para .zip (ex.: um PDF) não o converte em ZIP."
  }

  return null
}
