import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

// Mapa de palavras-chave → stage canônico
const STAGE_MAP: Record<string, string> = {
  qualificacao:    'CRM_Qualificacao',
  aquecimento:     'CRM_Aquecimento',
  reuniao:         'CRM_Reuniao',
  reuniao_proposta:'CRM_Reuniao',
  contrato:        'CRM_Contrato',
  contrato_aceite: 'CRM_Contrato',
  fechado:         'Purchase',
  purchase:        'Purchase',
  // Valores já no formato canônico
  crm_qualificacao:'CRM_Qualificacao',
  crm_aquecimento: 'CRM_Aquecimento',
  crm_reuniao:     'CRM_Reuniao',
  crm_contrato:    'CRM_Contrato',
};

function resolveStage(raw: string | null | undefined): string {
  if (!raw) return 'CRM_Qualificacao';
  const key = raw.toLowerCase().replace(/[^a-z_]/g, '');
  return STAGE_MAP[key] || raw;
}

async function readLeads(): Promise<any[]> {
  try {
    const fileData = await fs.readFile(dataFilePath, 'utf-8');
    const parsed = JSON.parse(fileData);
    return Array.isArray(parsed) ? parsed : (parsed.leads ?? []);
  } catch {
    return [];
  }
}

async function writeLeads(leads: any[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(leads, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Stage: prioridade → query param > campo do body > fallback
    const stageParam  = req.nextUrl.searchParams.get('stage');
    const rawStage    = stageParam || data.stage || data.evento || null;
    const stage       = resolveStage(rawStage);
    const now         = new Date().toISOString();

    const leads = await readLeads();

    // Chave de identificação do lead (email é o mais confiável)
    const existingIndex = data.email
      ? leads.findIndex((l: any) => l.email === data.email)
      : data.id
        ? leads.findIndex((l: any) => l.id === data.id)
        : -1;

    let responseData: any;

    if (existingIndex >= 0) {
      // ── LEAD EXISTENTE: mover para nova etapa no Kanban ──
      const existing    = leads[existingIndex];
      const prevStage   = existing.stage;

      leads[existingIndex] = {
        ...existing,
        nome:     data.nome     || existing.nome,
        email:    data.email    || existing.email,
        telefone: data.telefone || existing.telefone,
        valor:    data.valor    !== undefined ? data.valor : existing.valor,
        stage,
        stageHistory: [
          ...(existing.stageHistory || [{ stage: prevStage, at: existing.createdAt }]),
          { stage, at: now },
        ],
        updatedAt: now,
      };

      responseData = { success: true, action: 'moved', from: prevStage, to: stage, lead: leads[existingIndex] };

    } else {
      // ── LEAD NOVO: inserir na coluna correta ──
      const newLead = {
        id:           data.id || `lead-${Date.now()}`,
        nome:         data.nome     || 'Lead Anônimo',
        email:        data.email    || '',
        telefone:     data.telefone || '',
        valor:        data.valor    || 0,
        stage,
        stageHistory: [{ stage, at: now }],
        createdAt:    now,
        updatedAt:    now,
      };
      leads.push(newLead);

      responseData = { success: true, action: 'created', lead: newLead };
    }

    await writeLeads(leads);
    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await readLeads();
    return NextResponse.json({ success: true, leads }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
