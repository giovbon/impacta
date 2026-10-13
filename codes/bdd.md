- /
  - README.md
    ```markdown
    ## Como executa isso
    
    pip install pytest pytest-bdd
    
    Execute com: pytest test saque.py -v
    ```
  - conta.py
    ```python
    
    def criar_conta(saldo_inicial):
        """Cria uma conta representada por um dicionário."""
        return {"saldo": saldo_inicial}
    
    def sacar(conta, valor):
        """Recebe o dicionário da conta e o valor, e processa o saque."""
        if valor <= conta["saldo"]:
            conta["saldo"] -= valor
        else:
            raise ValueError("Saldo insuficiente")
    ```
  - saque.feature
    ```feature
    # language: pt
    Funcionalidade: Saque no Caixa Eletrônico
      Como um cliente do banco
      Eu quero poder sacar dinheiro
      Para ter dinheiro em espécie
    
      Cenário: Saque com saldo suficiente
        Dado que a conta tem saldo de 500 reais
        Quando o cliente saca 100 reais
        Então o saldo final deve ser 400 reais
    ```
  - test_saque.py
    ```python
    from pytest_bdd import scenarios, given, when, then, parsers
    from conta import criar_conta, sacar
    
    # 1. Conecta o arquivo .feature aos testes
    scenarios('saque.feature')
    
    # 2. DADO (Contexto inicial)
    @given(parsers.parse("que a conta tem saldo de {saldo:d} reais"), target_fixture="estado_da_conta")
    def conta_com_saldo(saldo):
        # Retorna o dicionário {"saldo": 500} criado pela nossa função
        return criar_conta(saldo)
    
    # 3. QUANDO (A Ação)
    @when(parsers.parse("o cliente saca {valor:d} reais"))
    def cliente_saca(estado_da_conta, valor):
        # Passamos o dicionário e o valor para a função sacar
        sacar(estado_da_conta, valor)
    
    # 4. ENTÃO (A Validação)
    @then(parsers.parse("o saldo final deve ser {saldo_esperado:d} reais"))
    def verifica_saldo_final(estado_da_conta, saldo_esperado):
        # Acessamos a chave "saldo" do dicionário para fazer a validação
        assert estado_da_conta["saldo"] == saldo_esperado
    ```