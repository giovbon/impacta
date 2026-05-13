---
title: Tutorial Completo - Python e Slides
presentation: "slides/exemplo.md"
codes: "codes/exemplo.md"
typst: 
- path: "typs/exemplo.typ"
  name: "Meu primeiro typst"
markmap: "mindmaps/exemplo.md"
asciinema:
  path: "demo.cast"
  name: "Gravação do Terminal - Comandos Iniciais"
submission: 
  - "CTT09 - Actions ADS111"
  - "CTT09 - Actions SI111"
---

Esta página demonstra a integração total dos novos recursos:

1. **Slide de Apresentação**: Renderizado no topo para introduzir o assunto.
2. **Explorador de Código**: Logo abaixo, para mostrar a implementação detalhada.

Você pode navegar pelos slides para entender a teoria e depois explorar o código abaixo para ver a prática. Ambos possuem botões de **Tela Cheia** e o explorador permite baixar tudo como **ZIP**.

---

## Dicas de Navegação
- No **Slide**: Use as setas ou clique no ícone de tela cheia.
- No **Código**: Use o mouse para abrir pastas e os botões no canto inferior direito para ajustar a fonte ou baixar o projeto.


Para mais de um typst:
```
---
title: Minha Página
presentation: "slides/exemplo.md"
codes: "codes/exemplo.md"
typst:
  - path: "typs/exemplo.typ"
    name: "Manual do Usuário"
  - path: "typs/exemplo2.typ"
    name: "Guia de Instalação"
---
```