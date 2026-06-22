---
type: conceito
tags: [dashboard, react, nextjs, kanban, crm, docker, ui-ux-pro-max]
created: 2026-06-22
updated: 2026-06-22
sources:
  - "crm-dashboard/"
---

# Dashboard CRM GTech

Aplicação web ultramoderna construída em **React (Next.js)** que serve como painel de controle visual para o funil de vendas da GTech. O dashboard recebe dados em tempo real do [[Funil Completo - Disparo META|workflow n8n]] e exibe os leads em um **quadro Kanban** organizado por etapas do funil.

## Arquitetura

```mermaid
graph TD
    USER["Usuário / CRM"] -->|"POST JSON"| DASH["Dashboard CRM<br/>(Next.js)"]
    DASH -->|"Webhook POST"| N8N["n8n<br/>(Funil Completo)"]
    N8N -->|"POST /api/webhook"| DASH
    N8N -->|"POST CAPI"| META["Meta Conversions API"]

    style DASH fill:#a855f7,color:#fff
    style N8N fill:#ff6d5a,color:#fff
    style META fill:#1877F2,color:#fff
```

## Funcionalidades

- **Painel Kanban** com 5 colunas: Qualificação, Aquecimento, Reunião, Contrato, Fechado
- **Atualização em tempo real** (polling a cada 5 segundos via `/api/webhook` GET)
- **Logo GTech** gerada por IA

### Painel Admin (Drawer lateral via ícone ⚙️)

- **Seção 1 — Webhooks n8n:** Lista todas as 5 URLs completas de webhook com botão de cópia individual. A URL base do n8n é configurável pelo admin (salva em `localStorage`).
- **Seção 2 — Disparo de Teste:** Formulário para simular leads de teste diretamente para o n8n.

## Design System (UI/UX Pro Max)

| Propriedade | Valor |
|-------------|-------|
| **Estilo** | Dark Mode OLED |
| **Background** | `#020617` |
| **Cards** | `#0F172A` |
| **CTA** | `#22C55E` |
| **Tipografia** | Fira Sans (headings) + Fira Code (dados) |
| **Ícones** | SVG Lucide (sem emojis) |
| **Navbar** | Floating, `backdrop-filter: blur(20px)` |
| **Acessibilidade** | WCAG AAA, `prefers-reduced-motion` |
| **Transições** | 150–350ms cubic-bezier |

## Stack Tecnológica

| Tecnologia | Uso |
|------------|-----|
| **Next.js** (React) | Framework web com App Router |
| **CSS Puro** | Design system UI/UX Pro Max (Dark Mode OLED) |
| **Lucide Icons** | Ícones SVG inline (substituem emojis) |
| **Docker** | Containerização para deploy no Portainer |
| **Node.js API Routes** | Backend para recebimento de webhooks |

## API Route `/api/webhook`

| Método | Descrição |
|--------|-----------|
| `POST` | Recebe dados de um lead e salva no `data.json` local |
| `GET` | Retorna todos os leads armazenados |

### Payload esperado (POST)

```json
{
  "nome": "João da Silva",
  "email": "joao@exemplo.com",
  "telefone": "(11) 99999-9999",
  "valor": 5000,
  "stage": "CRM_Qualificacao"
}
```

## Deploy e Exposição Pública

O projeto está implantado no **Portainer** usando o repositório Git como fonte:

- **Dockerfile:** Build multi-stage otimizado (standalone output do Next.js).
- **docker-compose.yml:** Serviço `crm-dashboard` conectado à rede Docker compartilhada `n8n-server_default`.
- **Mapeamento de Portas:** `3001:3000` (porta 3001 exposta no host, 3000 interna).
- **Nome do Container:** `gtech-crm-dashboard`
- **Persistência:** Volume `crm_data` montado em `/app/data` (salva o banco de leads `data.json`).
- **Túnel Cloudflare (Cloudflare Tunnel):** Exposto publicamente de forma segura através da rota:
  - **URL Pública:** `https://crm.proxserverabner.site` -> aponta para o IP local `http://192.168.3.16:3001`.

> [!IMPORTANT]
> O nó "Enviar para Dashboard" no n8n está configurado para entregar os dados usando a URL interna da rede Docker: `http://gtech-crm-dashboard:3000/api/webhook`. Isso evita latência externa e protege o tráfego dos leads.

## Páginas Relacionadas

- [[Funil Completo - Disparo META]] — Workflow n8n que alimenta o Dashboard
- [[Funil de Vendas]] — Modelo de etapas do funil
- [[Meta (Facebook)]] — Integração final dos eventos
