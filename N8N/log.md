---
type: log
updated: 2026-06-21
---

# 📝 Log da Wiki

Registro cronológico de todas as operações realizadas na wiki. Append-only.

---

## [2026-06-21] ingest | Funil Completo - Disparo META

- **Fonte:** `workflows/02/Funil Completo - Disparo META.workflow.ts`
- **Workflow ID:** `UiEzJf4m82eSvDQO`
- **Páginas criadas:** 8
  - `overview.md` — Visão geral do ecossistema
  - `workflows/Funil Completo - Disparo META.md` — Página do workflow
  - `conceitos/Meta Conversions API.md` — Conceito CAPI
  - `conceitos/Funil de Vendas.md` — Conceito funil de vendas
  - `conceitos/Hashing PII SHA-256.md` — Conceito hashing PII
  - `integracoes/Meta (Facebook).md` — Integração Meta
  - `padroes/Webhook Multi-Etapa.md` — Padrão arquitetural
  - `log.md` — Este registro
- **Páginas atualizadas:** `index.md`
- **Observações:** Primeira ingestão da wiki. Token de acesso da Meta encontrado exposto diretamente na URL do nó HTTP Request — sinalizado como risco de segurança na página do workflow.

## [2026-06-21] init | Estrutura base da wiki

- **Ação:** Criação da estrutura de pastas e arquivos base
- **Schema:** Seção `LLM Wiki — Schema` adicionada ao `AGENTS.md`
- **Estrutura:** `index.md`, `log.md`, `overview.md`, pastas `workflows/`, `conceitos/`, `integracoes/`, `padroes/`

## [2026-06-21] update | CRM Prefix + Remoção Lead

- **Fonte:** `workflows/02/Funil Completo - Disparo META.workflow.ts`
- **Workflow ID:** `UiEzJf4m82eSvDQO`
- **Alterações no workflow:**
  - Removido: Webhook + Processamento de **Oportunidade/Lead** (evento Lead agora é disparado apenas pelo Pixel do navegador)
  - Renomeados todos os eventos com prefixo `CRM_`: `CRM_CompleteRegistration`, `CRM_ViewContent`, `CRM_Schedule`, `CRM_SubmitApplication`, `CRM_Purchase`
  - Workflow reduzido de 13 para 11 nós, de 12 para 10 conexões
- **Push:** Workflow atualizado e verificado no n8n (✅ 0 problemas)
- **Frontend:** Formulário CRM atualizado em `frontend/index.html` — removida etapa Oportunidade, prefixo CRM_ em todos os eventos
- **Páginas atualizadas:** 6
  - `workflows/Funil Completo - Disparo META.md`
  - `conceitos/Funil de Vendas.md`
  - `conceitos/Meta Conversions API.md`
  - `integracoes/Meta (Facebook).md`
  - `padroes/Webhook Multi-Etapa.md`
  - `overview.md`

## [2026-06-21] update | event_source_url + Firing Tests

- **Fonte:** `workflows/02/Funil Completo - Disparo META.workflow.ts`
- **Workflow ID:** `UiEzJf4m82eSvDQO`
- **Alterações no workflow:**
  - Adicionado o parâmetro `event_source_url: 'https://n8n.proxserverabner.site'` no payload de todos os 5 nós de processamento Code. Isso soluciona o bloqueio de eventos pelo Meta sob o domínio genérico/inválido (`invalid.invalid`).
- **Testes de Disparo:**
  - Realizado o disparo automatizado de todos os 5 eventos do pipeline (`CRM_Qualificacao`, `CRM_Aquecimento`, `CRM_Reuniao`, `CRM_Contrato`, `Purchase`) através do formulário front-end.
  - Todas as chamadas retornaram 200 OK com confirmação de recebimento da API da Meta (`events_received: 1`) e identificadores de rastreamento (`fbtrace_id`).
- **Páginas atualizadas:**
  - `workflows/Funil Completo - Disparo META.md`
  - `conceitos/Meta Conversions API.md`
  - `log.md` (este registro)

## [2026-06-21] test | 5 Rodadas de Disparos em Lote (25 eventos)

- **Fonte:** `frontend/index.html` via browser subagent
- **Testes de Disparo:**
  - Realizados 25 disparos automatizados (5 rodadas de 5 etapas do funil) usando dados aleatórios gerados de forma programática.
  - Todos os 25 disparos de webhooks CRM responderam com status `200 OK` e retornaram identificadores de rastreamento válidos (`fbtrace_id`) provenientes da API Conversões da Meta.
- **Páginas atualizadas:**
  - `log.md` (este registro)

## [2026-06-21] update | Event Quality Match Score Improvements

