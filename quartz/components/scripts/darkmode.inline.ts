// Sempre define o tema como escuro (dark mode fixo)
const currentTheme = "dark"
document.documentElement.setAttribute("saved-theme", currentTheme)

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

// Já emite o evento com o tema escuro após o carregamento inicial
document.addEventListener("nav", () => {
  emitThemeChangeEvent("dark")
})
