<!-- .slide: data-background-image="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Modelo Conceitual</h1>
</div>

---

Um modelo de dados pode ser definido como uma estrutura que descreve como os dados são organizados e relacionados entre si.

Para projetar eficazmente um banco de dados, é vital começar com uma visão geral que abranja os requisitos de informação, levando à criação de um modelo de dados conceitual. Esta etapa é essencial no ciclo de vida do banco de dados, pois traduz requisitos do mundo real em uma estrutura formal, sem depender de um SGBD específico.

A modelagem conceitual funciona como uma "planta baixa" dos dados. Assim como um arquiteto não inicia uma obra sem uma planta, um projetista de banco de dados não deve iniciar a implementação sem um modelo conceitual sólido.

O mini-mundo, (ou universo de discurso), é definido como a representação de algum aspecto específico do mundo real dentro de um banco de dados. Exemplo: uma empresa ou uma instituição real que será descrita a fim de ser armazenada e gerenciada em um sistema.

---

Definindo o que veremos nessa aula:

- O modelo conceitual é uma descrição de alto nível da estrutura de uma base de dados que se concentra em entidades, relacionamentos e restrições, omitindo detalhes técnicos de armazenamento físico. Ele serve como uma ferramenta de comunicação entre usuários e projetistas, sendo independente de qualquer SGBD específico.

- O MER (Modelo Entidade-Relacionamento) é o modelo conceitual mais difundido e utilizado para representar essa visão de alto nível. Ele descreve o "mini-mundo" por meio de conceitos fundamentais como entidades, atributos e relacionamentos.

- O DER (Diagrama Entidade-Relacionamento) é a representação gráfica ou visual do MER. Ele utiliza uma notação padronizada para facilitar a visualização do esquema conceitual.

---

## Entidades, atributos e relacionamentos

Entidades são os objetos ou conceitos centrais do mundo real que um banco de dados representa, funcionando como os "substantivos" do modelo, como pessoas, lugares ou eventos. A identificação correta das entidades é crucial para o sucesso do projeto, pois elas são os fundamentos da estrutura.

É importante distinguir entre:

- Tipo de Entidade: Conjunto de entidades com os mesmos atributos, como FUNCIONARIO, que representa o conceito geral de um funcionário.

- Instância de Entidade: Um objeto específico dentro do tipo, como Joãozinho da Silva, que é uma instância do tipo FUNCIONARIO.

--

As entidades também podem ser classificadas pela sua dependência de identificação:

- Entidade Forte: Possui um atributo-chave único, como FUNCIONARIO ou DEPARTAMENTO.

- Entidade Fraca: Não tem atributos-chave suficientes e depende de outra entidade para sua identificação, como o DEPENDENTE de um FUNCIONARIO.

Após identificar as entidades, o próximo passo é descrever seus dados descritivos, chamados atributos. Atributos são as características que descrevem uma entidade, proporcionando informações específicas sobre cada instância. Por exemplo, para a entidade FUNCIONARIO, atributos como Nome, Cpf e Salario são essenciais.

Os atributos podem ser classificados da seguinte forma:
- Atributo Simples: Atômico e indivisível, como Sexo ou Salario.
- Atributo Composto: Dividido em componentes menores, como Endereco (Rua, Cidade, Estado), que facilita consultas específicas.

--

- Atributo Monovalorado: Possui apenas um valor para uma entidade, como Datanasc.
- Atributo Multivalorado: Pode ter vários valores, como Telefones de um DEPARTAMENTO.
- Atributo Derivado: Seu valor é calculado a partir de outros, como Idade (baseada em Datanasc ), exigindo processamento.
- Atributo Identificador (ou Atributo Chave ) é crucial, pois identifica unicamente cada instância. No caso da entidade FUNCIONARIO, o Cpf é um atributo-chave, assegurando que não haja duplicidade e mantendo a integridade do banco de dados.

--

Um modelo composto apenas por entidades e atributos é limitado. Para capturar a dinâmica do negócio, precisamos dos relacionamentos, que conectam as entidades e criam um sistema de informação coeso. Os relacionamentos representam as interações entre diferentes entidades, Exemplo: o relacionamento TRABALHA-PARA conecta FUNCIONARIO com DEPARTAMENTO.

Os relacionamentos são definidos por restrições estruturais:
- Grau do Relacionamento: Número de entidades participantes; relacionamentos binários (grau dois) são os mais comuns.
- Cardinalidade: Define quantas instâncias de uma entidade podem participar do relacionamento. Exemplos incluem:
    - Um-para-um (1:1): Um departamento é gerenciado por um funcionário.
    - Um-para-muitos (1:N): Um departamento pode ter muitos funcionários.
    - Muitos-para-muitos (N:M): Um funcionário pode trabalhar em vários projetos.

--

- Participação (Total vs. Parcial): Indica se a existência de uma entidade depende do relacionamento:
    - Total: Todas as instâncias da entidade devem estar associadas ao relacionamento. Exemplo: Em um relacionamento TRABALHA-PARA, cada FUNCIONARIO deve estar vinculado a um DEPARTAMENTO, não podendo haver funcionários sem departamentos.
    - Parcial: A associação é opcional; a entidade pode existir sem estar ligada ao relacionamento. Exemplo: Em um relacionamento FEZ_PEDIDO, um CLIENTE pode existir sem ter feito um pedido, permitindo que haja clientes sem pedidos.

Em relacionamentos N:M, podem haver Atributos de Relacionamentos, que fornecem informações adicionais. Por exemplo, no relacionamento TRABALHA_EM, pode haver um atributo Horas, registrando as horas que um funcionário dedica a um projeto específico.

--

Para que essas conexões e regras sejam mantidas de forma consistente, o modelo conceitual deve incorporar conceitos adicionais de integridade.

A Integridade Referencial é uma regra essencial em um modelo conceitual, assegurando a consistência entre entidades relacionadas. Quando uma entidade (como FUNCIONARIO ) possui um atributo que se refere a outra entidade (por exemplo, numDep referenciando DEPARTAMENTO ), o valor desse atributo deve corresponder a um atributo chave (chave primária) existente. Isso evita "registros órfãos", como um funcionário vinculado a um departamento inexistente.

---

## Diagrama Entidade-Relacionamento (DER)

A principal vantagem do Modelo Entidade-Relacionamento é sua representação visual através do Diagrama Entidade-Relacionamento (DER). Esse diagrama serve como uma linguagem visual clara, facilitando a comunicação do projeto do banco de dados entre diversos stakeholders, como analistas, desenvolvedores e usuários finais. Um DER bem elaborado elimina ambiguidades e atua como documento de referência ao longo do desenvolvimento do sistema.

Os componentes do DER são representados por símbolos simples e intuitivos:

- Entidade Forte: retângulo com o nome da entidade.
- Entidade Fraca: retângulo com linha dupla.
- Relacionamento: losango com o nome do relacionamento.
- Relacionamento Identificador: Losango com linha dupla, conectando uma entidade à sua raiz.

--

- Atributo: Elipse com o nome do atributo.
- Atributo-Chave: Elipse com o nome do atributo sublinhado.
- Atributo Multivalorado: Elipse conectada a outras elipses representando seus valores.
- Atributo Composto: Elipse conectada a outras elipses que representam seus componentes.
- Ligação: Linha que conecta entidades e atributos aos seus componentes.
- Participação Total: Linha dupla ligando a entidade participante ao relacionamento.

Esses símbolos garantem uma visualização clara e eficiente das relações e estruturas dentro do banco de dados.