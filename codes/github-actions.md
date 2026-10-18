- /
  - .github/
    - workflows
      - ci.yml
        ```yml
        name: Teste de API

        on: [push]

        jobs:
          verificar-api:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4

              - name: Setup Python
                uses: actions/setup-python@v5
                with:
                  python-version: '3.11'
                  cache: 'pip'

              - name: Instalar dependências
                run: |
                  python -m pip install --upgrade pip
                  if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

              - name: Rodar Testes
                run: pytest test_main.py
      ```
  - .gitignore
    ```
    .venv/
    *cache*/
    ```
  - main.py
    ```python
    from fastapi import FastAPI
    
    app = FastAPI()
    
    @app.get("/")
    def read_root():
        return {"mensagem": "API funcionando!"}
    
    @app.get("/somar/{a}/{b}")
    def somar(a: int, b: int):
        # Apenas retorna a soma dos dois números
        return {"resultado": a + b}
    ```
  - requirements.txt
    ```text
    fastapi[standard]
    pytest
    httpx
    ```
  - test_main.py
    ```python
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    
    def test_read_root():
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"mensagem": "API funcionando!"}
    
    def test_somar():
        response = client.get("/somar/5/3")
        assert response.status_code == 200
        assert response.json() == {"resultado": 8}
    ```