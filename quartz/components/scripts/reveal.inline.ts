async function initReveal() {
  const containers = document.querySelectorAll<HTMLElement>(".reveal")
  if (containers.length === 0) return

  const R = (window as any).Reveal
  const RM = (window as any).RevealMarkdown
  if (!R || !RM) {
    setTimeout(initReveal, 100)
    return
  }

  for (const container of Array.from(containers)) {
    try {
      const RH = (window as any).RevealHighlight
      const plugins = RH ? [RM, RH] : [RM]

      const deck = new R(container, {
        plugins,
        embedded: true,
        keyboard: true,
        controls: true,
        progress: true,
        center: true,
        transition: "slide",
        markdown: { separator: "^---", verticalSeparator: "^--" },
      })

      await deck.initialize()

      if (!container.querySelector(".reveal-fullscreen-btn")) {
        const btn = document.createElement("button")
        btn.className = "reveal-fullscreen-btn"
        btn.innerHTML = "⛶"
        btn.title = "Tela Cheia"
        btn.style.cssText =
          "position:absolute;bottom:15px;left:15px;z-index:1000;background:rgba(0,0,0,0.5);color:white;border:none;padding:8px 12px;border-radius:5px;cursor:pointer;font-size:14px;"
        btn.onclick = () => {
          if (!document.fullscreenElement) container.requestFullscreen()
          else document.exitFullscreen()
        }
        container.appendChild(btn)
      }

      setTimeout(() => deck.layout(), 100)

      // Cleanup before next navigation
      window.addCleanup(() => {
        try { deck.destroy() } catch (_) {}
      })
    } catch (e) {
      console.error("[Reveal] init error:", e)
    }
  }
}

document.addEventListener("nav", initReveal)

export default initReveal
