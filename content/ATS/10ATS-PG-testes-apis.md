---
title: Testes de APIs
presentation: "slides/ATS/09ATS-SL-testes-apis.md"
order: 10
typst: 
- path: "typs/ATS/ATS10.typ"
  name: "Exercício ATS10"
submission: 
  - "ATS10"
codes: "codes/testes-api.md"
---

Para não ter de colocar o python path no comando, toda vez que rodar o pytest:
- Crie arquivo `pyproject.toml` na raiz
- Inclua dentro dele:
```
[tool.pytest.ini_options]
pythonpath = ["."]
```

## 📚 Referência
- [Easier API testing with Tavern - Tavern](https://tavern.readthedocs.io/en/latest/)
- [Cap. 8: Testes – Engenharia de Software Moderna](https://engsoftmoderna.info/cap8.html)
