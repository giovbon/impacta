---
order: 1
title: Workflows
presentation:
  - "slides/CTT/Github-Actions/01-intro-github-actions.md"
  - "slides/CTT/Github-Actions/02-workflows.md"
---

Todos workflows são criados usando a linguagem YAML. Tenha em mente que a precisão na indentação é crucial. Um erro simples, como um espaço a mais ou a falta dele, pode fazer com que seu workflow falhe sem explicações claras.

Use sempre espaços, nunca Tabs, para indentar YAML (a indentação define a hierarquia dos dados). A convenção é 2 espaços por nível, o hífen conta na indentação e deve ser seguido por um espaço.

```yaml
# Nível 0
on: [push]

# Nível 0
jobs:
  # Nível 1 (2 espaços)
  testar_codigo:
    # Nível 2 (4 espaços)
    runs-on: ubuntu-latest
    steps:
      # Nível 3 (6 espaços, lista aninhada)
      - run: npm test
```

No GitHub, quando você faz um `git push`, o servidor olha para a pasta `.github/workflows/` à procura de workflows (arquivos `.yml` ou `.yaml`) e dispara todos os arquivos que tenham `on: push` configurado. 
O act imita esse comportamento, de forma que para executar os workflows você deve criar uma pasta, inicializar um repo com `git init`, criar as pastas `.github/workflows` e dentro de `workflows` colocar seus workflows como arquivos `.yml`

`.github/workflows/work-hello.yml` é o mesmo que essa estrutura de pastas:

```
├── Nome_Projeto_Git
│   ├── .github
│       ├── workflows
│   │   │   └── work-hello.yml
```

Elementos básicos de um workflow, a estrutura mínima para um workflow funcionar:

``` yaml
name: Hello World # (1)!

on: # (2)!
  workflow_dispatch:

jobs:
  say-hello-inline-bash: # (4)!
    runs-on: ubuntu-24.04 # (5)!
    steps: # (3)!
      - run: echo "Hello GitHub Action Workflow!" # (6)!
```

1. Workflow é o processo automatizado como um todo, identificado por esse rótulo ou nome.
2. Define o evento que faz o workflow rodar. No caso, foi configurado um gatilho manual (workflow_dispatch), que permite iniciá-lo clicando em um botão "Run workflow".
4. Job é um bloco de trabalho ou tarefa específica dentro do workflow, identificado por esse ID único (`say-hello-inline-bash`)
5. Define runner. Runner é a máquina ou ambiente virtual onde o job será executado (ex: um servidor `ubuntu-24.04`).
3. Steps são as instruções sequenciais executadas dentro do job.
6. Executa comando de linha de comando (shell).

## 📚 Referência
- [courses.devopsdirective.com/github-actions-beginner-to-pro](https://courses.devopsdirective.com/github-actions-beginner-to-pro)
- [Documentação do GitHub Actions - Documentos do GitHub](https://docs.github.com/pt/actions)