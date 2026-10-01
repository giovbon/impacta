<!-- .slide: class="slide-cover" -->
<p class="slide-cover__kicker">No/Low-Code Workflow Logic</p>

# APIs de OTP 

<p class="slide-cover__rule"></p>
<p class="slide-cover__sub">Endpoints: request_otp e verify_otp</p>
<p class="slide-cover__meta"><span>Prof. Giovani B.</span></p>
<p class="slide-cover__num">07</p>

---

Requisitos:

1. Ter **conta criada no [sendgrid](https://login.sendgrid.com/login/identifier)**. Vai envollver verificação de email e celular. Após criar a conta vai aparecer tela para validar um remetente para conseguir enviar e-mails (*Sender*), coloque um email seu, os dados de endereço, e depois valide pelo email que receberá nele.

2. **Configurar extensão no xano**

Pesquise no campo *marketplace* e entre, depois acesse ícone de *messaging* > *sendgrid email* > *get extension* > *get*. Depois que atualizar a página vá em *install extension* > *install* > *manage*. Com isso criará a API: **Sendgrid Validation**.

Os campos que exigirão preenchimento de valores: 
- `sendgrid_from_email`: o email que criou a conta no sendgrid
- `sendgrid_api_key`: começa com `SG.`, chave da api que deverá ser criada na [página](https://login.sendgrid.com/settings/api_keys) da interface web do sendgrid, de full access.

Não esqueça de salvar ambos os campos antes de sair da página.

--

3. Ter compreendido o funcionamento dos métodos `POST` e `GET` nas chamadas a APIs.

Para o exemplo demonstrativo utilizaremos as tabelas descritas abaixo, *adapte o exemplo para os requisitos reais do projeto que estão desenvolvendo*.

**Tabelas**:
- `user_temp` (`email`, `opt_code`, `opt_expires_at`)
- `usuario` (`email`, `senha`)

---

## API `request_otp`

<img src="https://i.ibb.co/4ZxzYCWB/81-AB5959-2-A13-4-AE4-9-D0-F-53-E8-FF229-EE3.png" width="90%" data-preview-image>

--

### Detalhes

<img src="https://i.ibb.co/MJBZBpY/BAD4148-C-C2-B2-41-FC-96-F6-202358522-E1-F.png" width="30%" data-preview-image>
<img src="https://i.ibb.co/QFbdMhjG/C6987544-8-BFF-45-FE-AF2-A-B24229-CBA471.png" width="30%" data-preview-image>
<img src="https://i.ibb.co/ymQmtSJN/874-F40-A3-3-DF6-4472-A523-7-FF9217-F4-C4-C.png" width="30%" data-preview-image>
<img src="https://i.ibb.co/rGVW1r0h/8-E166-FFA-25-F6-43-CC-80-F1-8-CA1-D98-EE600.png" width="30%" data-preview-image>
<img src="https://i.ibb.co/R4ZhMPjg/D4-B8392-D-4077-4249-80-F2-B9-E13721052-F.png" width="30%" data-preview-image>


**Error messages**:
- Precondition 1: Este e-mail já possui uma conta ativa. Faça login.

---

## API `verify_otp`

<img src="https://i.ibb.co/Df9Q4fM8/FED58931-5584-48-DE-9-B6-D-2-F29238-EE9-E8.png" width="90%" data-preview-image>

--

### Detalhes

<img src="https://i.ibb.co/j9R1rz33/664329-FA-9862-4-FCC-BF67-4022-D8-E50041.png" width="40%" data-preview-image>

**Error messages**:
- Precondition 1: Nenhuma solicitação de código encontrada para este e-mail.
- Precondition 2: Código de verificação incorreto.
- Precondition 3: O código de verificação expirou. Solicite um novo.