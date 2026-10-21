---
title: Quiz — Branching e Merging
shuffleQuestions: true
shuffleAnswers: true
---

### O que `git switch -c feature` faz?

1. [x] Cria a branch `feature` e passa para ela.
    > `-c` significa "create".
1. [ ] Apaga a branch `feature`.
1. [ ] Faz merge da branch `feature` na branch atual.

> `git switch -c <nome>` é o atalho moderno para criar e trocar de branch.

### Depois de commitar na branch `feature`, qual sequência integra o trabalho na `main`?

1. [x] `git switch main` e `git merge feature`
    > O merge acontece na branch que recebe as mudanças.
1. [ ] `git merge main` e `git switch feature`
1. [ ] `git push feature` e `git pull main`

> Primeiro você vai para a branch que recebe as mudanças; depois faz o merge da outra branch nela.

### Quais afirmações sobre merge fast-forward são verdadeiras?

- [x] A `main` avança até o commit da branch sem criar um commit de merge.
- [ ] O Git sempre cria um commit de merge, mesmo sem divergência.
- [x] Acontece quando a branch que recebe o merge não tem commits novos desde a ramificação.
- [ ] Só funciona com `git rebase`.

> No fast-forward não há divergência: o ponteiro da branch apenas avança.

### Complete o comando que cria a branch `feature` e já troca para ela:

```bash
git switch ___ feature
```

> A opção curta tem uma letra e substituiu o antigo `git checkout -b`.

Resposta: -c | --create

> `-c` é a forma curta de `--create`; o comando completo fica `git switch -c feature`.

### Observe o diagrama: por que o merge criou o commit `M`?

![Diagrama de um merge de três vias: a main tem A, B e C; a feature nasce em B e tem D e E; o merge M combina C e E](/static/quiz/merge-tres-vias.svg)

> Repare quantos pais o commit `M` tem.

1. [x] Porque `main` e `feature` tinham commits novos desde a ramificação.
    > É o caso clássico de merge de três vias: as duas histórias divergiram.
1. [ ] Porque o Git sempre cria um commit vazio em todo merge.
1. [ ] Porque o `git merge` foi executado dentro da branch errada.

> Quando as duas branches avançaram, o Git combina as duas histórias em um commit de merge com dois pais.
