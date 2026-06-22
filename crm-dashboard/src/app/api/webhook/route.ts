import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Local file to simulate a database for the leads
const dataFilePath = path.join(process.cwd(), 'data.json');

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Read existing leads
    let leads = [];
    try {
      const fileData = await fs.readFile(dataFilePath, 'utf-8');
      leads = JSON.parse(fileData);
    } catch (e) {
      // File doesn't exist or is empty, start with empty array
    }

    // Assign a unique ID if not present
    const lead = {
      id: data.id || `lead-${Date.now()}`,
      nome: data.nome || 'Lead Anônimo',
      email: data.email || '',
      telefone: data.telefone || '',
      valor: data.valor || 0,
      stage: data.stage || 'CRM_Qualificacao',
      createdAt: new Date().toISOString()
    };

    // Update existing or add new
    const existingIndex = leads.findIndex((l: any) => l.email === lead.email);
    if (existingIndex >= 0) {
      // Keep existing creation date, just update stage/info
      leads[existingIndex] = { ...leads[existingIndex], ...lead, id: leads[existingIndex].id, createdAt: leads[existingIndex].createdAt };
    } else {
      leads.push(lead);
    }

    // Save to file
    await fs.writeFile(dataFilePath, JSON.stringify(leads, null, 2));

    return NextResponse.json({ success: true, lead }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    let leads = [];
    try {
      const fileData = await fs.readFile(dataFilePath, 'utf-8');
      leads = JSON.parse(fileData);
    } catch (e) {
      // No file yet
    }
    return NextResponse.json({ success: true, leads }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
