<!-- .slide: data-background-image="https://images.squarespace-cdn.com/content/v1/5fb4ea8933ae6c208c3dac41/1656395530398-NQT3HSOMM2GVD84P8FXM/car2car" data-background-size="cover" data-background-opacity="0.4" -->

# fixtures

---

**Fixture** é uma função que prepara e *fornece dados ou contexto* para os testes.

- *fornecer dados*, que envolve a criação e injeção de informações ou objetos, como usuários falsos ou listas de produtos

- *fornecer contexto* refere-se à configuração do ambiente de execução, como abrir conexões com bancos de dados ou criar pastas temporárias, assegurando um cenário ideal e isolado para a validação do código durante o teste.

O pytest *detecta automaticamente essas funções marcadas* com `@pytest.fixture`. Seus resultados são *injetados nos testes que as solicitam*, eliminando a necessidade de chamadas manuais, por simplesmente *adicionar o nome da fixture dentro dos parênteses da função de teste*.

---

Use `return` quando você só quer *fornecer um dado inicial para o teste e não precisa desfazer/limpar nada depois*:

```py
@pytest.fixture
def usuario_padrao():
    return {"nome": "João", "idade": 30}

def test_nome_do_usuario(usuario_padrao):
    assert usuario_padrao["nome"] == "João"
```

---

Use `yield` quando você cria algo que *precisa ser destruído ou fechado depois que o teste acabar* (ex: arquivos físicos, conexões de rede, bancos de dados):


```py
@pytest.fixture
def arquivo_temporario():
    # 1. SETUP
    arquivo = open("temp.txt", "w")

    # 2. INJEÇÃO (pausa a fixture e roda o teste)
    yield arquivo 

    # 3. TEARDOWN (o teste acabou, o código volta para cá)
    arquivo.close()
```

A transição entre os momentos no pytest é *gerida automaticamente com a palavra-chave `yield`*. Quando o teste começa, o pytest executa a fixture até encontrar o `yield`, momento em que "congela" a execução (da função da fixture) e entrega a variável ao teste. Após a execução do teste, independentemente do resultado, o pytest retoma a fixture a partir do `yield` para realizar a limpeza necessária. Todo esse processo acontece sem a necessidade de código adicional para gerenciar as transições, pois o pytest cuida disso automaticamente.

---

<!-- _class: invert -->
## Parâmetros de Fixtures

Alguns **parâmetros** são cruciais para definir o *comportamento e a abrangência* de uma fixture no Pytest.

### `scope`

O `scope` *determina como e quando a fixture é criada e destruída*. Com ele, você pode *evitar a criação repetida de recursos pesados*. São definidas junto à marcação de fixture: `@pytest.fixture(scope="class")`

---

| **Nível de Escopo** | **Descrição**                                                                                                                                                       |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `function` (Padrão)        | Roda a fixture *uma vez para cada teste*. Se 10 testes chamarem a fixture, ela roda 10 vezes. Ideal para dados simples em memória.                                   |
| `class`           | Roda apenas *uma vez por classe* de testes. Todos os testes dentro daquela classe compartilham o mesmo resultado da fixture.                                          |
| `module`          | Roda apenas *uma vez por arquivo de teste (`.py`)*. Útil para carregar um arquivo pesado (como um CSV gigante) apenas uma vez e reutilizá-lo nos testes daquele arquivo. |
| `session`         | O mais abrangente. *Roda apenas uma vez para toda a execução do pytest*, independentemente de quantos arquivos ou testes diferentes você use. Funciona bem para serviços globais. |

---

### `autouse`

O parâmetro `autouse=True` permite que a *fixture seja aplicada automaticamente a todos os testes dentro do seu escopo* (`scope`), eliminando a necessidade de injetar seu nome em cada função de teste (ex: `def test_algo(minha_fixture):`). Isso é útil para *configurações globais que devem impactar todos os testes*, mas que não requerem interação direta, como silenciar logs, configurar variáveis de ambiente ou limpar tabelas do banco de dados.

---

### `params`

O parâmetro `params` permite que uma *fixture execute múltiplas vezes com dados diferentes*. Ao passar uma lista com itens para `params`, qualquer teste que utilizar essa fixture será executado automaticamente para cada item. Isso é ideal para testá-la sob várias condições sem duplicar código. 

Para usá-lo, define-se a lista em `@pytest.fixture(params=[...])` e, dentro da fixture, usa-se `request.param` para acessar o valor atual.

---

## `conftest.py`

O **`conftest.py`** é um *arquivo do Pytest que centraliza recursos compartilhados para testes*. Ao definir fixtures ou configurações nele, o Pytest as torna automaticamente *disponíveis para todos os arquivos de teste na mesma pasta e subpastas, sem necessidade de importações manuais*. É ideal para armazenar fixtures globais, como conexões de banco de dados ou autenticações de API, mantendo o código dos testes limpo e livre de repetições.

---

*Colocar todas as fixtures* no `conftest.py` é considerado *má prática*, tornando o arquivo complexo e difícil de manter. A organização ideal é:
- Crie fixtures específicas *dentro do arquivo de teste* (`test_*.py`) para uso exclusivo desse arquivo.
- Utilize `conftest.py` *na raiz (global) para fixtures genéricas* que precisam ser compartilhadas entre vários testes.
- Use `conftest.py` em *subpastas para restrições regionais*, evitando a poluição entre diferentes domínios de teste.

```
meu_projeto/
├── conftest.py               <-- Fixtures globais
├── testes/
│   ├── api/
│   │   ├── conftest.py       <-- Fixtures específicas para testes de API
│   │   └── test_api.py
│   └── frontend/
│       ├── conftest.py       <-- Fixtures específicas para testes de backend
│       └── test_backend.py
```