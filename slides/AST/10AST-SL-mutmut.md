<!-- .slide: class="slide-cover" -->
<p class="slide-cover__kicker">AST · Automated Software Testing</p>

# mutmut

<p class="slide-cover__rule"></p>
<p class="slide-cover__sub"></p>
<p class="slide-cover__meta"><span>Prof. Giovani B.</span></p>
<p class="slide-cover__num">10</p>

---


## Testes de Mutação

É uma técnica avançada de testes de software usada para *avaliar a qualidade e a eficácia* da sua suíte de testes unitários. Em vez de medir apenas a cobertura de código (quais linhas foram executadas), o teste de mutação *mede a capacidade dos seus testes em detectar falhas reais*.

Funciona por **introduzir pequenas mudanças no código-fonte (mutantes) para testar a eficácia da sua suíte de testes**:

- **Criação de Mutantes:** Altera pontualmente o código (ex: troca `>` por `>=`, `+` por `-`).
- **Execução dos Testes:** Roda seus testes unitários contra cada mutante.
- **Avaliação dos resultados:**
    - **Mutante Morto (Bom)**: O teste falhou com o código alterado. Isso é ótimo! Significa que seu teste é atento e percebeu que o código foi quebrado.
    - **Mutante Sobrevivente (Ruim)**: O teste passou mesmo com o código alterado. Isso é ruim! Significa que seu teste é fraco e deixou uma mudança/erro passar despercebido.

--

**A lógica é essa**:

- A ferramenta insere um erro de propósito no seu código (mutante).
- Como o código agora está "quebrado", o correto seria o teste falhar.
- Se o teste não falhou (o mutante sobreviveu), significa que você tem um ponto cego no código: ou faltou testar aquele caso (falta de cobertura), ou o teste existente é fraco e aceita qualquer resultado.

--

Ok, mas **a cobertura de testes não deveria ser suficiente?**

A cobertura tradicional mede apenas a *quantidade de código executada* (passar pela linha não garante que o resultado é validado), enquanto o teste de mutação mede a *qualidade do teste* ao provar se ele realmente quebra quando a lógica daquela linha é alterada (garante que o teste seja robusto para detectar erros).

---

## mutmut

O mutmut é uma das ferramentas de teste de mutação mais conhecidas para o ecossistema Python. Ele analisa o seu código em Python, injeta mutações em memória/arquivos temporários e roda seus testes (geralmente integrando-se com o pytest) para verificar quais mutantes sobrevivem.

Ele também aplica mutações de forma pragmática para tentar reduzir o tempo de execução (que costuma ser o grande gargalo dos testes de mutação).

--

### Comandos

- `mutmut run`: *Injeta as mutações no código*, executa a sua suíte de testes contra cada uma delas e salva o histórico dos resultados.
- `mutmut results`: *Lista o status final* de todos os mutantes gerados (`survived` ou `killed`) com seus respectivos nomes identificadores.
- `mutmut show <nome_do_mutante>`: Exibe o diff exato no terminal (o que mudou no código original) para aquele mutante específico, que alteração ele aplicou.

---

### Análise do Exemplo

Ao rodar o sobre o exemplo da aula, temos o resultado:

```bash
(.venv) giobon@giobon-Inspiron-5558:~/Área de trabalho/mutmut$ mutmut run
⠇ Generating mutants
    done in 50ms (0 files mutated, 0 ignored, 1 unmodified)
    Warning: 1 non-Python file(s) changed since the last full run: setup.cfg
    These cannot be tracked for behavioral changes, so cached results were kept.
    If the changes affect your tests, delete the mutants/ directory or set on_dependency_change = "rerun".
⠹ Listing all tests 
⠇ Running clean tests
    done
⠼ Running forced fail test
    done
Running mutation testing
⠧ 2/2  🎉 0 🫥 0  ⏰ 0  🤔 0  🙁 2  🔇 0  🧙 0
```

--

As linhas de texto que precedem o resultado (`⠧ 2/2  🎉 0 🫥 0  ⏰ 0  🤔 0  🙁 2  🔇 0  🧙 0`) final significam:

O `mutmut` analisa o código para identificar possíveis alterações, mapeia a suíte de testes e executa esses testes no código original sem modificações para garantir que já estejam passando; em seguida, simula uma falha proposital para validar se a ferramenta de testes responde corretamente a erros e, por fim, aplica cada alteração individualmente e roda os testes contra elas para medir a capacidade da suíte em detectar as falhas.

O trecho `2/2` significa que ele processou **2 mutantes de um total de 2**.

--

Aqui está o significado de cada ícone do placar:

