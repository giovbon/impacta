<!-- .slide: class="slide-cover" -->
<p class="slide-cover__kicker">AST · Automated Software Testing</p>

# Flake8

<p class="slide-cover__rule"></p>
<p class="slide-cover__sub"></p>
<p class="slide-cover__meta"><span>Prof. Giovani B.</span></p>
<p class="slide-cover__num">09</p>

---

## Linting

Linting é o processo de análise estática do código-fonte para *identificar erros de sintaxe, possíveis bugs, problemas de desempenho e desalinhamentos com padronizações de estilo* — tudo isso sem executar o código. A ferramenta que realiza esse processo é chamada de **linter**.

--

Para que é usado nos testes automatizados:

- **Garantia de Qualidade Pré-Execução**: Funciona como a primeira camada de validação em esteiras de Integração Contínua (CI/CD), evitando que código com erros primários avance para a fase de testes unitários ou de integração.
- **Padronização do Código**: Garante que toda a equipe siga a mesma convenção de estilo, facilitando a leitura e a manutenção do projeto.
- **Prevenção de Bugs**: Detecta variáveis não utilizadas, importações desnecessárias ou variáveis usadas antes de serem declaradas.

---

## Flake8

O Flake8 é uma das ferramentas de linting mais populares para a linguagem Python. Pense no Flake8 como um "revisor de texto profissional": você aponta onde ele deve olhar, diz quais regras ele pode ignorar (ou em quais focar) e ele gera um relatório mostrando linha por linha o que precisa ser ajustado.


O que o Flake8 analisa:

- **Violações do PEP 8**: Espaços em branco incorretos, linhas com mais de 79 caracteres, nomes de funções fora do padrão, falta de linhas em branco entre classes e funções.
- **Erros Lógicos e Sintaxe**: Módulos importados mas não usados, variáveis definidas mas nunca acessadas, uso de sintaxe desalinhada com a versão do Python.
- **Complexidade Ciclomática** (Opcional): Quantidade de caminhos de execução independentes em uma função ou método.

---

## Principais Classes de Erros

As mensagens geradas pelo Flake8 dividem-se em quatro grandes classes de prefixos:

- **E (Errors - PEP 8)**: *Erros de formatação e estilo* segundo o guia oficial do Python. Incluem problemas com espaçamento, indentação, tamanho de linha e separação de blocos.
- **W (Warnings - PEP 8)**: *Avisos* sobre práticas de estilo que não são erros de sintaxe diretos, mas que *afetam a legibilidade* (ex.: linhas em branco desnecessárias, espaços no final de linhas).
- **F (PyFlakes / Logical Errors)**: *Erros lógicos e potenciais bugs no código*. Apontam variáveis/módulos importados e não utilizados, referências a variáveis inexistentes ou redefinições indevidas.
- **C (McCabe Complexity)**: Avisos sobre a *complexidade do código*. Indicam funções ou métodos muito longos e cheios de estruturas condicionais aninhadas (if, else, for), sugerindo refatoração.

--

| Classe | Código | Descrição / Significado | Exemplo de Causa |
| --- | --- | --- | --- |
| **Estilo (PEP 8)** | `E501` | Linha muito longa (*line too long*) | Excedeu o limite padrão de 79 caracteres por linha. |
| **Estilo (PEP 8)** | `E111` / `E117` | Indentação incorreta | Uso de quantidade de espaços diferente de 4 por nível. |
| **Estilo (PEP 8)** | `E225` | Falta de espaço ao redor de operadores | Escrever `x=1+2` em vez de `x = 1 + 2`. |
| **Estilo (PEP 8)** | `E302` | Falta de linhas em branco entre funções | PEP 8 exige 2 linhas em branco entre funções/classes globais. |
| **Estilo (PEP 8)** | `E722` | Uso de `except:` genérico e sem tipo | Usar `try ... except:` sem especificar a exceção capturada. |
| **Aviso (PEP 8)** | `W291` | Espaço em branco no final da linha (*trailing whitespace*) | Deixar espaços invisíveis ao fim de uma linha de código. |
| **Aviso (PEP 8)** | `W292` | Falta de linha em branco ao fim do arquivo | Arquivo fonte sem uma quebra de linha `\n` final. |
| **Aviso (PEP 8)** | `W503` / `W504` | Quebra de linha ao redor de operador binário | Colocar `+` ou `and` antes ou depois do salto de linha. |
| **Lógico (PyFlakes)** | `F401` | Importação realizada mas não utilizada | Fazer `import os` e nunca usar a biblioteca `os` no script. |

