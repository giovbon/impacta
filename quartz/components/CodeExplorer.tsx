// @ts-ignore
import codeExplorerScript from "./scripts/codeExplorer.inline"
import codeExplorerStyle from "./styles/codeExplorer.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import fs from "fs"
import path from "path"

export interface CodeExplorerOptions {
  path?: string
}

interface FileNode {
  name: string
  isDir: boolean
  content?: string
  lang?: string
  children?: FileNode[]
  indent: number
}

function parseZCode(text: string): FileNode[] {
  const lines = text.split("\n")
  const root: FileNode[] = []
  const stack: FileNode[] = []
  let currentFile: FileNode | null = null
  let inCodeBlock = false
  let codeIndent = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === "" && !inCodeBlock) continue

    const indent = line.search(/\S/)
    if (indent === -1 && !inCodeBlock) continue

    const trimmed = line.trim()

    if (!inCodeBlock && trimmed.startsWith("- ")) {
      const name = trimmed.slice(2)
      const isDir = name.endsWith("/")
      const node: FileNode = {
        name: isDir ? name.slice(0, -1) : name,
        isDir,
        indent,
        children: isDir ? [] : undefined,
        content: isDir ? undefined : ""
      }

      // Find parent
      while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
        stack.pop()
      }

      if (stack.length === 0) {
        root.push(node)
      } else {
        stack[stack.length - 1].children?.push(node)
      }

      if (isDir) {
        stack.push(node)
      } else {
        currentFile = node
      }
    } else if (currentFile && trimmed.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeIndent = indent
        currentFile.lang = trimmed.slice(3) || "text"
      } else {
        inCodeBlock = false
      }
    } else if (inCodeBlock && currentFile) {
      const lineContent = line.startsWith(" ".repeat(codeIndent)) 
        ? line.slice(codeIndent) 
        : line.trimStart()
      currentFile.content += lineContent + "\n"
    }
  }

  return root
}

const CodeExplorer: QuartzComponent = ({ displayClass, fileData, ...props }: QuartzComponentProps) => {
  const filePath = (props.path || fileData.frontmatter?.codes) as string | undefined
  if (!filePath) return null

  const fullPath = path.join(process.cwd(), filePath.startsWith("/") ? filePath.slice(1) : filePath)
  if (!fs.existsSync(fullPath)) {
    return <div class="code-explorer-error">Arquivo não encontrado: {filePath}</div>
  }

  const content = fs.readFileSync(fullPath, "utf-8")
  const tree = parseZCode(content)

  const renderTree = (nodes: FileNode[]) => {
    return (
      <ul class="tree-list">
        {nodes.map((node, idx) => (
          <li key={`${node.name}-${idx}`}>
            {node.isDir ? (
              <>
                <div class="tree-item folder">
                  <span class="folder-icon">▶</span>
                  <span class="item-icon">📁</span>
                  <span class="item-name">{node.name}</span>
                </div>
                <div class="folder-content">
                  {renderTree(node.children || [])}
                </div>
              </>
            ) : (
              <div 
                class="tree-item file" 
                data-code={node.content?.trim()} 
                data-lang={node.lang}
              >
                <span class="item-icon">📄</span>
                <span class="item-name">{node.name}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div 
      class={classNames(displayClass, "code-explorer")}
      data-tree={JSON.stringify(tree)}
      data-name={path.basename(fullPath).replace(/\.[^/.]+$/, "")}
    >
      <div class="explorer-actions">
        <button class="action-btn zoom-in-btn" title="Aumentar Fonte">A+</button>
        <button class="action-btn zoom-out-btn" title="Diminuir Fonte">a-</button>
        <button class="action-btn copy-btn" title="Copiar Código">📋</button>
        <button class="action-btn fs-btn" title="Tela Cheia">⛶</button>
        <button class="action-btn zip-btn" title="Baixar ZIP">💾</button>
      </div>
      <div class="tree-panel">
        <div class="tree-title">{path.basename(fullPath)}</div>
        {renderTree(tree)}
      </div>
      <div class="viewer-panel">
        <div class="viewer-header">
          <span class="current-filename">Selecione um arquivo</span>
        </div>
        <div class="code-content">
          <pre><code></code></pre>
        </div>
      </div>
    </div>
  )
}

CodeExplorer.css = codeExplorerStyle
CodeExplorer.afterDOMLoaded = codeExplorerScript

export default ((userOpts?: Partial<CodeExplorerOptions>) => {
  return CodeExplorer
}) satisfies QuartzComponentConstructor
