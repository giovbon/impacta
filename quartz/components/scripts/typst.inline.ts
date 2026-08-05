let typstCompiler: any = null

async function initTypst() {
  const downloadBtns = document.querySelectorAll(".typst-download-btn")
  if (downloadBtns.length === 0) return

  // Bulletproof base URL detection for GitHub Pages
  const getBaseUrl = () => {
    if ((window as any).QUARTZ_BASE_URL) return (window as any).QUARTZ_BASE_URL
    const postScript = document.querySelector('script[src*="postscript.js"]') as HTMLScriptElement
    if (postScript) {
      const url = new URL(postScript.src)
      return url.pathname.replace("/postscript.js", "")
    }
    return ""
  }

  const baseUrl = getBaseUrl()

  downloadBtns.forEach((btn) => {
    if ((btn as any)._initialized) return
    ;(btn as any)._initialized = true

    btn.addEventListener("click", async (e) => {
      e.preventDefault()
      const typPath = btn.getAttribute("data-typ")
      if (!typPath) return

      const originalText = btn.innerHTML
      btn.classList.add("loading")
      btn.innerHTML = "⌛ Gerando PDF..."

      try {
        if (!typstCompiler) {
          const container = btn.closest(".typst-container")
          const bundlePath = container?.getAttribute("data-bundle") || `${baseUrl}/static/lib/typst/snippet.bundle.mjs`.replace(/\/+/g, "/")
          const wasmPath = container?.getAttribute("data-wasm") || `${baseUrl}/static/lib/typst/typst_ts_web_compiler_bg.wasm`.replace(/\/+/g, "/")

          // @ts-ignore
          const typstModule = await import(/* @vite-ignore */ bundlePath)
          typstCompiler = typstModule.$typst

          const responseWasm = await fetch(wasmPath)
          if (!responseWasm.ok) throw new Error("Falha ao carregar WASM do Typst")

          const buffer = await responseWasm.arrayBuffer()
          typstCompiler.setCompilerInitOptions({
            getModule: () => buffer,
          })
        }

        // Fetch .typ file (typPath is already resolved by component)
        const res = await fetch(typPath)
        if (!res.ok) throw new Error(`Arquivo .typ não encontrado: ${typPath}`)
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
          : typPath.split("/").pop()?.replace(".typ", ".pdf") || "documento.pdf"
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
