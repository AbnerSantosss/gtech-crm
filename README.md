# GTech CRM — Dashboard de Leads

Painel CRM ultramoderno construído em **Next.js** que recebe eventos do funil de vendas via **n8n** e exibe os leads em um quadro **Kanban** em tempo real, integrado com a **Meta Conversions API**.

---

## 🏗️ Arquitetura

```
CRM Externo ──POST──► n8n (Funil Completo)
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
             Meta CAPI          Dashboard CRM
           (criptografado)      (crm-dashboard:3000)
```

---

## 🚀 Deploy no Portainer

### Pré-requisitos
- Portainer com acesso ao Docker
- n8n já rodando como container

### Passo 1 — Criar uma nova Stack no Portainer

1. No Portainer, vá em **Stacks → Add Stack**
2. Dê o nome `gtech-crm`
3. Cole o conteúdo do `docker-compose.yml` abaixo

### Passo 2 — docker-compose.yml

```yaml
version: '3.8'
services:
  crm-dashboard:
    image: node:18-alpine
    container_name: gtech-crm-dashboard
    working_dir: /app
    command: sh -c "npm install && npm run build && npm start"
    volumes:
      - ./crm-dashboard:/app
      - crm_data:/app/data
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    networks:
      - n8n_network   # ← mesma rede do container do n8n

volumes:
  crm_data:

networks:
  n8n_network:
    external: true   # ← rede já existente onde o n8n está
```

> **⚠️ IMPORTANTE:** O nome da rede (`n8n_network`) deve ser o mesmo da rede onde o seu container n8n está rodando. Verifique no Portainer → Networks.

### Passo 3 — Configurar o n8n

No workflow **Funil Completo - Disparo META**, o nó `Enviar para Dashboard` usa a URL:

```
http://crm-dashboard:3000/api/webhook
```

Isso funciona automaticamente quando os dois containers estão na **mesma rede Docker**. Não é necessário expor portas extras.

### Passo 4 — Configurar o Access Token da Meta

No nó `Enviar para Meta API`, substitua os placeholders pelos valores reais:
- `SEU_PIXEL_ID` → ID do seu Pixel Meta (ex: `1511124637024458`)
- `SEU_ACCESS_TOKEN_META` → Token de acesso da Meta Conversions API

> **🔒 SEGURANÇA:** Nunca comite o token real no GitHub. Configure-o diretamente no painel do n8n usando **Credenciais Gerenciadas** ou **Variáveis de Ambiente**.

### Passo 5 — Acessar o Dashboard

Após o deploy, acesse:
```
http://SEU_SERVIDOR:3000
```

---

## ⚙️ Configuração do Admin

No Dashboard, clique no ícone de engrenagem (⚙️) no canto superior direito para abrir o Painel Admin.

### Seção 1 — Webhooks n8n
- Configure a **URL Base** do seu n8n (ex: `https://n8n.seudominio.com/webhook`)
- Copie as URLs individuais de cada etapa do funil para enviar ao desenvolvedor do CRM

### Seção 2 — Disparo de Teste
- Simule eventos do funil para testar a integração

---

## 🛡️ Segurança

| Item | Status |
|------|--------|
| Access Token Meta | ✅ Nunca exposto no código |
| Dados de leads (`data.json`) | ✅ No `.gitignore` |
| `.env` e segredos | ✅ No `.gitignore` |
| Dados criptografados antes da Meta | ✅ SHA-256 no n8n |

---

## 📦 Stack Tecnológica

- **Frontend:** Next.js 14 (App Router) + CSS Puro (Design System UI/UX Pro Max)
- **Ícones:** Lucide Icons (SVG inline)
- **Tipografia:** Fira Sans + Fira Code (Google Fonts)
- **Backend:** Next.js API Routes
- **Automação:** n8n
- **Deploy:** Docker + Portainer
