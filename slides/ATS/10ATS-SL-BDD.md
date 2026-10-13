<!-- .slide: class="slide-cover" -->
<p class="slide-cover__kicker">ATS · Automação de Testes de Software</p>

# BDD

<p class="slide-cover__rule"></p>
<p class="slide-cover__sub"></p>
<p class="slide-cover__meta"><span>Prof. Giovani B.</span></p>
<p class="slide-cover__num">09</p>

---

## O que é BDD?

O **Behavior Driven Development (BDD)**, ou Desenvolvimento Guiado por Comportamento, é uma *prática* de engenharia de software ágil focada em *melhorar a comunicação entre as equipes técnicas* (desenvolvedores, QA) *e as partes interessadas do negócio* (gerentes de produto, clientes). 

Em vez de focar na implementação técnica de uma funcionalidade, o BDD foca no **comportamento esperado** do sistema sob a perspectiva do usuário final, utilizando uma *linguagem simples e natural* que todos consigam entender.

--

**O Criador:** O BDD foi idealizado em *2003* pelo desenvolvedor britânico **Dan North**.

**A Relação com TDD:** O BDD não substitui o TDD (Desenvolvimento Guiado por Testes); ele é uma **evolução** dele:
- **TDD** foca em escrever testes unitários antes do código para garantir que o código funcione corretamente (*foco técnico*)
- **BDD** foca em descrever o comportamento do sistema para garantir que a equipe esteja construindo a funcionalidade certa (*foco no negócio*).

---

## O problema

O BDD foi criado para resolver a *falha de comunicação e o desalinhamento de expectativas entre quem pede o software e quem constrói o software*. A *área de negócios* escreve requisitos longos e complexos em documentos de texto, e os *desenvolvedores* traduzem isso para testes em código que ninguém de negócios consegue ler para validar se estão correto.

--

## Os 3 Amigos

A reunião dos "Three Amigos" (Os Três Amigos) é um dos conceitos centrais do BDD. É a forma prática como o BDD resolve o problema de comunicação na equipe. Para ajudar a resolver o problema, o BDD propõe que *antes de qualquer linha de código ser escrita*, uma funcionalidade deve ser discutida por **três perspectivas** fundamentais:

- **O Negócio (Product Owner):** Define qual é o problema a ser resolvido e qual valor isso traz. Traz a ideia da funcionalidade, as regras de negócio e o objetivo do cliente.
- **O Desenvolvimento (Dev):** Analisa como o problema pode ser resolvido tecnicamente, e como vamos construir isso. Avalia a viabilidade técnica, a complexidade da solução e quais arquiteturas ou componentes serão afetados.
- **A Qualidade (QA):** Pensa nos casos extremos e no que pode dar errado. Questiona os casos de borda (edge cases), cenários de erro, fluxos alternativos e como a regra será validada.

--

O termo *"Three Amigos"* se refere aos três pontos de vista (Negócio, Desenvolvimento e Qualidade) que precisam concordar sobre como o software deve se comportar antes do trabalho de codificação começar.

Em vez de uma pessoa escrever os requisitos sozinha e passar para os desenvolvedores e QAs lerem depois, três papéis fundamentais se sentam juntos antes de o código ser escrito para conversar e definir o comportamento da funcionalidade.

--

Sem os "Three Amigos", o fluxo tradicional costuma gerar mal-entendidos:

- O PO escreve um documento achando que explicou tudo.
- O Dev entende o documento de um jeito e desenvolve a funcionalidade.
- O QA entende de outro jeito e abre bugs porque o código não faz o que ele esperava.

---

### Sintaxe Gherkin (Dado, Quando, Então)

Para que os *testes sejam legíveis por todos*, o BDD popularizou o uso de uma *linguagem estruturada chamada Gherkin*. Ela mapeia o comportamento em etapas lógicas de causa e efeito:

- **`Feature`**: fornece uma descrição de alto nível das funcionalidades do software.
- **`Given`**: especifica uma pré-condição.
- **`When`**: define alguma ação.
- **`And`**: é utilizado para incluir passos adicionais junto com as etapas **Given**, **When** e **Then**.
- **`Then`**: verifica a consequência ou o resultado esperado da ação.

