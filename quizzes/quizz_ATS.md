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

### Por que a Pirâmide de Testes recomenda manter uma proporção reduzida de testes de sistema (ponta a ponta ou de interface) em comparação com os testes de unidade?

1. [x] Porque os testes de sistema são mais lentos para executar, mais caros de manter, frágeis e alterações visuais de interface dificultam a identificação rápida da causa raiz de uma falha.
	> Testes de unidade executam em milissegundos, são isolados e baratos de manter. Já os testes de sistema (E2E) exigem inicialização de ambiente completo, sendo mais lentos, custosos, frágeis a mudanças em componentes de interface e complexos para diagnosticar a causa raiz do erro.
1. [ ] Porque testes de unidade são os únicos capazes de validar fluxos de interface com o usuário final e garantir cobertura total do sistema sem necessidade de mock.
1. [ ] Porque testes de sistema não conseguem detectar bugs reais em ambiente de produção, servindo apenas para documentação técnica do projeto.
1. [ ] Porque a execução de testes de unidade exige mais infraestrutura de servidores e bancos de dados do que os testes E2E.

> A Pirâmide de Testes recomenda a distribuição proporcional porque os testes de unidade oferecem feedback rápido, baixo custo e facilidade no isolamento de defeitos. Em contrapartida, os testes de sistema/E2E, embora importantes para validar a aplicação de ponta a ponta, são significativamente mais lentos, caros e propensos a quebrar por pequenas alterações visuais na interface (flakiness).   

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

### Um desenvolvedor criou o arquivo de teste test_calculadora.py contendo o seguinte código em Python:

```python
from function.py import soma

def checar_soma_com_numeros_positivos():
    assert soma(2, 3) == 5
```
Ao abrir o terminal na pasta do projeto e executar o comando pytest, o desenvolvedor não conseguiu ver o resultado do teste, o terminal cuspiu um erro. Com base nas regras de funcionamento do Pytest, por que o teste não foi executado?

1. [x] Porque a função de teste foi nomeada como `checar_soma_com_numeros_positivos()` em vez de começar com o prefixo obrigatorio `test_`.
	> O Pytest utiliza o princípio de convenção sobre configuração: para coletar e executar os testes automaticamente, ele exige que o arquivo comece com `test_` (ou termine com `_test.py`) e que as **funções de teste comecem estritamente com `test_**` (ex: `def test_soma_positivos():`).

1. [ ] Porque a função `soma` está declarada no mesmo arquivo que o teste, o que causa um erro de sintaxe no carregador do Pytest.

1. [ ] Porque o Pytest não aceita a instrução nativa `assert` do Python, exigindo a importação de `unittest` e o uso de `self.assertEqual()`.

1. [ ] Porque arquivos de teste no Pytest obrigatoriamente precisam definir uma classe e herdar de `pytest.TestCase`.

> **Nomes de Arquivo:** O Pytest procura arquivos que começam com `test_` (ex: `test_calculadora.py`) ou terminam com `_test.py`.

### Para um workflow funcionar ele deve estar na pasta (a partir da raiz do repo): `/___/workflows`

Resposta: .github

### No desenvolvimento moderno de software, por que a execução de testes automatizados é transferida da máquina local do desenvolvedor para um serviço como o GitHub Actions?
1. [ ] A) Porque o GitHub Actions substitui a escrita dos testes em Python/Pytest, gerando os testes automaticamente a partir do histórico de commits.
2. [x] B) Porque a qualidade do software não pode depender do ambiente ou da execução manual na máquina do desenvolvedor; o GitHub Actions automatiza essa validação ao disparar uma infraestrutura isolada (Runner) a cada push ou pull request.
3. [ ] C) Porque os testes automatizados só conseguem acessar bancos de dados e APIs externas quando executados na nuvem do GitHub.
4. [ ] D) Para reduzir a quantidade de código no repositório, transferindo os arquivos de teste para serem salvos na nuvem.Gabarito e Comentário:

> No ambiente de desenvolvimento, a execução manual de testes no terminal do próprio desenvolvedor está sujeita a falhas humanas e variações de ambiente ("na minha máquina funciona"). O GitHub Actions garante que a suíte de testes seja executada de forma autônoma e padronizada em uma máquina virtual limpa (Runner) a cada alteração enviada ao repositório. 

### Durante a escrita de testes de unidade para um módulo de validação de dados de clientes, um desenvolvedor utilizou o gerenciador de contexto `with pytest.raises(...)` para garantir que exceções esperadas sejam lançadas ao receber dados incorretos.

Analise o trecho de código abaixo:

```python
import pytest

# Teste 1: Passar a string "vinte" no lugar de um número inteiro para a idade.
def test_validar_idade_com_tipo_invalido():
    with pytest.raises(Excecao_A):
        validar_idade("vinte")

# Teste 2: Passar uma idade com valor negativo (-5) onde um int é esperado.
def test_validar_idade_com_valor_invalido():
    with pytest.raises(Excecao_B):
        validar_idade(-5)

# Teste 3: Tentar acessar a chave "telefone" em um dicionário que contém apenas "nome" e "email".
def test_buscar_campo_inexistente_no_usuario():
    usuario = {"nome": "Carlos", "email": "carlos@email.com"}
    with pytest.raises(Excecao_C):
        obter_campo(usuario, "telefone")
```

De acordo com a convenção e o propósito das *built-in exceptions* do Python, quais exceções devem substituir `Excecao_A`, `Excecao_B` e `Excecao_C`, respectivamente, para que os testes passem de forma correta?

