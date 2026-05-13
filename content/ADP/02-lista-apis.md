---
title: Lista de APIs
enableToc: false
---

# Lista das APIs

- [ ] APIs de CRUD básicas (criadas automaticamente junto com as tabelas)
    - `GET`, `POST`, `DELETE id`, `GET id` e `PATCH id`

- [ ] APIs de autenticação (criadas junto da criação do workspace no Xano). A partir da tabela `user` padrão[^6], três APIs estão disponíveis para uso:
    - `/auth/login` devolve um `authToken` para alguém já cadastrado
    - `/auth/signup` cadastra usuário e devolve um `authToken` [^1]
    - `/auth/me/{authToken}` dado um authToken, devolve o usuário associado à ele

- SNIPPETs importados (15)
    - [ ] `/consultaCEP` dado um número de cep, devolve cep, localidade, estado, etc.
    - [ ] `/SendGrid_Email` {from, to, subject, content} devolve o status do envio

**APIs Customizadas**

- [ ] `/buscaCEP`. Recebe um CEP (texto) e busca na tabela CEP. Se encontrar, devolve o registro; se não, devolve null. Serve para evitar o "Query All" (buscar tudo) que seria lento. (16)

- [ ] `/buscaCliente` (ou `/consultaCliente`). Recebe `authToken`, chama internamente `/auth/me` para pegar o `user_id`, e então busca na tabela Cliente. É a base para quase todas as outras APIs. (16/17)

- [ ] `/upsertCEP`. Recebe {cep, cidade, estado}. Se o CEP existe, faz PATCH (atualiza); se não, faz POST (insere). Sempre retorna o registro do CEP (com o id). (17)

- [ ] `/cadastraCliente` Fluxo de 4 etapas: Recebe dados do cliente e cadastra um novo usuário para login e já cria o perfil de cliente vinculado a ele na mesma operação. (17)

- [ ] `/consultaEnderecoCliente`. Recebe `authToken`, descobre quem é o cliente (via `/buscaCliente`) e lista os endereços. Usa um Addon para trazer os dados do CEP junto com o endereço. (18)

- [ ] `/salvaEndereco`. Recebe dados do endereço + CEP. Primeiro chama `/upsertCEP` para garantir que o CEP existe e obter o `cep_id`, depois faz POST na tabela `ENDERECO`. (18)

- [ ] `/atualizaEndereco`. Similar ao anterior, mas faz PATCH na tabela ENDERECO usando o `endereco_id`. Também usa o `/upsertCEP` internamente. (18)

- [ ] `/marcarEnderecoPadrao`. Torna um endereço `padrão = true` e, via lógica de Array Map, define todos os outros endereços do mesmo cliente como `padrão = false`. (18)


[^1]: Um authToken é utilizado para provar que as futuras requisições pertencem à mesma pessoa que fez login naquela sessão.
[^6]: Tabelas a serem usadas para autenticação de usuários devem possuir campo de `Email` (tipo text) e um campo de `Password` (tipo password).

```mermaid
%%{init: {'theme': 'dark'}}}%%
graph LR
    %% Alterado de TD para LR para resolver sobreposição %%

    %% Declaração dos Nós (APIs e Banco de Dados)
    subgraph Entrada [Entrada / Gatilhos]
        BuscaCli(["/buscaCliente"])
        UpsertCEP(["/upsertCEP"])
    end
    
    subgraph Processo [Processamento de Endereço]
        ConsultaEnd(["/consultaEnderecoCliente"])
        SalvaEnd(["/salvaEndereco"])
        AtualizaEnd(["/atualizaEndereco"])
    end
    
    subgraph Regra [Regra de Negócio]
        MarcarPadrao(["/marcarEnderecoPadrao"])
    end

    DB[("Tabela de Endereços")]

    %% Atribuição de classes aos nós
    class BuscaCli auth;
    class UpsertCEP loc;
    class ConsultaEnd,SalvaEnd,AtualizaEnd action;
    class MarcarPadrao logic;
    class DB database;

    %% --- DEFINIÇÃO DE ESTILOS PARA TEMA ESCURO --- %%
    %% Cores com alto contraste para fundo escuro
    classDef auth fill:#f96,stroke:#333,stroke-width:2px,color:#000,font-weight:bold;
    classDef loc fill:#0cf,stroke:#333,stroke-width:2px,color:#000,font-weight:bold;
    classDef action fill:#4caf50,stroke:#333,stroke-width:1px,color:#fff;
    classDef logic fill:#9c27b0,stroke:#333,stroke-width:1px,color:#fff;
    classDef database fill:#607d8b,stroke:#fff,stroke-width:2px,color:#fff,rx:5,ry:5;
    
    %% Estilo padrão para subgraphs no tema escuro
    style Entrada fill:#2d2d2d,stroke:#555,color:#fff
    style Processo fill:#2d2d2d,stroke:#555,color:#fff
    style Regra fill:#2d2d2d,stroke:#555,color:#fff

    %% 1. Dependência de Identidade
    BuscaCli -->|Depende de Sucesso| ConsultaEnd
    BuscaCli -->|Depende de Sucesso| SalvaEnd
    BuscaCli -->|Depende de Sucesso| AtualizaEnd

    %% 2. Dependência de Localização
    UpsertCEP -->|Dependência Obrigatória| SalvaEnd
    UpsertCEP -->|Dependência Obrigatória| AtualizaEnd

    %% Ações no Banco de Dados (Operações padrão)
    %% Adicionado quebras de linha <br/> nos textos longos para evitar sobreposição
    ConsultaEnd -.->|Lê dados| DB
    SalvaEnd -.->|Cria registro| DB
    AtualizaEnd -.->|Altera registro| DB

    %% 3. Lógica de Negócio (Exclusividade)
    MarcarPadrao ==>|1. Marca o<br/>endereço alvo| DB
    MarcarPadrao ==>|2. Varre tabela e<br/>desmarca outros| DB
```