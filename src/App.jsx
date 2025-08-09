import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, CheckCircle2, Clock, Download, FileText, History, LayoutDashboard, Play, RefreshCw, ShieldAlert, Target, Upload, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'

const COURSE = {
  title: 'Preparación para Certificación en Gestión de Riesgos (PMI‑RMP®)',
  subtitle: 'Curso práctico con actividades y exámenes',
  simulator: {
    durationMinutes: 25,
    questions: [
      {
        id: 'simq1',
        prompt: 'Estás planificando la gestión de riesgos en un proyecto de Odoo ERP con fuerte resistencia al cambio. ¿Cuál es la MEJOR acción inicial?',
        options: [
          'Aplicar de inmediato reservas de contingencia en el cronograma',
          'Definir roles, apetito de riesgo y umbrales con los interesados clave',
          'Ejecutar entrevistas para identificar riesgos técnicos',
          'Elevar un cambio de alcance para añadir un plan de comunicación',
        ],
        answerIndex: 1,
        explanation: 'El proceso \'Planificar la Gestión de Riesgos\' establece el marco: roles, apetito y umbrales. Luego profundizas en identificación y planes de respuesta.',
        domain: 'Planificación',
      },
      {
        id: 'simq2',
        prompt: 'Tienes una lista extensa de riesgos. El patrocinador te pide priorizar en una reunión hoy. ¿Qué herramienta cualitativa usas primero?',
        options: [
          'Simulación Monte Carlo',
          'Árbol de decisiones',
          'Matriz probabilidad‑impacto con criterios estandarizados',
          'Análisis de sensibilidad tornado',
        ],
        answerIndex: 2,
        explanation: 'La priorización inicial se hace con análisis cualitativo (probabilidad‑impacto) antes del cuantitativo.',
        domain: 'Análisis cualitativo',
      },
      {
        id: 'simq3',
        prompt: 'Un riesgo positivo (oportunidad) permitiría reducir 8% el tiempo de pruebas si se contrata un experto externo. Mejor estrategia:',
        options: ['Aceptar', 'Explotar', 'Transferir', 'Mitigar'],
        answerIndex: 1,
        explanation: 'Para oportunidades, \'Explotar\' maximiza la probabilidad de que ocurra tomando acciones proactivas (p. ej., contratar al experto).',
        domain: 'Respuestas a oportunidades',
      },
      {
        id: 'simq4',
        prompt: 'Durante el seguimiento, notas que un plan de respuesta no se ejecutó a tiempo y el disparador (trigger) ya ocurrió. ¿Qué haces primero?',
        options: [
          'Registrar una lección aprendida y cerrar el riesgo',
          'Ejecutar el plan de contingencia y actualizar el registro',
          'Recalcular las reservas de gestión',
          'Abrir un cambio para modificar la EDT',
        ],
        answerIndex: 1,
        explanation: 'Si el trigger ocurrió y el plan preventivo falló, activa la contingencia y actualiza el registro/monitoreo.',
        domain: 'Monitoreo y control',
      },
    ],
  },
  modules: [
    {
      id: 'm1',
      title: 'Fundamentos y marco de referencia',
      lessons: [
        {
          id: 'm1l1',
          title: 'Conceptos clave y terminología',
          content: 'Diferencia entre riesgo y issue, amenazas vs oportunidades, apetito y tolerancia al riesgo. Alineado a estándar PMI y buenas prácticas organizacionales.',
        },
        {
          id: 'm1l2',
          title: 'Procesos de gestión de riesgos',
          content: 'Planificar, Identificar, Analizar (cualitativo y cuantitativo), Planificar respuestas, Implementar, y Monitorear/Controlar.',
        },
      ],
      activities: [
        {
          id: 'm1a1',
          title: 'Mapa conceptual de riesgos',
          brief: 'Construye un mapa conceptual que relacione apetito, umbrales, categorías (RBS) y procesos. Describe 3 ejemplos de tu contexto.',
          placeholder: 'Describe tu mapa conceptual o pega el enlace a Miro/Mural. Agrega 3 ejemplos reales…',
        },
      ],
      quizzes: [
        {
          id: 'm1q1',
          title: 'Mini‑examen Módulo 1 (10 preguntas)',
          questions: [
            {
              id: 'm1q1_1',
              prompt: '¿Qué diferencia principal hay entre apetito y tolerancia al riesgo?',
              options: [
                'El apetito es el riesgo máximo permitido; la tolerancia es la preferencia por la incertidumbre',
                'El apetito es la preferencia general; la tolerancia define rangos aceptables medibles',
                'Son sinónimos',
                'El apetito aplica a amenazas y la tolerancia solo a oportunidades',
              ],
              answerIndex: 1,
              explanation: 'Apetito = preferencia nivel macro; Tolerancia = límites/rangos aceptables a nivel operativo.',
              domain: 'Fundamentos',
            },
            {
              id: 'm1q1_2',
              prompt: 'Selecciona el mejor ejemplo de riesgo (no issue):',
              options: [
                'El proveedor ya entregó con 2 semanas de retraso',
                'Podría faltar un ingeniero clave durante pruebas críticas',
                'Se rechazó la factura de mayo',
                'El servidor de QA está caído ahora',
              ],
              answerIndex: 1,
              explanation: 'Un riesgo es un evento incierto que, si ocurre, impacta objetivos. Los otros son issues actuales.',
              domain: 'Fundamentos',
            },
          ],
        },
      ],
    },
    {
      id: 'm2',
      title: 'Plan de gestión de riesgos',
      lessons: [
        {
          id: 'm2l1',
          title: 'Componentes del plan',
          content: 'Roles, categorías (RBS), metodologías, criterios de prob‑impacto, formatos, umbrales y reporting.',
        },
      ],
      activities: [
        {
          id: 'm2a1',
          title: 'Esbozo de plan de riesgos',
          brief: 'Redacta un plan breve para un proyecto real (máx. 1 página) con roles, criterios y umbrales.',
          placeholder: 'Escribe tu esbozo aquí…',
        },
      ],
      quizzes: [
        {
          id: 'm2q1',
          title: 'Mini‑examen Módulo 2',
          questions: [
            {
              id: 'm2q1_1',
              prompt: '¿Qué artefacto organiza categorías de riesgo por áreas (p. ej., técnico, externo, organizacional)?',
              options: ['RACI', 'RBS', 'OBS', 'PBS'],
              answerIndex: 1,
              explanation: 'RBS = Risk Breakdown Structure.',
              domain: 'Planificación',
            },
          ],
        },
      ],
    },
  ],
}