1. [x] **Excecao_A:** `TypeError` | **Excecao_B:** `ValueError` | **Excecao_C:** `KeyError`
    > **`TypeError`:** Disparada quando o tipo do dado é incompatível com a operação (enviar uma string `"vinte"` onde se exigia número). **`ValueError`:** Disparada quando o tipo do dado está correto (`int`), mas o valor informado é inválido para a regra de negócio (idade negativa `-5`). **`KeyError`:** Disparada ao tentar acessar uma chave inexistente em um dicionário.

1. [ ] **Excecao_A:** `ValueError` | **Excecao_B:** `TypeError` | **Excecao_C:** `IndexError`
    > `ValueError` é para valor inválido, não tipo. `IndexError` ocorre em sequências como listas e tuplas ao acessar um índice fora dos limites, não em dicionários.

1. [ ] **Excecao_A:** `AttributeError` | **Excecao_B:** `ValueError` | **Excecao_C:** `FileNotFoundError`
    > `AttributeError` ocorre ao tentar invocar um método ou propriedade inexistente em um objeto. `FileNotFoundError` ocorre na tentativa de manipular arquivos cujo caminho não existe.

1. [ ] **Excecao_A:** `TypeError` | **Excecao_B:** `ZeroDivisionError` | **Excecao_C:** `KeyError`
    > `ZeroDivisionError` é restrito a operações aritméticas de divisão por zero.
    

### Em testes de unidade com Pytest, a comparação direta de números de ponto flutuante (*floats*) como `0.1 + 0.2 == 0.3` resulta em falha devido a pequenos ruídos de arredondamento na memória da linguagem (que gera algo como `0.30000000000000004`).

Para resolver esse problema, o Pytest disponibiliza um recurso auxiliar que aplica uma margem de tolerância flexível na verificação:

```python
import pytest

def test_calculo_decimal():
    # Valida a soma de decimais sem falhar por ruído de arredondamento
    assert 0.1 + 0.2 == pytest.___

```

Resposta: approx(0.3)


> Computadores apresentam limitações ao representar números decimais em binário. O método `pytest.approx()` resolve isso calculando a diferença entre os números e aceitando o resultado caso a variação seja insignificante.

### Complete a declaração da fixture no Pytest para que ela seja executada uma única vez para toda a sessão de testes, compartilhando o recurso entre todos os arquivos:

```python
@pytest.fixture(scope="___")
def conexao_global():
```

Resposta: session

> O parâmetro `scope="session"` faz com que a fixture seja instanciada apenas uma vez durante toda a execução da suíte do Pytest, independentemente da quantidade de testes ou arquivos executados. É o escopo mais abrangente do Pytest, indicado para recursos pesados compartilhados globalmente.

### A fixture ___ roda uma vez para cada teste. Se 10 testes chamarem a fixture com esse escopo (default), ela roda 10 vezes. Ideal para dados simples em memória.

Resposta: function

### Em relação às fixtures, complete abaixo com o parâmetro que permite que uma fixture execute múltiplas vezes com dados diferentes:

```python
@pytest.fixture( ___ =["mysql", "postgres", "sqlite"])
def banco_dados(request):
```

Resposta: params

### O ciclo fundamental do Desenvolvimento Dirigido por Testes (TDD) é composto por três etapas iterativas. Assinale a alternativa que indica a sequência correta desse ciclo e o significado de suas fases:

1. [x] **Red** (escrever um teste que falha), **Green** (escrever o código mínimo para passar) e **Refactor** (melhorar o código sem alterar seu comportamento).
    > O ciclo inicia com o teste falhando, segue para a implementação rápida e finaliza com a limpeza/melhoria da arquitetura.

1. [ ] **Red** (corrigir um bug), **Green** (escrever o teste) e **Refactor** (enviar para produção).
1. [ ] **Green** (escrever o código funcional), **Red** (escrever o teste para validar) e **Refactor** (refatorar o teste).
1. [ ] **Refactor** (simplificar a arquitetura), **Red** (criar a especificação) e **Green** (testar o resultado).

> O ciclo TDD baseia-se em: 1º **Red** (escrever o teste antes da funcionalidade, que inicialmente falha); 2º **Green** (implementar a solução simples necessária para o teste passar); 3º **Refactor** (eliminar duplicações e refatorar o código mantendo os testes passando).

### Quais das seguintes opções representam **Anti-Padrões (Test Smells)** na prática do TDD?

- [x] Testar detalhes de implementação interna em vez de focar nos resultados e comportamentos observáveis.

- [ ] Manter pequenos ciclos de repetição focados em uma única funcionalidade.

- [x] Pular sistematicamente a fase de Refatoração, levando ao acúmulo de débito técnico no código.

- [x] Criar testes excessivamente grandes e complexos que cobrem múltiplas regras de negócio ao mesmo tempo.

> Testar detalhes de implementação torna os testes frágeis. Pular a refatoração gera código confuso (débito técnico) e criar testes gigantes violam o princípio de atomicidade e clareza do TDD.

### Durante o desenvolvimento de testes unitários, dublês de teste são empregados para isolar o código sob teste de suas dependências externas. Associe os tipos de dublês às suas respectivas definições:

1. **Dummy**
2. **Fake**
3. **Stub**
4. **Mock**

- Objeto que possui uma implementação funcional simplificada (ex: banco de dados em memória).
- Objeto passado apenas para preencher a assinatura de um método, mas que nunca é utilizado na lógica.
- Objeto pré-programado com respostas fixas/controladas para responder a chamadas específicas.
- Objeto utilizado para verificar interações, expectativas e a ordem de chamadas de métodos.

