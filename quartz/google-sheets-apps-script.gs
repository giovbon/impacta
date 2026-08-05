/**
 * Google Apps Script - Formulário de Entrega Quartz Impacta
 *
 * Cole este script no Editor do Google Apps Script (Extensões > Apps Script)
 * da sua planilha do Google.
 *
 * Passos:
 * 1. Cole este código no editor (Código.gs)
 *
 * 2. Execute a função "initialSetup" uma vez para criar as abas necessárias
 *
 * 3. Preencha as abas "Alunos" e "Atividades" com os dados
 *
 * 4. Faça o deploy como Web App (Executar > Implantar > Nova implantação >
 *    Tipo: Aplicativo da Web, Executar como: Você, Quem tem acesso: Qualquer um)
 *
 * 5. Copie a URL gerada e cole no arquivo submission.inline.ts
 *
 * ─────────────────────────────────────────────────────────────
 * ESTRUTURA DA PLANILHA
 * ─────────────────────────────────────────────────────────────
 *
 * Aba "Entregas":
 *   id | timestamp | ra | nome_aluno | atividade | mensagem
 *   | link_github | arquivo_zip_nome | arquivo_zip_link | status_prazo
 *
 * Aba "Alunos" (cadastro de alunos):
 *   ra | nome_aluno | email
 *
 * Aba "Atividades" (cadastro de atividades com prazos):
 *   atividade | data_limite | descricao
 */

const SCRIPT_PROP_KEY = "key"
const SHEET_ENTREGAS = "Entregas"
const SHEET_ALUNOS = "Alunos"
const SHEET_ATIVIDADES = "Atividades"
const PASTA_ZIPS = "Entregas_ZIPs"  // Pasta no Drive para armazenar os ZIPs

const scriptProp = PropertiesService.getScriptProperties()

function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty(SCRIPT_PROP_KEY, activeSpreadsheet.getId())

  // ── Aba de Entregas ──
  var sheetEntregas = activeSpreadsheet.getSheetByName(SHEET_ENTREGAS)
  if (!sheetEntregas) {
    sheetEntregas = activeSpreadsheet.insertSheet(SHEET_ENTREGAS)
  }
  var headersEntregas = [
    "id", "timestamp", "ra", "nome_aluno", "atividade",
    "mensagem", "link_github", "arquivo_zip_nome",
    "arquivo_zip_link", "status_prazo"
  ]
  var rangeEntregas = sheetEntregas.getRange(1, 1, 1, headersEntregas.length)
  rangeEntregas.setValues([headersEntregas])
  rangeEntregas.setFontWeight("bold")

  // ── Aba de Alunos ──
  var sheetAlunos = activeSpreadsheet.getSheetByName(SHEET_ALUNOS)
  if (!sheetAlunos) {
    sheetAlunos = activeSpreadsheet.insertSheet(SHEET_ALUNOS)
  }
  var headersAlunos = ["ra", "nome_aluno", "email"]
  var rangeAlunos = sheetAlunos.getRange(1, 1, 1, headersAlunos.length)
  rangeAlunos.setValues([headersAlunos])
  rangeAlunos.setFontWeight("bold")

  // ── Aba de Atividades ──
  var sheetAtividades = activeSpreadsheet.getSheetByName(SHEET_ATIVIDADES)
  if (!sheetAtividades) {
    sheetAtividades = activeSpreadsheet.insertSheet(SHEET_ATIVIDADES)
  }
  var headersAtividades = ["atividade", "data_limite", "descricao", "ativo"]
  var rangeAtividades = sheetAtividades.getRange(1, 1, 1, headersAtividades.length)
  rangeAtividades.setValues([headersAtividades])
  rangeAtividades.setFontWeight("bold")

  // Volta para a aba de Entregas
  sheetEntregas.activate()
}

function sanitizeValue(value) {
  if (typeof value !== "string") return value
  var triggers = ["=", "+", "-", "@"]
  if (triggers.some(function(t) { return value.startsWith(t) })) {
    return "'" + value
  }
  return value
}

