<!-- .slide: data-background-image="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Modelo Físico</h1>
</div>


---

imagem

--

O modelo físico de dados é a fase final do projeto de um banco de dados, onde a estrutura lógica, como um diagrama Entidade-Relacionamento (ER), é convertida em uma implementação concreta. Seu principal objetivo é assegurar armazenamento eficiente e acesso rápido aos dados, influenciando diretamente a performance das aplicações.

Após a conversão de um modelo conceitual para um esquema relacional físico, como visto na aula/slide anterior, significa a representação correta de entidades e relacionamentos como tabelas e colunas. Após esse mapeamento, no modelo físico, definem-se as características físicas das tabelas e suas restrições.

No Xano, o processo de criação do modelo físico difere do desenvolvimento tradicional (hard code) por substituir a escrita manual de comandos SQL DDL (como CREATE TABLE) por uma interface visual intuitiva que abstrai a complexidade da infraestrutura. Embora o usuário interaja com elementos visuais para definir entidades e registros, o motor subjacente que sustenta esse modelo é um banco de dados PostgreSQL.

--

Embora plataformas no-code como o Xano abstraiam grande parte da complexidade da engenharia de banco de dados, a compreensão dos princípios fundamentais é o que diferencia uma aplicação amadora de uma solução profissional, escalável e robusta. Muitas aplicações no-code funcionam bem em pequena escala, mas se tornam lentas e frágeis à medida que crescem. A causa raiz, frequentemente, não está na lógica de negócio, mas em uma fundação de dados mal estruturada.

---

## Restrição de Domínio

Em Xano, ao criar uma coluna em sua tabela, a primeira coisa que você define é o tipo daquela propriedade. A interface simplifica as opções (Text, Integer, Boolean, etc.). A tipagem dos dados define como e o que pode ser armazenado.

Controla o tipo de dado aceito em cada campo
- Ex.: campo inteiro não aceita letras, só números.

Impõe limites aos valores inseridos
- Datas: mínimo (01/01/1900) e máximo permitido.
- Inteiro (4 bytes): de –2.147.483.648 a 2.147.483.647.
- Texto: limite de caracteres (ex.: 30).
- Números decimais: limite de casas (ex.: 2 após a vírgula).

Define limites de armazenamento
- Ex.: imagens limitadas a 20 MB.

---

## Tipos de Dados no Xano

### Tipos Clássicos

- Text → valores textuais (ex.: nomes, descrições).
- Integer → números inteiros (sem casas decimais).
- Timestamp → data completa com milissegundos (contados desde 01/01/1970).
- Date → data com precisão de dias (sem hora/minuto/segundo).
- Boolean → valores lógicos: Verdadeiro/Falso, True/False ou 1/0.
- Decimal → números com ponto flutuante (cálculos mais precisos).

--

### Tipos Avançados
- UUID → identificador único em hexadecimal (nunca se repete). Ex.: c75f7c66-e858-47d6-bb82-7ea5547c800c
- Object → conjunto de atributos armazenados juntos (ex.: endereço → rua, número, CEP). Usa formato semiestruturado JSON.
- Table Reference → referência entre tabelas (similar a chave estrangeira). Exemplo: em uma tabela Tarefas, o campo usuário_id pode ser um Table Reference que aponta para a tabela Usuários, permitindo saber a quem cada tarefa pertence. Isso facilita consultas (como listar todas as tarefas de um usuário), garante consistência dos dados (só aceita IDs existentes) e funciona como um “atalho” para relacionar informações sem duplicar dados.
- Enum → valores limitados a uma lista pré-definida (ex.: verde | azul | preto |... ).

--

- Email → texto com validação de e-mail (ex.: xxx@yyy.zzz ).
- Password → texto armazenado com mascaramento. Ex: ***
- JSON → texto formatado como JSON.
- Storage → guarda arquivos (imagem, áudio, vídeo, etc.).
- Geography → usado para mapas e dados geográficos. Ex: {"lat": -23.5505, "lng": -46.6333} que guarda a latitude e longitude.

---

## Fator de Nulidade

Define se um campo aceita ou não valores nulos (a obrigatoriedade do preenchimento):
- NULL → campo pode ficar vazio.
- NOT NULL → campo deve sempre ser preenchido.

Em um banco de dados, NULL não significa zero nem uma string vazia ( "" ) nem é igual a false. Ele representa a ausência de um valor. Essa distinção é crucial, pois um valor NULL pode ter diferentes interpretações, o que pode introduzir ambiguidade nas consultas.

Se um campo booleano não aceita nulos, ele só pode ter 2 valores: true ou false. Mas se ele aceita nulos, passa a ter 3 estados possíveis: true, false ou NULL (sem resposta).

--

Tanto quanto possível, evite colocar atributos em um esquema de relação base
cujos valores possam ser NULL.