Assinale a ordem correta do topo para o base:

1. [x] 2, 1, 3, 4
    > Fake = implementação simplificada; Dummy = apenas preenche parâmetros; Stub = retorna dados fixos pré-definidos; Mock = valida interações e comportamento.

1. [ ] 1, 2, 4, 3
1. [ ] 3, 4, 1, 2
1. [ ] 2, 3, 4, 1

> Fakes contêm lógica de negócio simplificada. Dummies servem apenas para satisfazer a verificação de tipos do compilador/interpretador. Stubs fornecem respostas diretas e prontas para o teste. Mocks testam o comportamento e validam se métodos específicos foram invocados corretamente.

### Qual é a diferença fundamental entre a utilização de um **Stub** e de um **Mock** em testes unitários?

1. [x] O Stub é focado em fornecer respostas indiretas controladas para o caso de teste, enquanto o Mock foca em verificar o comportamento e o cumprimento de interações/chamadas.
    > Stubs fornecem dados de entrada para o teste; Mocks inspecionam o comportamento de saída e validação de chamadas.


1. [ ] O Stub é usado apenas em testes de interface (UI), enquanto o Mock serve exclusivamente para conexões de banco de dados.
1. [ ] O Mock executa a implementação real da dependência, enquanto o Stub é uma simulação em memória.
1. [ ] Não há diferença técnica, sendo termos sinônimos utilizados indiferentemente pela literatura.

> O **Stub** provê dados simulados de entrada para que o estado do teste seja exercitado. O **Mock** foca no teste de comportamento (behavior testing), verificando se o SUT chamou os métodos da dependência na ordem e com os argumentos corretos (ex: através do comando `verify`).

### O Selenium é um ecossistema amplamente utilizado para automação de testes de sistema e ponta a ponta (E2E). Sobre a arquitetura do Selenium e o padrão W3C WebDriver, assinale a opção correta:

1. [x] O Selenium atua como um cliente HTTP/JSON sob o protocolo W3C WebDriver, delegando a tradução dos comandos para drivers específicos (como ChromeDriver e GeckoDriver) executarem no navegador.
    > O desacoplamento do Selenium permite enviar comandos genéricos padronizados pela W3C que o Driver traduz para cada navegador nativo.

1. [ ] O Selenium interage com o navegador exclusivamente através da captura da imagem da tela e identificação de coordenadas X e Y de pixels.
    > O Selenium lê a estrutura do código HTML e a árvore DOM do site, permitindo encontrar elementos por IDs, XPaths e seletores CSS.

1. [ ] O Selenium dispensa o uso de drivers externos, pois possui o código fonte do Google Chrome e Firefox embutido no seu próprio núcleo.
1. [ ] Os testes escritos em Selenium funcionam exclusivamente em navegadores em modo visível, sendo impossível sua execução em servidores CI/CD sem interface gráfica.

> O Selenium utiliza a especificação **W3C WebDriver**, permitindo o desacoplamento entre a linguagem do script e os navegadores. O script envia comandos padronizados via HTTP/JSON para o Driver (ex: ChromeDriver), que os traduz para a arquitetura nativa de cada navegador.


### Ao executar automações e testes E2E com Selenium em servidores de integração contínua (CI/CD) sem interface gráfica (*mode headless*), o recurso de captura de tela é essencial para o registro de evidências e auditoria de falhas, através do uso método abaixo:
> O screenshot funciona como os "olhos" do teste quando ele roda de forma invisível no servidor.

```python
driver.________("evidencia_falha.png")
```

Resposta: save_screenshot | save_screenshot()

> Em ambientes headless (sem tela visível), o recurso de *print screen* (`driver.save_screenshot()`) é fundamental para capturar evidências exatas de falhas ou comprovar a execução de tarefas para auditoria e monitoramento. O método `save_screenshot("nome_do_arquivo.png")` captura a renderização atual da página e a salva no caminho indicado, servindo como registro visual de auditoria ou depuração de erros.


### O Behavior Driven Development (BDD) foi concebido por Dan North como uma evolução do TDD. Qual é a premissa central do BDD no alinhamento entre as equipes técnicas e de negócio?

1. [x] Focar no comportamento esperado do sistema sob a perspectiva do usuário, utilizando linguagem simples e estruturada para facilitar a comunicação na reunião dos "Três Amigos" (PO, Dev e QA).
    > O BDD aproxima negócio e desenvolvimento traduzindo requisitos em cenários executáveis.
1. [ ] Substituir integralmente o TDD e os testes unitários, eliminando a necessidade de escrever código de teste em linguagens de programação.
    > O BDD não substitui o TDD; ele é uma evolução focada no negócio, enquanto o TDD foca na qualidade técnica e de unidade.
1. [ ] Exigir que clientes e gerentes de produto escrevam o código das funções de teste diretamente em Python ou Java.
    > Partes interessadas do negócio utilizam a linguagem Gherkin, enquanto o vínculo técnico com o código é feito pelos desenvolvedores/QAs.
1. [ ] Garantir que a cobertura de código seja calculada com base na quantidade de palavras-chave da documentação.

> O BDD foca no comportamento do sistema usando linguagem natural estruturada (Gherkin). Ele resolve falhas de comunicação alinhando as perspectivas do Product Owner (PO), Desenvolvedor (Dev) e Analista de Qualidade (QA) antes de iniciar a codificação.

