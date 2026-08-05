// @ts-ignore
import typstScript from "./scripts/typst.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { joinSegments, pathToRoot } from "../util/path"

interface TypstEntry {
  path: string
  name?: string
}

const TypstDownload: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
  const typst = fileData.frontmatter?.typst
  if (!typst) return null

  const entries: TypstEntry[] = (Array.isArray(typst) ? typst : [typst]).map((entry: any) => {
    if (typeof entry === "string") {
      return { path: entry }
    }
    return entry as TypstEntry
  })

  const baseDir = pathToRoot(fileData.slug!)
  const bundlePath = joinSegments(baseDir, "static/lib/typst/snippet.bundle.mjs")
  const wasmPath = joinSegments(baseDir, "static/lib/typst/typst_ts_web_compiler_bg.wasm")

  return (
    <div 
      class={classNames(displayClass, "typst-container")}
      data-bundle={bundlePath}
      data-wasm={wasmPath}
    >
      {entries.map((entry) => {
        const fetchPath = entry.path.startsWith("http") 
          ? entry.path 
          : joinSegments(baseDir, "static", entry.path)

        return (
          <button 
            key={entry.path}
            class="typst-download-btn" 
            data-typ={fetchPath}
            data-name={entry.name}
            title={`Baixar PDF (${entry.name || entry.path.split('/').pop()})`}
          >
            <span class="icon">📄</span> 
            {entry.name || `PDF: ${entry.path.split('/').pop()?.replace('.typ', '')}`}
          </button>
        )
      })}
    </div>
  )
}

TypstDownload.css = `
.typst-container {
  margin: 1.5rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
}

.typst-download-btn {
  background: var(--secondary);
  color: var(--light);
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-family: var(--bodyFont);
  box-shadow: 0 4px 12px rgba(var(--secondary-rgb), 0.2);
}

.typst-download-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 6px 16px rgba(var(--secondary-rgb), 0.3);
}

.typst-download-btn.loading {
  opacity: 0.8;
  cursor: wait;
}

.typst-download-btn .icon {
  font-size: 1.2em;
}
`

// @ts-ignore
TypstDownload.afterDOMLoaded = typstScript

export default (() => TypstDownload) satisfies QuartzComponentConstructor
