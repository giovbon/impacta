- /
  - README.md
    ```markdown
    # Como executar isso
    
    python -m venv venv
    
    source venv/bin/activate
    venv\Scripts\activate
    
    pip install pytest requests httpx pytest-asyncio tavern fastapi uvicorn
    
    pytest -v -s
    
    ## Arquivos
    
    - `test_api_requests.py` é um teste funcional voltado exclusivamente para a validação do contrato e das regras de negócio. Ele simula um cliente externo fazendo requisições HTTP reais contra a API pública JSONPlaceholder (`https://jsonplaceholder.typicode.com/posts`) para atestar se ela está retornando os dados exatos e o formato correto (como chaves JSON e status de sucesso), independentemente do tempo de resposta.
        - `pytest test_api_requests.py -v -s`
    
    - `test_api_async_performance.py` foca em validar o comportamento e a arquitetura da sua aplicação local FastAPI (`server_burro`), garantindo que ela lide com várias requisições simultâneas sem travar o servidor. Ao rodar diretamente na memória (usando transporte ASGI, sem usar a rede de internet), ele verifica se a sua API realmente trabalha de forma concorrente e previne que alguém insira um código bloqueante por engano.
        - `pytest test_api_async_performance.py -v -s`
    
    - `test_api_async_perf_param.py` também testa a sua aplicação local FastAPI (`server_burro`) na memória, mas expande o escopo utilizando a parametrização. Ele dispara blocos de 3, 10 e 50 requisições simultâneas contra a sua rota e garante que, independentemente da quantidade de chamadas concorrentes, o servidor processe todas ao mesmo tempo e finalize tudo em menos de 3 segundos.
        - `pytest test_api_async_perf_param.py -v -s`
    
    - `test_api_simples.tavern.yaml` é um teste funcional escrito de forma declarativa utilizando o plugin Tavern (estruturado em YAML). Assim como o teste com `requests`, ele realiza uma requisição HTTP real contra a API pública JSONPlaceholder (`https://jsonplaceholder.typicode.com/posts`). Seu foco é validar o contrato da API de uma maneira extremamente visual e com menos código Python, atestando o status code 200 e confirmando valores específicos no JSON de resposta (como `id` e `userId`). O uso do parâmetro `strict: False` torna o teste flexível, garantindo que ele valide apenas as chaves declaradas e ignore o restante dos dados retornados.
        - `pytest test_api_simples.tavern.yaml -v -s`
    
    - `test_completo.tavern.yaml` é um teste funcional avançado escrito de forma declarativa utilizando o Tavern. Ele realiza requisições HTTP reais contra a API pública JSONPlaceholder (`https://jsonplaceholder.typicode.com/posts`), orquestrando um fluxo de testes mais complexo e dinâmico. Ele combina três recursos poderosos: parametrização (para rodar o cenário inteiro com múltiplos IDs de posts), encadeamento de requisições (capturando o ID do autor na primeira resposta para usá-lo como variável na chamada seguinte) e integração com código Python customizado (para realizar validações de regras de negócio específicas, como atestar a presença do caractere "@" no formato do e-mail retornado).
        - `pytest test_completo.tavern.yaml -v -s`
        - `pytest test_completo.tavern.yaml -v --log-cli-level=INFO` para mais detalhes
    ```
  - conftest.py
    ```python
    
    import pytest
    
    @pytest.fixture
    def base_url():
        """Fixture que fornece a URL base da API para todos os testes."""
        return "https://jsonplaceholder.typicode.com"
    ```
  - server_burro.py
    ```python
    from fastapi import FastAPI
    import asyncio
    
    app = FastAPI()
    
    @app.get("/lento")
    async def lento():
        # Ele simplesmente dorme 2 segundos e responde
        await asyncio.sleep(2)
        return {"status": "ok"}
    ```
  - test_api_async_perf_param.py
    ```python
    import pytest
    import httpx
    import time
    import asyncio
    from server_burro import app 
    
    @pytest.mark.asyncio
    # Aqui dizemos: rode esse teste 3 vezes. Na primeira passe 3, na segunda 10, na terceira 50.
    @pytest.mark.parametrize("qtd_requisicoes", [3, 10, 50])
    async def test_performance_escala(qtd_requisicoes):
        inicio = time.time()
        transport = httpx.ASGITransport(app=app)
        
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            # Cria a quantidade exata de tarefas pedida pelo parâmetro
            tarefas = [client.get("/lento") for _ in range(qtd_requisicoes)]
            
            respostas = await asyncio.gather(*tarefas)
    
            for res in respostas:
                assert res.status_code == 200
    
        tempo_total = time.time() - inicio
    
        print(f"\n{qtd_requisicoes} requisições simultâneas -> Tempo: {tempo_total:.2f} segundos")
    
        # Mesmo com 50 requisições, o tempo total deve ser pouco mais de 2s
        assert tempo_total < 3.0
    ```
  - test_api_async_perform.py
    ```python
    import pytest
    import httpx
    import time
    import asyncio
    
    # 1. Importe a sua aplicação FastAPI diretamente do seu arquivo
    from server_burro import app 
    
    @pytest.mark.asyncio
    async def test_performance_assincrona():
        inicio = time.time()
    
        # Configure o transporte ASGI apontando para o seu app
        transport = httpx.ASGITransport(app=app)
        # Com ASGITransport a requisição nem chega a ir para a rede, ela roda direto na memória do seu computador
        
        # Passe o transporte para o AsyncClient. O base_url é obrigatório, mas pode ser um endereço fictício como "http://test"
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            
            # Dispara 3 requisições ao mesmo tempo (agora usando um caminho relativo)
            tarefas = [
                client.get("/lento"),
                client.get("/lento"),
                client.get("/lento")
            ]
    
            # O asyncio.gather dispara as 3 ao mesmo tempo
            respostas = await asyncio.gather(*tarefas)
    
            for res in respostas:
                assert res.status_code == 200
    
        fim = time.time()
        tempo_total = fim - inicio
    
        print(f"\nTempo total de execução: {tempo_total:.2f} segundos")
    
        # Deve passar com sucesso (pouco mais de 2 segundos)
        assert tempo_total < 3.0
    ```
  - test_api_requests.py
    ```python
    import requests
    
    def test_get_post_com_requests(base_url):
        # O Pytest injeta o 'base_url' automaticamente
        url = f"{base_url}/posts/1"
    
        # 1. Realiza a ação (GET)
        response = requests.get(url)
    
        # 2. Validações (Asserts)
        assert response.status_code == 200
    
        data = response.json()
        assert data["id"] == 1
        assert data["userId"] == 1
        assert "title" in data # Verifica se a chave existe no JSON
    ```
  - test_api_simples.tavern.yaml
    ```yaml
    # test_api_simples.tavern.yaml
    test_name: Teste basico de GET na API publica
    
    stages:
      - name: Busca o post 1 e valida a resposta
        request:
          url: "https://jsonplaceholder.typicode.com/posts/1"
          method: GET
    
        response:
          status_code: 200
          strict: False  # Usamos o False para ele não reclamar de chaves que não queremos testar agora
          json:
            id: 1
            userId: 1
    ```
  - test_completo.tavern.yaml
    ```yaml
    
    test_name: Teste avancado com Parametrizacao, Encadeamento e Python
    
    # 1. PARAMETRIZAÇÃO: O teste todo vai rodar duas vezes (uma para o post_id 1 e outra pro 2)
    marks:
      - parametrize:
          key: post_id
          vals:
            - 1
            - 2
    
    stages:
      - name: Estágio 1 - Busca o post e salva o ID do autor
        request:
          url: "https://jsonplaceholder.typicode.com/posts/{post_id}" # Usa o parâmetro aqui
          method: GET
    
        response:
          status_code: 200
          # 2. ENCADEAMENTO (SAVE): Pega o valor da chave 'userId' do JSON e salva na variável 'autor_id'
          save:
            json:
              autor_id: userId
    
      - name: Estágio 2 - Busca os dados do autor salvo e valida com Python
        request:
          # 2. ENCADEAMENTO (USO): Usa o 'autor_id' salvo no estágio anterior
          url: "https://jsonplaceholder.typicode.com/users/{autor_id}"
          method: GET
    
        response:
          status_code: 200
          # 3. INTEGRAÇÃO COM PYTHON: Manda a resposta HTTP para a nossa função no utils.py
          verify_response_with:
            function: utils:verificar_email_valido
    ```
  - utils.py
    ```python
    def verificar_email_valido(response):
        """
        O Tavern injeta a resposta HTTP inteira nesta função.
        Vamos pegar o JSON, extrair o e-mail e fazer uma validação simples.
        """
        dados = response.json()
        email = dados.get("email", "")
        
        # Se a condição for falsa, o assert falha e o teste do Tavern quebra
        assert "@" in email, f"O formato do e-mail '{email}' parece inválido!"
    ```