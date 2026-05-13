// @ts-ignore
import submissionScript from "./scripts/submission.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const SubmissionForm: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
  const submissionRaw = fileData.frontmatter?.submission
  const activities = Array.isArray(submissionRaw)
    ? submissionRaw
    : submissionRaw
      ? [submissionRaw]
      : []

  if (activities.length === 0) return null

  const isMultiple = activities.length > 1

  return (
    <div class={classNames(displayClass, "submission-container")}>
      <div class="submission-card">
        {/* Selection Screen (only if multiple) */}
        {isMultiple && (
          <div class="selection-screen">
            <div class="card-header">
              <div class="icon-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </div>
              <div class="header-text">
                <h3>Escolha a Atividade</h3>
                <p class="subtitle">Selecione para qual atividade deseja entregar</p>
              </div>
            </div>
            <div class="activity-list">
              {activities.map((act) => (
                <button type="button" class="select-activity-btn" data-activity={act}>
                  <span class="act-name">{act}</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Screen */}
        <div class={classNames("form-screen", isMultiple && "hidden")}>
          <div class="card-header">
            {isMultiple && (
              <button type="button" class="back-to-selection" title="Voltar para escolha">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
            )}
            <div class="icon-wrapper">
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="rocket-icon"
              >
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.79-1.81.19-2.55L4.5 16.5z"></path>
                <path d="M15 15l-3.5 3.5L7 14l3.5-3.5L15 15z"></path>
                <path d="M9 3.5l4 4a1.5 1.5 0 0 0 2.12 0l2.88-2.88a1.5 1.5 0 0 1 2.12 0L21 5.5s-1.5 4.5-4 7-6 2-9-1-1-6.5 1-9z"></path>
                <path d="M15 9l1 1"></path>
              </svg>
            </div>
            <div class="header-text">
              <h3>Entrega de Atividade</h3>
              <p class="subtitle">
                Atividade:{" "}
                <span class="highlight-activity">{!isMultiple ? activities[0] : ""}</span>
              </p>
            </div>
          </div>

          <form class="submission-form" data-activity={!isMultiple ? activities[0] : ""}>
            <div class="input-group">
              <label for="ra">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                RA do Aluno (7 dígitos)
              </label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="ra"
                  name="ra"
                  placeholder="Ex: 1234567"
                  required
                  pattern="[0-9]{7}"
                  maxlength="7"
                  title="O RA deve conter exatamente 7 dígitos numéricos"
                  autocomplete="off"
                />
                <div class="ra-validation-status"></div>
              </div>
              <input type="hidden" id="nome_aluno" name="nome_aluno" value="" />
              <div class="student-name-display" style="display:none;">
                <label>
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Aluno Confirmado
                </label>
                <div class="input-wrapper">
                  <span class="confirmed-name"></span>
                </div>
              </div>
            </div>

            <div class="input-group">
              <label for="github">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                Link do Projeto (GitHub)
              </label>
              <div class="input-wrapper">
                <input
                  type="url"
                  id="github"
                  name="github"
                  placeholder="https://github.com/usuario/projeto"
                  title="Insira o link da página do repositório no GitHub (não use o link .git)"
                />
              </div>
            </div>

            <div class="input-group">
              <label>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Ou Enviar Arquivo ZIP
              </label>
              <div class="file-drop-zone" id="dropzone">
                <input type="file" id="zipfile" name="zipfile" accept=".zip,.rar,.7z" />
                <div class="drop-zone-content">
                  <div class="drop-icon-container">
                    <svg
                      viewBox="0 0 24 24"
                      width="32"
                      height="32"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </div>
                  <span class="drop-text">Clique ou arraste o arquivo</span>
                  <div class="file-info-container">
                    <span class="file-name-display">Nenhum arquivo selecionado</span>
                    <button type="button" class="clear-file-btn" title="Remover arquivo">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <small>Formatos: .zip, .rar, .7z (Máx. 10MB)</small>
                </div>
              </div>
            </div>

            <div class="input-group">
              <label for="mensagem">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Mensagem (Opcional)
              </label>
              <div class="input-wrapper">
                <textarea
                  id="mensagem"
                  name="mensagem"
                  placeholder="Alguma observação sobre sua entrega?"
                ></textarea>
              </div>
            </div>

            <div class="status-message"></div>
            <div class="receipt-container"></div>

            <button type="submit" class="submit-btn">
              <span>Confirmar Entrega</span>
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                stroke="currentColor"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

SubmissionForm.css = `
.submission-container {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  perspective: 1000px;
  width: 100%;
}

.submission-card {
  width: 100%;
  max-width: 500px;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  text-align: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.submission-card * {
  box-sizing: border-box;
}

.submission-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--secondary), #a855f7);
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--lightgray);
  width: 100%;
}

.submission-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrapper {
  background: rgba(var(--secondary-rgb), 0.1);
  padding: 10px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary);
}

.icon-wrapper svg {
  width: 24px;
  height: 24px;
}

.rocket-icon {
  animation: rocket-float 3s ease-in-out infinite;
}

@keyframes rocket-float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-3px) rotate(5deg); }
}

.card-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--dark);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.card-header .subtitle {
  margin: 2px 0 0 0;
  color: var(--gray);
  font-size: 0.85rem;
}

.highlight-activity {
  color: var(--secondary);
  font-weight: 700;
  background: rgba(var(--secondary-rgb), 0.05);
  padding: 1px 6px;
  border-radius: 4px;
}

/* Selection Screen */
.selection-screen {
  animation: fadeIn 0.4s ease;
}

.hidden {
  display: none !important;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 1rem;
}

.select-activity-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  background: var(--light);
  border: 2px solid var(--lightgray);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.select-activity-btn:hover {
  border-color: var(--secondary);
  background: rgba(var(--secondary-rgb), 0.02);
  transform: translateX(5px);
}

.select-activity-btn .act-name {
  font-weight: 600;
  color: var(--dark);
  font-size: 0.95rem;
}

.select-activity-btn svg {
  color: var(--secondary);
  transition: transform 0.3s ease;
}

.select-activity-btn:hover svg {
  transform: translateX(3px);
}

/* Back Button */
.back-to-selection {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(var(--secondary-rgb), 0.05);
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--secondary);
  transition: all 0.2s ease;
}

.back-to-selection:hover {
  background: var(--secondary);
  color: #fff;
  transform: scale(1.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.input-group {
  margin-bottom: 1.2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: var(--gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-group input[type="text"],
.input-group input[type="url"],
.input-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.8rem 1.1rem;
  border: 2px solid var(--lightgray);
  border-radius: 12px;
  font-family: var(--bodyFont);
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--light);
  color: var(--dark);
  text-align: center;
}

.input-group input::placeholder,
.input-group textarea::placeholder {
  text-align: center;
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: var(--secondary);
  box-shadow: 0 0 0 4px rgba(var(--secondary-rgb), 0.1);
  transform: translateY(-1px);
}

/* Drop Zone Compact */
.file-drop-zone {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100px;
  border: 2px dashed var(--lightgray);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  background: rgba(var(--secondary-rgb), 0.01);
  cursor: pointer;
}

.file-drop-zone:hover {
  border-color: var(--secondary);
  background: rgba(var(--secondary-rgb), 0.04);
}

.file-drop-zone.drag-over {
  border-color: var(--secondary);
  background: rgba(var(--secondary-rgb), 0.08);
}

.file-drop-zone input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  pointer-events: none;
  gap: 5px;
}

.drop-icon-container {
  color: var(--gray);
  transition: all 0.3s ease;
}

.drop-icon-container svg {
  width: 24px;
  height: 24px;
}

.drop-text {
  font-weight: 700;
  color: var(--dark);
  font-size: 0.95rem;
}

.file-info-container {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 90%;
}

.file-name-display {
  font-size: 0.85rem;
  color: var(--secondary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clear-file-btn {
  background: rgba(248, 81, 73, 0.1);
  color: #f85149;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: none; /* Hidden by default */
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  pointer-events: auto; /* Ensure button is clickable even if parent has pointer-events: none */
}

.clear-file-btn:hover {
  background: #f85149;
  color: #fff;
  transform: scale(1.1);
}

.drop-zone-content small {
  font-size: 0.75rem;
  opacity: 0.7;
}

.input-group textarea {
  height: 100px;
}

/* Botão Compacto */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--secondary) 0%, #a855f7 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 25px rgba(var(--secondary-rgb), 0.2);
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(var(--secondary-rgb), 0.3);
}

.submit-btn:disabled {
  background: var(--lightgray);
  color: var(--gray);
  box-shadow: none;
  transform: none;
}

.status-message {
  padding: 1rem;
  border-radius: 14px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  display: none;
  text-align: center;
  font-weight: 600;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.download-receipt-btn {
  width: 100%;
  padding: 0.9rem;
  background: transparent;
  color: var(--secondary);
  border: 2px solid var(--secondary);
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem;
}

/* RA Validation Status */
.ra-validation-status {
  font-size: 0.8rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  transition: all 0.3s ease;
}

.ra-validation-status.loading {
  color: var(--gray);
}

.ra-validation-status.valid {
  color: #22c55e;
}

.ra-validation-status.invalid {
  color: #ef4444;
}

.ra-validation-status.checking {
  color: var(--gray);
}

/* Student Name Display (confirmação automática) */
.student-name-display {
  margin-top: 1rem;
  animation: fadeIn 0.4s ease;
  width: 100%;
}

.student-name-display label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: var(--gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.student-name-display .input-wrapper {
  width: 100%;
  padding: 0.8rem 1.1rem;
  border: 2px solid #22c55e;
  border-radius: 12px;
  background: rgba(34, 197, 94, 0.05);
  text-align: center;
  box-sizing: border-box;
}

.confirmed-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #22c55e;
}

/* Deadline Info */
.deadline-info {
  font-size: 0.8rem;
  margin-top: 4px;
  color: var(--gray);
  text-align: center;
  transition: all 0.3s ease;
}

.deadline-info.on-time {
  color: #22c55e;
}

.deadline-info.late {
  color: #ef4444;
}
`

SubmissionForm.afterDOMLoaded = submissionScript

export default (() => SubmissionForm) satisfies QuartzComponentConstructor
