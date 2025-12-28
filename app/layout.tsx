import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SYSTEM ATLAS – Behördenbescheide verstehen',
  description: 'Strategischer Denk-Assistent zur Analyse deutscher Behördenbescheide',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  )
}