### O que caracteriza essencialmente a prática do Desenvolvimento Dirigido por Testes (TDD)?
1. [ ] Criar o código de produção completo e, em seguida, escrever os testes automatizados para validar a implementação.
1. [x] Escrever os testes unitários antes de implementar o código de produção correspondente.
1. [ ] Testar manualmente a interface do usuário após cada grande entrega de software.
1. [ ] Utilizar apenas testes de integração em vez de testes unitários.

> O TDD (também conhecido como Test-First Development) baseia-se na inversão do fluxo tradicional: escreve-se o teste primeiro. O teste inicialmente falha, servindo como especificação para que se escreva o código de produção necessário para fazê-lo passar.

### Qual é a conduta orientada pelo TDD ao identificar um bug no sistema?
1. [ ] Alterar diretamente o código de produção até que o bug desapareça e depois subir para produção.
1. [x] B) Escrever primeiro um teste que reproduza o bug (gerando um resultado Red), para só então corrigir o código e fazê-lo passar (Green).
1. [ ] C) Excluir os testes da funcionalidade afetada para evitar falhas na esteira de compilação.
1. [ ] D) Reescrever toda a suíte de testes do projeto antes de investigar o erro.

> Escrever um teste que reproduz o erro antes de corrigi-lo assegura que a falha foi compreendida e funciona como uma proteção permanente para que o mesmo erro não volte a acontecer no futuro. 

### Na sintaxe Gherkin, a palavra-chave ___ é utilizada para especificar uma pré-condição necessária antes de executar a ação principal do cenário.

Resposta: given

> A gramática Gherkin utiliza `Given` (Dado que) para especificar pré-condições, `When` para ações do usuário e `Then` para asserções e resultados esperados.

### No ecossistema do `pytest-bdd`, complete o decorador utilizado para vincular um passo de ação (`Quando eu somo 2 e 2`) de um arquivo `.feature` à sua respectiva função Python:

```python
@___("eu somo 2 e 2")
def somar(estado):
    estado["total"] = 2 + 2

```

> Corresponde ao comando de ação da linguagem Gherkin mapeado para a biblioteca em Python.

Resposta: when | When | @when

> O decorador `@when` faz a correspondência exata do texto da etapa "Quando" do arquivo Gherkin com a função Python que executa essa ação no `pytest-bdd`.

### Sobre o BDD, complete corretamente:

```
Feature: Checkout de produtos na loja virtual
___ : o usuário está autenticado no sistema
And: o usuário tem algum produto no carrinho
When: o usuário clica no botão "Finalizar Compra"
Then: a tela de pagamento deve ser exibida
```

Resposta: given

### A biblioteca `pytest-bdd` utiliza o arquivo .___ para especificar e descrever os cenários de teste em sintaxe Gherkin.

Resposta: feature

> O arquivo com extensão `.feature` armazena a descrição do comportamento do sistema escrita em linguagem natural estruturada (Gherkin, utilizando palavras-chave como *Funcionalidade*, *Cenário*, *Dado*, *Quando* e *Então*). O `pytest-bdd` atua como um tradutor, lendo esse arquivo `.feature` e vinculando cada etapa do texto às funções de teste correspondentes no código Python.

### O Selenium é focado em navegadores e encontra elementos no HTML (por ID, XPath, CSS), tornando a automação robusta mesmo se a janela for redimensionada. Já o ___ depende de coordenadas fixas de tela ou imagens capturadas, tornando o script vulnerável a alterações na resolução ou na posição das janelas.

Resposta: PyAutoGUI

### Em qual nível da Pirâmide de Testes o Selenium se posiciona predominantemente e qual é o tipo de teste construído por ele?

1. [ ] A) Na base da pirâmide, onde executa testes unitários rápidos para pequenas partes isoladas de código.
1. [ ] B) Na camada intermediária, criando testes de integração exclusivos para bancos de dados sem interface visual.
1. [x] C) No topo da pirâmide, executando testes de sistema, de interface de usuário (UI) e ponta a ponta (E2E).
1. [ ] D) Fora da pirâmide, pois ferramentas de automação de navegador servem apenas para extração de dados (web scraping) e não para testes de software.

> O Selenium simula as ações de um usuário real no navegador. Na pirâmide de testes, essa abordagem é classificada no topo, compondo testes de sistema / E2E / UI que validam os fluxos completos da aplicação de ponta a ponta. 

### Ao realizar uma ação em um site que abre uma nova aba no navegador, como o Selenium gerencia essa nova janela?

1. [ ] A) O Selenium altera o foco automaticamente para a nova aba assim que ela é aberta pelo navegador.
1. [x] B) O Selenium mantém o foco na aba inicial. Para interagir com a nova aba, é necessário obter a lista `driver.window_handles` e alterar o foco explicitamente através do comando `driver.switch_to.window()`.
1. [ ] C) O Selenium lança uma exceção `TabNotAllowedException` e encerra a execução, pois não tem suporte a múltiplas janelas.
1. [ ] D) A nova aba é fechada automaticamente pelo Selenium para evitar o consumo excessivo de memória RAM.

> O Selenium só controla a aba em que foi iniciado. Para trabalhar em outra aba, é preciso capturar as identificações na lista `driver.window_handles` (onde o índice 0 é a primeira e 1 é a segunda) e trocar o foco com `driver.switch_to.window(...)`.

### O GitHub Actions organiza automações através de eventos, workflows, jobs e steps. Sobre a arquitetura e ordem de execução desses elementos, assinale a opção correta:

