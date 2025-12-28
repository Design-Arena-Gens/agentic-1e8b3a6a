'use client'

import { useState } from 'react'
import { FileText, Search, AlertCircle, Shield, Info } from 'lucide-react'

export default function Home() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const analyzeDocument = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Analyse fehlgeschlagen:', error)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-slate-900">SYSTEM ATLAS</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Strategischer Denk-Assistent zur Analyse deutscher Behördenbescheide
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Verwaltungshandeln als Logik- und Verfahrenssystem verstehen
          </p>
        </header>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Wichtiger Hinweis</p>
              <p>
                SYSTEM ATLAS gibt keine Rechtsberatung und trifft keine rechtlichen Entscheidungen.
                Für eine verbindliche Einschätzung sollte eine Fachstelle oder Rechtsberatung hinzugezogen werden.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-slate-700 mr-2" />
              <h2 className="text-2xl font-semibold text-slate-900">Bescheid analysieren</h2>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Fügen Sie hier den Text Ihres Behördenbescheids ein..."
              className="w-full h-96 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-900 placeholder-slate-400"
            />

            <button
              onClick={analyzeDocument}
              disabled={loading || !text.trim()}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyse läuft...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Systemanalyse starten
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-slate-700 mr-2" />
              <h2 className="text-2xl font-semibold text-slate-900">Systemanalyse</h2>
            </div>

            {!analysis ? (
              <div className="h-96 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Fügen Sie einen Bescheid ein und starten Sie die Analyse</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 h-96 overflow-y-auto pr-2">
                {/* Kurzüberblick */}
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Kurzüberblick
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{analysis.overview}</p>
                </section>

                {/* Auffälligkeiten */}
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                    Auffällige Punkte / mögliche Systemlücken
                  </h3>
                  <ul className="space-y-2">
                    {analysis.findings.map((finding: string, idx: number) => (
                      <li key={idx} className="flex items-start text-slate-700">
                        <span className="text-amber-600 mr-2 mt-1">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Klartext-Erklärung */}
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Klartext-Erklärung
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{analysis.explanation}</p>
                </section>

                {/* Strategischer Hinweis */}
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                    Strategischer Hinweis
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{analysis.strategy}</p>
                </section>

                {/* Rechtlicher Hinweis */}
                <section className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm text-slate-600 italic">
                    Dies ist keine Rechtsberatung. Für eine verbindliche Einschätzung sollte eine
                    Fachstelle oder Rechtsberatung hinzugezogen werden.
                  </p>
                </section>
              </div>
            )}
          </div>
        </div>

        {/* Feature Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-slate-900 mb-2">Systemische Analyse</h3>
            <p className="text-sm text-slate-600">
              Erkennung von Formfehlern, pauschalen Begründungen und unbestimmten Rechtsbegriffen
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-slate-900 mb-2">Verständliche Sprache</h3>
            <p className="text-sm text-slate-600">
              Übersetzung von Verwaltungssprache in klares, nachvollziehbares Deutsch
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-slate-900 mb-2">Datenschutz</h3>
            <p className="text-sm text-slate-600">
              Keine Speicherung personenbezogener Daten, keine Weitergabe an Dritte
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>
            SYSTEM ATLAS versteht Verwaltung als System aus Routinen, Textbausteinen und Absicherung –
            nicht als unfehlbare Instanz.
          </p>
        </footer>
      </div>
    </main>
  )
}
