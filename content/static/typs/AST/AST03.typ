
#set page(
  paper: "a4",
  fill: rgb("#181818"),
  footer: align(center)[
    Gerado em: #datetime.today().display("[day]/[month]/[year]")
  ],
)

#set text(
  fill: rgb("#f5f5f5"),
  size: 14pt,
)

#show raw.where(block: false): set text(fill: rgb("#aed68d"))
#show link: set text(fill: rgb("#58a6ff"))

#let code-block(body) = block(
  width: 100%,
  fill: rgb("#242424"),
  inset: 10pt,
  radius: 4pt,
)[
  #body
]

#let answer-space(height: 2cm) = block(
  width: 100%,
  height: height,
  stroke: 0.7pt + rgb("#666666"),
  radius: 3pt,
)

== 1. Preparação do Ambiente e Código

Crie os arquivos abaixo na mesma pasta e instale o plugin de cobertura executando:

`pip install pytest-cov`

```python
def validar_acesso(idade, possui_convite):
    if idade >= 18 and possui_convite:
        return "Acesso Permitido"
    elif idade >= 18 and not possui_convite:
        return "Comprar Ingressos"
    else:
        return "Acesso Negado: Menor de Idade"
```

```python
from validador import validar_acesso


def test_acesso_permitido():
    resultado = validar_acesso(20, True)
    assert resultado == "Acesso Permitido"


def test_menor_de_idade():
    resultado = validar_acesso(15, False)
    assert resultado == "Acesso Negado: Menor de Idade"
```

== 2. Execução de Comandos e Análise de Resultados

Execute os comandos indicados no seu terminal e responda às questões analíticas.

=== Passo A: Cobertura de Linha

Rode o comando:

#code-block(raw("pytest -v --cov=validador", lang: "bash"))

#v(4pt)

*Q1. Analise o relatório impresso no terminal.* Qual foi a porcentagem de cobertura (`Cover`)? Sabendo que o teste não cobriu todos os cenários, por que a porcentagem de linhas executadas parece alta?

#answer-space(2cm)

=== Passo B: Cobertura de Desvio (Branch Coverage)

Rode o comando adicionando a análise de desvios:

#code-block(raw("pytest -v --cov=validador --cov-branch", lang: "bash"))

#v(4pt)

*Q2. Compare o resultado com o Passo A.*

- O que indicam os valores das colunas *`Branch`* e *`BrPart`*?
- Por que a métrica *`Cover`* caiu em relação ao Passo A? Qual falha de lógica a cobertura de linha escondeu?

#answer-space(2.2cm)

=== Passo C: Relatório Visual em HTML

Rode o comando para gerar o site visual e abra o arquivo em seu navegador:

#code-block(raw("coverage html", lang: "bash"))

#text(size: 8.5pt, fill: rgb("#475569"))[
  _Dica: Abra o arquivo `htmlcov/index.html` e clique em `validador.py`._
]

#v(4pt)

*Q3. Observe o código colorido na interface HTML.*

- Qual cor (*Verde*, *Vermelho* ou *Amarelo*) foi atribuída à linha `elif idade >= 18 and not possui_convite:`?
- O que você precisa fazer — qual teste específico criar em `test_validador.py` — para que **100%** do arquivo fique destacado em verde?

#answer-space(2.2cm)

== 3. Ação Prática (Desafio de Correção)

Escreva abaixo o novo método de teste que falta para ser adicionado ao arquivo `test_validador.py`. Após escrever, adicione-o ao arquivo, rode `pytest -v --cov=validador --cov-branch` novamente e confirme se atingiu **100% de cobertura**.

```python
def test_compra_ingressos():
    resultado = validar_acesso(20, False)
    assert resultado == "Comprar Ingressos"
```
