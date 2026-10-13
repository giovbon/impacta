#set page(
  paper: "a4",
  fill: rgb("#181818"),
  footer: align(center)[Gerado em: #datetime.today().display("[day]/[month]/[year]")],
)
#show raw.where(block: false): set text(fill: rgb("#aed68d"))
#set text(
  fill: rgb("#f5f5f5"), 
  size: 14pt
)
#show link: set text(fill: rgb("#58a6ff"))

= Exercício Prático: Implementando BDD em um Carrinho de Compras
*Ferramentas necessárias:* Python, `pytest`, `pytest-bdd`

== O Cenário
Você faz parte de uma equipe ágil de um e-commerce. O *Product Owner (Negócios)* enviou um e-mail com a seguinte solicitação informal:

> *"Precisamos de um sistema de carrinho de compras básico. O usuário tem que conseguir adicionar um produto e ver o valor total atualizado. Mas atenção: a gente não pode deixar o cliente adicionar um produto se a quantidade que ele quer for maior do que o que temos no estoque! Se isso acontecer, o sistema deve dar um erro avisando de estoque insuficiente."*

Sua missão é transformar esse requisito informal em um comportamento testável e implementado, passando por três etapas lógicas.

=== Parte 1: O Chapéu do Negócio e QA
*Objetivo:* Escrever o comportamento esperado em uma linguagem que todos entendam.

Crie um arquivo chamado `carrinho.feature`. Com base no pedido do Product Owner, escreva *dois cenários* utilizando a sintaxe Gherkin (`Funcionalidade`, `Cenário`, `Dado`, `Quando`, `Então`, `E`):

1. *Cenário 1:* Adicionar um produto com sucesso (quando há estoque suficiente).
2. *Cenário 2:* Tentar adicionar um produto sem estoque suficiente (deve gerar uma falha).

*Dica:* Lembre-se de definir um contexto inicial (o carrinho vazio e o estoque disponível), a ação (tentar adicionar X unidades) e a validação (o total do carrinho mudou ou um erro ocorreu).

=== Parte 2: O Chapéu do Desenvolvedor - Código Base
*Objetivo:* Criar a regra de negócio real (código de produção) que resolve o problema.

Crie um arquivo chamado `carrinho.py`. Semelhante ao exemplo da conta bancária que você estudou, utilize dicionários para representar o estado das coisas. 

Implemente duas funções em Python:
1. `criar_carrinho()`: Deve retornar um dicionário representando o carrinho inicial: `{"total": 0, "itens": 0}`. Aqui, `itens` representa a quantidade total de unidades de produtos no carrinho.
2. `adicionar_produto(carrinho, quantidade_desejada, estoque_disponivel, preco_unitario)`: 
   - Verifique se a `quantidade_desejada` é menor ou igual ao `estoque_disponivel`.
   - Se for, atualize a quantidade total de unidades (`itens`) e o valor total no dicionário do `carrinho`.
   - Se não for, dispare uma exceção (`raise ValueError("Estoque insuficiente")`).

=== Parte 3: O Chapéu do QA Técnico - Automação
*Objetivo:* Traduzir o arquivo de texto em testes executáveis utilizando o `pytest-bdd`.

Crie um arquivo chamado `test_carrinho.py`. Você vai conectar o Gherkin (Parte 1) ao seu código Python (Parte 2).

*Requisitos da automação:*
1. Importe `scenarios`, `given`, `when`, `then` e `parsers` do `pytest_bdd`.
2. Carregue o arquivo `carrinho.feature`.
3. Crie os passos (`@given`) para inicializar o carrinho usando `target_fixture`.
4. Crie os passos (`@when`) usando `parsers.parse` para capturar os valores dinâmicos do texto (quantidade, estoque e preço) e chame sua função `adicionar_produto`.
5. Crie os passos de validação (`@then`) para garantir que o total do carrinho bate com o valor esperado.

*Desafio Extra (Tratamento de Exceção no BDD):*
No cenário de falha por falta de estoque, o `pytest` vai falhar a execução se o `ValueError` não for tratado durante o teste. Utilize um bloco `try...except` dentro do seu passo `@when` para capturar a exceção e armazená-la em uma chave como `carrinho["erro"]` no seu dicionário de estado, permitindo validar a mensagem "Estoque insuficiente" no `@then`.

=== Critérios de Sucesso
Ao final você deve conseguir abrir o seu terminal, digitar:
`pytest test_carrinho.py -v`

E visualizar os dois cenários passando com sucesso, provando que a comunicação entre o que o negócio pediu (Gherkin) e o que o desenvolvedor fez (Python) está perfeitamente alinhada.