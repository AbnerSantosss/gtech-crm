"use client";

import { useEffect, useState, FormEvent, useCallback } from 'react';
import Image from 'next/image';

const DEFAULT_WEBHOOK_BASE = 'https://n8n.proxserverabner.site/webhook';

// ── SVG Icons (Lucide) ──
const icons = {
  settings: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  clipboard: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>,
  check: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  rocket: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  link: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  flask: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16.5h10"/></svg>,
  phone: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  checkCircle: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>,
  xCircle: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>,
  x: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
};

const STAGES = [
  { id: 'qualificacao', label: 'Qualificação', event: 'CRM_Qualificacao', path: '/api/webhooks/gtech/leads/qualificacao', color: '#3B82F6' },
  { id: 'aquecimento', label: 'Aquecimento', event: 'CRM_Aquecimento', path: '/api/webhooks/gtech/leads/aquecimento', color: '#EAB308' },
  { id: 'reuniao', label: 'Reunião', event: 'CRM_Reuniao', path: '/api/webhooks/gtech/leads/reuniao_proposta', color: '#F97316' },
  { id: 'contrato', label: 'Contrato', event: 'CRM_Contrato', path: '/api/webhooks/gtech/leads/contrato_aceite', color: '#EF4444' },
  { id: 'fechado', label: 'Fechado', event: 'Purchase', path: '/api/webhooks/gtech/leads/fechado', color: '#A855F7' }
];

