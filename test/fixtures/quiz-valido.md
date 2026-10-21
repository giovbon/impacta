---
title: Quiz de exemplo
shuffleQuestions: false
shuffleAnswers: false
---

### Qual comando executa os testes?

> Dica: é o comando que descobre testes automaticamente.

1. [x] `pytest`
    > Correto: o pytest descobre e executa os testes.
1. [ ] `python`
1. [ ] `pip`

> O pytest é o runner usado neste projeto.

### Quais recursos ajudam a isolar um teste?

- [x] `tmp_path`
- [ ] `assert`
- [x] `monkeypatch`
- [ ] `print`

> Fixtures como `tmp_path` e `monkeypatch` preparam o ambiente.
