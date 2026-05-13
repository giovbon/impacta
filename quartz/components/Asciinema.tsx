import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { joinSegments, pathToRoot } from "../util/path"
// @ts-ignore
import asciinemaScript from "./scripts/asciinema.inline"

interface AsciinemaEntry {
  path: string
  name?: string
}

const Asciinema: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
  const asciinemaRaw = fileData.frontmatter?.asciinema
  if (!asciinemaRaw) return null

  const entries: AsciinemaEntry[] = (Array.isArray(asciinemaRaw) ? asciinemaRaw : [asciinemaRaw]).map((entry) => {
    if (typeof entry === "string") {
      const filename = entry.split("/").pop()?.split(".")[0] || "Terminal"
      return { path: entry, name: filename.charAt(0).toUpperCase() + filename.slice(1) }
    }
    // Deep clone/copy to ensure properties are accessible
    const e = entry as any
    return {
      path: e.path || e.src || e.url || "",
      name: e.name || e.title || e.description || e.label
    }
  })

  return (
    <div class={classNames(displayClass, "asciinema-container")}>
      {entries.map((entry) => {
        const baseDir = pathToRoot(fileData.slug!)
        const path = entry.path
        const fetchPath = path.startsWith("http") 
          ? path 
          : path.startsWith("asciinema/") 
            ? joinSegments(baseDir, "static", path)
            : joinSegments(baseDir, "static/asciinema", path)

        return (
          <div class="asciinema-wrapper">
            {entry.name && (
              <h4 class="asciinema-title">
                {entry.name}
              </h4>
            )}
            <div 
              class="asciinema" 
              data-src={fetchPath}
              data-theme="asciinema"
              data-speed="1"
              data-idle-time-limit="2"
              data-poster="npt:0:0"
              data-fit="width"
            >
              <div class="asciinema-loading">Carregando gravação do terminal...</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

Asciinema.css = `
.asciinema-container {
  margin: 2rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.asciinema-wrapper {
  width: 100%;
}

.asciinema-title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: var(--secondary);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.asciinema-title::before {
  content: ">";
  font-family: var(--codeFont);
  opacity: 0.5;
  color: var(--secondary);
}

.asciinema {
  margin: 1.5rem auto;
  max-width: 100%;
  display: block;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background-color: #1a1b1e;
  overflow: hidden;
  position: relative;
  min-height: 100px;
}

.asciinema-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #888;
  font-family: var(--codeFont);
  font-size: 0.9rem;
}

/* Customizações do Player para o Tema Dark */
.asciinema-player {
  --player-bg: #1a1b1e !important;
  background-color: #1a1b1e !important;
  border: none !important;
}

.asciinema-terminal {
  padding: 10px !important;
}

/* Esconder barra de controle por padrão e mostrar no hover do player */
.asciinema-player .control-bar {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.asciinema-player:hover .control-bar {
  opacity: 1;
}
`

Asciinema.afterDOMLoaded = asciinemaScript

export default (() => Asciinema) satisfies QuartzComponentConstructor