export default function CRMDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [adminOpen, setAdminOpen] = useState(false);
  const [webhookBase, setWebhookBase] = useState(DEFAULT_WEBHOOK_BASE);
  const [webhookInput, setWebhookInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [testStageIndex, setTestStageIndex] = useState(0);
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', valor: '' });
  const [toast, setToast] = useState<{ type: string; title: string; message: string } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/webhook');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (e) { console.error('Erro ao buscar leads:', e); }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('gtech_webhook_base');
    if (saved) { setWebhookBase(saved); setWebhookInput(saved); }
    else { setWebhookInput(DEFAULT_WEBHOOK_BASE); }
    fetchLeads();
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  const showToast = (type: string, title: string, message: string) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  const saveWebhookUrl = () => {
    const url = webhookInput.trim().replace(/\/$/, '');
    if (!url) return;
    setWebhookBase(url);
    localStorage.setItem('gtech_webhook_base', url);
    showToast('success', 'URL Atualizada', `Webhook: ${url}`);
  };

  const copyWebhookUrl = (index: number) => {
    navigator.clipboard.writeText(`${webhookBase}${STAGES[index].path}`);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleTestFire = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const stage = STAGES[testStageIndex];
    const payload: any = { nome: formData.nome || undefined, email: formData.email, telefone: formData.telefone || undefined, valor: parseFloat(formData.valor) || 0, stage: stage.event };
    Object.keys(payload).forEach(k => { if (payload[k] === undefined || payload[k] === '') delete payload[k]; });
    try {
      const res = await fetch(`${webhookBase}${stage.path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { showToast('success', `${stage.event} disparado`, `Etapa "${stage.label}" enviada com sucesso.`); setTimeout(fetchLeads, 1500); }
      else { showToast('error', 'Erro no envio', `Status ${res.status}.`); }
    } catch { showToast('error', 'Erro de conexão', 'Não foi possível conectar ao webhook.'); }
    finally { setLoading(false); }
  };

  const totalLeads = leads.length;
  const totalValue = leads.reduce((s: number, l: any) => s + (l.valor || 0), 0);

  return (
    <div className="dashboard-container">
      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-logo">
          <Image src="/logo.png" alt="Gtech Logo" width={40} height={40} />
          <div>
            <h1>GTech CRM</h1>
            <span className="header-subtitle">Dashboard de Leads</span>
          </div>
        </div>
        <div className="header-right">
          <div className="header-stats">
            <div className="stat-chip"><span className="stat-dot" /><span>{totalLeads} lead{totalLeads !== 1 ? 's' : ''}</span></div>
            <div className="stat-chip stat-value">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</div>
          </div>
          <button className="admin-toggle" onClick={() => setAdminOpen(!adminOpen)} title="Painel Admin">{icons.settings}</button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <div className="main-layout">
        <section className="kanban-board">
          {STAGES.map(stage => {
            const sl = leads.filter((l: any) => l.stage === stage.event);
            return (
              <div key={stage.id} className="kanban-column" style={{ '--col-color': stage.color } as React.CSSProperties}>
                <div className="kanban-header">
                  <div className="kanban-header-left">
                    <span className="kanban-icon" style={{ background: stage.color }} />
                    <span>{stage.label}</span>
                  </div>
                  <span className="badge" style={{ background: `${stage.color}18`, color: stage.color }}>{sl.length}</span>
                </div>
                <div className="kanban-cards">
                  {sl.length === 0 && <div className="kanban-empty">Nenhum lead</div>}
                  {sl.map((lead: any, i: number) => (
                    <div key={lead.id || i} className="lead-card">
                      <div className="lead-card-top">
                        <div className="lead-avatar" style={{ background: `${stage.color}18`, color: stage.color }}>{(lead.nome || '?')[0].toUpperCase()}</div>
                        <div>
                          <div className="lead-name">{lead.nome || 'Lead Anônimo'}</div>
                          <div className="lead-email">{lead.email}</div>
                        </div>
                      </div>
                      {lead.telefone && <div className="lead-detail">{icons.phone} {lead.telefone}</div>}
                      <div className="lead-card-bottom">
                        {lead.valor > 0 && <div className="lead-value">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.valor)}</div>}
                        <div className="lead-date">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('pt-BR') : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* ── ADMIN DRAWER ── */}
        <aside className={`admin-panel ${adminOpen ? 'open' : ''}`}>
          <div className="admin-panel-header">
            <h2>{icons.settings} Painel Admin</h2>
            <button className="admin-close" onClick={() => setAdminOpen(false)}>{icons.x}</button>
          </div>

          {/* SEÇÃO 1: WEBHOOKS */}
          <div className="admin-section">
            <div className="section-label">SEÇÃO 1</div>
            <h3>{icons.link} Webhooks n8n</h3>
            <p className="admin-help">URLs dos webhooks para cada etapa do funil. Copie e envie para o desenvolvedor do CRM.</p>
            <div className="webhook-base-label">URL Base</div>
            <div className="webhook-config">
              <input type="url" value={webhookInput} onChange={e => setWebhookInput(e.target.value)} placeholder="https://n8n.seudominio.com/webhook" />
              <button onClick={saveWebhookUrl}>Salvar</button>
            </div>
            <div className="webhook-list">
              {STAGES.map((stage, i) => (
                <div key={stage.id} className="webhook-item">
                  <div className="webhook-item-header">
                    <span className="webhook-item-dot" style={{ background: stage.color }} />
                    <span className="webhook-item-label">{stage.label}</span>
                    <span className="webhook-item-event">{stage.event}</span>
                  </div>
                  <div className="webhook-item-url-row">
                    <code className="webhook-item-url">{webhookBase}{stage.path}</code>
                    <button className={`copy-btn ${copiedIndex === i ? 'copied' : ''}`} onClick={() => copyWebhookUrl(i)} title="Copiar URL">
                      {copiedIndex === i ? icons.check : icons.clipboard}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEÇÃO 2: TESTE */}
          <div className="admin-section">
            <div className="section-label">SEÇÃO 2</div>
            <h3>{icons.flask} Disparo de Teste</h3>
            <p className="admin-help">Simule um evento do funil para testar o webhook e a integração com a Meta Conversions API.</p>
            <form onSubmit={handleTestFire}>
              <div className="admin-form-group">
                <label>Etapa</label>
                <select value={testStageIndex} onChange={e => setTestStageIndex(parseInt(e.target.value))}>
                  {STAGES.map((s, i) => <option key={s.id} value={i}>{s.label} — {s.event}</option>)}
                </select>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Nome</label><input type="text" required placeholder="João da Silva" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} /></div>
                <div className="admin-form-group"><label>E-mail</label><input type="email" required placeholder="lead@exemplo.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group"><label>Telefone</label><input type="text" placeholder="(11) 99999-9999" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} /></div>
                <div className="admin-form-group"><label>Valor (R$)</label><input type="number" placeholder="5000" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} /></div>
              </div>
              <button type="submit" className="test-fire-btn" disabled={loading}>
                {icons.rocket} {loading ? 'Disparando...' : `Disparar ${STAGES[testStageIndex].event}`}
              </button>
            </form>
          </div>
        </aside>
      </div>

      {adminOpen && <div className="admin-overlay" onClick={() => setAdminOpen(false)} />}

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? icons.checkCircle : icons.xCircle}</span>
          <div className="toast-body">
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}