--

Vamos criar um cenário onde um usuário vai comprar um produto. Note como cada palavra-chave cumpre exatamente o papel descrito na imagem.

**Cenário: Navegação para a tela de pagamento**

- **`Feature`:** Checkout de produtos na loja virtual
- **`Given`:** o usuário está autenticado no sistema
- **`And`:** o usuário tem algum produto no carrinho
- **`When`:** o usuário clica no botão "Finalizar Compra"
- **`Then`:** a tela de pagamento deve ser exibida
- **`And`:** o valor total do pedido deve ser "R$ 250,00"

---

## `pytest-bdd`

O `pytest-bdd` é uma das melhores ferramentas para aplicar BDD em Python. Ele é uma biblioteca Python de código aberto (que você instala usando o `pip`) que atua como um **plugin** (uma extensão) para o `pytest`. Em vez de construir um motor de testes inteiro do zero, os criadores do `pytest-bdd` *adicionaram ao `pytest` a capacidade de ler textos em BDD*.

- **O Gherkin não é um software**, ele é apenas um padrão de gramática, uma sintaxe. É ele quem dita a regra de usar as palavras estruturadas (`Funcionalidade`, `Cenário`, `Dado`, `Quando`, `Então`, `E`) e você escreve isso em texto.
- **O `pytest-bdd` é o tradutor (a implementação)** entrando como o software que faz a "leitura" desse arquivo de texto (`.feature`) e vincula cada frase a uma função real em Python.

--

Existem *outras bibliotecas* que também sabem ler Gherkin no Python, como o **Behave** ou o **Radish**. O `pytest-bdd` é apenas uma das implementações disponíveis, mas é considerada uma das melhores justamente por usar o ecossistema do `pytest`.

---

## Exemplo

Em arquivo `soma.feature`:

```
# language: pt
Funcionalidade: Matemática
  Cenário: Soma exata
    Dado que o valor inicial é zero
    Quando eu somo 2 e 2
    Então o total deve ser 4
```

--

Arquivo `test_soma.py`:

```py
from pytest_bdd import scenarios, given, when, then

# 1. Carrega o arquivo
scenarios('soma.feature')

# 2. DADO
@given("que o valor inicial é zero", target_fixture="estado")
def valor_inicial():
    # Passamos um dicionário simples com o valor 0
    return {"total": 0}

# 3. QUANDO
@when("eu somo 2 e 2")
def somar(estado):
    # Fazemos a soma diretamente aqui
    estado["total"] = 2 + 2

# 4. ENTÃO
@then("o total deve ser 4")
def verificar_resultado(estado):
    # Validamos se deu 4
    assert estado["total"] == 4
```

--

Ao executar com `pytest test_soma.py`, o pytest-bdd faz o seguinte, passo a passo:

- Lê `scenarios('soma.feature')` e carrega o arquivo `soma.feature`.
- Encontra o cabeçalho `# language: pt` e usa o dicionário interno para mapear `Dado`→`given`, `Quando`→`when`, `Então`→`then`.
- Percorre o cenário linha a linha, extraindo as strings das etapas:
    - `que o valor inicial é zero`
    - `eu somo 2 e 2`
    - `o total deve ser 4`
- Registra as funções Python decoradas (`@given`, `@when`, `@then`) e faz correspondência exata das strings das etapas com os decoradores do código.

--

- Ao casar cada texto exatamente, executa as funções na ordem das etapas:
    - Chama `valor_inicial()` (`@given`) que retorna `{"total": 0}` e o disponibiliza como fixture `estado`.
    - Chama `somar(estado)` (`@when`) que atualiza `estado["total"] = 4`.
    - Chama `verificar_resultado(estado)` (`@then`) que executa `assert estado["total"] == 4`.
- Se todas as asserções passarem, o teste é considerado bem-sucedido; se a correspondência de strings falhar ou a asserção falhar, o pytest reporta erro.