1. [x] Jobs rodam em paralelo por padrão em Runners isolados, enquanto os Steps de um mesmo Job são executados de forma estritamente sequencial.
    > Jobs são independentes e rodam concorrentemente (a menos que haja `needs`), mas seus Steps internos rodam um após o outro.

1. [ ] Todos os Jobs de um workflow rodam obrigatoriamente dentro do mesmo Runner sequencialmente.
    > Cada Job recebe uma instância ou máquina virtual (Runner) diferente.

1. [ ] Steps podem rodar em paralelo dentro de um mesmo Job para otimizar o tempo de compilação.
    > Os Steps dentro de um Job sempre rodam em sequência.

1. [ ] Os arquivos de workflow devem ser armazenados na raiz do projeto dentro da pasta `.github/actions/`.
    > Os arquivos `.yml` de workflow devem obrigatoriamente ficar na pasta `.github/workflows/`.

> No GitHub Actions, os workflows são ativados por eventos (como `push`). Os **Jobs** rodam concorrentemente por padrão em **Runners** separados. Dentro de cada Job, os **Steps** são executados um por um em sequência.


### A Action ___ tem o papel de copiar todo o código-fonte do repositório para o ambiente limpo e isolado do Runner, logo no primeiro passo (step) de um Job no GitHub Actions.

Resposta: actions/checkout | actions/checkout@v4


> Por padrão, o Runner é iniciado totalmente vazio. A Action `actions/checkout` executa os comandos Git necessários para clocar o repositório na máquina virtual do Job.


### Quais das seguintes opções representam gatilhos de eventos (`on:`) válidos para disparar um workflow no GitHub Actions?

- [x] `push`: Disparado quando alterações de código são enviadas ao repositório.

- [x] `pull_request`: Disparado quando uma solicitação de conversão de código é criada ou atualizada.

- [x] `workflow_dispatch`: Permite a execução manual do workflow através do botão "Run workflow" na interface.

- [ ] `git commit`: Disparado localmente na máquina do desenvolvedor antes de salvar a alteração.

> O GitHub Actions reage a eventos ocorridos no servidor do GitHub, como `push`, `pull_request`, `workflow_dispatch` ou rotinas agendadas (`schedule`). 

### Complete as lacunas sobre o funcionamento do GitHub Actions em um pipeline de testes: "Para evitar que a validação dependa do computador do desenvolvedor, o GitHub Actions disponibiliza uma máquina virtual limpa chamada ___. Quando ocorre um gatilho como o `push`, o workflow é disparado para configurar o ambiente e rodar os testes automaticamente."

Resposta: runner

### No contexto de DevOps, a Integração Contínua (CI) busca integrar alterações de código frequentemente no repositório compartilhado de forma segura. O ___ conecta os testes automatizados ao fluxo do Git (eventos de `push` ou `pull request`), garantindo a validação contínua e impedindo que código quebrado ou sem cobertura chegue aos ambientes finais.

Resposta: GitHub Actions

### Em automação de testes E2E com Selenium, o surgimento de testes oscilantes (*flaky tests*) ocorre com frequência devido a atrasos de rede ou renderizações dinâmicas. Por que o uso de `time.sleep()` é considerado uma má prática em relação às esperas inteligentes?

1. [x] O `time.sleep()` faz uma pausa fixa e incondicional, enquanto esperas inteligentes usam *polling* e liberam a execução no exato instante em que o elemento fica pronto.
    > Pausas fixas tornam a suíte desnecessariamente lenta ou falham se o tempo estipulado for insuficiente.

1. [ ] O `time.sleep()` consome excessivamente o processador da máquina virtual do Runner por criar um loop infinito.
1. [ ] O Selenium bloqueia a execução e lança exceção do tipo `DriverClosedException` ao identificar `time.sleep()`.
1. [ ] Esperas inteligentes executam testes apenas em navegadores headless sem depender de componentes HTML.

> O `time.sleep()` interrompe o script de forma engessada. Já esperas como a Espera Implícita e Explícita utilizam *polling* (sondagem em intervalos regulares) para continuar a execução no exato milissegundo em que a condição ou elemento se torna disponível.

<!-- REMOVE AST -->
### No Tavern, qual é a finalidade da propriedade `strict: False` configurada no bloco de validação de resposta (`response`)?

1. [x] Permitir que o teste passe validando apenas os campos informados no YAML, ignorando outras chaves adicionais retornadas na resposta JSON da API.
    > Evita que o teste quebre caso a API retorne campos extras que não são o foco da validação no momento.


1. [ ] Fazer com que o Tavern aceite códigos de status HTTP da faixa de erro 4xx e 5xx como sucesso.
1. [ ] Desativar a checagem de certificados SSL em conexões HTTPS.
1. [ ] Ignorar falhas de conexão de rede durante a execução dos testes no CI/CD.

> Com `strict: False`, o Tavern verifica apenas se os pares de chave-valor declarados no arquivo YAML batem com o JSON da API, desconsiderando chaves sobressalentes.


### A respeito da Espera Implícita (`implicitly_wait`) e da Espera Explícita (`WebDriverWait` com `Expected Conditions`) do Selenium, assinale a opção correta:

1. [x] A espera implícita é configurada globalmente uma vez e faz o Selenium aguardar até X segundos por qualquer elemento; a explícita aguarda por condições específicas em elementos determinados.
    > A implícita vale para toda a sessão; a explícita foca em eventos específicos como visibilidade ou estado clicável de um elemento.

