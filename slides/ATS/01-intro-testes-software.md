<!-- .slide: data-background-image="https://images.squarespace-cdn.com/content/v1/5fb4ea8933ae6c208c3dac41/1656395530398-NQT3HSOMM2GVD84P8FXM/car2car" data-background-size="cover" data-background-opacity="0.4" -->

# Introdução aos Testes de Software

---

## O que é testes de software?

Testar é uma maneira organizada de *passar informações* para um software e *decidir* se o que ele devolve está certo de acordo com o que foi prometido nas especificações.

### Principais Pontos

**Revelar Defeitos**: O objetivo do teste não é provar que um programa está perfeito, mas *mostrar que existem erros*. Um teste é considerado bom se ele descobrir um erro que ainda não foi encontrado.

**Como Funciona**: O processo envolve *três etapas*: 
1. montar um cenário de teste
2. executar a ação que você quer testar
3. verificar se o resultado que você obteve está de acordo com o que esperava

--

**Identificação de Erros e Falhas**: Se o *resultado obtido não bate com o esperado*, isso significa que um *defeito* foi encontrado. Isso pode mostrar que há *algo errado* que faz o programa funcionar de maneira diferente do que deveria.

**Perspectivas de Teste**:

- **Teste Funcional**: Olha para o software como um *usuário final*, verificando como ele deve reagir a determinadas funções.
- **Teste de Unidade**: Se concentra nos *detalhes internos*, checando como as partes do código (como funções) estão funcionando.

---

## Por que é necessário testar?

É necessário testar o software porque sua construção é uma *tarefa complexa e sujeita a erros humanos* em todas as fases do desenvolvimento. Como o *software tá presente em quase tudo* hoje em dia, garantir que ele funcione como prometido é essencial pra manter a *qualidade e a confiança* no produto.

Aqui estão os **principais motivos** para fazer testes:

• O foco principal é descobrir problemas pra *corrigir tudo antes de entregar o produto* pro usuário.

• Detectar problemas no começo do desenvolvimento é *muito mais barato* do que consertar depois.

• **Confiança e Sanidade do Desenvolvedor**: Sem uma bateria de testes, o código pode se tornar um "emaranhado ininteligível", gerando *medo de realizar alterações* (como refatorações) *por não saber o que pode ser quebrado acidentalmente* (regressões).
• Fazer testes ajuda a evitar que o *cliente perca a confiança na equipe* ao esbarrar em bugs que poderiam ter sido pegos antes.

---

### Exemplos reais

As piores coisas (consequências) aconteceram em **sistemas críticos**:

Em 2012, a **Knight Capital**, uma das maiores *corretoras de ações* dos EUA, instalou um novo software de negociação. O problema surgiu quando um *código antigo e "morto"*, que estava desativado há anos nos servidores, foi acidentalmente reativado devido a uma configuração errada durante o deploy. *O sistema começou a comprar e vender milhões de ações de forma frenética, perdendo dinheiro em cada transação.* Em apenas 45 minutos, a empresa enfrentou um prejuízo de *440 milhões de dólares*. Eles *quase faliram* e precisaram da ajuda de um grupo de investidores para se manter à tona.

--

O **Therac-25** era uma *máquina de radioterapia* computadorizada. O problema começou com um bug conhecido como "condição de corrida" (race condition). Se o *operador digitasse os comandos muito rapidamente*, o software ativava o feixe de elétrons de alta energia sem que o escudo protetor fosse colocado no lugar. O resultado foi alarmante: a máquina liberava *doses de radiação até 100 vezes mais altas* do que o planejado, mas mostrava uma mensagem de erro genérica ("Malfunction 54") que não informava sobre o perigo real. Pelo menos seis pacientes receberam overdoses massivas de radiação, o que levou a *mortes e ferimentos gravíssimos*.

--

