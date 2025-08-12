import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Clock, Download, FileText, History, LayoutDashboard, Moon, Play, RefreshCw, ShieldAlert, Sun, Target, Upload, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

// 💡 NUEVO: datos externos modularizados
import COURSE from "./courseData";
import FINAL_EXAM from "./finalExam";

/**
 * MVP – Plataforma online de preparación para certificación en gestión de riesgos
 * Ahora modularizado + modo oscuro.
 * Archivos:
 *  - App.jsx (este archivo)
 *  - courseData.js (módulos/lecciones/actividades/quizzes SIN preguntas del simulador)
 *  - finalExam.js (banco de preguntas del examen final)
 */

// ———————————— Mini componentes de UI ————————————
function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
      {children}
    </span>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5" />
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

// ———————————— Mini gráfico (SVG, sin dependencias) ————————————
function MiniBarChart({ data = [], max = null, height = 120 }) {
  const values = data.map((d) => d.value);
  const maxVal = max ?? Math.max(1, ...values, 1);
  const barW = 100 / (data.length || 1);
  return (
    <div className="w-full">
      <svg viewBox={`0 0 100 ${height}`} className="w-full h-[140px]">
        {data.map((d, i) => {
          const h = (d.value / maxVal) * (height - 20);
          const x = i * barW + 5;
          const y = height - h - 5;
          const w = barW - 10 / (data.length || 1);
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx="3" className="fill-black/80" />
              <text x={x + w / 2} y={height - 2} textAnchor="middle" fontSize="7" className="fill-gray-500">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function LessonCard({ lesson }) {
  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="mb-1 text-sm text-gray-500">Lección</div>
      <div className="text-base font-medium">{lesson.title}</div>
      <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{lesson.content}</p>
      {lesson.chart?.data?.length ? (
        <div className="mt-2">
          <div className="mb-1 text-xs text-gray-500">Gráfico conceptual</div>
          <MiniBarChart data={lesson.chart.data} max={lesson.chart.max} />
          {lesson.chart.caption && (
            <div className="mt-1 text-[11px] text-gray-500">{lesson.chart.caption}</div>
          )}
        </div>
      ) : null}
      {lesson.video && (
        <div className="pt-2">
          <a href={lesson.video} target="_blank" rel="noreferrer">
            <Button variant="outline">
              <Play className="mr-2 h-4 w-4" /> Ver video de apoyo
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}

// ———————————— Tema (claro/oscuro) ————————————
const THEME_KEY = "risk-course-theme";
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem(THEME_KEY);
    return saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  return { theme, setTheme };
}

// ———————————— Autotests básicos (se ejecutan en runtime, consola) ————————————
function runSelfChecks(course, finalExam) {
  try {
    const errs = [];
    if (!course || !Array.isArray(course.modules) || course.modules.length === 0) {
      errs.push('COURSE.modules vacío');
    }
    // Verificar simulador
    if (!Array.isArray(finalExam) || finalExam.length === 0) {
      errs.push('Simulador sin preguntas');
    } else {
      finalExam.forEach((q, i) => {
        if (!Array.isArray(q.options) || q.options.length < 2) errs.push(`SimQ${i}: opciones insuficientes`);
        if (q.answerIndex < 0 || q.answerIndex >= q.options.length) errs.push(`SimQ${i}: answerIndex fuera de rango`);
      });
    }
    // Verificar módulos/quizzes
    course.modules.forEach((m) => {
      if (!m.id || !m.title) errs.push(`Módulo inválido: ${m?.id}`);
      (m.quizzes || []).forEach((quiz) => {
        (quiz.questions || []).forEach((q, i) => {
          if (!Array.isArray(q.options) || q.options.length < 2) errs.push(`${m.id}/${quiz.id}/Q${i}: opciones < 2`);
          if (typeof q.answerIndex !== 'number' || q.answerIndex < 0 || q.answerIndex >= q.options.length) errs.push(`${m.id}/${quiz.id}/Q${i}: answerIndex inválido`);
        });
      });
    });
    if (errs.length) {
      console.warn('[SelfChecks] Problemas detectados:', errs);
    } else {
      console.log('[SelfChecks] OK – todas las pruebas pasaron');
    }
  } catch (e) {
    console.error('[SelfChecks] Excepción en pruebas:', e);
  }
}

// ———————————— Utilidades de almacenamiento ————————————
const STORAGE_KEY = "risk-course-progress-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

// ———————————— Quiz (una pregunta a la vez) ————————————
function Quiz({ quiz, onFinish, savedAnswers = {} }) {
  const [answers, setAnswers] = useState({ ...savedAnswers });
  const [submitted, setSubmitted] = useState(false);
  const [index, setIndex] = useState(0);

  const total = quiz.questions.length;
  const q = quiz.questions[index];

  const score = useMemo(() => {
    let s = 0;
    quiz.questions.forEach((qq) => { if (answers[qq.id] === qq.answerIndex) s += 1; });
    return s;
  }, [answers, quiz.questions]);

  const atStart = index === 0;
  const atEnd = index === total - 1;

  function go(delta) {
    const next = Math.min(total - 1, Math.max(0, index + delta));
    setIndex(next);
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5"/> {quiz.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-2xl border p-4">
          <div className="mb-2 text-sm text-muted-foreground">Pregunta {index + 1} de {total}</div>
          <div className="mb-3 font-medium">{q.prompt}</div>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isSelected = answers[q.id] === i;
              const isCorrect = q.answerIndex === i;
              const showColors = submitted;
              const base = "w-full text-left rounded-xl border p-3";
              const color = showColors
                ? isCorrect
                  ? "border-emerald-500"
                  : isSelected
                    ? "border-rose-500"
                    : ""
                : isSelected
                  ? "border-black"
                  : "";
              return (
                <button key={i} className={`${base} ${color}`} onClick={() => !submitted && setAnswers({ ...answers, [q.id]: i })}>
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {submitted && isCorrect && <CheckCircle2 className="h-5 w-5"/>}
                    {submitted && !isCorrect && isSelected && <XCircle className="h-5 w-5"/>}
                  </div>
                </button>
              );
            })}
          </div>
          {submitted && (
            <div className="mt-3 text-sm text-muted-foreground">
              <strong>Explicación: </strong>{q.explanation}
              {q.domain && (<div className="mt-1"><Badge>{q.domain}</Badge></div>)}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {submitted ? (
              <>Puntaje: <strong>{score}</strong> / {total}</>
            ) : (
              <>Selecciona tu respuesta y continúa. Puedes enviar al final.</>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => go(-1)} disabled={atStart}><RefreshCw className="mr-2 h-4 w-4 rotate-180"/> Anterior</Button>
            {!atEnd ? (
              <Button onClick={() => go(1)}><Play className="mr-2 h-4 w-4"/> Siguiente</Button>
            ) : (
              !submitted ? (
                <Button onClick={() => { setSubmitted(true); onFinish?.(answers, score); }}><CheckCircle2 className="mr-2 h-4 w-4"/> Enviar</Button>
              ) : (
                <Button onClick={() => onFinish?.(answers, score)}><Play className="mr-2 h-4 w-4"/> Continuar</Button>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ———————————— Simulador con temporizador ————————————
function ResultsCard({ result }) {
  if (!result) return null;
  const total = Object.values(result.byDomain).reduce((a, v) => a + v.total, 0);
  const correct = Object.values(result.byDomain).reduce((a, v) => a + v.correct, 0);
  const domains = Object.entries(result.byDomain).sort((a,b)=>a[0].localeCompare(b[0]));
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Resultado por dominio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">Aciertos: <strong>{correct}</strong> / {total}</div>
        {domains.map(([dom, { correct, total }]) => {
          const pct = total ? Math.round((correct/total)*100) : 0;
          return (
            <div key={dom} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{dom}</span>
                <span className="text-gray-500">{correct}/{total} ({pct}%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-black" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
        {result.recommendation && (
          <div className="rounded-xl border p-3 text-sm">
            <div className="font-medium mb-1">Sugerencia de estudio</div>
            <div className="text-gray-600">{result.recommendation}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Simulator({ config, onFinish, saved = {} }) {
  const [answers, setAnswers] = useState({ ...(saved.answers || {}) })
  const [timeLeft, setTimeLeft] = useState(saved.timeLeft ?? config.durationMinutes * 60)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(saved.lastResult || null)
  const [index, setIndex] = useState(0)

  const total = config.questions.length
  const q = config.questions[index]

  useEffect(() => {
    if (submitted) return
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [submitted])

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      submitNow()
    }
  }, [timeLeft, submitted])

  const score = useMemo(() => {
    let s = 0
    config.questions.forEach((qq) => { if (answers[qq.id] === qq.answerIndex) s += 1 })
    return s
  }, [answers, config.questions])

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')
  const atStart = index === 0
  const atEnd = index === total - 1

  function go(delta){
    const next = Math.min(total - 1, Math.max(0, index + delta))
    setIndex(next)
  }

  function submitNow(){
    setSubmitted(true)
    const byDomain = {}
    for (const qq of config.questions){
      const dom = qq.domain || 'General'
      byDomain[dom] = byDomain[dom] || { correct:0, total:0 }
      byDomain[dom].total += 1
      if ((answers[qq.id] ?? -1) === qq.answerIndex) byDomain[dom].correct += 1
    }
    const worst = Object.entries(byDomain)
      .map(([dom, d]) => ({ dom, pct: d.total? d.correct/d.total : 0 }))
      .sort((a,b)=>a.pct-b.pct)[0]
    const recommendation = worst ? `Refuerza el dominio "${worst.dom}" con las lecciones y mini‑exámenes de su módulo.` : ''
    const payload = { byDomain, score }
    setResult({ ...payload, recommendation })
    onFinish?.(answers, payload)
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5"/> Simulador de examen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-xl border p-3">
          <div className="text-sm text-gray-500">Tiempo restante</div>
          <div className="flex items-center gap-3 text-lg font-semibold"><Clock className="h-5 w-5"/> {mm}:{ss}</div>
        </div>

        {/* Pregunta actual */}
        <div className="rounded-2xl border p-4">
          <div className="mb-2 text-sm text-gray-500">Pregunta {index + 1} de {total}</div>
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

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {submitted ? <>Puntaje: <strong>{score}</strong> / {total}</> : <>Responde y navega. Envía al final o cuando se agote el tiempo.</>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => go(-1)} disabled={atStart}><RefreshCw className="mr-2 h-4 w-4 rotate-180"/> Anterior</Button>
            {!atEnd ? (
              <Button onClick={() => go(1)}><Play className="mr-2 h-4 w-4"/> Siguiente</Button>
            ) : (
              <Button onClick={submitNow}><CheckCircle2 className="mr-2 h-4 w-4"/> Enviar</Button>
            )}
          </div>
        </div>

        <ResultsCard result={result} />
      </CardContent>
    </Card>
  )
}

// ———————————— Actividad abierta ————————————
function Activity({ activity, savedText = "", onSave }) {
  const [text, setText] = useState(savedText);
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> {activity.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{activity.brief}</p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={activity.placeholder}
          className="min-h-[160px]"
        />
        <div className="flex gap-2">
          <Button onClick={() => onSave?.(text)}><CheckCircle2 className="mr-2 h-4 w-4"/> Guardar</Button>
          <Button variant="outline" onClick={() => setText("")}>Limpiar</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ———————————— App principal ————————————
export default function RiskCourseApp() {
  const [state, setState] = useState(() =>
    loadState() || {
      currentModuleId: COURSE.modules[0].id,
      answersByQuiz: {},
      activityTexts: {},
      simulator: { answers: {}, runs: [], timeLeft: null, lastResult: null },
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

    const totalSimQuestions = SIMULATOR.questions.length
  const runs = state.simulator?.runs ?? []
  const bestSimScore = runs.length ? Math.max(...runs.map(r => r.score ?? 0)) : 0
  const passThreshold = 0.7 // 70%
  const last = state.simulator?.lastResult
  const lastPct = last ? (Object.values(last.byDomain).reduce((a,v)=>a+v.correct,0) / Object.values(last.byDomain).reduce((a,v)=>a+v.total,0)) : 0
  const isEligible = last && lastPct >= passThreshold

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

  function printCertificate(){
    const title = 'Certificado de Finalización'
    const name = state.profile.name || 'Participante'
    const date = new Date().toLocaleDateString()
    const score = Math.round(lastPct * 100)
    const w = window.open('', 'PRINT', 'height=800,width=1100')
    w.document.write(`<!doctype html><html><head><title>${title}</title>
      <style>
        body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Arial;padding:60px;background:#f8fafc}
        .card{max-width:900px;margin:0 auto;padding:60px;border:1px solid #e5e7eb;border-radius:24px;background:white;}
        .hdr{font-size:28px;font-weight:700;letter-spacing:.5px;margin-bottom:8px}
        .sub{color:#6b7280;margin-bottom:24px}
        .name{font-size:36px;font-weight:800;margin:24px 0}
        .meta{margin-top:24px;color:#374151}
        .row{display:flex;justify-content:space-between;margin-top:40px}
        .sig{border-top:1px solid #e5e7eb;padding-top:8px;width:40%;text-align:center;color:#6b7280}
        .badge{display:inline-block;border:1px solid #111;border-radius:9999px;padding:6px 12px;font-size:12px;margin-top:12px}
        @media print { body{background:white} }
      </style>
    </head><body><div class="card">
      <div class="hdr">${title}</div>
      <div class="sub">Preparación para Certificación en Gestión de Riesgos (PMI‑RMP®)</div>
      <div>Otorgado a</div>
      <div class="name">${name}</div>
      <div>por completar el simulador con un puntaje de <strong>${score}%</strong> y los módulos fundamentales del curso.</div>
      <div class="meta">Fecha: ${date}</div>
      <div class="row">
        <div class="sig">Director del Programa</div>
        <div class="sig">Coordinación Académica</div>
      </div>
      <div class="badge">Referencia: curso-riesgos · vercel</div>
    </div></body></html>`)
    w.document.close(); w.focus(); w.print(); w.close();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6" />
            <div>
              <h1 className="text-lg font-semibold">{COURSE.title}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{COURSE.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="mr-2 h-4 w-4"/> : <Moon className="mr-2 h-4 w-4"/>}
              {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </Button>
            <Button variant="outline" onClick={exportJSON}><Download className="mr-2 h-4 w-4"/> Exportar avance</Button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 text-sm">
              <Upload className="h-4 w-4"/> Importar
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])} />
            </label>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[280px,1fr]">
        {/* Sidebar */}
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
              <Stat icon={ShieldAlert} label="Preguntas" value={COURSE.simulator.questions.length}/>
              <Stat icon={CheckCircle2} label="Mejor puntaje" value={`${bestSimScore}/${COURSE.simulator.questions.length}`}/>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Certificado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Requisito: ≥ 70% en el simulador más reciente.</div>
              <div className={`rounded-xl border p-3 ${isEligible ? '' : 'opacity-60'}`}>
                <div className="text-xs text-gray-500 mb-1">Nombre en certificado</div>
                <Input placeholder="Tu nombre tal como irá en el certificado" value={state.profile.name} onChange={(e)=> setState({ ...state, profile: { ...state.profile, name: e.target.value } })} />
                <div className="mt-2 flex gap-2">
                  <Button onClick={printCertificate} disabled={!isEligible}>Imprimir / Guardar PDF</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Contenido (solo módulo seleccionado) */}
        <section>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5"/> {currentModule.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lecciones */}
                {currentModule.lessons?.map((l) => (
                  <LessonCard key={l.id} lesson={l} />
                ))}

                {/* Actividades */}
                {currentModule.activities?.map((a) => (
                  <Activity
                    key={a.id}
                    activity={a}
                    savedText={state.activityTexts[a.id] || ''}
                    onSave={(text) => setState({ ...state, activityTexts: { ...state.activityTexts, [a.id]: text } })}
                  />
                ))}

                {/* Quizzes */}
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

                {/* Simulador */}
                <div className="rounded-2xl border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-base font-medium flex items-center gap-2"><Clock className="h-5 w-5"/> Examen final simulado</div>
                    <Badge>{totalSimQuestions} preguntas</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Temporizador y retroalimentación. Al finalizar verás resultados por dominio y una sugerencia de estudio.</p>
                  <Simulator
                    config={SIMULATOR}
                    saved={state.simulator}
                    onFinish={(answers, payload) => {
                      const score = payload.score
                      const run = { date: new Date().toISOString(), score }
                      setState({ ...state, simulator: { answers, runs: [...runs, run], timeLeft: null, lastResult: payload } })
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
