---
title: Github Actions
presentation: "slides/ATS/11ATS-SL-github-actions.md"
order: 12
typst: 
- path: "typs/ATS/ATS12.typ"
  name: "Exercício ATS12"
submission: 
  - "ATS12"
codes: "codes/github-actions.md"
---

## Matrix Strategy

A Estratégia de Matriz no GitHub Actions funciona como uma "máquina de clonagem". Você define uma matriz de variáveis (por exemplo, sistemas operacionais e versões do Python) e o Actions gera automaticamente um job separado para cada combinação, executando-os em paralelo na nuvem. Isso permite testar simultaneamente todas as variantes, por exemplo, `['ubuntu-latest','windows-latest']` × `['3.10','3.11']` produz quatro runners (Ubuntu+3.10, Ubuntu+3.11, Windows+3.10, Windows+3.11) sem duplicar código no YAML.  

Os principais benefícios são economia de tempo e manutenção (evita repetição de blocos de job), detecção precoce de bugs específicos de ambiente e aceleração do feedback ao desenvolvedor graças ao paralelismo. Exemplo do uso disso:

```yaml
name: Teste de API

on: [push]

jobs:
  verificar-api:
    strategy:
      matrix:
        python-version: ['3.10', '3.11', '3.12']
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'pip'

      - name: Instalar dependências
        run: |
          python -m pip install --upgrade pip
          pip install fastapi[standard] pytest httpx
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

      - name: Rodar Testes
        run: pytest test_main.py
```


## 📚 Referência
- [Documentação do GitHub Actions - Documentos do GitHub](https://docs.github.com/pt/actions)
- [Discovering the Most Popular and Most Used Github Actions - Codecov](https://about.codecov.io/blog/discovering-the-most-popular-and-most-used-github-actions/)