| Ícone | Nome em inglês | O que significa na prática | O seu valor |
| --- | --- | --- | --- |
| **`🎉`** | **Killed (Morto)** | O teste **falhou** ao rodar com o mutante. **(Excelente!)** | **0** |
| **`🙁`** | **Survived (Sobreviveu)** | O teste **passou** mesmo com o código alterado. **(Ruim - falta teste)** | **2** |
| **`🫥`** | **Skipped** | Mutante ignorado por regras de configuração. | **0** |
| **`⏰`** | **Timeout** | O mutante gerou um loop infinito no código e estourou o tempo. | **0** |
| **`🤔`** | **Suspicious** | Comportamento estranho (ex: o teste falhou por outro motivo). | **0** |
| **`🔇`** | **Untested** | Código sem nenhum teste cobrindo a linha. | **0** |
| **`🧙`** | **Check/Re-evaluate** | Mutantes marcados para checagem manual. | **0** |

--

**Resumo do Diagnóstico:**

Você tem **0 mutantes mortos (`🎉 0`)** e **2 mutantes sobreviventes (`🙁 2`)**.

Isso confirma que o seu teste atual passa por 100% da linha do `main.py`, mas é fraco demais para notar quando a regra do `18` muda.

O `assert eh_maior_de_idade(18) is True` resolve o problema porque força a suíte de testes a quebrar no exato instante em que o limite de idade é alterado.

Ao rodar o `run`, o mutmut cria as pastas `mutants/` e `.mutmut-cache` a fim de **salvar os resultados e deixar a próxima execução mais rápida**.

--

Se mudarmos o teste a fim de corrigir os resultados, devemos rodar **`rm -rf mutants/ .mutmut-cache`** antes, porque *o mutmut não detecta alterações feitas apenas nos testes. Sem limpar o cache, ele ignora o teste novo e repete o resultado antigo.*

Ao rodar novamente o mutmut com `rm -rf mutants/ .mutmut-cache && mutmut run` com a correção (novo assert) temos o resultado:

`⠧ 2/2  🎉 2 🫥 0  ⏰ 0  🤔 0  🙁 0  🔇 0  🧙 0`

Esse resultado significa que você atingiu **100% de eficácia nos testes de mutação**: dos 2 mutantes gerados, ambos foram mortos (**🎉 2**) e nenhum sobreviveu (**🙁 0**). Isso confirma que a adição da checagem no valor limite (18 anos) *tornou sua suíte de testes totalmente robusta*, garantindo que qualquer alteração indevida na lógica do código fará os testes falharem imediatamente.

---

## Como o mutmut altera o código?

O `mutmut` não sai apagando ou reescrevendo o código de forma aleatória. Ele faz a leitura estrutural do seu arquivo Python e procura por padrões específicos onde **erros lógicos humanos** costumam acontecer.

A lógica do `mutmut` baseia-se em introduzir os famosos *off-by-one errors* (erros por um) e inversões de fluxo. Ele parte do princípio de que: **se um valor base ou condição limite for levemente alterado, o teste deve ser capaz de notar.**

--

### Critérios e Tipos de Mutações

O `mutmut` aplica um *catálogo restrito e seguro de mutações matemáticas e sintáticas*. Os principais critérios são:

**Operadores de Comparação:** Testa se os limites (as bordas) estão bem definidos.
- O que era `>` vira `>=`.
- O que era `<` vira `<=`.
- O que era `==` vira `!=`.


**Operadores Matemáticos:** Inverte as operações e contadores.
- O que era `+` vira `-`, e vice-versa.
- O que era `*` vira `/`.
- `+=` transforma-se em `-=` ou `=` simple

--

**Tipos Primitivos (Números):** Testa a rigidez dos valores fixados no código somando ou subtraindo 1.
- `0` vira `1`.
- `1` vira `2`.
- `18` vira `19`.


**Booleanos e Condicionais:** Inverte tomadas de decisão.
- `True` vira `False`.
- `and` vira `or`.
- `in` vira `not in`.


**Strings:** Insere caracteres extras para validar se o teste garante o texto exato.
- Uma string vazia `""` vira `"XX"`.
- Um texto como `"aprovado"` vira `"XXaprovadoXX"`.

---

## `setup.cfg`

O **`setup.cfg`** é um arquivo de configuração padronizado no Python. No contexto do **`mutmut`**, ele serve para salvar as regras de execução do teste de mutação para você não precisar passar parâmetros longos no terminal toda vez que rodar `mutmut run`.

--

Exemplos de opções:

```ini
[mutmut]
# 1. Onde estão os arquivos do projeto que devem sofrer mutações
source_paths = main.py

# 2. Comando exato usado para rodar os testes
runner = python -m pytest

# 3. Onde estão guardados os testes (útil se ficarem numa pasta separada)
tests_dir = tests/

# 4. Usa dados do coverage para só alterar linhas cobertas por testes (economiza tempo)
use_coverage = True

# 5. O que fazer se um arquivo fora do código mudar (ex: setup.cfg)
on_dependency_change = rerun

```