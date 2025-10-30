import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Guia de Cuidados – Smoke 🐈‍⬛ & Filhote 🐾 (31/10–05/11)',
  description: 'Guia de cuidados de Smoke e Filhote',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  )
}