1. [ ] A espera implícita deve ser chamada antes de cada clique no botão, enquanto a espera explícita só funciona com a classe `By.ID`.
1. [ ] Ambas as esperas pausam a execução pelo tempo total configurado, sem interromper o aguardo quando o elemento surge.
1. [ ] A espera explícita é nativa do navegador Firefox, sendo incompatível com o ChromeDriver.

> A Espera Implícita define um tempo limite global de sondagem para localização de elementos na página. A Espera Explícita exige o uso de `WebDriverWait` combinado com `Expected Conditions` (EC) para aguardar estados específicos de um elemento.

### Durante a automação de testes unitários com Pytest, é preciso validar se um método lança uma exceção adequada ao receber entradas inválidas. O método ___ atua como um gerenciador de contexto que verifica se o código executado dentro do bloco `with` dispara a exceção esperada. Caso a exceção ocorra, o teste é considerado bem-sucedido; caso contrário, o teste falha.

Resposta: raises | pytest.raises

> Funcionamento: Utiliza-se o gerenciador de contexto `with pytest.raises(ExcecaoEsperada):` envolvendo o trecho de código sob teste. O `pytest.raises` captura a exceção especificada e faz o teste passar se ela for lançada.

<!-- REMOVE AST -->
### Dentro de testes de API. enquanto a biblioteca `requests` trabalha de forma puramente síncrona, a biblioteca ___ foi desenvolvida para suportar requisições assíncronas (`async`/`await`) e HTTP/2. Isso permite testar serviços concorrentes de alta performance de maneira eficiente.

Resposta: httpx

> Em arquiteturas síncronas, chamadas externas ou conexões ao banco travam a thread. Já nas assíncronas (`async`/`await`), economiza-se memória e suporta alto volume de requisições concorrentes.

### Testes de desempenho, testes de usabilidade e testes de estresse/falha classificam-se em qual categoria de testes de software?

1. [x] Testes de Requisitos Não-Funcionais.
    > Avaliam atributos de qualidade do sistema, como velocidade, resiliência e facilidade de uso, e não regras de negócio específicas.
1. [ ] Testes de Unidade Isolada.
1. [ ] Testes de Mutação de Código.
1. [ ] Testes Estáticos de Sintaxe.

> Enquanto testes funcionais buscam encontrar falhas na lógica de negócio, testes não-funcionais aferem requisitos como velocidade e suporte à carga (desempenho), facilidade de navegação (usabilidade) e comportamento em desastres (resiliência/falhas).

### Na automação de testes de interface gráfica (E2E) com Selenium, um grande desafio é a presença de ___ , caracterizados como um teste que apresenta resultados inconsistentes (passa/falha) no mesmo código, causado frequentemente por problemas de sincronismo, temporização e seletores instáveis.

Resposta: Flaky Tests

> Um *flaky test* é aquele que gera resultados imprevisíveis na mesma versão do sistema. As causas mais comuns envolvem atrasos na rede, animações de interface e escolhas ruins de locators.


### Na escolha de estratégias para localizar elementos no DOM (Locators) no Selenium, quais são os dois fatores fundamentais que devem ser equilibrados para garantir a qualidade da automação?

1. [x] Performance (velocidade de busca no motor do navegador) e Resiliência (capacidade de não quebrar diante de mudanças visuais/estruturais).
    > A seleção de seletores deve priorizar a rápida localização e a resistência a alterações no leiaute.
1. [ ] Complexidade e Quantidade de linhas no código YAML.
1. [ ] Criptografia do seletor e compatibilidade com bancos de dados relacionais.
1. [ ] Tamanho da imagem da captura de tela e número de threads de CPU.

> A escolha dos locators deve buscar máxima performance de busca do navegador e alta resiliênci, evitando que pequenas atualizações no CSS ou leiaute quebrem o teste.

### Durante o desenvolvimento de suítes de teste unitário, a duplicação de código de teste para validar diferentes cenários de entrada e saída é considerada um anti-padrão. O recurso nativo do Pytest que resolve esse problema, permitindo a execução de uma mesma função de teste contra múltiplos conjuntos de dados, é o `@pytest.mark.` ___ (complete).

Resposta: parametrize

> Esse decorador injeta automaticamente cada tupla de dados como argumentos da função de teste, gerando um caso de teste individual para cada conjunto.

> O decorador `@pytest.mark.parametrize` permite implementar testes orientados a dados (Data-Driven Testing), executando a função de teste de forma independente para cada combinação de parâmetros fornecida, sem interromper os demais cenários se um deles falhar.

### Em projetos Python estruturados com o Pytest, o arquivo ___ `.py` contêm as fixtures globais para que fiquem disponíveis automaticamente para todos os arquivos de teste do diretório, sem a necessidade de importação explícita.

Resposta: conftest

> O arquivo `conftest.py` é o ponto central de compartilhamento de fixtures e configurações no Pytest. Qualquer fixture declarada nele é descoberta automaticamente por todos os arquivos de teste do mesmo nível de diretório ou inferiores.

### A Cobertura de Linha avalia apenas se cada instrução ou comando do código-fonte foi executado pelo menos uma vez durante a suíte de testes; já a Cobertura de ___ é uma métrica mais rigorosa, pois avalia se todas as possibilidades de tomada de decisão (como cada caminho verdadeiro e falso de uma estrutura condicional) foram exercitadas.

Resposta: desvio

> A Cobertura de Linha afere a passagem dos testes pelas linhas executáveis do código. Contudo, uma única execução pode passar por 100% das linhas ativando apenas a condição verdadeira de um `if`, deixando o fluxo condicional falso sem verificação. A Cobertura de Desvio exige testar ambos os desvios (`True` e `False`), sendo mais abrangente.


