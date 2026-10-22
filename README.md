# site-11ty — site de materiais de aula

Abre a navegação com `[` (ou Ctrl+B); fecha com `Esc`. Não há botão de abrir na interface.

Projeto **separado** do site Quartz que existe na raiz do repositório. Este projeto é autocontido:
conteúdo, slides, mapas mentais, códigos, quizzes e libs vivem todos aqui dentro.

## Requisitos

- Node 22+ (no WSL: `wsl bash -ic "..."` se o node não estiver no PATH do Windows)

## Comandos

```bash
./run.sh         # sobe o servidor de desenvolvimento (é o que você usa no dia a dia)
npm install
npm run dev      # o mesmo, sem o run.sh (servidor em http://localhost:8080)
npm run build    # limpa _site/ e gera de novo
npm test         # testes dos módulos puros
npm run clean    # apaga _site/
```

`./run.sh` roda Eleventy (`--serve`, com live reload), o esbuild em watch e o watch de
`content/`, `slides/`, `mindmaps/`, `codes/` e `quizzes/`: **salvar qualquer arquivo reconstrói o
site e o navegador recarrega sozinho**. Opções:

```bash
PORT=8081 ./run.sh                  # outra porta
BASE_URL=/11ty/ ./run.sh            # simular o Pages em subpasta
```

> Em `/mnt/c` (WSL) o filesystem não emite eventos de arquivo. O `eleventy.config.js` liga o
> *polling* sozinho nesse caso — sem ele, o servidor fica no ar sem perceber nenhuma mudança.
> `WATCH_POLLING=1`/`0` força ligado/desligado.

## Publicação

O site é publicado pelo GitHub Actions a partir de um **repositório separado**
(`giovbon/11ty`), então o Pages do repositório `impacta` (Quartz) não é afetado:
[`.github/workflows/deploy.yaml`](.github/workflows/deploy.yaml) roda `npm ci`, `npm test`,
`npm run build` com `BASE_URL=/11ty/` e publica `_site/`. Sem secrets (OIDC).

Antes do primeiro deploy, o Pages do repositório precisa estar habilitado com
*Source: GitHub Actions* (Settings → Pages): se o job rodar com o Pages ainda desligado,
o `configure-pages` falha com `Not Found`.

Para um build local igual ao de produção:

```bash
BASE_URL=/11ty/ npm run build
```

## Estrutura

```
content/    aulas em markdown (o frontmatter aciona os componentes) + static/ (assets publicados)
slides/     decks reveal.js (.md), lidos em tempo de build
mindmaps/   mapas mentais (.md), lidos em tempo de build
codes/      árvores de código do explorer (.zcode)
quizzes/    quizzes em markdown, lidos em tempo de build
docs/       PROPOSTA.md (contrato), MODELO.md (arquitetura) e SLIDES.md (guia dos decks)
scripts/    dev.mjs (serve + watch), build-assets.mjs (esbuild) e vendor-libs.mjs
run.sh      sobe o ambiente de desenvolvimento
src/        _lib (leitura do conteúdo), _data, _includes, pages, components, assets, client
_site/      saída do build (não versionada)
```

## Regras do projeto

1. Nada lê pastas fora de `site-11ty/`.
2. Um componente = uma pasta (`src/components/<nome>/`).
3. Asset que precisa chegar ao navegador mora em `content/static/**` → publicado em `/static/**`.
4. Pastas `oculto/` não são publicadas (ver abaixo).
5. Sem SPA: cada navegação é um carregamento novo.
6. Quizzes ficam em `quizzes/**`, são lidos no build e não são publicados como página solta.

## Quiz

Um quiz é acionado pelo frontmatter, igual a slides/códigos, e aparece **depois do conteúdo da
aula e antes da entrega**. A correção é local no navegador: **nada é enviado** e não há RA nem
planilha.

```yaml
---
title: Branching e Merging
quiz: "quizzes/git-branch-merge.md"
---
```

O arquivo em `quizzes/` usa uma sintaxe inspirada no Quizdown:

````md
---
title: Quiz — Branching e Merging
---

### O que `git switch -c feature` faz?

> Dica opcional. O blockquote antes das opções vira o botão "Ver dica".

1. [x] Cria a branch e passa para ela.
    > Comentário opcional desta opção.
1. [ ] Apaga a branch.
1. [ ] Faz merge na branch atual.

> Explicação mostrada depois de conferir.

### Complete o comando que cria a branch `feature`:

```bash
git switch ___ feature
```

Resposta: -c | --create

> Explicação da lacuna.
````

- `1. [x]` = **escolha única** (radio); `- [x]` = **múltipla escolha** (checkbox).
- `Resposta: ...` = **resposta escrita** (input de texto, sem opções). Separe alternativas aceitas
  com `|` (para um `|` literal, escape com `\|`); a comparação ignora maiúsculas/minúsculas, espaços
  repetidos e crases. Serve tanto para texto comum quanto para lacunas em blocos de código no
  enunciado.
- Blockquote **antes** das opções (ou do `Resposta:`) = dica; **depois** = explicação;
  **indentado sob uma opção** = comentário daquela opção.
- `shuffleQuestions: true` e `shuffleAnswers: true` no frontmatter do quiz embaralham de forma
  determinística no build.
- Enunciado, dica, explicação e opções aceitam **markdown completo**: blocos de código com realce e
  imagens. Imagens locais ficam em `content/static/**` e são referenciadas por `/static/...` (o
  prefixo do `BASE_URL` é aplicado automaticamente).
- Depois de **Conferir respostas**, o botão **Baixar resultado (.txt)** gera um relatório local com
  as questões erradas ou não respondidas: enunciado, o que foi marcado, resposta correta,
  comentários das opções, dica e explicação. Nada é enviado pela rede.
- As respostas ficam salvas no `sessionStorage` (chave por quiz + página) e são repostas ao
  recarregar a aba; **Limpar** apaga o rascunho. A correção não é restaurada — é preciso conferir de novo.
- O gabarito fica no HTML (`data-correct`/`data-answers`): é um recurso didático, não uma avaliação.
- Se o arquivo não existir ou a sintaxe estiver inválida, o build avisa no console e a página mostra
  um cartão de erro em vez de quebrar.
- **Não implementado nesta versão**: quiz de sequência/ordenação do Quizdown e envio de respostas.

## Ocultar conteúdo

Uma pasta chamada **`oculto`** em qualquer nível de `content/` tira tudo que está dentro dela do site publicado. Maiúsculas/minúsculas não importam (`oculto`, `Oculto`, `OCULTO`).

```text
content/ADP/oculto/rascunho.md        # não vira página nem aparece na navegação
content/static/oculto/imagem.png      # não é copiada para /static/oculto/
```

O build ignora a pasta inteira: páginas, listagens de pasta, navegação e assets em `content/static/oculto/**`. Para voltar a publicar, mova o arquivo para fora da pasta `oculto/` (ou renomeie a pasta).

Detalhes e roadmap: [`MODELO.md`](MODELO.md).
