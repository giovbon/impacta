---
title: Revisão ATS
shuffleQuestions: true
shuffleAnswers: true
---

### Na Engenharia de Software, a cadeia de eventos que descreve o surgimento de um comportamento incorreto durante a execução de um programa é bem definida. Assinale a alternativa que apresenta a sequência correta dessa cadeia de causabilidade:

1. [x] Engano → Defeito (Bug) → Erro → Falha

1. [ ] Defeito → Engano → Falha → Erro
	> O engano é a causa primária cometida pelo desenvolvedor, não o resultado do defeito.

1. [ ] Erro → Falha → Engano → Defeito
	> A falha é a manifestação externa visível, sendo o último estágio da cadeia.

1. [ ] Falha → Erro → Defeito (Bug) → Engano
	> A cadeia está invertida.

> A cadeia lógica estabelece que um engano humano resulta em um defeito (bug) no código. Quando esse defeito é ativado durante a execução, ele gera um erro (estado interno inconsistente), que por sua vez provoca uma falha visível no comportamento do software.

### De acordo com a Pirâmide de Testes e com as boas práticas de Engenharia de Software Moderna, como deve ser distribuída a proporção aproximada dos tipos de testes em um projeto ideal?

1. [x] 70% Testes de Unidade, 20% Testes de Integração e 10% Testes de Sistema.
	> Testes de unidade são mais rápidos e isolados, devendo compor a base e a maior parte da suíte.

1. [ ] 10% Testes de Unidade, 20% Testes de Integração e 70% Testes de Sistema.
	> Inverter a pirâmide torna a suíte extremamente lenta, cara e difícil de manter.

1. [ ] 33% Testes de Unidade, 33% Testes de Integração e 33% Testes de Aceitação.
1. [ ] 50% Testes de Sistema (E2E) e 50% Testes de Integração.

> A recomendação clássica da Pirâmide de Testes sugere focar a maior parte dos esforços na base com testes de unidade (~70%), seguidos por testes de integração/serviços (~20%) e uma camada menor de testes de sistema/ponta a ponta (~10%).

### Quais das seguintes afirmações sobre a garantia da qualidade e testes de software são VERDADEIRAS?

- [x] O objetivo principal do teste não é provar que o software está perfeito, mas sim revelar defeitos ainda não encontrados.
- [ ] Testes de Unidade validam o software como um todo, garantindo os requisitos de negócio com o usuário final.
- [x] O Teste de Aceitação é geralmente realizado com foco em confirmar se os requisitos originais de negócio foram atendidos.
- [ ] A qualidade de software é uma característica simples e fácil de medir por meio de uma única métrica.

> O teste de software busca encontrar falhas e revelar defeitos. A validação final dos requisitos originais com o usuário é papel do Teste de Aceitação, enquanto os Testes Unitários focam na menor unidade de código isolada.

### Considerações sobre a estrutura dos frameworks `unittest` e `pytest` em Python revelam diferenças arquiteturais. Qual afirmação distingue corretamente ambos?

1. [x] O `unittest` é um framework nativo (built-in) baseado em POO que exige herança de `unittest.TestCase`, enquanto o `pytest` permite funções simples e usa o `assert` nativo do Python.

    > O `unittest` exige classes herdando de `TestCase`; o `pytest` aceita funções prefixadas com `test_` e usa a instrução `assert` nativa.

1. [ ] O `pytest` já vem instalado por padrão no Python, enquanto o `unittest` necessita de instalação via `pip install`.
    > O `unittest` é o framework nativo da linguagem Python.

1. [ ] O `unittest` utiliza a palavra-chave `yield` para verificar asserções, enquanto o `pytest` depende de métodos como `self.assertEqual()`.

1. [ ] Ambos exigem obrigatoriamente que todos os testes sejam escritos dentro de métodos de classes herdadas.

> O `unittest` faz parte da biblioteca padrão do Python e utiliza Orientação a Objetos (herdando de `unittest.TestCase`). Já o `pytest` exige instalação via pip e simplifica a escrita utilizando funções diretas e o comando `assert` do próprio Python.

### No Pytest, a gestão de contexto e dados de teste é realizada por meio de *Fixtures*. ___ é a palavra-chave do Python é utilizada dentro de uma fixture para separar a fase de preparação (*setup*) da fase de limpeza (*teardown*)?

Resposta: yield
    > No `pytest`, o `yield` pausa a execução da função de fixture para injetar a dependência no teste. Quando o teste termina, o Pytest retoma a execução imediatamente após o `yield` para executar o código de *teardown* (limpeza).
