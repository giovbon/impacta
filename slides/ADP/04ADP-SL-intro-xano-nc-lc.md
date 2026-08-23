<!-- .slide: data-background-image="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Desenvolvimento No/Low Code e Xano</h1>
</div>


---

## O Espectro do Desenvolvimento de Software

### Desenvolvimento Tradicional (Hard-Code)
Programação convencional que envolve escrever código linha por linha. Exige equipes de profissionais de TI e grandes investimentos para construir sistemas do zero, lidando com muita complexidade .

Alta exigência de Conhecimento Técnico , pois exige conhecimento profundo de linguagens de programação, arquitetura de sistemas e gerenciamento de bancos de dados.

--

### Low-Code (LC)
Plataformas que oferecem um ambiente de desenvolvimento visual com componentes pré-construídos e funcionalidades de arrastar e soltar. Elas aceleram o desenvolvimento , mas ainda permitem que programadores profissionais escrevam código para personalizações complexas ou integrações específicas .

Baixa a média exigência de Conhecimento Técnico pois permite que pessoas com alguma lógica de programação criem aplicações.

### No-Code (NC)

Plataformas projetadas para usuários de negócio sem nenhuma experiência em programação ("nondevelopers"). O objetivo é permitir a criação de lógica de negócio complexa, como visto em ferramentas como o Xano , sem escrever uma única linha de código, focando inteiramente na funcionalidade e no resultado.

Nenhuma ou muito pouca exigência de Conhecimento Técnico

--

As plataformas LC/NC não são apenas uma inovação tecnológica , elas são uma solução estratégica para problemas que aflige as empresas modernas : a capacidade limitada da TI para atender a uma demanda crescente por aplicações altos custos para o desenvolvimento tradicional (hard-code) insatisfação dos usuários de negócio (leigos), que buscam soluções mais eficazes (customizadas) para seus desafios diários.

"Desenvolvedor Cidadão" : é um funcionário de negócio (não é desenvolvedor de software por profissão) que combinam seu profundo conhecimento do negócio em questão com a acessibilidade das ferramentas LC/NC para construir soluções práticas e direcionadas, para si e para outros.

---

## Vantagens e Desafios da Abordagem LC/NC

## Vantagens
- Velocidade e Agilidade : Plataformas LC/NC aceleram o desenvolvimento, permitindo lançamentos rápidos.
- Acessibilidade e Redução de Custos : Com modelos SaaS e planos acessíveis, é possível experimentar tecnologias sem investimentos altos, contrastando com os custos de desenvolvimento anteriores.
- Flexibilidade e Automação : Essas ferramentas atendem diversas necessidades e automatizam tarefas manuais, otimizando tempo e reduzindo estresse nas equipes.
- Inovação democrática : Permitem que não-desenvolvedores construam soluções, aproveitando o conhecimento útil de funcionários sobre problemas de negócios e promovendo inovação descentralizada.

--

## Desvantagens

- Vendor Lock-In : Ficar preso a uma plataforma pode dificultar migrações e extração de dados, tornando a troca de solução complexa e custosa.
- Limitações de Escopo e Complexidade : Ferramentas LC/NC são adequadas para problemas de baixa a média complexidade , mas não substituem sistemas robustos, podendo falhar em contextos corporativos grandes. Pra coisas mais complexas, o low-code facilmente vira "muito-
- muito-code".
- Questões de escala : Exemplo: uma aplicação LC/NC pode funcionar bem para alguns milhares de usuários, mas para milhões ou bilhões de usuários? Para esse tipo de otimização na aplicação, apenas equipes de desenvolvedores profissionais podem atender a demanda.

---

## Xano

O Xano é uma plataforma centralizada de Backend-as-a-Service (BaaS) que unifica o gerenciamento de bancos de dados relacionais . A ferramenta permite que organizações e fundadores criem backends empresariais sem precisar de desenvolvedores caros ou gastar meses com código manual de infraestrutura .

Xano é uma ferramenta "headless", tendo uma arquitetura que separa o backend (parte do servidor que gerencia dados e lógica) do frontend (interface visual que os usuários interagem). Isso significa que a ferramenta não oferece uma interface visual integrada , permitindo que desenvolvedores e organizações integrem seu backend com qualquer tecnologia ou framework front-end, como React, Vue, ou soluções no-code (WeWeb, Bubble e FlutterFlow).

--

O Xano utiliza por baixo dos panos um banco de dados PostgreSQL . Sua infraestrutura é baseada em tecnologias modernas como Docker e Kubernetes , rodando no Google Cloud Platform (GCP) . A lógica de negócios é construída através da Function Stack (Pilha de Funções) , uma interface visual onde você define entradas, processa dados e gera respostas sem escrever código. Há os recursos de:

- Instância : É o seu servidor backend, com recursos dedicados à sua conta.
    - O plano gratuito utiliza recursos compartilhados.
    - Os planos pagos oferecem instâncias dedicadas (single-tenant), o que isola os dados e recursos de computação (CPU e RAM) de outros usuários, aumentando a segurança e o desempenho.
- Workspace : (Espaços de Trabalho): Funcionam como contêineres dedicados para cada projeto, cliente ou equipe. Eles permitem a segregação de dados e comunicações , sendo ideais para separar ambientes de desenvolvimento, homologação (staging) e produção .

O plano gratuito do Xano permite a configuração de 1 Workspace por conta , mas nas opções pagas existem opções para vários, cada um isolado dos demais.

---

Daqui pra frente há vários prints de tela...