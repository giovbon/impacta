function initCodeExplorer() {
  const explorers = document.querySelectorAll(".code-explorer")
  if (explorers.length === 0) return

  // Wait for Highlight.js if needed
  if (!(window as any).hljs) {
    setTimeout(initCodeExplorer, 200)
    return
  }

  explorers.forEach((explorer) => {
    if ((explorer as any)._initialized) return
    ;(explorer as any)._initialized = true

    const treeItems = explorer.querySelectorAll(".tree-item.file")
    const codeDisplay = explorer.querySelector(".code-content code")
    const filenameDisplay = explorer.querySelector(".current-filename")
    const folders = explorer.querySelectorAll(".tree-item.folder")
    const fsBtn = explorer.querySelector(".fs-btn")
    const zipBtn = explorer.querySelector(".zip-btn") as HTMLButtonElement
    const copyBtn = explorer.querySelector(".copy-btn")
    const zoomInBtn = explorer.querySelector(".zoom-in-btn")
    const zoomOutBtn = explorer.querySelector(".zoom-out-btn")

    let currentFontSize = 14
    let currentCode = ""

    // Copy Functionality
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        if (!currentCode) return
        navigator.clipboard.writeText(currentCode).then(() => {
          const originalText = copyBtn.innerHTML
          copyBtn.innerHTML = "✅"
          setTimeout(() => {
            copyBtn.innerHTML = originalText
          }, 2000)
        })
      })
    }

    // Font Size Controls
    if (zoomInBtn) {
      zoomInBtn.addEventListener("click", () => {
        currentFontSize += 2
        if (currentFontSize > 30) currentFontSize = 30
        ;(explorer as HTMLElement).style.setProperty("--code-font-size", `${currentFontSize}px`)
      })
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener("click", () => {
        currentFontSize -= 2
        if (currentFontSize < 8) currentFontSize = 8
        ;(explorer as HTMLElement).style.setProperty("--code-font-size", `${currentFontSize}px`)
      })
    }

    // Fullscreen Toggle
    if (fsBtn) {
      fsBtn.addEventListener("click", () => {
        explorer.classList.toggle("fullscreen")
        document.body.style.overflow = explorer.classList.contains("fullscreen") ? "hidden" : ""
      })
    }

    // ZIP Download
    if (zipBtn) {
      zipBtn.addEventListener("click", async () => {
        const treeData = JSON.parse(explorer.getAttribute("data-tree") || "[]")
        const projectName = explorer.getAttribute("data-name") || "projeto"
        
        zipBtn.innerHTML = "⏳"
        zipBtn.disabled = true

        try {
          const JSZip = await loadJSZip()
          const zip = new (JSZip as any)()
          
          function collectFiles(nodes: any[], basePath: string, zip: any) {
            nodes.forEach(node => {
              const fullPath = basePath ? `${basePath}/${node.name}` : node.name
              if (node.isDir) {
                // For folders, we don't strictly need to call zip.folder() if we add files with paths,
                // but it helps if the folder is empty.
                const folder = zip.folder(fullPath)
                if (node.children) {
                  collectFiles(node.children, fullPath, zip)
                }
              } else if (node.content !== undefined) {
                zip.file(fullPath, node.content)
              }
            })
          }

          collectFiles(treeData, "", zip)
          const blob = await zip.generateAsync({ type: "blob" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${projectName}.zip`
          a.click()
          URL.revokeObjectURL(url)
          
          zipBtn.innerHTML = "✅"
        } catch (err) {
          console.error("[CodeExplorer] Erro ao gerar ZIP:", err)
          zipBtn.innerHTML = "❌"
        } finally {
          setTimeout(() => {
            zipBtn.innerHTML = "💾"
            zipBtn.disabled = false
          }, 2000)
        }
      })
    }

    // Handle folder toggling
    folders.forEach(folder => {
      folder.addEventListener("click", (e) => {
        e.stopPropagation()
        folder.classList.toggle("open")
        const content = folder.nextElementSibling
        if (content && content.classList.contains("folder-content")) {
          content.classList.toggle("open")
        }
        const icon = folder.querySelector(".folder-icon")
        if (icon) {
          icon.textContent = folder.classList.contains("open") ? "▼" : "▶"
        }
      })
    })

    // Handle file selection
    treeItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation()
        treeItems.forEach(i => i.classList.remove("active"))
        item.classList.add("active")

        const code = item.getAttribute("data-code") || ""
        currentCode = code
        const lang = item.getAttribute("data-lang") || "text"
        const filename = item.querySelector(".item-name")?.textContent || ""

        if (codeDisplay) {
          const validLang = lang || "text"
          codeDisplay.className = `hljs language-${validLang}`
          
          try {
            // @ts-ignore
            if (window.hljs) {
              // @ts-ignore
              const highlighted = window.hljs.highlight(code, { language: validLang }).value
              codeDisplay.innerHTML = highlighted
            } else {
              codeDisplay.textContent = code
            }
          } catch (e) {
            console.error("[CodeExplorer] Erro ao destacar:", e)
            codeDisplay.textContent = code
          }
        }

        if (filenameDisplay) {
          filenameDisplay.textContent = filename
        }
      })
    })

    // Select first file by default
    const firstFile = treeItems[0] as HTMLElement
    if (firstFile) {
      firstFile.click()
      let parent = firstFile.parentElement
      while (parent && !parent.classList.contains("code-explorer")) {
        if (parent.classList.contains("folder-content")) {
          const folder = parent.previousElementSibling
          if (folder && folder.classList.contains("folder")) {
            folder.classList.add("open")
            parent.classList.add("open")
            const icon = folder.querySelector(".folder-icon")
            if (icon) icon.textContent = "▼"
          }
        }
        parent = parent.parentElement
      }
    }
  })
}

function loadJSZip() {
  if ((window as any).JSZip) return Promise.resolve((window as any).JSZip)
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
    script.onload = () => resolve((window as any).JSZip)
    script.onerror = () => reject(new Error("Falha ao carregar JSZip"))
    document.head.appendChild(script)
  })
}

document.addEventListener("nav", initCodeExplorer)
window.addEventListener("DOMContentLoaded", initCodeExplorer)
initCodeExplorer()

export default initCodeExplorer
