import { NextResponse } from 'next/server'

interface SystemGap {
  category: string
  pattern: RegExp
  description: string
}

const systemGaps: SystemGap[] = [
  {
    category: 'Unbestimmte Rechtsbegriffe',
    pattern: /\b(in der Regel|kann|sollte|grundsätzlich|im Allgemeinen|üblicherweise|regelmäßig)\b/gi,
    description: 'Unbestimmte Rechtsbegriffe gefunden, die Ermessensspielräume andeuten'
  },
  {
    category: 'Pauschale Begründungen',
    pattern: /\b(nicht erforderlich|nicht notwendig|nicht zweckmäßig|nicht angezeigt|nicht gegeben)\b/gi,
    description: 'Pauschale Formulierung ohne konkrete Einzelfallprüfung erkennbar'
  },
  {
    category: 'Formelmäßige Ablehnungen',
    pattern: /\b(nach Prüfung|nach eingehender Prüfung|nach sorgfältiger Prüfung|wurde festgestellt)\b/gi,
    description: 'Formelhafte Standardformulierung ohne erkennbare Einzelfallabwägung'
  },
  {
    category: 'Fehlende Konkretisierung',
    pattern: /\b(entsprechend|gemäß|nach Maßgabe|im Sinne von)\b/gi,
    description: 'Verweis auf Normen ohne konkrete Anwendung auf den Einzelfall'
  },
  {
    category: 'Ermessensausübung',
    pattern: /\b(ermessen|ermessensspielraum|kann entscheiden|steht frei|nach pflichtgemäßem ermessen)\b/gi,
    description: 'Ermessen wird angedeutet, aber keine sichtbare Ermessensabwägung dokumentiert'
  }
]

function analyzeText(text: string) {
  const findings: string[] = []
  const foundPatterns = new Set<string>()

  // Systemlücken-Analyse
  systemGaps.forEach(gap => {
    const matches = text.match(gap.pattern)
    if (matches && matches.length > 0 && !foundPatterns.has(gap.category)) {
      findings.push(`${gap.description} (${matches.length}× gefunden: "${matches.slice(0, 3).join('", "')}")`)
      foundPatterns.add(gap.category)
    }
  })

  // Formale Mängel prüfen
  if (!/Aktenzeichen|Az\.|Geschäftszeichen/i.test(text)) {
    findings.push('Kein Aktenzeichen erkennbar – könnte die Zuordnung und Nachverfolgung erschweren')
  }

  if (!/Rechtsbehelfsbelehrung|Widerspruch|Klage|Rechtsbehelf/i.test(text)) {
    findings.push('Keine Rechtsbehelfsbelehrung erkennbar – dies könnte ein formaler Mangel sein')
  }

  if (!/Frist|innerhalb von|binnen|bis zum/i.test(text)) {
    findings.push('Keine klare Fristangabe erkennbar')
  }

  if (!/Anhörung|Stellungnahme|Gelegenheit zur Äußerung/i.test(text)) {
    findings.push('Keine Anhörung vor Erlass erkennbar – bei belastenden Verwaltungsakten könnte dies relevant sein')
  }

  if (text.length < 200) {
    findings.push('Sehr kurzer Bescheid – die Begründungstiefe erscheint möglicherweise unzureichend')
  }

  // Begründungsqualität
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
  const avgSentenceLength = text.length / sentences.length
  if (avgSentenceLength > 200) {
    findings.push('Sehr lange Sätze – könnte auf komplexe Verschachtelungen oder Unklarheiten hinweisen')
  }

  if (findings.length === 0) {
    findings.push('Bei erster Durchsicht keine auffälligen Systemlücken erkannt – dennoch empfiehlt sich eine fachliche Prüfung')
  }

  return findings
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Kein gültiger Text übergeben' },
        { status: 400 }
      )
    }

    const findings = analyzeText(text)

    // Generiere strukturierte Antwort
    const analysis = {
      overview: `Der vorgelegte Bescheid wurde auf systemische Auffälligkeiten untersucht. Es wurden ${findings.length} Punkte identifiziert, die näher betrachtet werden sollten. Die Analyse konzentriert sich auf formale Aspekte, Begründungstiefe und typische Verwaltungsroutinen.`,

      findings,

      explanation: `Behördenbescheide folgen häufig Textbausteinen und Standardformulierungen. Dies ist verwaltungstechnisch normal, kann aber dazu führen, dass die konkrete Einzelfallprüfung nicht ausreichend dokumentiert wird. Unbestimmte Rechtsbegriffe wie "in der Regel" oder "grundsätzlich" schaffen Ermessensspielräume – diese müssen jedoch erkennbar ausgeübt und begründet werden. Formale Mängel (fehlende Fristen, unvollständige Rechtsbehelfsbelehrung) können unter Umständen die Rechtswirksamkeit beeinflussen.`,

      strategy: `Es könnte strategisch sinnvoll sein, die identifizierten Punkte systematisch zu dokumentieren und bei Bedarf eine konkrete Begründung der Einzelfallentscheidung nachzufragen. Bei formalen Mängeln (z.B. fehlende Anhörung) oder wenn die Begründung sehr pauschal bleibt, kann dies Ansatzpunkte für eine Überprüfung bieten. Eine fachkundige Beratung kann einschätzen, ob und wie diese Punkte relevant sein könnten.`
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analyse-Fehler:', error)
    return NextResponse.json(
      { error: 'Fehler bei der Analyse' },
      { status: 500 }
    )
  }
}
