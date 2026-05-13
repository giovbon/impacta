async function initAsciinema() {
  const elements = document.querySelectorAll<HTMLElement>(".asciinema")
  if (elements.length === 0) return

  // Library is loaded locally via <head> with data-persist, so it's always available
  const Player = (window as any).AsciinemaPlayer
  if (!Player) return

  for (const el of Array.from(elements)) {
    const src = el.getAttribute("data-src")
    if (!src) continue

    try {
      el.innerHTML = ""
      const playerInstance = Player.create(src, el, {
        theme: "asciinema",
        speed: 1,
        idleTimeLimit: 2,
        poster: "npt:0:0",
        fit: "width",
        terminalFontSize: "14px",
      })

      // Cleanup before next navigation
      window.addCleanup(() => {
        try { playerInstance?.dispose() } catch (_) {}
        el.innerHTML = ""
      })
    } catch (e) {
      console.error("[Asciinema] init error:", e)
    }
  }
}

document.addEventListener("nav", initAsciinema)

export default initAsciinema
