// @ts-ignore
import revealScript from "./scripts/reveal.inline"
import revealStyle from "./styles/reveal.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import fs from "fs"
import path from "path"

export interface PresentationOptions {
  src?: string
}

const defaultOptions: PresentationOptions = {
  src: undefined,
}

const Presentation: QuartzComponent = ({ displayClass, fileData, ...props }: QuartzComponentProps) => {
  const src = (props.src || fileData.frontmatter?.presentation) as string | undefined
  if (!src) return null

  let markdownContent = ""
  const id = "reveal-" + path.basename(src).replace(/\./g, "-")
  
  try {
    const cleanSrc = src.startsWith("/") ? src.slice(1) : src
    const fullPath = path.join(process.cwd(), cleanSrc)
    if (fs.existsSync(fullPath)) {
      markdownContent = fs.readFileSync(fullPath, "utf-8").replace(/<\/script>/g, "<\\/script>")
    }
  } catch (e) {
    console.error(`[Reveal] Erro ao ler arquivo: ${src}`, e)
  }

  return (
    <div class={classNames(displayClass, "reveal-container")}>
      <div 
        id={id}
        class="reveal" 
        style={{ height: "600px", border: "1px solid var(--lightgray)", borderRadius: "8px", overflow: "hidden", position: "relative" }}
      >
        <div class="slides">
          <section data-markdown="" data-separator="^---" data-separator-vertical="^--">
            <script type="text/template" dangerouslySetInnerHTML={{ __html: markdownContent }} />
          </section>
        </div>
      </div>
    </div>
  )
}

Presentation.css = revealStyle
Presentation.afterDOMLoaded = revealScript

export default ((userOpts?: Partial<PresentationOptions>) => {
  return Presentation
}) satisfies QuartzComponentConstructor