- **Fonte:** `workflows/02/Funil Completo - Disparo META.workflow.ts` e `frontend/index.html`
- **Workflow ID:** `UiEzJf4m82eSvDQO`
- **Melhorias para Qualidade do Evento (Nota 0/10):**
  - **Captura de Nome Completo:** Adicionado campo "Nome Completo" no front-end. O fluxo n8n agora divide e hashea separadamente `fn` (First Name) e `ln` (Last Name).
  - **Dados de Sessão (IP & User Agent):** O fluxo n8n agora extrai `userAgent` (`client_user_agent`) e `clientIp` (`client_ip_address`) a partir dos cabeçalhos da requisição HTTP do webhook. Como os eventos são do tipo `website`, estes dados de dispositivo e conexão são obrigatórios para a Meta realizar o match.
  - **Formatação de Telefone (E.164):** Inserida lógica no n8n para identificar números brasileiros (com 10 ou 11 dígitos limpos) e prefixar automaticamente com o DDI `55` se ausente, garantindo a formatação adequada para a Meta API.
  - **External ID:** Mapeado o ID do lead como `external_id` hasheado dentro do objeto `user_data`.
- **Testes de Disparo (Rich Match Keys):**
  - Efetuado 1 ciclo completo de teste do funil (5 etapas) usando nomes realistas e todos os parâmetros de match habilitados. Todos retornaram `200 OK` e obtiveram IDs de rastreamento válidos.
- **Páginas atualizadas:**
  - `workflows/Funil Completo - Disparo META.md`
  - `conceitos/Meta Conversions API.md`
  - `log.md` (este registro)

## [2026-06-22] create | Dashboard CRM GTech (React/Next.js)

- **Fonte:** `crm-dashboard/` (novo projeto Next.js)
- **Ação:** Criação de Dashboard CRM ultramoderno em React (Next.js) com painel Kanban
- **Componentes criados:**
  - `crm-dashboard/src/app/page.tsx` — Página principal com Kanban e formulário
  - `crm-dashboard/src/app/globals.css` — CSS ultramoderno (Glassmorphism, dark mode)
  - `crm-dashboard/src/app/api/webhook/route.ts` — API para recebimento de leads do n8n
  - `crm-dashboard/Dockerfile` — Build multi-stage para deploy Docker
  - `crm-dashboard/docker-compose.yml` — Configuração para Portainer
  - `crm-dashboard/public/logo.png` — Logo GTech gerada por IA
- **Alterações no workflow n8n:**
  - Adicionado nó `EnviarParaDashboard` (HTTP Request) que envia dados brutos dos leads para `http://crm-dashboard:3000/api/webhook`
  - Todos os 5 webhooks agora disparam simultaneamente para o Dashboard e para o fluxo de processamento/Meta
  - Workflow atualizado de 11 para 12 nós
  - Push realizado com sucesso no n8n remoto (✅ 200 OK)
- **Páginas criadas:** 1
  - `conceitos/Dashboard CRM GTech.md`
- **Páginas atualizadas:** 4
  - `workflows/Funil Completo - Disparo META.md`
  - `overview.md`
  - `index.md`
  - `log.md` (este registro)

## [2026-06-22] update | Redesign UI/UX Pro Max + Regra Frontend

- **Fonte:** `crm-dashboard/src/app/page.tsx`, `crm-dashboard/src/app/globals.css`
- **Ação:** Redesign completo do Dashboard CRM usando a skill **UI/UX Pro Max**
- **Design System Aplicado:**
  - **Estilo:** Dark Mode OLED (`#020617` bg, `#0F172A` cards, `#22C55E` CTA)
  - **Tipografia:** Fira Sans (headings) + Fira Code (dados/monospace)
  - **Ícones:** Todos os emojis substituídos por SVG Lucide inline
  - **Navbar:** Floating com `backdrop-filter: blur(20px)`
  - **Acessibilidade:** `prefers-reduced-motion` respeitado, contrastes WCAG AAA
- **Reestruturação da Interface:**
  - Tela principal: Dashboard Kanban (apenas visualização de leads)
  - Painel Admin (drawer lateral): **Seção 1 (Webhooks n8n)** com URLs copiáveis + **Seção 2 (Disparo de Teste)**
  - URL base do webhook configurável pelo admin (salva em `localStorage`)
- **Regra criada no AGENTS.md:** Seção `🎨 Regra de Frontend — UI/UX Pro Max`
- **Skill instalada:** `uipro-cli` → `.agent/skills/ui-ux-pro-max/`
- **Páginas atualizadas:**
  - `conceitos/Dashboard CRM GTech.md`
  - `log.md` (este registro)
