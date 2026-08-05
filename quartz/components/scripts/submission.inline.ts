// ═══════════════════════════════════════════════════════════════════════
// SCRIPT DE SUBMISSÃO - GOOGLE SHEETS
// ═══════════════════════════════════════════════════════════════════════
//
// INSTRUÇÕES PARA CONFIGURAR:
//
// 1. Crie uma planilha do Google
//
// 2. Cole o conteúdo de "google-sheets-apps-script.gs" no Editor do
//    Google Apps Script (Extensões > Apps Script)
//
// 3. Execute a função "initialSetup" uma vez para criar as abas:
//    - "Entregas" (registro das submissões)
//    - "Alunos"  (cadastro: ra | nome_aluno | email)
//    - "Atividades" (cadastro: atividade | data_limite | descricao)
//
// 4. Preencha as abas "Alunos" e "Atividades" com os dados
//
// 5. Faça o deploy como Web App (Executar > Implantar > Nova implantação >
//    Tipo: Aplicativo da Web, Executar como: Você, Quem tem acesso: Qualquer um)
//
// 6. Copie a URL gerada e cole na variável SCRIPT_URL abaixo
// ═══════════════════════════════════════════════════════════════════════

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwauFvnfDsrpl_ACYeZ46NxwKAp2BR9b-3Z0Nz9uTelTaRIYsdQwWYYTYO4GvNBmw4/exec"

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

/**
 * Converte um File (ZIP) para base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1] || result
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Envia requisição GET para o Google Apps Script (usado para consultas)
 */
function getFromGAS(url: string, params: Record<string, string>): Promise<any> {
  const queryString = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&")
  const fullUrl = `${url}?${queryString}`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", fullUrl)
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          reject(new Error("Resposta inválida do servidor."))
        }
      } else {
        reject(new Error(`Erro HTTP ${xhr.status}: ${xhr.responseText}`))
      }
    }
    xhr.onerror = () => reject(new Error("Erro de rede ao conectar com o servidor."))
    xhr.ontimeout = () => reject(new Error("Tempo limite excedido. Tente novamente."))
    xhr.timeout = 15000
    xhr.send()
  })
}

/**
 * Envia FormData para o Google Apps Script via POST
 * Inclui os parâmetros essenciais na query string para evitar perdas
 * caso o navegador converta o POST em GET durante o redirecionamento 302 do GAS.
 */
function postToGAS(url: string, formData: FormData): Promise<string> {
  const queryParams: string[] = ["action=submit"]
  for (const [key, value] of (formData as any).entries()) {
    if (typeof value === "string" && key !== "arquivo_zip_base64" && key !== "mensagem") {
      queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  }
  const fullUrl = url.includes("?")
    ? `${url}&${queryParams.join("&")}`
    : `${url}?${queryParams.join("&")}`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", fullUrl)
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText)
      } else {
        reject(new Error(`Erro HTTP ${xhr.status}: ${xhr.responseText}`))
      }
    }
    xhr.onerror = () => reject(new Error("Erro de rede ao conectar com o servidor."))
    xhr.ontimeout = () => reject(new Error("Tempo limite excedido. Tente novamente."))
    xhr.timeout = 120000 // 2 minutos (arquivos grandes podem demorar)
    xhr.send(formData)
  })
}

/**
 * Busca dados da atividade (prazo) - única consulta externa antes do submit
 */
async function buscarAtividade(
  atividade: string,
): Promise<{ found: boolean; data_limite?: string }> {
  try {
    return await getFromGAS(SCRIPT_URL, { action: "buscarAtividade", atividade })
  } catch {
    return { found: false }
  }
}

/**
 * Formata uma data ISO para exibição pt-BR
 */
