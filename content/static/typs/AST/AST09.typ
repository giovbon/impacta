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

== Desafio Prático: Implementando Qualidade de Código e Linting

*Cenário*:
Você acaba de ser contratado como Engenheiro(a) de Automação de Testes em uma startup. A equipe de desenvolvimento entregou o script inicial de testes automatizados (`test_login.py`), mas o código foi escrito às pressas. Sua missão é implementar o Flake8 para auditar esse código, configurar as regras do projeto e refatorar o script até que o linter aprove 100% do arquivo.

=== Parte 1: O Código Legado

Crie um arquivo chamado `test_login.py` na sua máquina e cole o código exato abaixo:

```python
import os
import sys
import time

def realizar_login(usuario, senha, forcar_erro):
    resultado_login=False
    
    if usuario == True:
        if senha != None:
            if forcar_erro == False:
                print("Iniciando o processo de login no sistema com credenciais validas e aguardando o tempo de resposta do servidor...")
                resultado_login = True
            else:
                print("Erro forcado")
        else:
            print("Senha vazia")
    else:
        print("Usuario invalido")
        
    return resultado_login

def test_verificar_login_valido():
    token_sessao = "abc123xyz"
    assert realizar_login(True, "123456", False) == True


```

=== Parte 2: Configuração Inicial

Crie o arquivo de configuração `.flake8` na raiz do projeto contendo as seguintes regras básicas:

1. O tamanho máximo de linha deve ser de 100 caracteres (não 88 ou 79).
2. O limite de complexidade ciclomática deve ser 3.
3. Pastas de cache e ambientes virtuais devem ser excluídas da análise.

=== Parte 3: Pesquisa e Execução (Missões)

Rodando o comando `flake8 .`, você notará uma enxurrada de erros. Resolva os problemas baseando-se no material das aulas, mas você precisará pesquisar na documentação do Python/Flake8 para resolver os seguintes desafios:

1. A Regra não documentada: O Flake8 vai acusar os erros E711 e E712 no seu código. Pesquise o que esses erros significam. Por que fazer `if usuario == True:` ou `senha != None:` é considerado uma má prática no Python? Refatore o código para a forma correta (Pythonic way).
2. Ignorando uma linha específica: A variável `token_sessao` dentro do teste não está sendo usada (Erro F841). Porém, o desenvolvedor sênior disse: *"Não apague essa variável, vamos usá-la amanhã na integração com a API"*. Pesquise como instruir o Flake8 a ignorar o erro apenas nesta linha específica do código, sem alterar o arquivo `.flake8` (Dica: pesquise sobre comentários *inline* no Flake8).
3. Expandindo o Flake8 (Plugins): Como este é um projeto de testes, apenas o Flake8 puro não basta. Pesquise e instale o plugin chamado `flake8-pytest-style`. Rode o Flake8 novamente. Ele vai gerar um novo erro com o prefixo PT na linha do `assert`. Descubra o que esse erro significa, corrija-o e explique o motivo.

=== Entregáveis

Ao final da atividade, você deve entregar:

1. O arquivo `.flake8` configurado.
2. O arquivo `test_login.py` refatorado, que deve rodar no terminal com o comando `flake8 .` sem retornar absolutamente nenhuma mensagem de erro.
3. O arquivo `explicacao.md` com explicação (3 a 5 linhas) sobre o que você aprendeu ao pesquisar sobre os erros E711/E712 e sobre o plugin de Pytest.