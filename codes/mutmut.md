- /
  - README.md
    ```markdown
    pip install pytest mutmut
    
    Se certifique de que tudo passe:
    pytest
    
    mutmut run
    
    mutmut results
    
    mutmut show main.x_eh_maior_de_idade__mutmut_1
    mutmut show main.x_eh_maior_de_idade__mutmut_2
    
    Após alterar o teste, rode:
    
    rm -rf mutants/ .mutmut-cache && mutmut run
    ```
  - main.py
    ```python
    
    def eh_maior_de_idade(idade: int) -> bool:
        return idade >= 18
    ```
  - setup.cfg
    ```cfg
    [mutmut]
    source_paths = main.py
    runner = python -m pytest
    ```
  - test_main.py
    ```python
    # test_main.py
    from main import eh_maior_de_idade
    
    def test_eh_maior_de_idade():
        assert eh_maior_de_idade(20) is True
        assert eh_maior_de_idade(15) is False
        # assert eh_maior_de_idade(18) is True  # resolve o problema porque força a suíte de testes a quebrar no exato instante em que o limite de idade é alterado.
    ```
