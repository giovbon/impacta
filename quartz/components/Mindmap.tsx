// @ts-ignore
import mindmapScript from "./scripts/mindmap.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { joinSegments, pathToRoot } from "../util/path"

const Mindmap: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
  const markmapPath = fileData.frontmatter?.markmap as string | undefined
  if (!markmapPath) return null

  const baseDir = pathToRoot(fileData.slug!)
  const fetchPath = markmapPath.startsWith("http") 
    ? markmapPath 
    : joinSegments(baseDir, "static", markmapPath)

  return (
    <div 
      class={classNames(displayClass, "markmap-container")} 
      data-src={fetchPath}
    >
      <div class="markmap-loading">Carregando mapa mental...</div>
    </div>
  )
}

Mindmap.css = `
.markmap-container {
  width: 100%;
  height: 600px;
  background: #1a1b1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin: 2rem 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.markmap-container svg {
  width: 100%;
  height: 100%;
  font-family: var(--bodyFont);
}

/* Forçar contraste no texto do SVG */
.markmap-container .markmap-node div {
  color: #ffffff !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.markmap-container .markmap-link {
  stroke-width: 2px !important;
  opacity: 0.8;
}

.markmap-controls {
  position: absolute;
  bottom: 25px;
  right: 25px;
  display: flex;
  gap: 10px;
  z-index: 1001;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.markmap-container:hover .markmap-controls {
  opacity: 1;
  transform: translateY(0);
}

.markmap-controls button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  color: #fff;
  transition: all 0.2s ease;
}

.markmap-controls button:hover {
  background: var(--secondary);
  color: var(--light);
  transform: translateY(-2px);
}

.markmap-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  font-family: var(--bodyFont);
}

.markmap-container:fullscreen {
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  background: #1a1b1e;
}
`

Mindmap.afterDOMLoaded = mindmapScript

export default (() => Mindmap) satisfies QuartzComponentConstructor