const STORAGE_KEY = 'risk-course-progress-v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) { return null }
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch (e) {}
}

function Badge({ children }) {
  return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">{children}</span>
}
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5" />
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  )
}

function Quiz({ quiz, onFinish, savedAnswers = {} }) {
  const [answers, setAnswers] = useState({ ...savedAnswers })
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    let s = 0
    quiz.questions.forEach((q) => { if (answers[q.id] === q.answerIndex) s += 1 })
    return s
  }, [answers, quiz.questions])

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5"/> {quiz.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="rounded-2xl border p-4">
            <div className="mb-2 text-sm text-gray-500">Pregunta {idx + 1} de {quiz.questions.length}</div>
            <div className="mb-3 font-medium">{q.prompt}</div>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === i
                const isCorrect = q.answerIndex === i
                const showColors = submitted
                const base = 'w-full text-left rounded-xl border p-3'
                const color = showColors
                  ? isCorrect ? 'border-emerald-500' : (isSelected ? 'border-rose-500' : '')
                  : (isSelected ? 'border-black' : '')
                return (
                  <button key={i} className={`${base} ${color}`} onClick={() => !submitted && setAnswers({ ...answers, [q.id]: i })}>
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {submitted && isCorrect && <CheckCircle2 className="h-5 w-5"/>}
                      {submitted && !isCorrect && isSelected && <XCircle className="h-5 w-5"/>}
                    </div>
                  </button>
                )
              })}
            </div>
            {submitted && (
              <div className="mt-3 text-sm text-gray-600">
                <strong>Explicación: </strong>{q.explanation}
                {q.domain && (<div className="mt-1"><Badge>{q.domain}</Badge></div>)}
              </div>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {submitted ? <>Puntaje: <strong>{score}</strong> / {quiz.questions.length}</> : <>Selecciona tus respuestas y envía para ver resultados.</>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {}}><RefreshCw className="mr-2 h-4 w-4"/> Reiniciar</Button>
            {!submitted ? (
              <Button onClick={() => { setSubmitted(true); onFinish?.(answers, score) }}><CheckCircle2 className="mr-2 h-4 w-4"/> Enviar</Button>
            ) : (
              <Button onClick={() => onFinish?.(answers, score)}><Play className="mr-2 h-4 w-4"/> Continuar</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Simulator({ config, onFinish, saved = {} }) {
  const [answers, setAnswers] = useState({ ...(saved.answers || {}) })
  const [timeLeft, setTimeLeft] = useState(saved.timeLeft ?? config.durationMinutes * 60)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (submitted) return
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [submitted])

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      setSubmitted(true)
      onFinish?.(answers)
    }
  }, [timeLeft, submitted, onFinish, answers])

  const score = useMemo(() => {
    let s = 0
    config.questions.forEach((q) => { if (answers[q.id] === q.answerIndex) s += 1 })
    return s
  }, [answers, config.questions])

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5"/> Simulador de examen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-xl border p-3">
          <div className="text-sm text-gray-500">Duración</div>
          <div className="flex items-center gap-3 text-lg font-semibold"><Clock className="h-5 w-5"/> {mm}:{ss}</div>
        </div>

        {config.questions.map((q, idx) => (
          <div key={q.id} className="rounded-2xl border p-4">
            <div className="mb-2 text-sm text-gray-500">Pregunta {idx + 1} de {config.questions.length}</div>
            <div className="mb-3 font-medium">{q.prompt}</div>
            <div className="grid gap-2 md:grid-cols-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={submitted}
                  className={`text-left rounded-xl border p-3 ${answers[q.id] === i ? 'border-black' : ''}`}
                  onClick={() => setAnswers({ ...answers, [q.id]: i })}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {submitted ? <>Puntaje: <strong>{score}</strong> / {config.questions.length}</> : <>Selecciona tus respuestas. El examen se envía al agotar el tiempo o al presionar "Enviar".</>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {}}><RefreshCw className="mr-2 h-4 w-4"/> Reiniciar</Button>
            <Button onClick={() => { setSubmitted(true); onFinish?.(answers) }}><CheckCircle2 className="mr-2 h-4 w-4"/> Enviar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Activity({ activity, savedText = '', onSave }) {
  const [text, setText] = useState(savedText)
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> {activity.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{activity.brief}</p>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={activity.placeholder} className="min-h-[160px]" />
        <div className="flex gap-2">
          <Button onClick={() => onSave?.(text)}><CheckCircle2 className="mr-2 h-4 w-4"/> Guardar</Button>
          <Button variant="outline" onClick={() => setText('')}>Limpiar</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function RiskCourseApp() {
  const [state, setState] = useState(() =>
    loadState() || {
      currentModuleId: COURSE.modules[0].id,
      answersByQuiz: {},
      activityTexts: {},
      simulator: { answers: {}, runs: [], timeLeft: null },
      profile: { name: '', email: '' },
    }
  )

  useEffect(() => saveState(state), [state])

  const currentModule = useMemo(
    () => COURSE.modules.find((m) => m.id === state.currentModuleId) || COURSE.modules[0],
    [state.currentModuleId]
  )

  const progress = useMemo(() => {
    const totalQuestions = COURSE.modules.reduce(
      (acc, m) => acc + m.quizzes.reduce((a, q) => a + q.questions.length, 0),
      0
    )
    const answered = Object.values(state.answersByQuiz).reduce((acc, qa) => acc + Object.keys(qa || {}).length, 0)
    const pct = totalQuestions ? Math.round((answered / totalQuestions) * 100) : 0
    return { totalQuestions, answered, pct }
  }, [state.answersByQuiz])

  const totalSimQuestions = COURSE.simulator.questions.length
  const bestSimScore = Math.max(0, *([0] + state.simulator.runs.map((r) => r.score || 0)))

  function exportJSON() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'curso-riesgos-progreso.json'
    a.click()
    URL.revokeObjectURL(url)
  }
  function importJSON(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try { const obj = JSON.parse(String(e.target?.result || '')); setState(obj) } catch { alert('Archivo inválido') }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6" />
            <div>
              <h1 className="text-lg font-semibold">{COURSE.title}</h1>
              <p className="text-xs text-gray-500">{COURSE.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportJSON}><Download className="mr-2 h-4 w-4"/> Exportar avance</Button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 text-sm">
              <Upload className="h-4 w-4"/> Importar
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])} />
            </label>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[280px,1fr]">
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/> Módulos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {COURSE.modules.map((m, idx) => {
                const modQuestions = m.quizzes.reduce((a, q) => a + q.questions.length, 0)
                const answeredInMod = m.quizzes.reduce((a, q) => a + Object.keys(state.answersByQuiz[q.id] || {}).length, 0)
                const pct = modQuestions ? Math.round((answeredInMod / modQuestions) * 100) : 0
                const active = state.currentModuleId === m.id
                return (
                  <button
                    key={m.id}
                    className={`w-full rounded-xl border p-3 text-left ${active ? 'border-black' : ''}`}
                    onClick={() => setState({ ...state, currentModuleId: m.id })}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{idx + 1}. {m.title}</div>
                      <span className="text-xs text-gray-500">{pct}%</span>
                    </div>
                    <Progress value={pct} className="mt-2"/>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5"/> Tu perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input placeholder="Tu nombre" value={state.profile.name} onChange={(e) => setState({ ...state, profile: { ...state.profile, name: e.target.value } })} />
              <Input placeholder="Tu email" value={state.profile.email} onChange={(e) => setState({ ...state, profile: { ...state.profile, email: e.target.value } })} />
              <div className="rounded-xl border p-3 text-sm">
                <div className="mb-1 font-medium">Progreso general</div>
                <Progress value={progress.pct}/>
                <div className="mt-2 text-xs text-gray-500">{progress.answered}/{progress.totalQuestions} preguntas respondidas</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="h-5 w-5"/> Simulador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Stat icon={Clock} label="Duración" value={`${COURSE.simulator.durationMinutes} min`}/>
              <Stat icon={ShieldAlert} label="Preguntas" value={totalSimQuestions}/>
              <Stat icon={CheckCircle2} label="Mejor puntaje" value={`—/${totalSimQuestions}`}/>
            </CardContent>
          </Card>
        </aside>

        <section>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/> {currentModule.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentModule.lessons?.map((l) => (
                  <div key={l.id} className="rounded-2xl border p-4">
                    <div className="mb-1 text-sm text-gray-500">Lección</div>
                    <div className="text-base font-medium">{l.title}</div>
                    <p className="mt-2 text-sm text-gray-600">{l.content}</p>
                  </div>
                ))}

                {currentModule.activities?.map((a) => (
                  <Activity
                    key={a.id}
                    activity={a}
                    savedText={state.activityTexts[a.id] || ''}
                    onSave={(text) => setState({ ...state, activityTexts: { ...state.activityTexts, [a.id]: text } })}
                  />
                ))}

                {currentModule.quizzes?.map((q) => (
                  <Quiz
                    key={q.id}
                    quiz={q}
                    savedAnswers={state.answersByQuiz[q.id] || {}}
                    onFinish={(answers) => setState({
                      ...state,
                      answersByQuiz: { ...state.answersByQuiz, [q.id]: answers },
                    })}
                  />
                ))}

                <div className="rounded-2xl border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-base font-medium flex items-center gap-2"><Clock className="h-5 w-5"/> Examen final simulado</div>
                    <Badge>{COURSE.simulator.questions.length} preguntas</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Temporizador y retroalimentación. Puedes reiniciar y repetir para mejorar tu puntaje.</p>
                  <Simulator
                    config={COURSE.simulator}
                    saved={state.simulator}
                    onFinish={(answers) => {
                      const score = COURSE.simulator.questions.reduce((s, q) => s + ((answers[q.id] ?? -1) === q.answerIndex ? 1 : 0), 0)
                      const run = { date: new Date().toISOString(), score }
                      setState({ ...state, simulator: { answers, runs: [...state.simulator.runs, run], timeLeft: null } })
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-2 text-xs text-gray-500">
        <div className="mt-2">© {new Date().getFullYear()} Curso de preparación en gestión de riesgos. Versión MVP.</div>
      </footer>
    </div>
  )
}