### "O comando ___ atua como um formatador que transforma os dados de cobertura em um relatório visual e interativo, gerando automaticamente uma pasta chamada `htmlcov` no diretório do projeto, cujo arquivo principal é o `index.html`. Ao abrir esse arquivo no navegador, o código-fonte é apresentado colorido: as linhas em verde representam linhas executadas e cobertas pela suíte de testes, as linhas em vermelho indicam linhas não executadas (lacunas de testes) e as linhas em amarelo sinalizam desvios lógicos (branches) atingidos apenas parcialmente (exige o uso da flag `--cov-branch`)."

Resposta: coverage html

### Em engenharia de software, a medição de cobertura de código (Code Coverage) ajuíza a porcentagem de linhas ou ramos exercitados pela suíte de testes. Por que uma cobertura de 100% de linhas (Statement Coverage) NÃO garante a ausência de defeitos na aplicação?

1. [x] Porque a cobertura de linhas indica apenas que o código foi executado, mas não garante que todas as combinações de condições lógicas foram testadas ou que as asserções do teste são suficientes.
> Testar se uma linha rodou não significa que o valor de retorno foi validado de forma rigorosa ou que condições de borda foram cobertas.


2. [ ] Porque a métrica de cobertura de código só é válida para linguagens compiladas como C e Java, sendo irrelevante para Python.
3. [ ] Porque ferramentas de cobertura (como `pytest-cov`) calculam apenas linhas de comentário e assinaturas de funções.
4. [ ] Porque atingir 100% de cobertura invalida os testes de integração do pipeline de CI/CD.

> A cobertura de linhas mede a execução, não a qualidade das asserções. Uma suíte de testes pode atingir 100% de cobertura sem ter um único comando `assert`, falhando em detectar defeitos comportamentais.

<!--
### Avaliar a efetividade da suíte de testes através da inserção de pequenas alterações intencionais no código fonte de produção, verificando se os testes falham ao detectar a mudança é uma técnica chamada de teste de ___ .

Resposta: mutação

### Nos testes de mutação, se os testes passarem após uma mutação no código de produção, dizemos que o mutante ___, indicando uma brecha na suíte de testes.

Resposta: sobreviveu

> O Teste de Mutação afere a qualidade dos próprios testes. Ele introduz defeitos propositais ("mutantes") no código de produção; se os testes continuarem passando (mutante sobreviveu), a suíte é fraca ou possui asserções incompletas naquele trecho.

-->

### No contexto de automação de testes de sistema e interface gráfica (E2E) com Selenium, a utilização do padrão de projeto **Page Object Model (POM)** é amplamente recomendada. Qual é o propósito arquitetural desse padrão?

1. [x] Abstrair as páginas Web em classes Python onde os elementos de tela (locators) e as interações de usuário são encapsulados, separando os detalhes da interface da lógica do script de teste.
> Facilita a manutenção: se o ID de um botão mudar no HTML, atualiza-se apenas a classe da página, sem quebrar os arquivos de teste.


1. [ ] Converter chamadas de API REST escritas em YAML no Tavern diretamente para scripts do Selenium WebDriver.
1. [ ] Substituir o uso do protocolo W3C WebDriver pela leitura direta do código-fonte do servidor.
1. [ ] Garantir que todas as páginas da aplicação Web sejam testadas de forma síncrona sem o uso de navegadores.

> O Page Object Model (POM) reduz a duplicação e melhora a manutenção dos testes E2E. Cada página da aplicação torna-se uma classe; as operações (clicar, preencher) viram métodos, isolando o teste contra alterações de leiaute ou seletores HTML.


### Quais das seguintes opções representam benefícios diretos da adoção do padrão Page Object Model em projetos de automação E2E?

* [x] Reutilização de código de interação com a interface gráfica em múltiplos testes.
* [x] Facilidade de manutenção quando ocorrem alterações na estrutura HTML ou seletores dos elementos da página.
* [x] Maior legibilidade dos scripts de teste, que passam a descrever ações de alto nível do usuário.
* [ ] Eliminação da necessidade de utilizar ferramentas de integração contínua (CI/CD) como o GitHub Actions.

> O POM melhora a reusabilidade, a legibilidade e a manutenibilidade das suítes de teste de interface, sem qualquer relação com a eliminação de esteiras de CI/CD.

### Uma regra de negócio determina que um desconto é concedido apenas para compras com valor total entre R$ 100,00 e R$ 500,00 (inclusive). Ao aplicar a técnica de **Análise de Valor Limite (Boundary Value Analysis)**, quais valores devem ser selecionados para testar essa regra de forma otimizada?

1. [x] R$ 99,99; R$ 100,00; R$ 100,01; R$ 499,99; R$ 500,00 e R$ 500,01.
> Testa exatamente nas bordas (limite inferior e superior, imediatamente antes e imediatamente depois).

1. [ ] R$ 0,00; R$ 250,00 e R$ 1000,00.
> Seleciona apenas valores intermediários (particionamento de equivalência simples), ignorando os limites onde os erros costumam ocorrer.

1. [ ] R$ 100,00 e R$ 500,00 exclusivamente.
1. [ ] Qualquer valor aleatório gerado por uma biblioteca de testes de carga.

> A Análise de Valor Limite foca nas fronteiras das classes de equivalência (imediatamente abaixo, no limite exato e imediatamente acima), pois é onde os desenvolvedores mais cometem enganos de operadores condicionais (ex: `<` em vez de `<=`).

