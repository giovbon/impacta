- /
  - README.md
    ```
    python -m venv .venv
    .venv\Scripts\activate
    pip install flake8
    
    Rode o comando abaixo e interprete o retorno:
    flake8 --max-complexity=3 exemplo_erros.py
    ```
  - exemplo_erros.py
    ```python
    import os  # Erro F401: Módulo 'os' importado, mas nunca utilizado
    import sys

    # Erro E302: PEP 8 exige 2 linhas em branco antes de definir uma função
    def processar_dados( status, valor ):  # Erro E201: Espaços desnecessários dentro dos parênteses

        # Erro F841: Variável 'dados_locais' atribuída, mas nunca utilizada no código
        dados_locais = "processando"

        # Erro E225: Falta de espaços ao redor do operador de atribuição (=)
        resultado=valor*2

        # Erro C901: Função demasiadamente complexa (muitas estruturas 'if' aninhadas)
        if status == 1:
            if valor > 10:
                if resultado > 20:
                    print("Caso 1")
        elif status == 2:
            if valor < 5:
                print("Caso 2")
        elif status == 3:
            print("Caso 3")
        else:
            print("Caso padrão")

        # Erro F821: 'variavel_inexistente' não foi definida em nenhum lugar
        print(variavel_inexistente)

        # Erro E501: Linha ultrapassa o limite padrão de 79 caracteres do PEP 8
        texto_longo = "Esta é uma linha extremamente longa criada para demonstrar o alerta de limite de caracteres do Flake8." 

        return resultado 

    # Aviso W291: Há um espaço em branco invisível no final da linha acima (trailing whitespace)
    # Aviso W292: Não há uma linha em branco no final deste arquivo
    ```