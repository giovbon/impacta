<!-- .slide: data-background-image="https://i.ibb.co/sdTzbgWb/watermark-removed-Gemini-Generated-Image-m61yahm61yahm61y.png" data-background-size="cover" data-background-opacity="0.4" -->


<div class="glass-box">
    <h1>Componentes</h1>
</div>

---

<img src="https://i.ibb.co/wh2mxrtz/2026-08-25-20-41.png" width="20%" data-preview-image>

As *duas caixas vermelhas* destacam áreas fundamentais para a navegação e estrutura do seu aplicativo no FlutterFlow.

--

<img src="https://i.ibb.co/wh2mxrtz/2026-08-25-20-41.png" width="10%" data-preview-image>

**Painel Superior: Gerenciador de Páginas e Componentes**
Esta área serve para organizar todos os elementos globais do projeto:

- **pages:** Lista todas as telas/páginas criadas no aplicativo.
- **Flutter / Android / iOS:** essas *pastas servem para organizar e separar os componentes reutilizáveis e as configurações nativas do seu aplicativo*: a pasta Flutter guarda botões, cards e códigos personalizados que funcionam em qualquer tela, enquanto as pastas Android e iOS armazenam os arquivos de configuração específicos de cada sistema (como permissões de câmera, GPS e chaves de integração) para garantir que o app rode sem erros nos celulares.

--

<img src="https://i.ibb.co/wh2mxrtz/2026-08-25-20-41.png" width="10%" data-preview-image>

**Painel Inferior: Widget Tree (Árvore de Widgets)**
Mostra a estrutura visual e hierárquica em tempo real da página selecionada (`HomePage`):

* **Aninhamento Parente-Filho:** Exibe exatamente como os elementos estão organizados internamente.
* **Ações rápidas:** Permite selecionar elementos para editar suas propriedades, arrastar para reordenar ou clicar no ícone `+` ao lado de cada elemento para adicionar novos componentes dentro dele.

---

Componentes do FlutterFlow são *widgets reutilizávei*s que permitem criar um elemento de interface uma única vez e *utilizá-lo em diversas partes do aplicativo*. São usados para seções repetitivas de layout.

Os principais *benefícios* do uso de componentes são:

- **Consistência e Manutenção**: Garantem que a *aparência e o comportamento da interface sejam uniformes*. Como as atualizações são centralizadas, qualquer alteração feita no componente original é refletida automaticamente em todas as suas instâncias.
- **Eficiência**: *Reduzem a duplicidade de trabalho e a incidência de erros*, o que facilita a escalabilidade do projeto.
- **Integração**: Ao serem adicionados a uma página, eles integram-se à Árvore de Widgets, permitindo a interação com outros elementos e a resposta a alterações de estado.

---

É possível:
- Criar novo componente no ícone de **+ > Add Component > Create Blank Component**
- Converter um widget já criado em um componente e reutilizá-lo em todo o seu aplicativo: **click direito > Convert to Component**
- Criando componente a partir do modelo: Ícone de **+ > Add Component > Use Template**
- Criar com IA, descrevendo o que deseja em linguagem natural: Ícone de **+ > Add Component > Create with Designer**