A recomendação existe porque a presença de NULLs pode complicar a lógica de negócio e as consultas. Por exemplo, uma consulta que calcula a média de salários pode ser distorcida se alguns funcionários tiverem salários NULL, porque cálculos como soma e média geralmente ignoram nulos. Se você tem uma tabela com notas [8, 7, NULL, 10] e calcular a média, o NULL não entra no cálculo: $ (8 + 7 + 10) ÷ 3 = 8,33 $.

Sempre que possível, é preferível modelar os dados de forma a evitar a necessidade de valores nulos, como criar uma tabela separada para informações opcionais.

No Xano o fator de nulidade pode ser definido por um checkbox na aba de seleção do tipo de dados.

imagem

---

## Auto Preenchimento

Auto preenchimento (ou auto incremental ou campo identidade (Identity)) refere-se a campos cujo preenchimento é controlado automaticamente pelo sistema, como o campo ID, que serve como chave primária nas tabelas.

- O ID é um campo que geralmente contém valores inteiros sequenciais. Esses valores começam a partir de um número inicial (chamado de seed ) e aumentam por um valor fixo (chamado de increment ). O padrão mais comum é iniciar em 1 e incrementar em 1 a cada novo registro, resultando em uma sequência como: 1, 2, 3, 4...
- Algumas versões de auto preenchimento utilizam o padrão UUID. O UUID (Identificador Único Universal) é um identificador de 128 bits que gera um valor único e aleatório, permitindo a criação de chaves primárias em bancos de dados sem a necessidade de um contador sequencial, garantindo a unicidade mesmo em sistemas distribuídos.

A maioria dos bancos de dados permite apenas um campo auto incremental por tabela. Essa limitação é crucial porque impede que sistemas distribuídos ou paralelos utilizem os mesmos valores, evitando a duplicação de dados.

--

### No Xano

O campo ID é o padrão para a chave primária nas tabelas. É um campo incremental e numérico, começando em 1 e aumentando de 1 em 1. Se você não especificar outro campo como chave primária, o Xano utilizará o ID por padrão.

Outros campos que funcionam como o ID podem ser criados usando funções, garantindo a mesma funcionalidade do auto-incremento.

Também é possível criar campos com o padrão UUID e definir um preenchimento automático para eles.

---

## Restrições

As restrições (constraints) são regras que controlam como os dados devem ser inseridos e garantem a integridade das informações nas tabelas. Elas impõem regras específicas às colunas. Tipos de restrições:

- Chave Única (Unique - UQ): Garante que todos os valores em uma colunasejam distintos.
- Valor Padrão (Default - DF): Define um valor padrão para uma coluna, caso nenhum valor seja fornecido.
- Regra de Validação (Check - CK): Impõe condições que os dados devem atender ao serem inseridos. Ex: CHECK (Idade > 18)

---

## Chave Primária
A Chave Primária (Primary Key) serve para identificar de forma única cada linha em uma tabela. Quando você fornece um valor de chave primária em uma consulta, esse valor deve corresponder a uma e apenas uma linha na tabela. Isso significa que a chave primária garante que cada registro é único.

Regras da Chave Primária:
- Valores Únicos: o valor na coluna da chave primária não pode ser repetido, apenas valores únicos são permitidos.
- Sem Valores NULOS, portanto NOT NULL
- Um por Tabela: apenas uma chave primária é permitida por tabela.

Tipos de Chave Primária:

- Chave Primária Simples: composta por apenas uma coluna. Exemplo: ID_Cliente em uma tabela de clientes.
- Chave Primária Composta: composta por duas ou mais colunas, garantindo que a combinação não contenha valores repetidos. Exemplos: RG + Estado ou Cidade + Estado + País.

--

No Xano

No Xano, a chave primária é fixada como a coluna ID. Não é possível renomear essa coluna ou promover outras colunas a chave primária. Além disso, o Xano não aceita chaves primárias compostas; apenas o ID é definido como chave primária.

Nos casos em que se queira implementar algo pareciso a uma chave primária composta, é recomendado criar um índice único (regra de unicidade) para garantir que um conjunto de dados não se repita. No entanto, esse índice único não é considerado uma chave primária.

Um índice único é uma restrição que garante que os valores em uma ou mais colunas sejam distintos. Isso significa que não pode haver duas linhas com os mesmos valores nessas colunas.

Exemplo: Se você tem uma tabela de Usuários e deseja garantir que a combinação de Email e Telefone seja única, você pode criar um índice único para cada uma dessas colunas. Assim, não será possível inserir dois usuários com o mesmo email ou telefone.

---

## Chave Estrangeira (Foreign Key)

A Chave Estrangeira é usada para criar relacionamentos entre tabelas, garantindo a integridade referencial.

Regras da Chave Estrangeira:

