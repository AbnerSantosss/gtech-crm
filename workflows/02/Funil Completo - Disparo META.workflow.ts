import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Funil Completo - Disparo META
// Nodes   : 12  |  Connections: 15
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WebhookQualificacao                webhook
// WebhookAquecimento                 webhook
// WebhookReuniaoProposta             webhook
// WebhookContratoAceite              webhook
// WebhookFechado                     webhook
// ProcessarQualificacao              code
// ProcessarAquecimento               code
// ProcessarReuniao                   code
// ProcessarContrato                  code
// ProcessarFechado                   code
// EnviarParaMetaApi                  httpRequest                [onError→regular]
// EnviarParaDashboard                httpRequest
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WebhookQualificacao
//    → ProcessarQualificacao
//      → EnviarParaMetaApi
//    → EnviarParaDashboard
// WebhookAquecimento
//    → ProcessarAquecimento
//      → EnviarParaMetaApi (↩ loop)
//    → EnviarParaDashboard (↩ loop)
// WebhookReuniaoProposta
//    → ProcessarReuniao
//      → EnviarParaMetaApi (↩ loop)
//    → EnviarParaDashboard (↩ loop)
// WebhookContratoAceite
//    → ProcessarContrato
//      → EnviarParaMetaApi (↩ loop)
//    → EnviarParaDashboard (↩ loop)
// WebhookFechado
//    → ProcessarFechado
//      → EnviarParaMetaApi (↩ loop)
//    → EnviarParaDashboard (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'UiEzJf4m82eSvDQO',
    name: 'Funil Completo - Disparo META',
    active: true,
    isArchived: false,
    settings: {
        saveExecutionProgress: true,
        saveManualExecutions: true,
        saveDataErrorExecution: 'all',
        saveDataSuccessExecution: 'all',
        executionTimeout: 3600,
        timezone: 'UTC',
        executionOrder: 'v1',
        binaryMode: 'separate',
    },
})
export class FunilCompletoDisparoMetaWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'wh-qualificacao',
        webhookId: '2e87b7d6-81b3-4a57-8492-b4fa6ee255c2',
        name: 'Webhook QUALIFICACAO',
        type: 'n8n-nodes-base.webhook',
        version: 1,
        position: [80, -400],
    })
    WebhookQualificacao = {
        httpMethod: 'POST',
        path: 'api/webhooks/gtech/leads/qualificacao',
        responseMode: 'lastNode',
        options: {},
    };

    @node({
        id: 'wh-aquecimento',
        webhookId: '596b5ade-46e0-4c85-9e6e-473a0d925e98',
        name: 'Webhook AQUECIMENTO',
        type: 'n8n-nodes-base.webhook',
        version: 1,
        position: [80, -208],
    })
    WebhookAquecimento = {
        httpMethod: 'POST',
        path: 'api/webhooks/gtech/leads/aquecimento',
        responseMode: 'lastNode',
        options: {},
    };

    @node({
        id: 'wh-reuniao',
        webhookId: 'e7fd4718-f9ad-4700-8aeb-f290267b0dcb',
        name: 'Webhook REUNIAO PROPOSTA',
        type: 'n8n-nodes-base.webhook',
        version: 1,
        position: [80, 0],
    })
    WebhookReuniaoProposta = {
        httpMethod: 'POST',
        path: 'api/webhooks/gtech/leads/reuniao_proposta',
        responseMode: 'lastNode',
        options: {},
    };

    @node({
        id: 'wh-contrato',
        webhookId: '2e00e3b7-c30b-46e7-b8d1-29a39114fe7b',
        name: 'Webhook CONTRATO ACEITE',
        type: 'n8n-nodes-base.webhook',
        version: 1,
        position: [80, 208],
    })
    WebhookContratoAceite = {
        httpMethod: 'POST',
        path: 'api/webhooks/gtech/leads/contrato_aceite',
        responseMode: 'lastNode',
        options: {},
    };

    @node({
        id: 'wh-fechado',
        webhookId: '3450b0c3-3e45-432e-bfe0-4c2d6d2a08a8',
        name: 'Webhook FECHADO',
        type: 'n8n-nodes-base.webhook',
        version: 1,
        position: [80, 400],
    })
    WebhookFechado = {
        httpMethod: 'POST',
        path: 'api/webhooks/gtech/leads/fechado',
        responseMode: 'lastNode',
        options: {},
    };

    @node({
        id: 'code-qualificacao',
        name: 'Processar QUALIFICACAO',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [352, -400],
    })
    ProcessarQualificacao = {
        jsCode: `const crypto = require('crypto');
const inputItem = $input.first().json;
const body = inputItem.body || inputItem;
const headers = inputItem.headers || {};
const userAgent = headers['user-agent'] || '';
const clientIp = (headers['x-forwarded-for'] || headers['x-real-ip'] || '').split(',')[0].trim();
const emailBruto = body.email ? String(body.email) : '';
const telefoneBruto = (body.telefone || body.phone) ? String(body.telefone || body.phone) : '';
const nomeBruto = body.nome ? String(body.nome) : '';
const leadId = body.id || body.lead_id || '';
const emailLimpo = emailBruto.trim().toLowerCase();
const hashEmail = emailLimpo ? crypto.createHash('sha256').update(emailLimpo).digest('hex') : null;
let telefoneLimpo = telefoneBruto.replace(/\\D/g, '');
if (telefoneLimpo) {
  if (telefoneLimpo.length === 10 || telefoneLimpo.length === 11) {
    if (!telefoneLimpo.startsWith('55')) {
      telefoneLimpo = '55' + telefoneLimpo;
    }
  }
}
const hashPhone = telefoneLimpo ? crypto.createHash('sha256').update(telefoneLimpo).digest('hex') : null;
let hashFirstName = null;
let hashLastName = null;
if (nomeBruto) {
  const partesNome = nomeBruto.trim().toLowerCase().split(/\\s+/);
  const firstName = partesNome[0] || '';
  const lastName = partesNome.slice(1).join(' ') || '';
  if (firstName) hashFirstName = crypto.createHash('sha256').update(firstName).digest('hex');
  if (lastName) hashLastName = crypto.createHash('sha256').update(lastName).digest('hex');
}
const hashExternalId = leadId ? crypto.createHash('sha256').update(String(leadId)).digest('hex') : null;
const userData = {};
if (hashEmail) userData.em = [hashEmail];
if (hashPhone) userData.ph = [hashPhone];
if (hashFirstName) userData.fn = [hashFirstName];
if (hashLastName) userData.ln = [hashLastName];
if (hashExternalId) userData.external_id = [hashExternalId];
if (clientIp) userData.client_ip_address = clientIp;
if (userAgent) userData.client_user_agent = userAgent;
return [{ json: { data: [{ event_name: 'CRM_Qualificacao', event_time: Math.floor(Date.now()/1000), event_id: leadId || crypto.randomUUID(), action_source: 'website', event_source_url: 'https://n8n.proxserverabner.site', user_data: userData, custom_data: { currency: 'BRL', value: Number(body.valor || body.value || 0) } }] } }];`,
    };

    @node({
        id: 'code-aquecimento',
        name: 'Processar AQUECIMENTO',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [352, -208],
    })
    ProcessarAquecimento = {
        jsCode: `const crypto = require('crypto');
const inputItem = $input.first().json;
const body = inputItem.body || inputItem;
const headers = inputItem.headers || {};
const userAgent = headers['user-agent'] || '';
const clientIp = (headers['x-forwarded-for'] || headers['x-real-ip'] || '').split(',')[0].trim();
const emailBruto = body.email ? String(body.email) : '';
const telefoneBruto = (body.telefone || body.phone) ? String(body.telefone || body.phone) : '';
const nomeBruto = body.nome ? String(body.nome) : '';
const leadId = body.id || body.lead_id || '';
const emailLimpo = emailBruto.trim().toLowerCase();
const hashEmail = emailLimpo ? crypto.createHash('sha256').update(emailLimpo).digest('hex') : null;
let telefoneLimpo = telefoneBruto.replace(/\\D/g, '');
if (telefoneLimpo) {
  if (telefoneLimpo.length === 10 || telefoneLimpo.length === 11) {
    if (!telefoneLimpo.startsWith('55')) {
      telefoneLimpo = '55' + telefoneLimpo;
    }
  }
}
const hashPhone = telefoneLimpo ? crypto.createHash('sha256').update(telefoneLimpo).digest('hex') : null;
let hashFirstName = null;
let hashLastName = null;
if (nomeBruto) {
  const partesNome = nomeBruto.trim().toLowerCase().split(/\\s+/);
  const firstName = partesNome[0] || '';
  const lastName = partesNome.slice(1).join(' ') || '';
  if (firstName) hashFirstName = crypto.createHash('sha256').update(firstName).digest('hex');
  if (lastName) hashLastName = crypto.createHash('sha256').update(lastName).digest('hex');
}
const hashExternalId = leadId ? crypto.createHash('sha256').update(String(leadId)).digest('hex') : null;
const userData = {};
if (hashEmail) userData.em = [hashEmail];
if (hashPhone) userData.ph = [hashPhone];
if (hashFirstName) userData.fn = [hashFirstName];
if (hashLastName) userData.ln = [hashLastName];
if (hashExternalId) userData.external_id = [hashExternalId];
if (clientIp) userData.client_ip_address = clientIp;
if (userAgent) userData.client_user_agent = userAgent;
return [{ json: { data: [{ event_name: 'CRM_Aquecimento', event_time: Math.floor(Date.now()/1000), event_id: leadId || crypto.randomUUID(), action_source: 'website', event_source_url: 'https://n8n.proxserverabner.site', user_data: userData, custom_data: { currency: 'BRL', value: Number(body.valor || body.value || 0) } }] } }];`,
    };

    @node({
        id: 'code-reuniao',
        name: 'Processar REUNIAO',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [352, 0],
    })
    ProcessarReuniao = {
        jsCode: `const crypto = require('crypto');
const inputItem = $input.first().json;
const body = inputItem.body || inputItem;
const headers = inputItem.headers || {};
const userAgent = headers['user-agent'] || '';
const clientIp = (headers['x-forwarded-for'] || headers['x-real-ip'] || '').split(',')[0].trim();
const emailBruto = body.email ? String(body.email) : '';
const telefoneBruto = (body.telefone || body.phone) ? String(body.telefone || body.phone) : '';
const nomeBruto = body.nome ? String(body.nome) : '';
const leadId = body.id || body.lead_id || '';
const emailLimpo = emailBruto.trim().toLowerCase();
const hashEmail = emailLimpo ? crypto.createHash('sha256').update(emailLimpo).digest('hex') : null;
let telefoneLimpo = telefoneBruto.replace(/\\D/g, '');
if (telefoneLimpo) {
  if (telefoneLimpo.length === 10 || telefoneLimpo.length === 11) {
    if (!telefoneLimpo.startsWith('55')) {
      telefoneLimpo = '55' + telefoneLimpo;
    }
  }
}
const hashPhone = telefoneLimpo ? crypto.createHash('sha256').update(telefoneLimpo).digest('hex') : null;
let hashFirstName = null;
let hashLastName = null;
if (nomeBruto) {
  const partesNome = nomeBruto.trim().toLowerCase().split(/\\s+/);
  const firstName = partesNome[0] || '';
  const lastName = partesNome.slice(1).join(' ') || '';
  if (firstName) hashFirstName = crypto.createHash('sha256').update(firstName).digest('hex');
  if (lastName) hashLastName = crypto.createHash('sha256').update(lastName).digest('hex');
}
const hashExternalId = leadId ? crypto.createHash('sha256').update(String(leadId)).digest('hex') : null;
const userData = {};
if (hashEmail) userData.em = [hashEmail];
if (hashPhone) userData.ph = [hashPhone];
if (hashFirstName) userData.fn = [hashFirstName];
if (hashLastName) userData.ln = [hashLastName];
if (hashExternalId) userData.external_id = [hashExternalId];
if (clientIp) userData.client_ip_address = clientIp;
if (userAgent) userData.client_user_agent = userAgent;
return [{ json: { data: [{ event_name: 'CRM_Reuniao', event_time: Math.floor(Date.now()/1000), event_id: leadId || crypto.randomUUID(), action_source: 'website', event_source_url: 'https://n8n.proxserverabner.site', user_data: userData, custom_data: { currency: 'BRL', value: Number(body.valor || body.value || 0) } }] } }];`,
    };

    @node({
        id: 'code-contrato',
        name: 'Processar CONTRATO',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [352, 208],
    })
    ProcessarContrato = {
        jsCode: `const crypto = require('crypto');
const inputItem = $input.first().json;
const body = inputItem.body || inputItem;
const headers = inputItem.headers || {};
const userAgent = headers['user-agent'] || '';
const clientIp = (headers['x-forwarded-for'] || headers['x-real-ip'] || '').split(',')[0].trim();
const emailBruto = body.email ? String(body.email) : '';
const telefoneBruto = (body.telefone || body.phone) ? String(body.telefone || body.phone) : '';
const nomeBruto = body.nome ? String(body.nome) : '';
const leadId = body.id || body.lead_id || '';
const emailLimpo = emailBruto.trim().toLowerCase();
const hashEmail = emailLimpo ? crypto.createHash('sha256').update(emailLimpo).digest('hex') : null;
let telefoneLimpo = telefoneBruto.replace(/\\D/g, '');
if (telefoneLimpo) {
  if (telefoneLimpo.length === 10 || telefoneLimpo.length === 11) {
    if (!telefoneLimpo.startsWith('55')) {
      telefoneLimpo = '55' + telefoneLimpo;
    }
  }
}
const hashPhone = telefoneLimpo ? crypto.createHash('sha256').update(telefoneLimpo).digest('hex') : null;
let hashFirstName = null;
let hashLastName = null;
if (nomeBruto) {
  const partesNome = nomeBruto.trim().toLowerCase().split(/\\s+/);
  const firstName = partesNome[0] || '';
  const lastName = partesNome.slice(1).join(' ') || '';
  if (firstName) hashFirstName = crypto.createHash('sha256').update(firstName).digest('hex');
  if (lastName) hashLastName = crypto.createHash('sha256').update(lastName).digest('hex');
}
const hashExternalId = leadId ? crypto.createHash('sha256').update(String(leadId)).digest('hex') : null;
const userData = {};
if (hashEmail) userData.em = [hashEmail];
if (hashPhone) userData.ph = [hashPhone];
if (hashFirstName) userData.fn = [hashFirstName];
if (hashLastName) userData.ln = [hashLastName];
if (hashExternalId) userData.external_id = [hashExternalId];
if (clientIp) userData.client_ip_address = clientIp;
if (userAgent) userData.client_user_agent = userAgent;
return [{ json: { data: [{ event_name: 'CRM_Contrato', event_time: Math.floor(Date.now()/1000), event_id: leadId || crypto.randomUUID(), action_source: 'website', event_source_url: 'https://n8n.proxserverabner.site', user_data: userData, custom_data: { currency: 'BRL', value: Number(body.valor || body.value || 0) } }] } }];`,
    };

    @node({
        id: 'code-fechado',
        name: 'Processar FECHADO',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [352, 400],
    })
    ProcessarFechado = {
        jsCode: `const crypto = require('crypto');
const inputItem = $input.first().json;
const body = inputItem.body || inputItem;
const headers = inputItem.headers || {};
const userAgent = headers['user-agent'] || '';
const clientIp = (headers['x-forwarded-for'] || headers['x-real-ip'] || '').split(',')[0].trim();
const emailBruto = body.email ? String(body.email) : '';
const telefoneBruto = (body.telefone || body.phone) ? String(body.telefone || body.phone) : '';
const nomeBruto = body.nome ? String(body.nome) : '';
const leadId = body.id || body.lead_id || '';
const emailLimpo = emailBruto.trim().toLowerCase();
const hashEmail = emailLimpo ? crypto.createHash('sha256').update(emailLimpo).digest('hex') : null;
let telefoneLimpo = telefoneBruto.replace(/\\D/g, '');
if (telefoneLimpo) {
  if (telefoneLimpo.length === 10 || telefoneLimpo.length === 11) {
    if (!telefoneLimpo.startsWith('55')) {
      telefoneLimpo = '55' + telefoneLimpo;
    }
  }
}
const hashPhone = telefoneLimpo ? crypto.createHash('sha256').update(telefoneLimpo).digest('hex') : null;
let hashFirstName = null;
let hashLastName = null;
if (nomeBruto) {
  const partesNome = nomeBruto.trim().toLowerCase().split(/\\s+/);
  const firstName = partesNome[0] || '';
  const lastName = partesNome.slice(1).join(' ') || '';
  if (firstName) hashFirstName = crypto.createHash('sha256').update(firstName).digest('hex');
  if (lastName) hashLastName = crypto.createHash('sha256').update(lastName).digest('hex');
}
const hashExternalId = leadId ? crypto.createHash('sha256').update(String(leadId)).digest('hex') : null;
const userData = {};
if (hashEmail) userData.em = [hashEmail];
if (hashPhone) userData.ph = [hashPhone];
if (hashFirstName) userData.fn = [hashFirstName];
if (hashLastName) userData.ln = [hashLastName];
if (hashExternalId) userData.external_id = [hashExternalId];
if (clientIp) userData.client_ip_address = clientIp;
if (userAgent) userData.client_user_agent = userAgent;
return [{ json: { data: [{ event_name: 'Purchase', event_time: Math.floor(Date.now()/1000), event_id: leadId || crypto.randomUUID(), action_source: 'website', event_source_url: 'https://n8n.proxserverabner.site', user_data: userData, custom_data: { currency: 'BRL', value: Number(body.valor || body.value || 0) } }] } }];`,
    };

    @node({
        id: 'http-meta',
        name: 'Enviar para Meta API',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [1056, -96],
        onError: 'continueRegularOutput',
    })
    EnviarParaMetaApi = {
        method: 'POST',
        url: 'https://graph.facebook.com/v19.0/SEU_PIXEL_ID/events?access_token=SEU_ACCESS_TOKEN_META',
        sendBody: true,
        contentType: 'raw',
        rawContentType: 'application/json',
        body: '={{ JSON.stringify($json) }}',
        options: {},
    };

    @node({
        id: 'http-dashboard',
        name: 'Enviar para Dashboard',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.1,
        position: [1056, 100],
    })
    EnviarParaDashboard = {
        method: 'POST',
        url: 'http://gtech-crm-dashboard:3000/api/webhook',
        sendBody: true,
        contentType: 'raw',
        rawContentType: 'application/json',
        body: '={{ JSON.stringify($json.body || $json) }}',
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ProcessarAquecimento.out(0).to(this.EnviarParaMetaApi.in(0));
        this.ProcessarContrato.out(0).to(this.EnviarParaMetaApi.in(0));
        this.ProcessarFechado.out(0).to(this.EnviarParaMetaApi.in(0));
        this.ProcessarQualificacao.out(0).to(this.EnviarParaMetaApi.in(0));
        this.ProcessarReuniao.out(0).to(this.EnviarParaMetaApi.in(0));
        this.WebhookAquecimento.out(0).to(this.ProcessarAquecimento.in(0));
        this.WebhookAquecimento.out(0).to(this.EnviarParaDashboard.in(0));
        this.WebhookContratoAceite.out(0).to(this.ProcessarContrato.in(0));
        this.WebhookContratoAceite.out(0).to(this.EnviarParaDashboard.in(0));
        this.WebhookFechado.out(0).to(this.ProcessarFechado.in(0));
        this.WebhookFechado.out(0).to(this.EnviarParaDashboard.in(0));
        this.WebhookQualificacao.out(0).to(this.ProcessarQualificacao.in(0));
        this.WebhookQualificacao.out(0).to(this.EnviarParaDashboard.in(0));
        this.WebhookReuniaoProposta.out(0).to(this.ProcessarReuniao.in(0));
        this.WebhookReuniaoProposta.out(0).to(this.EnviarParaDashboard.in(0));
    }
}
