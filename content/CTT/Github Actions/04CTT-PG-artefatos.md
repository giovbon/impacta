---
order: 4
title: Artefatos e gatilhos
presentation:
  - "slides/CTT/Github-Actions/05-artefatos-transf.md"
---

## Exemplo do uso de artefatos

```yaml
name: Aprendendo Artefatos

on: 
  push:
  workflow_dispatch:

jobs:
  gerador: # (1)!
    name: Produzir Arquivo
    runs-on: ubuntu-latest
    steps:
      - name: Criar relatório de teste
        run: echo "Sucesso! Artefato gerado em $(date)" > relatorio.txt

      - name: Salvar Artefato
        uses: actions/upload-artifact@v4 # (3)!
        with:
          name: meu-pacote # (4)!
          path: relatorio.txt # (5)!

  consumidor: # (2)!
    name: Ler Arquivo
    runs-on: ubuntu-latest
    needs: [gerador] # (6)!
    steps:
      - name: Recuperar Artefato
        uses: actions/download-artifact@v4 # (7)!
        with:
          name: meu-pacote # (8)!

      - name: Exibir Conteúdo
        run: cat relatorio.txt
```

1. Job que gera o arquivo
2. Job que usa o arquivo
3. Ferramenta oficial para enviar arquivos do executor atual para o armazenamento seguro do GitHub
4. Nome identificador do artefato, será um arquivo compactado
5. O arquivo que será criado e enviado
6. Obrigatório para o arquivo existir
7. Ferramenta oficial para recuperar esses arquivos do armazenamento e colocá-los dentro de um novo executor
8. O mesmo nome usado no upload