<!-- .slide: data-background-image="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Modelo Lógico Relacional</h1>
</div>

---

Enquanto o modelo conceitual se concentra em capturar e representar os requisitos de negócio de forma abstrata e independente de tecnologia, o modelo relacional atua como uma ponte, traduzindo essa abstração em uma estrutura lógica, organizada e padronizada, Essa estrutura, composta por tabelas e regras de integridade, está pronta para ser compreendida e implementada pela vasta maioria dos Sistemas Gerenciadores de Banco de Dados (SGBDs) modernos.

Para construir essa ponte de maneira sólida, é essencial dominar os conceitos fundamentais que sustentam a arquitetura e a lógica do modelo relacional.

---

## Blocos de construção do Modelo Relacional

Segue conceitos padrões para a organização de dados na maioria dos bancos de dados, que permite que projetistas e desenvolvedores se comuniquem sobre a estrutura dos dados:

- Relação (Tabela): Uma tabela é chamada de relação, representando um conjunto de fatos sobre uma entidade, como por exemplo uma tabela de ESTUDANTES,
- Tupla (Linha): Cada linha em uma relação é uma tupla, representando uma instância de uma entidade, por exemplo, os dados do estudante Joãozinho na relação ESTUDANTE,
- Atributo (Coluna): Uma coluna é um atributo, que indica como interpretar os valores em cada tupla, Todos os valores de uma coluna geralmente são do mesmo tipo, como Nome, Número e Classe na relação ESTUDANTE,
- Domínio: O domínio de um atributo define o conjunto de todos os valores possíveis naquele coluna, Por exemplo, o domínio do atributo Classe poderia ser um número inteiro, enquanto o de Nome seria uma cadeia de caracteres.

--

tabela

--

Com essa estrutura, é fundamental garantir que cada tupla seja identificada de forma única, o que é alcançado através do uso estratégico de chaves, As chaves são essenciais para garantir a unicidade e integridade dos dados em bancos de dados relacionais, prevenindo duplicidades e assegurando que os relacionamentos entre tabelas sejam válidos,

- Superchave (Super-key): Uma superchave é um conjunto de um ou mais atributos que, tomados coletivamente, identificam unicamente uma tupla dentro de uma relação, Por exemplo, em uma relação ESTUDANTE, qualquer conjunto de atributos que inclua um identificador único, como {CPF, Nome}, é uma superchave.
- Chave Candidata (Candidate Key): Uma chave candidata é uma superchave mínima, Isso significa que ela possui a propriedade de unicidade, mas nenhum de seus atributos pode ser removido sem que o conjunto perca essa propriedade, Se {CPF} identifica unicamente um estudante, ele é uma chave candidata.
- A Chave Primária (Primary Key ou PK) é a chave candidata que o projetista do banco de dados escolhe para ser o principal meio de identificação das tuplas em uma relação,

--

A escolha é estratégica e, uma vez definida, impõe uma regra fundamental conhecida como restrição de integridade de entidade.

Esta restrição determina que o valor da chave primária em qualquer tupla não pode ser NULL (nulo). Isso é essencial, pois a chave primária é o mecanismo utilizado para identificar unicamente cada registro, e um valor nulo não serviria a esse propósito.

- Chave Estrangeira (Foreing Key ou FK) é um atributo em uma tabela que referencia a chave primária de outra tabela, permitindo representar relacionamentos, inclusive recursivos. Ela formaliza os vínculos entre entidades.

A chave estrangeira impõe uma restrição de integridade referencial, que assegura consistência entre tabelas, evitando registros órfãos. Essa regra estipula que o valor da chave estrangeira deve:

- Corresponder a um valor de chave primária existente ou
- Ser NULL, se o relacionamento for opcional e o atributo aceitar valores nulos.

--

imagem

---

## Mapeamento do Modelo Conceitual para o Relacional

Com estes conceitos, podemos abordar a transformação de um modelo conceitual em um esquema relacional funcional.

### Transformando Diagramas em Tabelas Reais
Algumas regras garantem que o modelo lógico seja consistente, normalizado e reflita a semântica do modelo conceitual.

## Relacionamento 1:1 (Um-para-Um)

> Regra: A Chave Primária (PK) de uma tabela vira Chave Estrangeira (FK) na outra.

Dica de Ouro: Coloque a FK na tabela onde a participação é obrigatória (total) para evitar campos vazios ( NULL ).

Exemplo: Gerente e Departamento
- Tabela DEPARTAMENTO: Cod_Depto (PK), Nome, CPF_Gerente (FK)
- Tabela GERENTE: CPF (PK), Nome

Aqui, CPF_Gerente em Departamento garante que todo departamento tenha um responsável direto sem espalhar dados.

--

imagem

---

## Relacionamento 1:N (Um-para-Muitos)

> Regra: A Chave Primária do lado "1" vai para a tabela do lado "N" como Chave Estrangeira.

Exemplo: Departamento e Funcionário
- Um Departamento tem muitos Funcionários.
- Tabela DEPARTAMENTO: ID_Depto (PK), Nome.
- Tabela FUNCIONARIO: ID_Func (PK), Nome, ID_Depto (FK).

Por que no lado N? Porque cada funcionário só pode apontar para um único departamento.

--

imagem

---

## Relacionamento N:M (Muitos-para-Muitos)

> Regra: Não pode ser mapeado diretamente. Criamos uma Tabela Associativa (Tabela de Junção).

Exemplo: Estudantes e Disciplinas
- Tabela ESTUDANTE: Matricula (PK), Nome.
- Tabela DISCIPLINA: Cod_Disc (PK), Nome.
- Tabela MATRICULA: Matricula (FK), Cod_Disc (FK).

A PK desta tabela é a combinação das duas FKs.

--

imagem

--

## Atributos Multivalorados

> Regra: Atributos que aceitam vários valores (ex: Telefones) geram uma nova tabela.

Exemplo: Telefones de um Funcionário
- Tabela FUNCIONARIO: ID_Func (PK), Nome.
- Tabela TELEFONES_FUNC: ID_Func (FK), Telefone.
- A PK é a composição de (ID_Func + Telefone).

Importante: Isso mantém a Primeira Forma Normal (1FN), garantindo que cada campo tenha apenas um valor atômico.

--

imagem

---

## Relacionamentos N-ários

> Regra: Para relacionamentos envolvendo 3 ou mais entidades, cria-se uma nova relação (tabela).

Exemplo: Fornecedor fornece Peça para um Projeto 
- Tabela FORNECIMENTO:
    - ID_Fornecedor (FK)
    - ID_Peca (FK)
    - ID_Projeto (FK)
    - PK: A junção das três chaves.

--

imagem

---

### Notação pé de galinha

As representações do slide usam o estilo visual da Notação de Pé de Galinha (ERD). Ela é a favorita para diagramas relacionais porque é muito intuitiva. Os símbolos que usamos nas extremidades das linhas definem a cardinalidade (quantos registros se relacionam com quantos),

Tabela visual