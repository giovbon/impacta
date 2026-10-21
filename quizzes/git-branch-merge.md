---
title: Quiz — Branching e Merging
---

### O que `git switch -c feature` faz?

1. [x] Cria a branch `feature` e passa para ela.
    > `-c` significa "create".
1. [ ] Apaga a branch `feature`.
1. [ ] Faz merge da branch `feature` na branch atual.

> `git switch -c <nome>` é o atalho moderno para criar e trocar de branch.

### Depois de commitar na branch `feature`, qual sequência integra o trabalho na `main`?

1. [x] `git switch main` e `git merge feature`
1. [ ] `git merge main` e `git switch feature`
1. [ ] `git push feature` e `git pull main`

> Primeiro você vai para a branch que recebe as mudanças; depois faz o merge da outra branch nela.

### Quais afirmações sobre merge fast-forward são verdadeiras?

- [x] A `main` avança até o commit da branch sem criar um commit de merge.
- [ ] O Git sempre cria um commit de merge, mesmo sem divergência.
- [x] Acontece quando a branch que recebe o merge não tem commits novos desde a ramificação.
- [ ] Só funciona com `git rebase`.

> No fast-forward não há divergência: o ponteiro da branch apenas avança.
