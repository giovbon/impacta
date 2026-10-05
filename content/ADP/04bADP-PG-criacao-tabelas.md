---
title: Criação das tabelas no Xano
order: 7
---

Seguir o documento de [especificação](https://docs.google.com/document/d/17qAH2g9vHGn0i63Eah2UCYnIq4qpgj7KW71rpiQKyUE/edit?pli=1&tab=t.ago3hfddj9ud#heading=h.ha3wa69j2ro0) para a criação das tabelas no Xano.

- CADASTRO (Roxo)
- TOKENIZAÇÃO (Verde)
- CANCELAMENTO E ESTORNO (Laranja)
- PRODUÇÃO E ENTREGA (Amarelo)
- PRODUTOS E PEDIDOS (Rosa/Magenta)
- TRANSAÇÕES E SISTEMA (Azul-Acinzado)

<img src="https://kroki.io/dbml/svg/eNrFWMFu2zgQvecrCPSSPbRJ0DR1CmwBxWYKo47lWkoPLQphIjJetpLIUlSazaKnHvoF_aL82A4lS5Zs15vEDDYHR6KZN5w3b4YzCeEi4WTiTeiIfPyLA-M6lonUr8iT3smL_unRJ_LPDiGCEZEZPuOafFRfPuFKrDkYziIwxIiU5wZShcsKFE-I4ddm5_vOTliinwd06gQ8kymvsAnhKYik-izN5vk3qVnzUB8laoNrfvmKvK68fSZYaUkyMZORNKoGZmAg4tdKaIhBtuw3_gShF54HUX80pOOQOvEMf5siX-LNpYGYJ0UCunYyVpf1Y2U6ihPBEWkdX11_58QVOderm5-WwS63LNygE0cuNDEqmtPHgiHwEnF0PKBT2vedmE3kTAOThZa1zaxI-eItlqlKeIrkNUsXIPRiAxLDNc9iAfWKAqZRWhdSWu1uYL5LORKwdhOd1ITv7ZE_7_xjd4f-WzoefvBuf97-8Mnue66RzD3y5GD_5Lh38Mc9Abv5EdbgfW8lEhW-iyRxboVxE8WgDcgIg6aFMk2k7xqoeUoZI7_wTNzYOrIhr9oeLGWONw09H78efxg48a080EK4tvTNncKyCfk9HX2I4PreuE9H3hmC-IQSGoT-dIzKG4GG7DNY7Z0ev3x-cLSd9gJ_1LG0RF5lwoX8HsNQKo24asqH4kywtfqZ0MFw4Hc1l8skhgyrPZQVaYPslk7eVV4tzTo-j8afUwtXgH-MCRyLFGxlvQsZa1hYJDAiS51tTN75-R-cEJOpPzivyi-mwzic0jce2fVS0DyRNh2od_J8v7ddOvgrN3CF6iKCjrDvJ3OpNsTEn6wVs08fkQT6f5CwqVvz6XaSDP0ABVmZDcjuVOawdwYzzKOySNP-Ye_4eDtVVuArxJXIWwSl4UfhnbIUJ4cmjTSQtIpNdhlHvHW3YvdgNJ_BQ7uH32uhQ19X6vPQOXGwPW0xnmMrVM5D1cJXwyImclVjWfFqHssWIfZd5BApLVlxI3TT76KxmdSLdrjQOKalqK20Xpm_2eqLDyuZPAzpmXPZNEacoSNHLXrKyykqMmHaN1RxsayjO9aAktX1d9pcBF05CcPTDWKyTj98iph648DOEL-oLRrBMEA0e4vdFMlTLxbZDQ5QtmocHb487J1sOVaUxtZ0-xW4k6bEqYl1HbZgCv62TUm9YIRqcqtqYxbKsf-RuMJZ5LfJWDlhsIPO_2vWqD3rlo1yAgmceKsSPO2l1GmT3q2hozF46r1zY43rWWGvpGbWzpXM6_fv_wI9bflh">

<!-- 
ATUALIZADO EM 05/10/2026

// ==========================================
// CADASTRO (Roxo / #8B5CF6)
// ==========================================

Table PAPEL [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  papel text
}

Table USER [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  nome text
  email email
  password password
  papel_id integer [ref: > PAPEL.id]
  codigo_otp text
  data_expiracao timestamp
}

Table STATUS_CLIENTE [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  status text
}

Table CLIENTE [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  celular text
  cpf text
  status_cliente_id integer [ref: > STATUS_CLIENTE.id]
  user_id integer [ref: - USER.id]
}

Table CEP [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  cep text
  uf text
  cidade text
}

Table ENDERECO [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  logradouro text
  numero text
  complemento text
  bairro text
  referencia text
  padrao bool
  cliente_id integer [ref: > CLIENTE.id]
  cep_id integer [ref: > CEP.id]
}

// ==========================================
// TOKENIZAÇÃO (Verde / #10B981)
// ==========================================

Table STATUS_TTOKENIZACAO [headercolor: #10B981] {
  id integer [pk]
  created_at timestamp
  status text
}

Table TTOKENIZACAO [headercolor: #10B981] {
  id integer [pk]
  created_at timestamp
  det_cartao_encript text
  cliente_id integer [ref: > CLIENTE.id]
  status_ttokenizacao_id integer [ref: > STATUS_TTOKENIZACAO.id]
}

Table CARTAOTOKNZD [headercolor: #10B981] {
  id integer [pk]
  created_at timestamp
  token text
  codigoclienteassas text
  cliente_id integer [ref: > CLIENTE.id]
}

// ==========================================
// CANCELAMENTO E ESTORNO (Laranja / #F97316)
// ==========================================

Table STATUS_SOLCANCELAMENTO [headercolor: #F97316] {
  id integer [pk]
  created_at timestamp
  status text
}

Table SOLCANCELAMENTO [headercolor: #F97316] {
  id integer [pk]
  created_at timestamp
  motivo text
  pedido_id integer [ref: > PEDIDO.id]
  status_solcancelamento_id integer [ref: > STATUS_SOLCANCELAMENTO.id]
}

Table STATUS_TESTORNO [headercolor: #F97316] {
  id integer [pk]
  created_at timestamp
  status text
}

Table TESTORNO [headercolor: #F97316] {
  id integer [pk]
  created_at timestamp
  valor decimal
  solcancelamento_id integer [ref: > SOLCANCELAMENTO.id]
  status_testorno_id integer [ref: > STATUS_TESTORNO.id]
}

// ==========================================
// PRODUÇÃO E ENTREGA (Amarelo / #EAB308)
// ==========================================

Table STATUS_OP [headercolor: #EAB308] {
  id integer [pk]
  created_at timestamp
  status text
}

Table OP [headercolor: #EAB308] {
  id integer [pk]
  created_at timestamp
  pedido_id integer [ref: > PEDIDO.id]
  status_op_id integer [ref: > STATUS_OP.id]
}

Table STATUS_OE [headercolor: #EAB308] {
  id integer [pk]
  created_at timestamp
  status text
}

Table OE [headercolor: #EAB308] {
  id integer [pk]
  created_at timestamp
  pedido_id integer [ref: > PEDIDO.id]
  status_oe_id integer [ref: > STATUS_OE.id]
}

// ==========================================
// PRODUTOS E PEDIDOS (Rosa/Magenta / #EC4899)
// ==========================================

Table STATUS_PEDIDO [headercolor: #EC4899] {
  id integer [pk]
  created_at timestamp
  status text
  status_para text
}

Table PEDIDO [headercolor: #EC4899] {
  id integer [pk]
  created_at timestamp
  total decimal
  nfc_e text
  cod_entrega text
  cliente_id integer [ref: > CLIENTE.id]
  status_pedido_id integer [ref: > STATUS_PEDIDO.id]
}

Table PRODUTO [headercolor: #EC4899] {
  id integer [pk]
  created_at timestamp
  nome text
  descricao text
  qtd_disp integer
  preco decimal
  precisa_produzir bool
  categoria text
  url_imagem text
  imagem storage
}

Table STATUS_ITEM [headercolor: #EC4899] {
  id integer [pk]
  created_at timestamp
  status text
}

Table ITEM [headercolor: #EC4899] {
  id integer [pk]
  created_at timestamp
  qtd integer
  valor_unit decimal
  subtotal decimal
  pedido_id integer [ref: > PEDIDO.id]
  produto_id integer [ref: > PRODUTO.id]
  status_item_id integer [ref: > STATUS_ITEM.id]
}

// ==========================================
// TRANSAÇÕES E SISTEMA (Azul-Acinzado / #64748B)
// ==========================================

Table STATUS_TRANSACAO [headercolor: #64748B] {
  id integer [pk]
  created_at timestamp
  status text
}

Table TRANSACAO [headercolor: #64748B] {
  id integer [pk]
  created_at timestamp
  clienteassas text
  idpayment text
  tipo text
  valor integer
  datavenc text
  descricao text
  statustransacao_id integer [ref: > STATUS_TRANSACAO.id]
}

Table TOKENS [headercolor: #64748B] {
  id integer [pk]
  created_at timestamp
  plataforma text
  token text
}

Table FAQ [headercolor: #64748B] {
  id integer [pk]
  created_at timestamp
  pergunta text
  resposta text
}


-->