/**
 * Converte valor da planilha para objeto Date, suportando DD/MM/YYYY
 */
function parseDateRobust(val) {
  if (!val) return null;
  
  // Se já for um objeto Date do Google Sheets
  if (Object.prototype.toString.call(val) === '[object Date]' || (val.getFullYear && !isNaN(val.getTime()))) {
    return val;
  }
  
  var str = String(val).trim();
  // Tenta quebrar por / ou -
  var parts = str.split(/[\/\-]/);
  if (parts.length === 3) {
    var d = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10) - 1;
    var y = parseInt(parts[2], 10);
    // Se o ano vier primeiro (YYYY-MM-DD)
    if (parts[0].length === 4) {
      y = parseInt(parts[0], 10);
      d = parseInt(parts[2], 10);
    }
    var res = new Date(y, m, d);
    if (!isNaN(res.getTime())) return res;
  }
  
  var res2 = new Date(str);
  if (!isNaN(res2.getTime())) return res2;

  return null;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(
    JSON.stringify(obj)
  ).setMimeType(ContentService.MimeType.JSON)
}

/**
 * GET handler (consultas):
 *   ?action=buscarAluno&ra=1234567
 *   ?action=buscarAtividade&atividade=NOME
 *   ?action=listarAtividades
 */
function doGet(e) {
  try {
    var action = (e && e.parameter) ? (e.parameter.action || "") : ""

    // Se a requisição for uma entrega (action=submit ou se contiver RA e atividade), repassa para doPost
    if (action === "submit" || (e && e.parameter && e.parameter.ra && e.parameter.atividade)) {
      return doPost(e)
    }

    var doc = SpreadsheetApp.openById(scriptProp.getProperty(SCRIPT_PROP_KEY))

    if (action === "buscarAluno") {
      var ra = e.parameter.ra || ""
      if (!/^\d{7}$/.test(ra)) {
        return jsonResponse({ result: "error", error: "RA inválido. Deve conter 7 dígitos." })
      }

      var sheet = doc.getSheetByName(SHEET_ALUNOS)
      if (!sheet) {
        return jsonResponse({ result: "error", error: "Aba de alunos não encontrada." })
      }

      var dadosAlunos = sheet.getDataRange().getValues()
      for (var a = 1; a < dadosAlunos.length; a++) {
        if (String(dadosAlunos[a][0]) === ra) {
          return jsonResponse({
            result: "success",
            found: true,
            ra: ra,
            nome_aluno: dadosAlunos[a][1],
            email: dadosAlunos[a][2] || ""
          })
        }
      }
      return jsonResponse({ result: "success", found: false, ra: ra })
    }

    if (action === "buscarAtividade") {
      var atividade = e.parameter.atividade || ""
      var sheetAtv = doc.getSheetByName(SHEET_ATIVIDADES)
      if (!sheetAtv) {
        return jsonResponse({ result: "error", error: "Aba de atividades não encontrada." })
      }

      var dadosAtv = sheetAtv.getDataRange().getValues()
      for (var b = 1; b < dadosAtv.length; b++) {
        if (String(dadosAtv[b][0]).trim().toLowerCase() === atividade.trim().toLowerCase()) {
          var dlRaw = dadosAtv[b][1]
          var dlDate = parseDateRobust(dlRaw)
          return jsonResponse({
            result: "success",
            found: true,
            atividade: atividade,
            data_limite: (dlDate && !isNaN(dlDate.getTime())) ? dlDate.toISOString() : String(dlRaw),
            descricao: dadosAtv[b][2] || "",
            ativo: dadosAtv[b][3] !== false
          })
        }
      }
      return jsonResponse({ result: "success", found: false, atividade: atividade })
    }

    if (action === "listarAtividades") {
      var sheetLista = doc.getSheetByName(SHEET_ATIVIDADES)
      if (!sheetLista) {
        return jsonResponse({ result: "error", error: "Aba de atividades não encontrada." })
      }

      var dadosLista = sheetLista.getDataRange().getValues()
      var atividades = []
      for (var c = 1; c < dadosLista.length; c++) {
        if (dadosLista[c][0]) {
          var dlRaw2 = dadosLista[c][1]
          var dlDate2 = parseDateRobust(dlRaw2)
          atividades.push({
            atividade: String(dadosLista[c][0]),
            data_limite: (dlDate2 && !isNaN(dlDate2.getTime())) ? dlDate2.toISOString() : String(dlRaw2),
            descricao: String(dadosLista[c][2] || ""),
            ativo: dadosLista[c][3] !== false
          })
        }
      }
      return jsonResponse({ result: "success", atividades: atividades })
    }

    return jsonResponse({ result: "error", error: "Ação desconhecida." })

  } catch (err) {
    return jsonResponse({ result: "error", error: "Erro interno ao consultar dados." })
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    // ── 1. Honeypot anti-spam ──
    if (e.parameter.mobile_number && e.parameter.mobile_number !== "") {
      return jsonResponse({ result: "success", message: "Bot detected" })
    }

    var doc = SpreadsheetApp.openById(scriptProp.getProperty(SCRIPT_PROP_KEY))

    // ── 2. Validação do RA (busca nome automaticamente) ──
    var ra = (e.parameter.ra || "").trim()
    if (!/^\d{7}$/.test(ra)) {
      return jsonResponse({ result: "error", error: "RA inválido. Deve conter exatamente 7 dígitos." })
    }

    var sheetAlunos = doc.getSheetByName(SHEET_ALUNOS)
    if (!sheetAlunos) {
      return jsonResponse({ result: "error", error: "Erro: aba de alunos não encontrada." })
    }

    var dadosAlunos = sheetAlunos.getDataRange().getValues()
    var nomeAlunoCorreto = ""

    for (var i = 1; i < dadosAlunos.length; i++) {
      if (String(dadosAlunos[i][0]) === ra) {
        nomeAlunoCorreto = String(dadosAlunos[i][1])
        break
      }
    }

    if (!nomeAlunoCorreto) {
      return jsonResponse({ result: "error", error: "RA não encontrado no cadastro de alunos." })
    }

    // ── 3. Validação da atividade ──
    var atividade = (e.parameter.atividade || "").trim()
    if (!atividade) {
      return jsonResponse({ result: "error", error: "Atividade não informada." })
    }

    var sheetAtividades = doc.getSheetByName(SHEET_ATIVIDADES)
    if (!sheetAtividades) {
      return jsonResponse({ result: "error", error: "Erro: aba de atividades não encontrada." })
    }

    var dadosAtividades = sheetAtividades.getDataRange().getValues()
    var atividadeEncontrada = false
    var statusPrazo = 0

    for (var j = 1; j < dadosAtividades.length; j++) {
      if (String(dadosAtividades[j][0]).trim().toLowerCase() === atividade.trim().toLowerCase()) {
        atividadeEncontrada = true

        // Verifica se a atividade está ativa
        var ativo = dadosAtividades[j][3];
        if (ativo === false || String(ativo).toLowerCase() === "false") {
          return jsonResponse({
            result: "error",
            error: "Esta atividade está desativada e não aceita mais envios. Verifique com o professor."
          })
        }

        var dlRaw3 = dadosAtividades[j][1]
        var dataLimite = parseDateRobust(dlRaw3)

        if (dataLimite && !isNaN(dataLimite.getTime())) {
          var agora = new Date();
          var tz = doc.getSpreadsheetTimeZone();
          // Formata as datas no fuso horário da planilha para comparação textual segura
          var hojeStr = Utilities.formatDate(agora, tz, "yyyy-MM-dd");
          var limiteStr = Utilities.formatDate(dataLimite, tz, "yyyy-MM-dd");

          if (hojeStr > limiteStr) {
            var hParts = hojeStr.split("-");
            var lParts = limiteStr.split("-");
            var dHoje = new Date(hParts[0], hParts[1]-1, hParts[2]);
            var dLimite = new Date(lParts[0], lParts[1]-1, lParts[2]);
            var diffDays = Math.round(Math.abs(dHoje - dLimite) / (1000 * 60 * 60 * 24));
            statusPrazo = diffDays;
          }
        } else if (dlRaw3) {
          statusPrazo = "Erro: Data Inválida (" + dlRaw3 + ")";
        }
        break
      }
    }

    if (!atividadeEncontrada) {
      return jsonResponse({
        result: "error",
        error: "Atividade \"" + atividade + "\" não encontrada no cadastro. Verifique com o professor."
      })
    }

    // ── 4. Verificação de duplicidade (mesmo RA + mesma atividade nos últimos 5 min) ──
    var sheetEntregas = doc.getSheetByName(SHEET_ENTREGAS)
    if (!sheetEntregas) {
      return jsonResponse({ result: "error", error: "Erro: aba de entregas não encontrada." })
    }

    var dadosEntregas = sheetEntregas.getDataRange().getValues()
    var agoraTimestamp = new Date().getTime()
    var VINTE_QUATRO_HORAS = 24 * 60 * 60 * 1000

    for (var k = 1; k < dadosEntregas.length; k++) {
      var raLinha = String(dadosEntregas[k][2]).trim()
      var atvLinha = String(dadosEntregas[k][4]).trim().toLowerCase()
      var tsLinhaRaw = dadosEntregas[k][1]
      
      // Tenta converter para data caso esteja salvo como texto
      var tsLinha = (tsLinhaRaw instanceof Date) ? tsLinhaRaw : new Date(tsLinhaRaw)

      if (raLinha === ra && atvLinha === atividade.toLowerCase().trim() && !isNaN(tsLinha.getTime())) {
        if (agoraTimestamp - tsLinha.getTime() < VINTE_QUATRO_HORAS) {
          return jsonResponse({
            result: "error",
            error: "Você já enviou esta atividade nas últimas 24 horas. Aguarde para reenviar."
          })
        }
      }
    }

    // ── 5. Processa arquivo ZIP ──
    var arquivoZipNome = e.parameter.arquivo_zip_nome || ""
    var arquivoZipLink = ""

    if (e.parameter.arquivo_zip_base64 && arquivoZipNome) {
      var decodedBytes = Utilities.base64Decode(e.parameter.arquivo_zip_base64)
      var blob = Utilities.newBlob(decodedBytes, "application/zip", arquivoZipNome)

      // Cria pasta específica se não existir
      var pastas = DriveApp.getFoldersByName(PASTA_ZIPS)
      var folder = pastas.hasNext() ? pastas.next() : DriveApp.createFolder(PASTA_ZIPS)

      var file = folder.createFile(blob)
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
      arquivoZipLink = file.getUrl()
    }

    // ── 6. Salva na planilha ──
    var headers = sheetEntregas.getRange(1, 1, 1, sheetEntregas.getLastColumn()).getValues()[0]
    var nextRow = sheetEntregas.getLastRow() + 1

    var novoId = Utilities.getUuid()

    var newRow = headers.map(function(header) {
      var h = String(header).trim().toLowerCase();
      var fieldMap = {
        "id": novoId,
        "timestamp": new Date(),
        "nome_aluno": nomeAlunoCorreto,
        "status_prazo": statusPrazo,
        "arquivo_zip_nome": arquivoZipNome,
        "arquivo_zip_link": arquivoZipLink
      }

      if (h in fieldMap) {
        return fieldMap[h]
      }

      var rawValue = e.parameter[header] || e.parameter[h] || ""
      return sanitizeValue(rawValue)
    })

    var newRange = sheetEntregas.getRange(nextRow, 1, 1, newRow.length)
    newRange.setNumberFormat("@")
    newRange.setValues([newRow])

    return jsonResponse({
      result: "success",
      row: nextRow,
      id: novoId,
      nome_aluno: nomeAlunoCorreto,
      status_prazo: statusPrazo
    })

  } catch (err) {
    return jsonResponse({ result: "error", error: "Erro interno ao processar a entrega." })
  } finally {
    lock.releaseLock()
  }
}