### A técnica de **Particionamento por Classes de Equivalência** visa reduzir o número total de casos de teste necessários. Qual é a premissa dessa técnica?

1. [x] Dividir o domínio de entrada de dados em partes (classes) onde se presume que o sistema apresentará o mesmo comportamento para qualquer valor pertencente a essa mesma classe.
> Se o sistema se comporta da mesma forma para todo o intervalo, basta testar um único representante daquela classe.

1. [ ] Testar exaustivamente todas as combinações de números inteiros possíveis suportadas pela memória do computador.
1. [ ] Executar o mesmo caso de teste várias vezes até que o banco de dados atinja a capacidade máxima.
1. [ ] Validar apenas as entradas que causam exceções irrecuperáveis no sistema operacional.

> O Particionamento por Classes de Equivalência divide os dados de entrada em conjuntos válidos e inválidos. Espera-se que qualquer elemento de uma mesma classe gere o mesmo resultado, permitindo escolher apenas um representante por classe.

<!--
### Seguem atividades típicas de Testes ___ : Inspeção de código-fonte, revisão por pares (Code Review) e análise automatizada por Linters (ex: Flake8, Pylint, SonarQube) sem executar a aplicação.

Resposta: estáticos | estaticos | estático | estatico

> Esse tipo de teste examinam o código, documentação e arquitetura sem necessidade de colocar o sistema em execução.

> Testes estáticos analisam artefatos (código, requisitos, diagramas) sem executar o programa, identificando falhas de sintaxe, más práticas, vulnerabilidades e desvios de padrão antes do tempo de execução (*runtime*).

### Ferramentas automatizadas que analisam o código-fonte sem executá-lo para identificar violações de estilo, potenciais bugs e vulnerabilidades de segurança são conhecidas como analisadores estáticos ou ___.

> Categoria de ferramentas que inspecionam o código em tempo de desenvolvimento (ex: Flake8, Pylint, ESLint).

Resposta: linters | Linters | linter

> Os **Linters** inspecionam o código-fonte em busca de erros sintáticos, padrões de código inadequados, variáveis não utilizadas e falhas potenciais de segurança sem a necessidade de rodar o programa.

-->

### O conjunto amplo de testes executado após alterações no código para garantir que funcionalidades antigas não foram danificadas, assegurando que novas alterações não reintroduziram defeitos antigos, são chamados de testes de ___.

Resposta: regressão


### Na automação de testes E2E com Selenium WebDriver, a escolha da estratégia de localização de elementos (Locators) afeta a velocidade e a resiliência dos scripts. CSS Selectors possuem melhor desempenho de busca no motor do navegador, mas o locator ___ possui maior poder expressivo, permitindo navegar em direção aos elementos pai (`parent`) e buscar por texto exato.

Resposta: XPath | xpath

> O CSS Selector não consegue subir na árvore do DOM (navegar para elementos pai) nem buscar elementos por texto contido, recursos suportados pelo XPath.

<!--
### O Teste de Mutação injeta pequenas modificações sintáticas (mutantes) no código sob teste. Quando um mutante é gerado alterando um operador de `>=` para `>`, e a suíte de testes existente CONTINUA PASSANDO sem acusar erro, como esse mutante é classificado e o que esse resultado indica?

1. [x] O mutante **Sobreviveu**, indicando que a suíte de testes possui uma deficiência ou brecha (falta de teste para o valor limite exato).
	> Se o teste não falhou com a mudança no código de produção, significa que nenhum teste validou aquele ponto de borda.

1. [ ] O mutante foi **Morto**, confirmando a alta eficácia e rigor da suíte de testes.
1. [ ] O mutante é **Equivalente**, significando que o código mutado é mais rápido que o original.
1. [ ] O teste de mutação falhou por problemas de sintaxe no interpretador Python.

> Se a suíte de testes continua passando após a modificação do código de produção, o mutante **sobreviveu**. Isso revela um ponto cego na suíte de testes, mostrando que não existe asserção testando a condição limite específica.

-->

### Para que o `pytest` reconheça e execute os cenários descritos em um arquivo `.feature`, de que forma o `pytest-bdd` realiza a ligação desse arquivo com o arquivo de teste Python (`test_*.py`)?**

1. [ ] Importando diretamente a classe `Feature` via `from pytest_bdd import Feature` e instanciando o arquivo como um módulo Python.
1. [x] Chamando a função `scenarios('caminho/do/arquivo.feature')` (ou utilizando o decorador `@scenario`) dentro do arquivo Python de teste.

1. [ ] Renomeando o arquivo `.feature` para `.py` e utilizando a instrução `import` padrão do Python.
1. [ ] Adicionando a tag `# pytest: load_feature` na primeira linha do arquivo `.feature`.


> Para que a suíte do `pytest` descubra e execute os cenários descritos em Gherkin, o arquivo de teste Python (`test_*.py`) precisa apontar para o arquivo `.feature` correspondente. O `pytest-bdd` fornece a função `scenarios('arquivo.feature')` (ou o decorador individual `@scenario('arquivo.feature', 'Nome do Cenário')`), que faz a leitura do arquivo de texto, carrega seus cenários e os mapeia para as funções decoradas com `@given`, `@when` e `@then` no Python.

### Sobre o `pytest-bdd`, preencha a lacuna:

```python
from pytest_bdd import _________, given, when, then

# Comando do pytest-bdd utilizado para carregar o arquivo .feature
# e vincular todos os seus cenários à execução do Pytest:
_________('soma.feature')
```

Resposta: scenarios
