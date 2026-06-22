---
type: conceito
tags: [meta, facebook, capi, conversoes, server-side]
created: 2026-06-21
updated: 2026-06-21
sources:
  - "[[Funil Completo - Disparo META]]"
---

# Meta Conversions API

A Conversions API (CAPI) é a interface server-side do [[Meta (Facebook)]] para envio de eventos de conversão. Diferentemente do Meta Pixel (que roda no navegador do usuário), a CAPI permite que eventos sejam enviados diretamente do servidor, tornando o rastreamento mais confiável e independente de bloqueadores de anúncios ou restrições de cookies.

## Por que usar a CAPI?

- **Confiabilidade:** Eventos server-side não são bloqueados por ad blockers
- **Conversões offline:** Eventos que acontecem fora do navegador (ligações, reuniões, contratos) podem ser reportados
- **Deduplicação:** O campo `event_id` permite que a Meta ignore eventos duplicados quando CAPI e Pixel reportam o mesmo evento
- **Otimização de campanhas:** O algoritmo do Meta Ads recebe sinais mais completos sobre a qualidade dos leads

## Estrutura do Payload

O endpoint espera um array `data[]` onde cada item é um evento:

```json
{
  "data": [
    {
      "event_name": "Lead",
      "event_time": 1718971200,
      "event_id": "uuid-unico",
      "action_source": "website",
      "event_source_url": "https://n8n.proxserverabner.site",
      "user_data": {
        "em": ["sha256-do-email"],
        "ph": ["sha256-do-telefone"],
        "fn": ["sha256-do-primeiro-nome"],
        "ln": ["sha256-do-sobrenome"],
        "external_id": ["sha256-do-lead-id"],
        "client_ip_address": "189.120.34.5",
        "client_user_agent": "Mozilla/5.0..."
      },
      "custom_data": {
        "currency": "BRL",
        "value": 1500.00
      }
    }
  ]
}
```

### Campos Obrigatórios

| Campo | Descrição |
|-------|-----------|
| `event_name` | Nome do evento padrão (Lead, Purchase, etc.) |
| `event_time` | Timestamp Unix em segundos |
| `action_source` | Origem da ação (`website`, `app`, `phone_call`, etc.) |
| `user_data` | Dados do usuário hasheados (ver [[Hashing PII SHA-256]]) |

### Campos Recomendados

| Campo | Descrição |
|-------|-----------|
| `event_id` | ID único para deduplicação com o Pixel |
| `event_source_url` | URL de origem do evento (crucial para evitar bloqueio por domínio `invalid.invalid` no Meta Ads) |
| `user_data.client_ip_address` | Endereço IP do dispositivo do lead (crucial para atribuição server-side em eventos `website`) |
| `user_data.client_user_agent` | User Agent do navegador do lead (crucial para atribuição server-side em eventos `website`) |
| `user_data.fn` e `user_data.ln` | Primeiro Nome e Sobrenome hasheados (eleva significativamente a nota de match) |
| `user_data.external_id` | ID único do lead hasheado (para consolidação no CRM) |
| `custom_data.value` | Valor monetário do evento |
| `custom_data.currency` | Moeda (ISO 4217) |

## Endpoint

```
POST https://graph.facebook.com/v{VERSION}/{PIXEL_ID}/events?access_token={TOKEN}
```

## Eventos Padrão Utilizados

No projeto atual, os seguintes eventos são usados (ver [[Funil de Vendas]]):

| Evento Meta | Etapa do Funil | Origem | Significado |
|-------------|----------------|--------|-------------|
| `Lead` | Oportunidade | 🌐 Pixel | Primeiro contato qualificado (navegador) |
| `CRM_Qualificacao` | Qualificação | 🖥️ CRM | Lead qualificado pelo CRM |
| `CRM_Aquecimento` | Aquecimento | 🖥️ CRM | Lead demonstrou interesse ativo |
| `CRM_Reuniao` | Reunião/Proposta | 🖥️ CRM | Reunião ou proposta agendada |
| `CRM_Contrato` | Contrato/Aceite | 🖥️ CRM | Contrato enviado ou aceito |
| `Purchase` | Fechado | 🖥️ CRM | Venda concluída |

> [!NOTE]
> Os eventos do CRM são prefixados com `CRM_` para diferenciá-los dos eventos do Pixel no Meta Events Manager. O evento `Lead` é disparado apenas pelo Pixel do navegador.

## Páginas Relacionadas

- [[Funil Completo - Disparo META]] — Workflow que implementa a integração
- [[Meta (Facebook)]] — Serviço externo
- [[Hashing PII SHA-256]] — Padrão de hash exigido pela CAPI
- [[Funil de Vendas]] — Mapeamento de etapas para eventos
