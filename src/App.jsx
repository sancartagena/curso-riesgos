import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Clock, Download, FileText, History, LayoutDashboard, Play, RefreshCw, ShieldAlert, Target, Upload, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

/**
 * MVP – Plataforma online de preparación para certificación en gestión de riesgos
 * Características:
 * - Estructura por módulos con lecciones, actividades y mini‑exámenes.
 * - Simulador de examen final con temporizador.
 * - Retroalimentación inmediata, métricas de desempeño y progreso persistente (localStorage).
 * - Exportar/Importar avance y respuestas (JSON).
 * - Estilo moderno con Tailwind + shadcn/ui. Animaciones con Framer Motion.
 *
 * Cómo extender:
 * - Agrega preguntas en COURSE.modules[].quizzes[].questions.
 * - Agrega lecciones/actividades en COURSE.modules[].lessons / activities.
 * - Ajusta la duración del simulador en COURSE.simulator.durationMinutes.
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

// ———————————— Datos del curso ————————————
const COURSE = {
  title: 'Preparación para Certificación en Gestión de Riesgos (PMI-RMP®)',
  subtitle: 'Curso práctico con actividades y exámenes',
  simulator: {
    durationMinutes: 60,
    questions: [
      // (25 preguntas del simulador)
      { id: 'simq1', prompt: 'Estás planificando la gestión de riesgos en un proyecto de Odoo ERP con fuerte resistencia al cambio. ¿Cuál es la MEJOR acción inicial?', options: ['Aplicar de inmediato reservas de contingencia en el cronograma','Definir roles, apetito de riesgo y umbrales con los interesados clave','Ejecutar entrevistas para identificar riesgos técnicos','Elevar un cambio de alcance para añadir un plan de comunicación'], answerIndex: 1, explanation: 'En Planificar la Gestión de Riesgos se establecen roles, apetito y umbrales antes de identificar y responder.', domain: 'Planificación' },
      { id: 'simq2', prompt: 'Tienes una lista extensa de riesgos. El patrocinador te pide priorizar hoy. ¿Qué herramienta cualitativa usas primero?', options: ['Simulación Monte Carlo','Árbol de decisiones','Matriz probabilidad-impacto con criterios estandarizados','Análisis de sensibilidad (tornado)'], answerIndex: 2, explanation: 'La priorización inicial se aborda con análisis cualitativo prob‑impacto.', domain: 'Análisis cualitativo' },
      { id: 'simq3', prompt: 'Una oportunidad permitiría reducir 8% el tiempo de pruebas si se contrata un experto externo. Mejor estrategia:', options: ['Aceptar','Explotar','Transferir','Mitigar'], answerIndex: 1, explanation: 'Explotar maximiza la probabilidad de que la oportunidad ocurra.', domain: 'Respuestas a oportunidades' },
      { id: 'simq4', prompt: 'El disparador (trigger) ocurrió y la acción preventiva no se ejecutó. ¿Qué haces primero?', options: ['Registrar lección y cerrar','Ejecutar la contingencia y actualizar el registro','Recalcular reservas de gestión','Solicitar cambio a la EDT'], answerIndex: 1, explanation: 'Activa la contingencia y actualiza el registro/seguimiento.', domain: 'Monitoreo y control' },
      { id: 'simq5', prompt: 'El plan de gestión de riesgos debe definir, entre otros, los umbrales. ¿Qué enunciado es correcto?', options: ['Los umbrales se definen solo para costos','Los umbrales son límites cuantitativos que disparan acciones','Los umbrales reemplazan al apetito','Los umbrales son exclusivos de riesgos técnicos'], answerIndex: 1, explanation: 'Umbrales = límites cuantitativos/condiciones que disparan acciones.', domain: 'Planificación' },
      { id: 'simq6', prompt: 'Qué salida PRODUCE Identificar Riesgos?', options: ['Plan de gestión de riesgos','Registro de riesgos actualizado','Matriz prob‑impacto','Reservas de contingencia'], answerIndex: 1, explanation: 'La salida principal es el registro de riesgos (y atributos iniciales).', domain: 'Identificación' },
      { id: 'simq7', prompt: 'Cuál es el objetivo del análisis cuantitativo?', options: ['Determinar causas raíz','Priorizar cualitativamente','Cuantificar efecto en objetivos con datos numéricos','Definir responsables'], answerIndex: 2, explanation: 'El análisis cuantitativo cuantifica el efecto con modelos numéricos.', domain: 'Análisis cuantitativo' },
      { id: 'simq8', prompt: 'Reserva usada para eventos identificados con plan de respuesta:', options: ['Reserva de gestión','Reserva de contingencia','Amortiguador de cadena crítica','Holgura total'], answerIndex: 1, explanation: 'Contingencia = para riesgos identificados; gestión = para desconocidos.', domain: 'Planificación de respuestas' },
      { id: 'simq9', prompt: 'Mejor técnica para descubrir riesgos sistémicos entre áreas:', options: ['Lista de verificación','Entrevistas 1:1','Análisis de supuestos y restricciones','Análisis de árbol de fallos'], answerIndex: 2, explanation: 'Los supuestos/restricciones mal planteados revelan riesgos sistémicos.', domain: 'Identificación' },
      { id: 'simq10', prompt: 'En un árbol de decisiones, eligiendo una alternativa con EMV mayor, ¿qué estás maximizando?', options: ['Valor esperado','Valor mínimo garantizado','Probabilidad de éxito','ROI contable'], answerIndex: 0, explanation: 'El EMV (Expected Monetary Value) guía la elección bajo incertidumbre.', domain: 'Cuantitativo' },
      { id: 'simq11', prompt: 'Qué estrategia NO corresponde a amenazas:', options: ['Evitar','Mitigar','Transferir','Explotar'], answerIndex: 3, explanation: 'Explotar es estrategia de oportunidades.', domain: 'Respuestas' },
      { id: 'simq12', prompt: 'Indicador útil en seguimiento de riesgos para saber si las respuestas están funcionando:', options: ['SPI','KRI (indicador clave de riesgo)','IRR','Lead time'], answerIndex: 1, explanation: 'KRIs miden exposición y eficacia de respuestas.', domain: 'Monitoreo' },
      { id: 'simq13', prompt: 'Qué documento define “quién informa qué, a quién y cuándo” sobre riesgos?', options: ['Plan de comunicaciones','Registro de interesados','Plan de riesgos','Acta de constitución'], answerIndex: 2, explanation: 'El plan de riesgos incluye reporting/formatos de comunicación.', domain: 'Planificación' },
      { id: 'simq14', prompt: 'Qué técnica acelera la identificación en grupos numerosos y reduce sesgo del dominador?', options: ['Entrevistas','Delphi','Revisión de documentos','Lluvia de ideas abierta'], answerIndex: 1, explanation: 'Delphi logra consenso anónimo y reduce sesgos.', domain: 'Identificación' },
      { id: 'simq15', prompt: 'Si la distribución de duraciones es altamente asimétrica, qué simulación captura mejor esa realidad?', options: ['Uniforme','Normal','Triangular/PERT','Binomial'], answerIndex: 2, explanation: 'Triangular/PERT modelan asimetría en tareas.', domain: 'Cuantitativo' },
      { id: 'simq16', prompt: 'Cambiar proveedor para reducir probabilidad de falla es ejemplo de:', options: ['Mitigar','Transferir','Aceptar','Escalar'], answerIndex: 0, explanation: 'Mitigar reduce probabilidad/impacto de amenazas.', domain: 'Respuestas' },
      { id: 'simq17', prompt: 'Qué elemento del registro de riesgos facilita auditar la efectividad de las respuestas?', options: ['Categoría RBS','Propietario del riesgo','Estrategia y plan de respuesta','Fecha de identificación'], answerIndex: 2, explanation: 'Estrategia + plan permiten evaluar ejecución/efectividad.', domain: 'Registro' },
      { id: 'simq18', prompt: 'Cuál es la mejor fuente para identificar riesgos de cumplimiento en banca?', options: ['Lecciones aprendidas internas','Normativa del regulador','Encuesta de clima','WBS'], answerIndex: 1, explanation: 'La normativa aplicable origina requisitos y riesgos de cumplimiento.', domain: 'Identificación' },
      { id: 'simq19', prompt: 'Una respuesta a oportunidad “compartir” se parece más a:', options: ['Mitigar','Transferir','Explotar','Escalar'], answerIndex: 1, explanation: 'Compartir oportunidades = alianza/contrato para repartir beneficios.', domain: 'Respuestas' },
      { id: 'simq20', prompt: 'Qué debes hacer si un riesgo residual supera el umbral?', options: ['Aceptarlo documentado','Escalarlo y/o planificar respuesta adicional','Cerrar el riesgo','Ignorarlo si la probabilidad es baja'], answerIndex: 1, explanation: 'Si supera umbral, requiere decisión/escalamiento o respuesta extra.', domain: 'Monitoreo' },
      { id: 'simq21', prompt: 'Relación correcta entre RBS y EDT:', options: ['RBS descompone entregables','RBS descompone fuentes/categorías de riesgo','Son equivalentes','Ninguna'], answerIndex: 1, explanation: 'EDT = entregables; RBS = categorías/fuentes de riesgo.', domain: 'Fundamentos' },
      { id: 'simq22', prompt: 'Cuál es una salida del análisis cualitativo?', options: ['Lista priorizada de riesgos','Curvas S','EMV de alternativas','Plan de reservas'], answerIndex: 0, explanation: 'Salida típica: lista priorizada con puntuaciones y racionales.', domain: 'Cualitativo' },
      { id: 'simq23', prompt: 'Quién es responsable de ejecutar el plan de respuesta?', options: ['PMO','Propietario del riesgo','Patrocinador','Comité de dirección'], answerIndex: 1, explanation: 'Cada riesgo tiene un owner para ejecutar/coordinar respuestas.', domain: 'Gobernanza' },
      { id: 'simq24', prompt: 'Cuál métrica mirarías para saber si una respuesta de transferencia (seguro) fue adecuada?', options: ['Prima vs cobertura y deducible','Nº de reuniones','Duración del proyecto','% de alcance completado'], answerIndex: 0, explanation: 'Transferir = analizar cobertura efectiva y costo asociado.', domain: 'Respuestas' },
      { id: 'simq25', prompt: 'Qué práctica evita “listas infinitas” y centra el análisis en lo material?', options: ['Categorización RBS','Definir criterios y umbrales claros','Reuniones más largas','Añadir más participantes'], answerIndex: 1, explanation: 'Criterios/umbrales evitan dispersión y enfocan en lo relevante.', domain: 'Planificación' },
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
          content: 'Riesgo: evento incierto que, si ocurre, impacta objetivos.
Issue: evento que ya ocurrió.
Amenaza vs Oportunidad: impacto negativo vs positivo.
Apetito: preferencia organizacional por el riesgo (macro).
Tolerancia/Umbral: límites medibles que disparan acciones.',
          chart: { data: [
            { label: 'Amenaza', value: 60 },
            { label: 'Oport.', value: 40 },
            { label: 'Apet.', value: 70 },
            { label: 'Umbral', value: 50 },
          ], caption: 'Relación conceptual entre tipos de riesgo y gobierno' },
          video: 'https://www.youtube.com/watch?v=1G5a3Q_risk'
        },
        {
          id: 'm1l2',
          title: 'Procesos de gestión de riesgos',
          content: 'Secuencia típica: Planificar → Identificar → Analizar (cuali/cuanti) → Planificar respuestas → Implementar → Monitorear/Controlar.
Cada proceso tiene entradas, herramientas y salidas específicas (ITTOs) que conviene dominar para el examen.',
          chart: { data: [
            { label: 'Plan', value: 20 },
            { label: 'ID', value: 30 },
            { label: 'Cuali', value: 40 },
            { label: 'Cuanti', value: 35 },
            { label: 'Resp', value: 25 },
            { label: 'Mon', value: 30 },
          ], caption: 'Peso relativo aproximado de esfuerzo por proceso' },
          video: 'https://www.youtube.com/watch?v=2H7p9Q_process'
        },
      ],
      activities: [
        { id: 'm1a1', title: 'Mapa conceptual de riesgos', brief: 'Relaciona apetito, umbrales, RBS y procesos. Describe 3 ejemplos de tu contexto.', placeholder: 'Describe tu mapa o pega enlace a Miro/Mural…' },
      ],
      quizzes: [
        { id: 'm1q1', title: 'Mini-examen Módulo 1 (6 preguntas)', questions: [
          { id: 'm1q1_1', prompt: '¿Qué diferencia principal hay entre apetito y tolerancia al riesgo?', options: ['Apetito = máximo permitido; Tolerancia = preferencia','Apetito = preferencia general; Tolerancia = rangos medibles','Son sinónimos','Apetito solo a amenazas'], answerIndex: 1, explanation: 'Apetito (macro) vs Tolerancia (límites operativos).', domain: 'Fundamentos' },
          { id: 'm1q1_2', prompt: 'Selecciona el mejor ejemplo de riesgo (no issue):', options: ['Retraso ya ocurrido','Podría faltar un ingeniero clave','Factura rechazada','Servidor caído ahora'], answerIndex: 1, explanation: 'Riesgo = evento incierto futuro.', domain: 'Fundamentos' },
          { id: 'm1q1_3', prompt: 'Qué artefacto define la estrategia general de gestión de riesgos?', options: ['Acta','Plan de riesgos','Registro de interesados','Matriz RACI'], answerIndex: 1, explanation: 'El plan de riesgos define enfoque, roles y reporting.', domain: 'Planificación' },
          { id: 'm1q1_4', prompt: 'Qué significa oportunidad en gestión de riesgos?', options: ['Evento incierto con efecto positivo','Evento seguro con efecto neutro','Costo hundido','Evento fuera de alcance'], answerIndex: 0, explanation: 'Oportunidad = impacto positivo si ocurre.', domain: 'Fundamentos' },
          { id: 'm1q1_5', prompt: 'El apetito de riesgo lo define…', options: ['El equipo de proyecto','La alta dirección/Patrocinador','El proveedor','PMO obligatoriamente'], answerIndex: 1, explanation: 'Se establece a nivel organizacional/patrocinio.', domain: 'Gobernanza' },
          { id: 'm1q1_6', prompt: 'Cuál NO es un beneficio del registro de riesgos?', options: ['Trazabilidad de decisiones','Evitar todos los riesgos','Responsables claros','Estado y próximos pasos'], answerIndex: 1, explanation: 'No se puede “evitar todos los riesgos”.', domain: 'Registro' },
        ]},
      ],
    },
    {
      id: 'm2',
      title: 'Plan de gestión de riesgos',
      lessons: [
        {
          id: 'm2l1',
          title: 'Componentes del plan',
          content: 'Incluye: objetivo y alcance; roles y responsabilidades; RBS; criterios prob‑impacto; métodos de análisis; umbrales; reservas y gobernanza; reporting y frecuencia.
El plan estandariza y evita decisiones ad hoc.',
          chart: { data: [
            { label: 'Roles', value: 20 },
            { label: 'RBS', value: 30 },
            { label: 'Criterios', value: 40 },
            { label: 'Umbrales', value: 35 },
            { label: 'Rep.', value: 25 },
          ], caption: 'Énfasis típico al redactar un plan' },
          video: 'https://www.youtube.com/watch?v=3Q2planRBS'
        },
        {
          id: 'm2l2',
          title: 'Gobernanza y responsabilidades',
          content: 'Define propietarios de riesgo, comité de riesgos, niveles de escalamiento y auditoría.
Un owner por riesgo asegura ejecución de respuestas y seguimiento.',
          chart: { data: [
            { label: 'Owner', value: 45 },
            { label: 'Comité', value: 35 },
            { label: 'Escala', value: 30 },
            { label: 'Aud.', value: 20 },
          ], caption: 'Elementos clave de gobernanza' },
          video: 'https://www.youtube.com/watch?v=4govRisk'
        },
      ],
      activities: [
        { id: 'm2a1', title: 'Esbozo de plan de riesgos', brief: 'Redacta 1 página con roles, criterios y umbrales para un proyecto real.', placeholder: 'Escribe tu esbozo aquí…' },
      ],
      quizzes: [
        { id: 'm2q1', title: 'Mini-examen Módulo 2 (5 preguntas)', questions: [
          { id: 'm2q1_1', prompt: '¿Qué artefacto organiza categorías de riesgo por áreas?', options: ['RACI','RBS','OBS','PBS'], answerIndex: 1, explanation: 'RBS = Risk Breakdown Structure.', domain: 'Planificación' },
          { id: 'm2q1_2', prompt: 'Qué sección del plan define cuándo reportar y a quién?', options: ['Metodología','Reporting','Criterios','Cronograma'], answerIndex: 1, explanation: 'El plan especifica formatos y frecuencia de reporting.', domain: 'Planificación' },
          { id: 'm2q1_3', prompt: 'Los umbrales sirven para…', options: ['Estimaciones de costo','Disparar acciones al superarse límites','Definir EDT','Definir roles contables'], answerIndex: 1, explanation: 'Umbrales disparan acciones.', domain: 'Planificación' },
          { id: 'm2q1_4', prompt: 'Quién aprueba el plan de riesgos típicamente?', options: ['Patrocinador/Steering','Proveedor','Cualquier miembro','Oficial de cumplimiento exclusivamente'], answerIndex: 0, explanation: 'Alta dirección/steering aprueba planes clave.', domain: 'Gobernanza' },
          { id: 'm2q1_5', prompt: 'Qué relación tienen apetito y umbrales?', options: ['Independientes','Umbrales operacionalizan el apetito','Umbrales sustituyen apetito','No se relacionan'], answerIndex: 1, explanation: 'Umbrales traducen apetito a límites medibles.', domain: 'Planificación' },
        ]},
      ],
    },
    {
      id: 'm3',
      title: 'Identificación de riesgos',
      lessons: [
        {
          id: 'm3l1',
          title: 'Técnicas y fuentes',
          content: 'Combina técnicas para reducir sesgo: Delphi (consenso anónimo), brainstorming (divergencia), entrevistas (profundidad), checklists (cobertura), análisis de supuestos y restricciones (desbloquea riesgos sistémicos).',
          chart: { data: [
            { label: 'Delphi', value: 35 },
            { label: 'Brain', value: 30 },
            { label: 'Entrev', value: 25 },
            { label: 'Chk', value: 20 },
            { label: 'Sup/Res', value: 40 },
          ], caption: 'Eficacia relativa (ejemplo) por técnica' },
          video: 'https://www.youtube.com/watch?v=5idRiskTech'
        },
        {
          id: 'm3l2',
          title: 'Registro de riesgos (atributos)',
          content: 'Registra: causa → riesgo → impacto esperado; categoría RBS; disparadores; owner propuesto; respuesta preliminar.
Mantén descripciones claras: “Debido a [causa], podría ocurrir [riesgo], lo que resultaría en [impacto]”.',
          chart: { data: [
            { label: 'Causa', value: 30 },
            { label: 'Riesgo', value: 40 },
            { label: 'Impacto', value: 35 },
            { label: 'RBS', value: 20 },
          ], caption: 'Atributos mínimos recomendados' },
          video: 'https://www.youtube.com/watch?v=6regRiskLog'
        },
      ],
      activities: [
        { id: 'm3a1', title: 'Ejercicio de identificación', brief: 'Identifica 8 riesgos (5 amenazas, 3 oportunidades) para un caso ERP y clasifícalos en RBS.', placeholder: 'Lista y clasifica tus riesgos…' },
      ],
      quizzes: [
        { id: 'm3q1', title: 'Mini-examen Módulo 3 (6 preguntas)', questions: [
          { id: 'm3q1_1', prompt: 'Mejor técnica para evitar sesgo de líder dominante:', options: ['Brainstorming abierto','Delphi','Entrevistas públicas','Votación a mano alzada'], answerIndex: 1, explanation: 'Delphi garantiza anonimato y consenso.', domain: 'Identificación' },
          { id: 'm3q1_2', prompt: 'Cuál es una ENTRADA de Identificar Riesgos?', options: ['Plan de riesgos','Registro de riesgos','EMV','Curva S'], answerIndex: 0, explanation: 'Plan de riesgos guía la identificación.', domain: 'Entradas' },
          { id: 'm3q1_3', prompt: 'Elemento que NO es típico del registro en esta fase:', options: ['Causa','Impacto monetario exacto','Categoría RBS','Disparadores'], answerIndex: 1, explanation: 'El impacto monetario exacto es del cuantitativo.', domain: 'Registro' },
          { id: 'm3q1_4', prompt: 'Qué técnica ayuda a descubrir “puntos ciegos” regulatorios?', options: ['Revisión normativa','Mapa de calor','PERT','Planning poker'], answerIndex: 0, explanation: 'La base regulatoria es crítica para cumplimiento.', domain: 'Identificación' },
          { id: 'm3q1_5', prompt: 'Riesgo vs causa:', options: ['Son lo mismo','La causa antecede al riesgo','La causa es la respuesta','La causa es el impacto'], answerIndex: 1, explanation: 'Causa → Riesgo → Impacto.', domain: 'Fundamentos' },
          { id: 'm3q1_6', prompt: 'Qué documento histórico ayuda más en identificación?', options: ['Lecciones aprendidas','Presupuesto vigente','Plan de adquisiciones','WBS sólo'], answerIndex: 0, explanation: 'Lecciones aprendidas evitan repetir errores.', domain: 'Lecciones' },
        ]},
      ],
    },
    {
      id: 'm4',
      title: 'Análisis cualitativo y cuantitativo',
      lessons: [
        {
          id: 'm4l1',
          title: 'Cualitativo (prob‑impacto, urgencia)',
          content: 'Normaliza escalas (por ejemplo 1–5) y criterios de probabilidad e impacto. Añade urgencia y detectabilidad si aplica. La salida es una lista priorizada con racionales.',
          chart: { data: [
            { label: 'Prob', value: 50 },
            { label: 'Impact', value: 50 },
            { label: 'Urg', value: 30 },
          ], caption: 'Criterios frecuentes en cualitativo' },
          video: 'https://www.youtube.com/watch?v=7qualRisk'
        },
        {
          id: 'm4l2',
          title: 'Cuantitativo (EMV, Monte Carlo)',
          content: 'El análisis cuantitativo convierte la incertidumbre en métricas: EMV = p × i, árboles de decisión para alternativas, simulación Monte Carlo para distribución de resultados. Considera correlaciones.',
          chart: { data: [
            { label: 'EMV', value: 40 },
            { label: 'Tornado', value: 35 },
            { label: 'MC', value: 45 },
          ], caption: 'Herramientas clave del cuantitativo' },
          video: 'https://www.youtube.com/watch?v=8quantRisk'
        },
      ],
      activities: [
        { id: 'm4a1', title: 'Priorización cualitativa', brief: 'Construye una matriz prob‑impacto para 12 riesgos identificados y prioriza el Top 5.', placeholder: 'Pega tu matriz o describe el Top 5 con razones…' },
      ],
      quizzes: [
        { id: 'm4q1', title: 'Mini-examen Módulo 4 (6 preguntas)', questions: [
          { id: 'm4q1_1', prompt: 'Una salida del análisis cualitativo es:', options: ['Lista priorizada de riesgos','EMV por alternativa','Reserva de gestión','Ruta crítica'], answerIndex: 0, explanation: 'Resultado típico: ranking priorizado.', domain: 'Cualitativo' },
          { id: 'm4q1_2', prompt: 'Qué distribución suele usarse en PERT?', options: ['Triangular','Normal','Beta','Poisson'], answerIndex: 2, explanation: 'PERT emplea beta (o aproximación).', domain: 'Cuantitativo' },
          { id: 'm4q1_3', prompt: 'El EMV se calcula como:', options: ['Impacto × Costo fijo','Probabilidad × Impacto','Impacto / Probabilidad','Probabilidad + Impacto'], answerIndex: 1, explanation: 'EMV = p × i.', domain: 'Cuantitativo' },
          { id: 'm4q1_4', prompt: 'Si hay correlación alta entre riesgos, la simulación debe:', options: ['Ignorarla','Asumir independencia','Modelarla explícitamente','Reducir iteraciones'], answerIndex: 2, explanation: 'La correlación cambia la dispersión de resultados.', domain: 'Cuantitativo' },
          { id: 'm4q1_5', prompt: 'Qué sesgo puede inflar impactos estimados?', options: ['Anclaje','Optimismo','Disponibilidad','Todos'], answerIndex: 3, explanation: 'Varios sesgos afectan estimaciones.', domain: 'Psicología del riesgo' },
          { id: 'm4q1_6', prompt: 'La matriz de calor sirve para:', options: ['Reporte ejecutivo visual','Calcular EMV','Definir EDT','Asignar contratos'], answerIndex: 0, explanation: 'Facilita comunicación y foco.', domain: 'Cualitativo' },
        ]},
      ],
    },
    {
      id: 'm5',
      title: 'Planificación e implementación de respuestas',
      lessons: [
        {
          id: 'm5l1',
          title: 'Estrategias para amenazas y oportunidades',
          content: 'Amenazas: evitar, mitigar, transferir, aceptar.
Oportunidades: explotar, compartir, mejorar, aceptar.
Selecciona estrategia según probabilidad, impacto, costo y apetito.',
          chart: { data: [
            { label: 'Evitar', value: 25 },
            { label: 'Mitigar', value: 40 },
            { label: 'Transf', value: 30 },
            { label: 'Aceptar', value: 20 },
          ], caption: 'Frecuencia típica de uso (ejemplo)' },
          video: 'https://www.youtube.com/watch?v=9respRisk'
        },
        {
          id: 'm5l2',
          title: 'Reservas, triggers y contingencias',
          content: 'Contingencia: para riesgos identificados; Gestión: para desconocidos.
Define triggers observables para activar planes. Documenta supuestos y límites de uso de reservas.',
          chart: { data: [
            { label: 'Cont', value: 45 },
            { label: 'Gest', value: 35 },
            { label: 'Trig', value: 40 },
          ], caption: 'Componentes críticos en la respuesta' },
          video: 'https://www.youtube.com/watch?v=10contRisk'
        },
      ],
      activities: [
        { id: 'm5a1', title: 'Diseño de plan de respuesta', brief: 'Para los 5 riesgos Top, define estrategia, responsable, trigger y costo estimado.', placeholder: 'Plan de respuesta por riesgo…' },
      ],
      quizzes: [
        { id: 'm5q1', title: 'Mini-examen Módulo 5 (5 preguntas)', questions: [
          { id: 'm5q1_1', prompt: 'Transferir una amenaza implica:', options: ['Eliminar su causa','Reducir su probabilidad','Mover el impacto a un tercero mediante contrato/seguro','Aceptarla sin acción'], answerIndex: 2, explanation: 'Transferencia contractual/seguro.', domain: 'Respuestas' },
          { id: 'm5q1_2', prompt: 'Explotar una oportunidad busca:', options: ['Aumentar impacto negativo','Maximizar probabilidad de beneficio','Reducir variabilidad','Documentar sin actuar'], answerIndex: 1, explanation: 'Explotar = asegurar que ocurra.', domain: 'Respuestas' },
          { id: 'm5q1_3', prompt: 'Las reservas de gestión cubren:', options: ['Riesgos identificados','Riesgos desconocidos','Costos fijos','Gastos operativos'], answerIndex: 1, explanation: 'Gestión = unknown unknowns.', domain: 'Reservas' },
          { id: 'm5q1_4', prompt: 'Qué debes definir para poder activar una contingencia?', options: ['KPI de ventas','Trigger/condición','Ruta crítica','SLA del proveedor'], answerIndex: 1, explanation: 'Trigger define cuándo activar.', domain: 'Planificación' },
          { id: 'm5q1_5', prompt: 'Quién ejecuta la respuesta?', options: ['Propietario del riesgo','PMO','Patrocinador','QA'], answerIndex: 0, explanation: 'Owner responsable de ejecutar/coordinar.', domain: 'Gobernanza' },
        ]},
      ],
    },
    {
      id: 'm6',
      title: 'Monitoreo, control y mejora',
      lessons: [
        {
          id: 'm6l1',
          title: 'Seguimiento de respuestas y KRIs',
          content: 'Define indicadores adelantados (KRIs) y umbrales de alerta. Revisa ejecución de respuestas, riesgos residuales y emergentes. Usa tableros visuales.',
          chart: { data: [
            { label: 'KRI', value: 50 },
            { label: 'Resp', value: 35 },
            { label: 'Resid', value: 30 },
          ], caption: 'Focos de monitoreo' },
          video: 'https://www.youtube.com/watch?v=11kriRisk'
        },
        {
          id: 'm6l2',
          title: 'Lecciones y mejora continua',
          content: 'Captura sistemática: qué se esperaba, qué ocurrió, por qué, qué haríamos distinto. Integra las lecciones al plan y a la RBS. Comunica a toda la organización.',
          chart: { data: [
            { label: 'Capt', value: 30 },
            { label: 'Anal', value: 35 },
            { label: 'Integr', value: 40 },
          ], caption: 'Ciclo de lecciones aprendidas' },
          video: 'https://www.youtube.com/watch?v=12lessonRisk'
        },
      ],
      activities: [
        { id: 'm6a1', title: 'Simulación de comité de riesgos', brief: 'Redacta minuta con decisiones de escalamiento, cierre y actualización de reservas.', placeholder: 'Minuta de comité…' },
      ],
      quizzes: [
        { id: 'm6q1', title: 'Mini-examen Módulo 6 (5 preguntas)', questions: [
          { id: 'm6q1_1', prompt: 'Indicador más adecuado para anticipar materialización:', options: ['KRI','KPI de ventas','ROI','EVA'], answerIndex: 0, explanation: 'KRIs monitorean exposición.', domain: 'Monitoreo' },
          { id: 'm6q1_2', prompt: 'Qué hacer con un riesgo que ya ocurrió?', options: ['Mantener como riesgo','Convertirlo en issue y gestionar','Eliminar del registro sin más','Ignorarlo'], answerIndex: 1, explanation: 'Pasa a issue/gestión de incidentes.', domain: 'Control' },
          { id: 'm6q1_3', prompt: 'Qué documento debe actualizarse tras ejecutar una respuesta?', options: ['Diccionario EDT','Registro de riesgos','Acta constitución','Contrato marco'], answerIndex: 1, explanation: 'Registro refleja estado/residual.', domain: 'Registro' },
          { id: 'm6q1_4', prompt: 'Cuándo conviene cerrar un riesgo?', options: ['Nunca','Cuando prob y/o impacto son insignificantes o ya no aplican','Solo al final del proyecto','Cuando el patrocinador lo pida'], answerIndex: 1, explanation: 'Se cierra si pierde relevancia o ya no puede ocurrir.', domain: 'Control' },
          { id: 'm6q1_5', prompt: 'Qué práctica asegura aprendizaje organizacional?', options: ['No documentar para ahorrar tiempo','Lecciones aprendidas integradas a procesos','Reuniones ad hoc sin registros','Delegar todo a QA'], answerIndex: 1, explanation: 'Lecciones integradas y reutilizadas.', domain: 'Mejora continua' },
        ]},
      ],
    },
  ],
};

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

  const totalSimQuestions = COURSE.simulator.questions.length
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
                    <Badge>{COURSE.simulator.questions.length} preguntas</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Temporizador y retroalimentación. Al finalizar verás resultados por dominio y una sugerencia de estudio.</p>
                  <Simulator
                    config={COURSE.simulator}
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




