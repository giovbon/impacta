let typstCompiler: any = null

function getSiteRoot(): string {
  const base = (window as any).QUARTZ_BASE_URL || ""
  if (base && location.pathname.startsWith(base)) {
    return base
  }
  return ""
}

function resolveStaticUrl(rawPath: string): string {
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath
  }

  let clean = rawPath
  const staticIdx = clean.indexOf("static/")
  if (staticIdx !== -1) {
    clean = clean.substring(staticIdx)
  } else {
    clean = clean.replace(/^(\.\.\/|\.\/|\/)+/, "")
    if (!clean.startsWith("static/")) {
      clean = "static/" + clean
    }
  }

  const root = getSiteRoot()
  const fullPath = (root + "/" + clean).replace(/\/+/g, "/")
  return new URL(fullPath, location.origin).href
}

async function initTypst() {
  const downloadBtns = document.querySelectorAll(".typst-download-btn")
  if (downloadBtns.length === 0) return

  downloadBtns.forEach((btn) => {
    if ((btn as any)._initialized) return
    ;(btn as any)._initialized = true

    btn.addEventListener("click", async (e) => {
      e.preventDefault()
      const rawTypPath = btn.getAttribute("data-typ")
      if (!rawTypPath) return

      const originalText = btn.innerHTML
      btn.classList.add("loading")
      btn.innerHTML = "⌛ Gerando PDF..."

      try {
        if (!typstCompiler) {
          const container = btn.closest(".typst-container")
          const rawBundlePath = container?.getAttribute("data-bundle") || "static/lib/typst/snippet.bundle.mjs"
          const rawWasmPath = container?.getAttribute("data-wasm") || "static/lib/typst/typst_ts_web_compiler_bg.wasm"

          const bundleUrl = resolveStaticUrl(rawBundlePath)
          const wasmUrl = resolveStaticUrl(rawWasmPath)

          // @ts-ignore
          const typstModule = await import(/* @vite-ignore */ bundleUrl)
          typstCompiler = typstModule.$typst

          const responseWasm = await fetch(wasmUrl)
          if (!responseWasm.ok) throw new Error(`Falha ao carregar WASM do Typst: ${wasmUrl} (status: ${responseWasm.status})`)

          const buffer = await responseWasm.arrayBuffer()
          typstCompiler.setCompilerInitOptions({
            getModule: () => buffer,
          })
        }

        const typUrl = resolveStaticUrl(rawTypPath)
        const res = await fetch(typUrl)
        if (!res.ok) throw new Error(`Arquivo .typ não encontrado: ${typUrl} (status: ${res.status})`)
        const typstCode = await res.text()

        // Generate PDF
        const pdfArrayBuffer = await typstCompiler.pdf({ mainContent: typstCode })

        // Download
        const blob = new Blob([pdfArrayBuffer], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const customName = btn.getAttribute("data-name")
        const filename = customName 
          ? `${customName}.pdf` 
          : rawTypPath.split("/").pop()?.replace(".typ", ".pdf") || "documento.pdf"
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)

        btn.innerHTML = "✅ Concluído"
      } catch (err) {
        console.error("[Typst] Erro:", err)
        btn.innerHTML = "❌ Erro ao gerar"
      } finally {
        setTimeout(() => {
          btn.innerHTML = originalText
          btn.classList.remove("loading")
        }, 3000)
      }
    })
  })
}

document.addEventListener("nav", initTypst)
initTypst()

export default initTypst

