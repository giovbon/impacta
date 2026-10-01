---
title: APIs de OTP
presentation: 
    - "slides/NLCW/10NLCW-SL-api-sendgrid.md"
order: 12
---

Ideia para construção da interface de cadastro:
- 2 campos (email e senha), sendo a senha salva em Widget State como variável senha.
    - Ao clicar em cadastrar aparece mensagem "Código enviado para o seu e-mail!" ou "Este e-mail já possui conta.".
- Segunda tela de validação do código OTP.
    - Um campo de texto de 6 dígitos (PinCode widget ou TextField normal para otp_code).
    - Usuário digita código de validação
        - Mensagens possíveis: Conta criada com sucesso! ou Código incorreto ou expirado.