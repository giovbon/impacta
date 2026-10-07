
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

== Desafio Prático: Caçando Mutantes e Garantindo a Robustez dos Testes

*Cenário*:
Você assumiu o cargo de QA/Engenheiro de Qualidade em uma fintech. A equipe de desenvolvimento acabou de entregar a nova funcionalidade de *Concessão de Crédito*. O desenvolvedor júnior garantiu que a suíte de testes tem "100% de cobertura de código", mas o Tech Lead desconfia que os testes estão fracos e podem deixar bugs passarem para a produção.

Sua missão é configurar o `mutmut`, provar que os testes atuais são frágeis (deixando mutantes sobreviverem) e, em seguida, refatorar a suíte de testes para que consiga detectar qualquer alteração indevida na regra de negócio.

=== Parte 1: O Código Legado

Crie dois arquivos na sua máquina e cole os códigos exatos abaixo:

*Arquivo 1:* `credito.py` (O código da aplicação)

```python
def aprovar_emprestimo(score_serasa: int, renda_mensal: float) -> bool:
    # Regra: Aprova se o score for maior ou igual a 700 OU a renda for maior que 5000.00
    if score_serasa >= 700 or renda_mensal > 5000.00:
        return True
    return False

```

*Arquivo 2:* `test_credito.py` (O teste do desenvolvedor)

```python
from credito import aprovar_emprestimo

def test_aprovacao_por_score():
    # Passa com score alto
    assert aprovar_emprestimo(850, 2000.00) is True

def test_aprovacao_por_renda():
    # Passa com renda alta
    assert aprovar_emprestimo(500, 8000.00) is True

def test_reprovacao():
    # Reprova com tudo baixo
    assert aprovar_emprestimo(300, 1500.00) is False

```

=== Parte 2: Configuração Inicial

Para não precisar digitar comandos longos toda vez, crie o arquivo de configuração `setup.cfg` na raiz do projeto contendo as regras do `mutmut` para esta análise:

1. Os testes devem usar o `pytest` como executor (runner).
2. O arquivo alvo da mutação deve ser apenas o `credito.py` (não queremos mutar o próprio arquivo de teste).
3. O comportamento de dependência (`on_dependency_change`) deve estar configurado para rodar novamente (`rerun`).

=== Parte 3: Pesquisa e Execução (Missões)

Se você rodar apenas `pytest`, verá que todos os testes passam (a cobertura é realmente 100%). Mas agora é a hora da verdade.

Execute o comando `mutmut run` no terminal. Algumas alterações propositais feitas pela ferramenta não farão seus testes falharem (os temidos "Mutantes Sobreviventes" `🙁`). Cumpra as seguintes missões:

1. *A Falsa Sensação de Segurança:* Liste os resultados com `mutmut results`. Quantos mutantes sobreviveram?
2. *Investigação Criminal (O Comando Show):* Escolha um dos mutantes sobreviventes e rode o comando `mutmut show <ID>` (substitua `<ID>` pelo número do mutante).
* Observe o *diff* gerado. O que o `mutmut` alterou na linha do `if`?
* Por que o teste original `test_aprovacao_por_score()` não falhou, mesmo com o código da aplicação tendo sido modificado e "quebrado"?


3. *O Contra-Ataque (Análise de Valor Limite):* O seu teste falhou em cobrir as "bordas" da regra de negócio (os limites exatos). Refatore o arquivo `test_credito.py` adicionando novos cenários (ou alterando os atuais) para blindar a regra de negócio.
* *Atenção:* Antes de testar sua correção, lembre-se da regra de ouro do mutmut: você precisa excluir as pastas de cache rodando `rm -rf mutants/ .mutmut-cache`, senão ele ignorará seu novo teste!
* Rode `mutmut run` novamente até o placar exibir apenas mutantes mortos (`🎉`).



=== Entregáveis

Ao final da atividade, você deve enviar/apresentar:

1. O arquivo `setup.cfg` configurado.
2. O arquivo `test_credito.py` refatorado, que, ao ser validado contra o `mutmut`, deve resultar em zero mutantes sobreviventes (`🙁 0`).
3. Um arquivo `explicacao.md` respondendo (em até 5 linhas): O que o `mutmut show` revelou sobre a alteração feita no sinal `>=` (ou no valor `700`), e qual é a importância da técnica de "Análise do Valor Limite" para matar esses mutantes?