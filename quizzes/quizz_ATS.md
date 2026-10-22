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


### Complete a declaração da fixture no Pytest para que ela seja executada uma única vez para toda a sessão de testes, compartilhando o recurso entre todos os arquivos:

```python
@pytest.fixture(scope="___")
def conexao_global():
```

Resposta: session

> O parâmetro `scope="session"` faz com que a fixture seja instanciada apenas uma vez durante toda a execução da suíte do Pytest, independentemente da quantidade de testes ou arquivos executados. É o escopo mais abrangente do Pytest, indicado para recursos pesados compartilhados globalmente.

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


### O papel da Action oficial ___ logo no primeiro passo (step) de um Job no GitHub Actions é o de copiar todo o código-fonte do repositório para o ambiente limpo e isolado do Runner.

Resposta: actions/checkout | actions/checkout@v4


> Por padrão, o Runner é iniciado totalmente vazio. A Action `actions/checkout` executa os comandos Git necessários para clocar o repositório na máquina virtual do Job.


### Quais das seguintes opções representam gatilhos de eventos (`on:`) válidos para disparar um workflow no GitHub Actions?

- [x] `push`: Disparado quando alterações de código são enviadas ao repositório.

- [x] `pull_request`: Disparado quando uma solicitação de conversão de código é criada ou atualizada.

- [x] `workflow_dispatch`: Permite a execução manual do workflow através do botão "Run workflow" na interface.

- [ ] `git commit`: Disparado localmente na máquina do desenvolvedor antes de salvar a alteração.

> O GitHub Actions reage a eventos ocorridos no servidor do GitHub, como `push`, `pull_request`, `workflow_dispatch` ou rotinas agendadas (`schedule`). 

### Em automação de testes E2E com Selenium, o surgimento de testes oscilantes (*flaky tests*) ocorre com frequência devido a atrasos de rede ou renderizações dinâmicas. Por que o uso de `time.sleep()` é considerado uma má prática em relação às esperas inteligentes?

1. [x] O `time.sleep()` faz uma pausa fixa e incondicional, enquanto esperas inteligentes usam *polling* e liberam a execução no exato instante em que o elemento fica pronto.
    > Pausas fixas tornam a suíte desnecessariamente lenta ou falham se o tempo estipulado for insuficiente.

1. [ ] O `time.sleep()` consome excessivamente o processador da máquina virtual do Runner por criar um loop infinito.
1. [ ] O Selenium bloqueia a execução e lança exceção do tipo `DriverClosedException` ao identificar `time.sleep()`.
1. [ ] Esperas inteligentes executam testes apenas em navegadores headless sem depender de componentes HTML.

> O `time.sleep()` interrompe o script de forma engessada. Já esperas como a Espera Implícita e Explícita utilizam *polling* (sondagem em intervalos regulares) para continuar a execução no exato milissegundo em que a condição ou elemento se torna disponível.


### No Tavern, qual é a finalidade da propriedade `strict: False` configurada no bloco de validação de resposta (`response`)?

1. [x] Permitir que o teste passe validando apenas os campos informados no YAML, ignorando outras chaves adicionais retornadas na resposta JSON da API.
    > Evita que o teste quebre caso a API retorne campos extras que não são o foco da validação no momento.


1. [ ] Fazer com que o Tavern aceite códigos de status HTTP da faixa de erro 4xx e 5xx como sucesso.
1. [ ] Desativar a checagem de certificados SSL em conexões HTTPS.
1. [ ] Ignorar falhas de conexão de rede durante a execução dos testes no CI/CD.

> Com `strict: False`, o Tavern verifica apenas se os pares de chave-valor declarados no arquivo YAML batem com o JSON da API, desconsiderando chaves sobressalentes.


### A respeito da Espera Implícita (`implicitly_wait`) e da Espera Explícita (`WebDriverWait` com `Expected Conditions`), assinale a opção correta:

1. [x] A espera implícita é configurada globalmente uma vez e faz o Selenium aguardar até X segundos por qualquer elemento; a explícita aguarda por condições específicas em elementos determinados.
    > A implícita vale para toda a sessão; a explícita foca em eventos específicos como visibilidade ou estado clicável de um elemento.

1. [ ] A espera implícita deve ser chamada antes de cada clique no botão, enquanto a espera explícita só funciona com a classe `By.ID`.
1. [ ] Ambas as esperas pausam a execução pelo tempo total configurado, sem interromper o aguardo quando o elemento surge.
1. [ ] A espera explícita é nativa do navegador Firefox, sendo incompatível com o ChromeDriver.

> A Espera Implícita define um tempo limite global de sondagem para localização de elementos na página. A Espera Explícita exige o uso de `WebDriverWait` combinado com `Expected Conditions` (EC) para aguardar estados específicos de um elemento.