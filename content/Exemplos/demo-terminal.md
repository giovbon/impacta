---
title: "Demonstração: Terminal Interativo"
asciinema:
  path: "demo.cast"
  name: "Demonstração: Comandos Iniciais de Terminal"
---

Esta página demonstra a integração do **Asciinema Player** no Quartz. 

O player acima é uma gravação real de um terminal. Você pode:
- **Pausar e dar play**
- **Copiar texto** diretamente de dentro da gravação
- **Alterar a velocidade**
- **Ver em tela cheia**

### Como usar no seu site
Você pode colocar seus arquivos `.cast` em uma pasta chamada `asciinema` na raiz do projeto. No frontmatter, você pode usar um objeto para incluir um nome/descrição:

```yaml
---
title: Minha Aula
asciinema:
  - path: "demo.cast"
    name: "Demonstração de Comandos Git"
---
```

Você também pode listar várias gravações, cada uma com sua descrição:

```yaml
---
title: Tutorial de Configuração
asciinema:
  - path: "install.cast"
    name: "Passo 1: Instalação"
  - path: "config.cast"
    name: "Passo 2: Configuração"
---
```

Isso é ideal para tutoriais de linha de comando, demonstrações de scripts Python ou logs de compilação.