function formatarData(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/**
 * Gera o texto do comprovante
 */
function gerarComprovante(data: any): string {
  const separador = "═".repeat(56)
  const linhaSimples = "─".repeat(56)

  return [
    separador,
    "        COMPROVANTE DE ENTREGA - QUARTZ IMPACTA",
    separador,
    "",
    `  ID de Comprovação: ${data.protocol}`,
    `  Data/Hora:         ${data.data}`,
    `  Aluno:             ${data.aluno}`,
    `  RA:                ${data.ra}`,
    `  Atividade:         ${data.atividade}`,
    `  Status:            ${data.status}`,
    "",
    linhaSimples,
    `  Referência: ${data.link}`,
    linhaSimples,
    "",
    "  Este documento é a prova oficial de sua entrega eletrônica.",
    `  Autenticação: ${data.protocol}-${data.ra}`,
    "",
    separador,
  ].join("\n")
}

/**
 * Exibe info de prazo no formulário
 */
function exibirInfoPrazo(form: HTMLFormElement, atividade: string) {
  // Remove info anterior se existir
  const existing = form.querySelector(".deadline-info")
  if (existing) existing.remove()

  buscarAtividade(atividade).then((result) => {
    if (!result.found || !result.data_limite) return

    const dataLimite = new Date(result.data_limite)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    dataLimite.setHours(0, 0, 0, 0)

    const difDias = Math.ceil((dataLimite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

    let deadlineMsg = ""
    let deadlineClass = ""

    if (difDias < 0) {
      deadlineMsg = `⚠️ Prazo encerrado em ${formatarData(result.data_limite)} (${Math.abs(difDias)} dia(s) de atraso)`
      deadlineClass = "late"
    } else if (difDias === 0) {
      deadlineMsg = "🔴 Último dia de prazo! Entrega até 23:59"
      deadlineClass = "late"
    } else if (difDias <= 3) {
      deadlineMsg = `🟡 Prazo: ${formatarData(result.data_limite)} (faltam ${difDias} dia(s))`
      deadlineClass = "on-time"
    } else {
      deadlineMsg = `🟢 Prazo: ${formatarData(result.data_limite)} (faltam ${difDias} dia(s))`
      deadlineClass = "on-time"
    }

    const deadlineInfo = document.createElement("div")
    deadlineInfo.className = `deadline-info ${deadlineClass}`
    deadlineInfo.textContent = deadlineMsg
    form.insertBefore(deadlineInfo, form.firstChild)
  })
}

/**
 * Inicializa os formulários de submissão na página
 */
async function initSubmission() {
  const cards = document.querySelectorAll(".submission-container")

  for (const card of cards) {
    if ((card as any)._initialized) continue
      ; (card as any)._initialized = true

    const form = card.querySelector(".submission-form") as HTMLFormElement
    if (!form) continue

    const statusMsg = card.querySelector(".status-message") as HTMLDivElement
    const receiptContainer = card.querySelector(".receipt-container") as HTMLDivElement
    const fileInput = card.querySelector('input[type="file"]') as HTMLInputElement
    const fileNameDisplay = card.querySelector(".file-name-display") as HTMLSpanElement
    const clearFileBtn = card.querySelector(".clear-file-btn") as HTMLButtonElement
    const dropZone = card.querySelector(".file-drop-zone") as HTMLDivElement
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
    const raInput = form.querySelector("#ra") as HTMLInputElement
    const nomeInput = form.querySelector("#nome_aluno") as HTMLInputElement
    const studentNameDisplay = card.querySelector(".student-name-display") as HTMLDivElement
    const confirmedNameDisplay = card.querySelector(".confirmed-name") as HTMLSpanElement
    const raValidationStatus = card.querySelector(".ra-validation-status") as HTMLDivElement

    const selectionScreen = card.querySelector(".selection-screen")
    const formScreen = card.querySelector(".form-screen")
    const selectButtons = card.querySelectorAll(".select-activity-btn")
    const backBtn = card.querySelector(".back-to-selection")
    const activityHighlight = card.querySelector(".highlight-activity")

    // ── Validação LOCAL do RA (apenas formato, sem chamada à API) ──
    raInput.addEventListener("input", () => {
      const ra = raInput.value.trim()

      // Esconde confirmação de nome enquanto digita
      studentNameDisplay.style.display = "none"
      nomeInput.value = ""
      confirmedNameDisplay.textContent = ""

      if (ra.length === 0 || ra.length < 7) {
        raValidationStatus.className = "ra-validation-status"
        raValidationStatus.textContent = ""
        return
      }

      if (!/^[0-9]{7}$/.test(ra)) {
        raValidationStatus.className = "ra-validation-status invalid"
        raValidationStatus.textContent = "❌ RA deve conter exatamente 7 dígitos"
        return
      }

      // Formato válido - feedback visual positivo
      raValidationStatus.className = "ra-validation-status valid"
      raValidationStatus.textContent = "✔️ RA válido"
    })

    // ── Ao selecionar atividade (modo múltiplo) ──
    async function onActivitySelected(activity: string) {
      form.setAttribute("data-activity", activity)
      if (activityHighlight) activityHighlight.textContent = activity

      selectionScreen?.classList.add("hidden")
      formScreen?.classList.remove("hidden")

      // Reset
      form.reset()
      statusMsg.style.display = "none"
      statusMsg.textContent = ""
      receiptContainer.innerHTML = ""
      fileNameDisplay.textContent = "Nenhum arquivo selecionado"
      clearFileBtn.style.display = "none"
      studentNameDisplay.style.display = "none"
      nomeInput.value = ""
      confirmedNameDisplay.textContent = ""
      raValidationStatus.className = "ra-validation-status"
      raValidationStatus.textContent = ""
      submitBtn.style.display = ""
      submitBtn.disabled = false

      // Busca prazo (assíncrono, não bloqueia)
      exibirInfoPrazo(form, activity)
    }

    selectButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        onActivitySelected(btn.getAttribute("data-activity") || "")
      })
    })

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        formScreen?.classList.add("hidden")
        selectionScreen?.classList.remove("hidden")
      })
    }

    // Se for atividade única, já busca o prazo
    const singleActivity = form.getAttribute("data-activity")
    if (singleActivity) {
      exibirInfoPrazo(form, singleActivity)
    }

    // ── Feedback de arquivo selecionado ──
    fileInput.addEventListener("change", () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0]
        if (file.size > MAX_FILE_SIZE_BYTES) {
          fileNameDisplay.textContent = "❌ Arquivo muito grande (máx. 10MB)"
          fileNameDisplay.style.color = "#ef4444"
          clearFileBtn.style.display = "flex"
          fileInput.value = ""
          return
        }
        fileNameDisplay.textContent = `📄 ${file.name}`
        fileNameDisplay.style.color = "var(--secondary)"
        clearFileBtn.style.display = "flex"
      } else {
        fileNameDisplay.textContent = "Nenhum arquivo selecionado"
        fileNameDisplay.style.color = "var(--gray)"
        clearFileBtn.style.display = "none"
      }
    })

    // ── Botão para limpar anexo ──
    clearFileBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      fileInput.value = ""
      fileNameDisplay.textContent = "Nenhum arquivo selecionado"
      fileNameDisplay.style.color = "var(--gray)"
      clearFileBtn.style.display = "none"
    })

      // ── Drag & Drop ──
      ;["dragenter", "dragover"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault()
          e.stopPropagation()
          dropZone.classList.add("drag-over")
        })
      })
      ;["dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault()
          e.stopPropagation()
          dropZone.classList.remove("drag-over")
        })
      })

    // ══════════════════════════════════════════════════════════
    // SUBMIT: Tudo em uma única requisição POST
    // ══════════════════════════════════════════════════════════
    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      const activityName = form.getAttribute("data-activity")
      const ra = raInput.value.trim()

      // ── Validações locais (rápidas, sem API) ──
      if (!/^[0-9]{7}$/.test(ra)) {
        showStatus(statusMsg, "error", "O RA deve conter exatamente 7 dígitos numéricos.")
        return
      }

      const github = (form.querySelector("#github") as HTMLInputElement)?.value.trim() || ""
      const mensagem = (form.querySelector("#mensagem") as HTMLTextAreaElement)?.value.trim() || ""
      const zipFile = fileInput.files?.[0]

      const hasLink = github.length > 0
      const hasFile = !!zipFile

      if (hasLink && hasFile) {
        showStatus(statusMsg, "error", "Envie apenas o link OU o arquivo ZIP, não ambos.")
        return
      }
      if (!hasLink && !hasFile) {
        showStatus(
          statusMsg,
          "error",
          "É obrigatório fornecer o link do GitHub OU anexar um arquivo ZIP.",
        )
        return
      }

      if (hasLink) {
        const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/
        if (!githubRegex.test(github) || github.endsWith(".git")) {
          showStatus(
            statusMsg,
            "error",
            "Link inválido. Use: https://github.com/usuario/repositorio",
          )
          return
        }
      }

      if (hasFile && zipFile!.size > MAX_FILE_SIZE_BYTES) {
        showStatus(statusMsg, "error", "Arquivo muito grande. O limite é de 10MB.")
        return
      }

      // ── Tudo ok localmente → prepara envio ──
      statusMsg.style.display = "block"
      statusMsg.className = "status-message"
      statusMsg.innerHTML = hasFile ? "📤 Preparando arquivo..." : "📝 Enviando dados..."
      receiptContainer.innerHTML = ""
      submitBtn.disabled = true

      try {
        let arquivoZipBase64 = ""
        let arquivoZipNome = ""

        if (hasFile) {
          arquivoZipNome = zipFile!.name
          arquivoZipBase64 = await fileToBase64(zipFile!)
        }

        statusMsg.innerHTML = "📨 Enviando a atividade... ⚠️AGUARDE⚠️"

        const params: Record<string, string> = {
          ra,
          atividade: activityName || "",
          mensagem,
          link_github: github,
          arquivo_zip_nome: arquivoZipNome,
        }

        if (arquivoZipBase64) {
          params["arquivo_zip_base64"] = arquivoZipBase64
        }

        const postData = new FormData()
        Object.entries(params).forEach(([key, value]) => {
          postData.append(key, value)
        })

        const responseText = await postToGAS(SCRIPT_URL, postData)

        var result: any
        try {
          result = JSON.parse(responseText)
        } catch {
          throw new Error("Resposta inválida do servidor. Tente novamente.")
        }

        if (result.result !== "success") {
          throw new Error(result.error || "Erro ao salvar na planilha.")
        }

        // ── Sucesso! ──
        const statusValor = result.status_prazo
        const nomeAluno = result.nome_aluno || ra

        let statusTexto = "No Prazo"
        if (typeof statusValor === "number" && statusValor > 0) {
          statusTexto = `Atrasado (${statusValor} dia(s))`
        } else if (statusValor === 0 || statusValor === "0") {
          statusTexto = "No Prazo"
        } else if (typeof statusValor === "string") {
          statusTexto = statusValor
        }

        // Preenche o nome do aluno automaticamente com o que veio do servidor
        nomeInput.value = nomeAluno
        confirmedNameDisplay.textContent = nomeAluno
        studentNameDisplay.style.display = "block"

        statusMsg.className = "status-message success"
        statusMsg.innerHTML = `✨ Entrega confirmada! Aluno: <strong>${nomeAluno}</strong> (${statusTexto})`

        // Oculta APENAS o botão de confirmar entrega após a conclusão com sucesso
        submitBtn.style.display = "none"

        const protocol = result.id || result.row || Date.now()
        createReceiptButton(receiptContainer, {
          protocol,
          ra,
          aluno: nomeAluno,
          atividade: activityName,
          data: new Date().toLocaleString("pt-BR"),
          status: statusTexto,
          link: hasFile ? `ZIP: ${arquivoZipNome}` : github,
        })
      } catch (err: any) {
        statusMsg.className = "status-message error"
        statusMsg.innerHTML = `❌ ${err.message}`
      } finally {
        if (submitBtn.style.display !== "none") {
          submitBtn.disabled = false
        }
      }
    })
  }
}

function showStatus(el: HTMLDivElement, type: "error" | "success", msg: string) {
  el.style.display = "block"
  el.className = `status-message ${type}`
  el.innerHTML = type === "error" ? `❌ ${msg}` : `✅ ${msg}`
}

function createReceiptButton(container: HTMLElement, data: any) {
  const existingBtn = container.querySelector(".download-receipt-btn")
  if (existingBtn) existingBtn.remove()

  const btn = document.createElement("button")
  btn.type = "button"
  btn.className = "download-receipt-btn"
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    <span>Baixar Comprovante (TXT)</span>
  `

  btn.onclick = () => {
    const originalContent = btn.innerHTML
    const conteudo = gerarComprovante(data)

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `comprovante_${data.ra}_${data.protocol}.txt`
    a.click()
    URL.revokeObjectURL(url)

    btn.innerHTML = "✅ Comprovante Baixado"
    setTimeout(() => {
      btn.innerHTML = originalContent
    }, 3000)
  }

  container.appendChild(btn)
}

document.addEventListener("nav", initSubmission)
window.addEventListener("DOMContentLoaded", initSubmission)
initSubmission()

export default initSubmission