--

| Classe | Código | Descrição / Significado | Exemplo de Causa |
| --- | --- | --- | --- |
| **Lógico (PyFlakes)** | `F841` | Variável atribuída mas nunca utilizada | Declarar `resultado = 10` e não usar `resultado` depois. |
| **Lógico (PyFlakes)** | `F821` | Nome de variável não definido (*undefined name*) | Tentar usar uma variável que não foi criada no escopo. |
| **Lógico (PyFlakes)** | `F403` / `F405` | Uso de `from modulo import *` | Importação genérica que esconde a origem das variáveis. |
| **Complexidade** | `C901` | Função demasiadamente complexa | A função possui muitos caminhos lógicos (`if`, `for`). |

---

### Comandos

Para instalar a ferramenta use `pip install flake8`

- Analise todos os arquivos `.py` desta pasta e de todas as subpastas com `flake8 .`
- Analisar um único arquivo: `flake8 testes/test_login.py`
- Analisar uma pasta específica: `flake8 testes/`

Se o terminal rodar e não aparecer nada o código passou sem nenhum erro. Caso contrário, vai retornar algo parecido com isso: `meu_script.py:12:80: E501 line too long (85 > 79 characters)`

Como interpretar:
- `meu_script.py` → O arquivo onde está o problema.
- `12` → O número da linha.
- `80` → A coluna exata na linha.
- `E501` → O código do erro.
- `line too long...` → A explicação do erro.

--

Quando se cria um projeto Python, ele gera pastas automáticas ou virtuais que não contêm o código que você escreveu (como ambientes virtuais ou pastas de cache). Você não quer que o Flake8 analise essas pastas.

**Escondendo Pastas Irrelevantes** com `--exclude`: `flake8 --exclude=.venv,__pycache__,.git .`

- `.venv`: é a pasta de ambiente virtual (contém bibliotecas de terceiros), que não faz sentido o Flake8 analisar.
- `__pycache__`: pasta de arquivos temporários do Python.
- `.git`: pasta de histórico do Git.

--

Código complexo demais é difícil de manter e fácil de quebrar. A complexidade ciclomática mede quantas decisões (como if, else, for, while) uma única função toma.

**Medindo a Complexidade do Código** com `flake8 --max-complexity=10 .`

- **O que faz**: Avalia todas as funções do projeto. Se alguma função tiver um nível de complexidade maior que 10 (muitos ifs ou laços aninhados), o Flake8 gera um alerta C901.
- **Para que serve**: Avisa quando uma função/teste ficou grande e confusa demais, sugerindo que você deve dividi-la em funções menores.

--

## Simplificando com arquivo `.flake8`

Digitar comandos longos no terminal toda vez cansa e gera erros. A melhor prática em um projeto real é criar um arquivo texto na raiz do seu projeto chamado `.flake8`.

```py
[flake8]
# Tamanho máximo de linha desejado
max-line-length = 88

# Pastas que o Flake8 deve ignorar completamente
exclude = 
    .git,
    __pycache__,
    .venv

# Códigos de erro que você prefere ignorar no projeto
ignore = E501

# Limite máximo de complexidade por função
max-complexity = 10
```

Depois de salvar esse arquivo, no terminal você precisa digitar apenas `flake8 .`'