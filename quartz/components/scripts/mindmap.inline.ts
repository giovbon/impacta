let loadingMarkmap = false
async function initMindmap() {
  const elements = document.querySelectorAll(".markmap-container")
  if (elements.length === 0) return

  // Load Markmap from CDN if not already loaded
  if (!(window as any).markmap && !loadingMarkmap) {
    loadingMarkmap = true
    try {
      await loadScript("https://cdn.jsdelivr.net/npm/d3@7")
      await loadScript("https://cdn.jsdelivr.net/npm/markmap-view")
      await loadScript("https://cdn.jsdelivr.net/npm/markmap-lib")
    } catch (e) {
      console.error("[Markmap] Failed to load scripts", e)
      loadingMarkmap = false
      return
    }
    loadingMarkmap = false
  }

  // Wait if still loading from another call
  if (loadingMarkmap) {
    setTimeout(initMindmap, 100)
    return
  }

  const { Markmap, Transformer } = (window as any).markmap
  const transformer = new Transformer()

  elements.forEach(async (el) => {
    if ((el as any)._initialized) return
    ;(el as any)._initialized = true

    const src = el.getAttribute("data-src")
    if (!src) return

    try {
      // Ensure path is correct for GitHub Pages
      const fetchPath = src
      console.log("[Markmap] Fetching:", fetchPath)
      const response = await fetch(fetchPath)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const markdown = await response.text()
      
      if (!markdown.trim()) return

      // Clear and create SVG
      el.innerHTML = ""
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      el.appendChild(svg)

      // Transform and Render
      const { root } = transformer.transform(markdown)
      const mm = Markmap.create(svg, { 
        autoFit: true,
        duration: 500,
        paddingX: 20,
      }, root)

      window.addCleanup(() => {
        el.innerHTML = ""
      })

      // Add Controls
      const controls = document.createElement("div")
      controls.className = "markmap-controls"
      
      const createBtn = (label: string, title: string, onClick: () => void) => {
        const btn = document.createElement("button")
        btn.innerHTML = label
        btn.title = title
        btn.onclick = (e) => {
          e.stopPropagation()
          onClick()
        }
        return btn
      }

      controls.appendChild(createBtn("➕", "Aumentar Zoom", () => mm.rescale(1.25)))
      controls.appendChild(createBtn("➖", "Diminuir Zoom", () => mm.rescale(0.8)))
      controls.appendChild(createBtn("🎯", "Centralizar", () => mm.fit()))
      controls.appendChild(createBtn("⛶", "Tela Cheia", () => {
        if (!document.fullscreenElement) {
          el.requestFullscreen()
        } else {
          document.exitFullscreen()
        }
      }))

      el.appendChild(controls)
      setTimeout(() => mm.fit(), 300)
    } catch (e) {
      console.error("[Markmap] Failed to fetch source:", src, e)
      el.innerHTML = `<div style="color:red; padding: 10px;">Erro ao carregar mapa mental: ${src}</div>`
    }
  })
}

function loadScript(src: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

document.addEventListener("nav", initMindmap)
initMindmap()

export default initMindmap