A **sonda** foi enviada para *estudar o clima de Marte*, mas nunca conseguiu completar a missão. O problema começou com uma *falha na conversão de unidades*: uma equipe da Lockheed Martin usou o sistema Imperial (libras-força), enquanto a equipe da NASA utilizou o sistema Métrico (Newtons). Isso gerou um caos, já que o software de navegação recebeu dados errados, *fazendo com que a sonda se aproximasse demais da atmosfera de Marte*. O resultado foi a *destruição da sonda* devido ao calor e pressão atmosférica, com um custo total da missão em torno de *125 milhões de dólares*.

---

## Fatores que causam falhas

* **Erro Humano:** é a *principal causa* das falhas, pois como o *software depende muito da habilidade das pessoas*, qualquer erro na fase de desenvolvimento pode causar defeitos no produto final.

* **Complexidade do Sistema:** problemas podem surgir pois a construção de software é uma *tarefa inerentemente complexa*, e essa complexidade, muitas vezes resulta em um resultado diferente do que era esperado.

* **Falhas de Integração:** muitas falhas ocorrem especificamente quando as *diversas partes do software são colocadas para trabalhar juntas*. Mesmo que unidades individuais funcionem bem, sua interação pode ser inadequada e levar a comportamentos não especificados.

--

* **Manutenção e Regressões:** *sempre que mudamos algo no sistema* para corrigir bugs ou adicionar funcionalidades, existe o risco de surgir novos problemas. Isso é conhecido como **regressão**, onde requisitos que antes funcionavam deixam de funcionar.

* **Degradação do Código:** o *acúmulo de código confuso e desorganizado* gera "débito técnico", tornando o *desenvolvimento mais complicado e propenso a erros*, pois o desenvolvedor perde de vista as dependências do sistema e fica receoso em fazer mudanças.

---

## Cadeia de eventos
### Engano, bug, erro e falha

Um **engano** cometido por uma pessoa resulta em um **defeito (bug)** no software. Quando esse defeito é *ativado* (o programa é executado), ele pode gerar um **erro**, que é um estado interno inconsistente do sistema. Esse erro, por sua vez, pode levar a uma **falha**, que se manifesta como um comportamento ou resultado incorreto do software.

--

<div style="text-align: center;">
    <img src="../zSLIDES/img/image.png" width="60%">
</div>

---

## Relação dos Testes com Qualidade

A **qualidade de software** é uma *característica complexa e difícil de medir*, que abrange *várias dimensões*, como funcionalidade, confiabilidade, eficiência, portabilidade, usabilidade e manutenibilidade. Essa qualidade é *garantida por processos de Validação, Verificação e Teste*, que asseguram que tanto o produto final quanto seu processo de desenvolvimento atendam às especificações. 

A *percepção de qualidade pelos usuários* está muito ligada à *confiança no código* e à *ausência de bugs* que atrapalhem o trabalho, sendo uma das características mais desejadas em um sistema.

A **confiabilidade** refere-se à capacidade do software de *operar corretamente (sem falhas) sob certas condições*: em um período específico e em um ambiente determinado.

--

Diferentemente do hardware, a *confiabilidade do software* não diminui com o tempo ou desgaste físico; ela *é aprimorada ao longo do tempo através da detecção e eliminação de defeitos durante os testes e operação*. 

Um *alto nível de confiabilidade* é crucial em *sistemas críticos*, como os de controle de usinas nucleares, equipamentos médicos ou aeroespaciais, onde falhas podem causar consequências graves.

---

# O que deve ser testado?
## Já que os testes são tão importantes para garantir a qualidade do software, isso significa que devemos testar absolutamente tudo?

---

## Resposta: Não, você não deve, e nem consegue, testar tudo.

Na prática isso seria um **teste exaustivo**: abordagem teórica onde se tenta *testar todas as combinações possíveis de dados de entrada* e todas as pré-condições de um sistema.

O teste exaustivo *é impossível*. Tentar cobrir todas as combinações possíveis de um software levaria séculos, mesmo para programas simples. O segredo não é a quantidade, mas a *estratégia de seleção*.

---

## Etapas
Existem etapas bem definidas para a execução da atividade de teste:

### 1. Planejamento

Definimos o que vamos testar:

