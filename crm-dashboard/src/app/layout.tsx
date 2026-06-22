import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTech CRM — Dashboard de Leads",
  description: "Painel CRM ultramoderno para visualização e disparo de eventos do funil de vendas via n8n e Meta Conversions API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