- Referência a Chave Primária: Cada coluna de chave estrangeira deve apontar para uma chave primária de outra tabela (ou da mesma tabela, em um auto-relacionamento). Os tipos de dados devem ser compatíveis.
    - Valores Nulos: A chave estrangeira pode permitir valores nulos. A referência da chave estrangeira só é aplicada quando a coluna contém um valor, caso contrário não há necessidade de validação, pois não há valor a ser verificado.
- Valores Permitidos: Os valores na coluna de chave estrangeira devem ser os mesmos já utilizados pela chave primária correspondente.
- Múltiplas Chaves Estrangeiras: Uma tabela pode ter várias chaves estrangeiras, desde que cada uma siga as regras mencionadas acima.

Exemplo de chave estrangeira:
- Tabela Aluno
    - Colunas: Matrícula (chave primária), Nome 
- Tabela Prova
    - Colunas: idProva (chave primária), Matrícula (chave estrangeira), Nota

--

Se existirem alunos com matrículas 500, 501 e 502, as provas cadastradas podem associar-se a esses alunos apenas.

Caso você tente cadastrar uma prova para uma matrícula inexistente, como 503, isso resultará em uma violação da regra de integridade referencial.

--

## Integridade Referencial

A integridade referencial garante que os relacionamentos entre dados sejam coesos, ou seja, que sempre haja uma relação com dados reais e existentes.

Antes de adicionar dados em uma tabela que possui uma chave estrangeira (que referencia outra tabela), é essencial garantir que o valor referenciado já exista na tabela associada.

Em outras palavras, antes de inserir as notas de um novo Aluno, por ex: Cláudio, eu primeiro devo inserir este aluno, recuperar sua chave primária ( ex: 503 ) e finalmente inserir as Provas associadas à nova chave 503.

--

Para a remoção de dados, certifique-se de que o valor referenciado na tabela associada seja removido primeiro. Isso evita a violação da integridade
referencial e mantém a coesão dos dados.

Em outras palavras, antes de remover um aluno, por exemplo o Mario, de matrícula 502, para evitar o cenário de deixar linhas não referenciadas na tabela Prova, eu primeiro preciso remover as provas do Mario ( idProva 3,4 e 5 ), para depois remover o aluno ( matrícula 502 ).

--

As regras de integridade referencial também se aplicam à atualização de dados.

Atualização na Tabela Aluno: Não é permitido alterar o valor de uma matrícula (por exemplo, de 502 para 503) se o valor 502 estiver sendo utilizado na tabela Prova.

Atualização na Tabela Prova: Não é permitido atualizar o valor de uma matrícula (por exemplo, de 502 para 503) se o valor 503 não existir previamente na tabela Aluno.

--

### No Xano

No Xano, chaves estrangeiras utilizam-se do campo do tipo Table Reference:

Ele primeiro nos solicita a tabela à qual associar aqueles valores:

E depois o nome da coluna que será criada, sempre seguindo o padrão
`<tabela referenciada>_id`:

--

Uma tabela Prova, criada no Xano, com 3 notas associadas aos alunos 1 e 2 ficaria assim:

---

## Índices

Um índice é uma estrutura de dados de consulta, separada da tabela, que melhora a velocidade das operações de recuperação de dados. Ele é criado em uma ou mais colunas de uma tabela. A estrutura do índice armazena os valores da(s) coluna(s) de forma ordenada e mantém um ponteiro para a localização física do registro correspondente no disco.

Resultado do seu uso: as consultas de leitura (GET) que filtram por uma coluna indexada serão drasticamente mais rápidas, enquanto os endpoints de API que escrevem dados (POST, PATCH, DELETE) serão marginalmente mais lentos. Isso ocorre porque, a cada operação de escrita, o Xano precisa atualizar não apenas a tabela, mas também todos os seus índices associados para mantê-los sincronizados. Esse pequeno custo na escrita é quase sempre um excelente investimento para obter uma grande aceleração nas leituras.

--

### Quando Criar um Índice?

A criação de índices é uma decisão estratégica. Indexar colunas erradas ou em excesso pode degradar o desempenho. As situações mais comuns em que um índice é vantajoso são:

- Colunas de Chave Primária: Os sistemas de banco de dados criam automaticamente um índice único na chave primária de cada tabela, pois ela é a forma mais comum de acessar um registro específico.
- Colunas de Chave Estrangeira: Indexar chaves estrangeiras é essencial para acelerar as operações de junção (JOIN) entre tabelas, que são extremamente comuns em bancos de dados relacionais.
- Colunas Frequentemente Usadas em Filtros: Colunas que aparecem com frequência na cláusula WHERE de suas consultas são fortes candidatas. Se você busca usuários por email ou produtos por categoria, um índice nessas colunas trará um ganho de performance significativo.
- Colunas Usadas para Ordenação: Se sua aplicação frequentemente solicita dados em uma ordem específica (usando a cláusula ORDER BY ), um índice na coluna de ordenação pode evitar uma operação de ordenação em tempo real, que é computacionalmente cara.