* **Objetivo:** Verificar se o campo aceita apenas senhas entre **8 e 12 caracteres**.
* **Escopo:** Vamos focar na validação do tamanho da senha, não na forma como ela é salva (no banco de dados).
* **Critério:** Utilizaremos **Análise do Valor Limite**, onde erros costumam aparecer.

--

### 2. Projeto de Casos de Teste

Criamos os cenários de teste com base em **Classes de Equivalência** e **Limites**:

### Classes de Equivalência
Esse conceito é usado para *reduzir o número de casos de teste* que precisam ser realizados. A ideia é *agrupar entradas que devem ter o mesmo resultado*. Por exemplo, se a regra diz que a senha deve ter entre 8 e 12 caracteres:

- **Classe Válida**: Senhas com 8, 9, 10, 11 e 12 caracteres.
- **Classe Inválida**: Senhas com menos de 8 ou mais de 12 caracteres.

Assim, em vez de testar cada uma das senhas possíveis, você testa apenas uma de cada classe.

--

### Limites

Esse conceito envolve *testar os valores nas bordas das classes*, onde os erros são mais frequentes. No exemplo da senha, você testaria:

- A menor quantidade aceitável: 8 caracteres.
- A maior quantidade aceitável: 12 caracteres.
- Um abaixo do mínimo: 7 caracteres.
- Um acima do máximo: 13 caracteres.

Esses testes de limites ajudam a garantir que o software se comporte corretamente em torno dos critérios estabelecidos.

--

| Caso de Teste | Dado de Entrada (Senha) | Técnica | Resultado Esperado |
| --- | --- | --- | --- |
| CT01 | `1234567` (7) | Limite (mínimo - 1) | **Erro:** "Senha muito curta" |
| CT02 | `12345678` (8) | Limite (mínimo) | **Sucesso:** Senha aceita |
| CT03 | `123456789012` (12) | Limite (máximo) | **Sucesso:** Senha aceita |
| CT04 | `1234567890123` (13) | Limite (máximo + 1) | **Erro:** "Senha muito longa" |
| CT05 | `ABC123` (6) | Classe de Equivalência (Inválida) | **Erro:** "Senha muito curta" |

--

### 3. Execução

O testador ou um script automatizado insere cada senha criada:

* **Ação:** Digitar `1234567890123`.
* **Observação:** O sistema exibiu uma mensagem de erro?

### 4. Análise

Aqui, comparamos os resultados com o que esperávamos:

* **Cenário A:** Para 13 caracteres, o sistema deu erro. **Resultado:** Teste bem-sucedido.
* **Cenário B:** Se aceitou, é um **DEFEITO** a ser corrigido.

---


## Modelo em V 

A imagem apresenta o Modelo em V, uma representação clássica que demonstra a *relação direta entre cada fase do desenvolvimento de software e seu respectivo nível de teste*:

<div style="text-align: center;">
    <img src="../zSLIDES/img/image-1.png" width="60%">
</div>

--

### Fases do Desenvolvimento
Representa a decomposição do projeto, indo do macro (negócio) para o micro (código):

- **Requisitos**: Definição do que o software deve fazer para o negócio.
- **Esp. Funcional**: Detalhamento das funcionalidades e comportamento do sistema.
- **Esp. Técnica**: Definição da arquitetura, banco de dados e como os componentes se comunicarão.
- **Construção**: O momento da codificação propriamente dita pelos desenvolvedores.

---

### Níveis do Teste
Representa a integração e verificação do software, subindo do micro para o macro:

- **Testes Unitários**: Validam a *menor unidade de código* (funções / métodos) gerada na fase de *Construção*.
- **Teste de Integração**: Verifica se os componentes técnicos conversam entre si conforme a *Esp. Técnica*.
- **Teste de Sistema**: Valida o software como um todo, garantindo que ele execute as funções descritas na *Esp. Funcional*.
- **Teste de Aceitação**: Realizado geralmente pelo usuário final para confirmar se os *Requisitos* originais foram atendidos.