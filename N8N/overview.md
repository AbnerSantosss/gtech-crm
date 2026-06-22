---
type: overview
tags: [n8n, infraestrutura, visao-geral]
created: 2026-06-21
updated: 2026-06-22
---

# 🏗️ Visão Geral do Ecossistema n8n

## Infraestrutura

| Item | Valor |
|------|-------|
| **Instância** | `https://n8n.proxserverabner.site` |
| **Tipo** | Externa (self-hosted) |
| **Identificador** | `inst_beb08f0f59` |
| **Projeto ativo** | Personal |
| **Ambiente n8nac** | `02` |
| **Diretório de workflows** | `workflows/02/` |
| **Sincronização de pastas** | Ativada |

## Workflows Ativos

| Workflow | ID | Status | Integrações |
|----------|----|--------|-------------|
| [[Funil Completo - Disparo META]] | `UiEzJf4m82eSvDQO` | ✅ Ativo | [[Meta (Facebook)]] |

## Integrações em Uso

- [[Meta (Facebook)]] — Conversions API para rastreamento de eventos offline do funil de vendas
- [[Dashboard CRM GTech]] — Painel Kanban em React/Next.js que recebe leads em tempo real via n8n

## Padrões Identificados

- [[Webhook Multi-Etapa]] — Usado no workflow de funil para receber eventos de 5 etapas distintas

## Conceitos-Chave

- [[Meta Conversions API]] — Mecanismo de envio de conversões server-side
- [[Funil de Vendas]] — Modelo de etapas comerciais mapeado para eventos Meta
- [[Hashing PII SHA-256]] — Conformidade de privacidade no envio de dados pessoais

## Notas de Segurança

> [!WARNING]
> O token de acesso da Meta está exposto diretamente na URL do nó HTTP Request do workflow [[Funil Completo - Disparo META]]. Recomenda-se migrar para uma **credencial gerenciada** no n8n para evitar exposição em código e logs.

> [!NOTE]
> O evento **Lead** é disparado apenas pelo Pixel do navegador. Os demais eventos do funil são enviados pelo CRM via webhook, com os nomes `CRM_Qualificacao`, `CRM_Aquecimento`, `CRM_Reuniao`, `CRM_Contrato` e `Purchase` (evento padrão de compra).
