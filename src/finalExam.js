// finalExam.js
// Banco de preguntas del simulador/examen final.

const FINAL_EXAM = [
  {
    id: 'simq1',
    prompt:
      'Estás planificando la gestión de riesgos en un proyecto de Odoo ERP con fuerte resistencia al cambio. ¿Cuál es la MEJOR acción inicial?',
    options: [
      'Aplicar de inmediato reservas de contingencia en el cronograma',
      'Definir roles, apetito de riesgo y umbrales con los interesados clave',
      'Ejecutar entrevistas para identificar riesgos técnicos',
      'Elevar un cambio de alcance para añadir un plan de comunicación',
    ],
    answerIndex: 1,
    explanation:
      'En Planificar la Gestión de Riesgos se establecen roles, apetito y umbrales antes de identificar y responder.',
    domain: 'Planificación',
  },
  {
    id: 'simq2',
    prompt:
      'Tienes una lista extensa de riesgos. El patrocinador te pide priorizar hoy. ¿Qué herramienta cualitativa usas primero?',
    options: [
      'Simulación Monte Carlo',
      'Árbol de decisiones',
      'Matriz probabilidad-impacto con criterios estandarizados',
      'Análisis de sensibilidad (tornado)',
    ],
    answerIndex: 2,
    explanation:
      'La priorización inicial se aborda con análisis cualitativo prob-impacto.',
    domain: 'Análisis cualitativo',
  },
  {
    id: 'simq3',
    prompt:
      'Una oportunidad permitiría reducir 8% el tiempo de pruebas si se contrata un experto externo. Mejor estrategia:',
    options: ['Aceptar', 'Explotar', 'Transferir', 'Mitigar'],
    answerIndex: 1,
    explanation: 'Explotar maximiza la probabilidad de que la oportunidad ocurra.',
    domain: 'Respuestas a oportunidades',
  },
  {
    id: 'simq4',
    prompt:
      'El disparador (trigger) ocurrió y la acción preventiva no se ejecutó. ¿Qué haces primero?',
    options: [
      'Registrar lección y cerrar',
      'Ejecutar la contingencia y actualizar el registro',
      'Recalcular reservas de gestión',
      'Solicitar cambio a la EDT',
    ],
    answerIndex: 1,
    explanation: 'Activa la contingencia y actualiza el registro/seguimiento.',
    domain: 'Monitoreo y control',
  },
  {
    id: 'simq5',
    prompt:
      'El plan de gestión de riesgos debe definir, entre otros, los umbrales. ¿Qué enunciado es correcto?',
    options: [
      'Los umbrales se definen solo para costos',
      'Los umbrales son límites cuantitativos que disparan acciones',
      'Los umbrales reemplazan al apetito',
      'Los umbrales son exclusivos de riesgos técnicos',
    ],
    answerIndex: 1,
    explanation:
      'Umbrales = límites cuantitativos/condiciones que disparan acciones.',
    domain: 'Planificación',
  },
  {
    id: 'simq6',
    prompt: 'Qué salida PRODUCE Identificar Riesgos?',
    options: [
      'Plan de gestión de riesgos',
      'Registro de riesgos actualizado',
      'Matriz prob-impacto',
      'Reservas de contingencia',
    ],
    answerIndex: 1,
    explanation:
      'La salida principal es el registro de riesgos (y atributos iniciales).',
    domain: 'Identificación',
  },
  {
    id: 'simq7',
    prompt: 'Cuál es el objetivo del análisis cuantitativo?',
    options: [
      'Determinar causas raíz',
      'Priorizar cualitativamente',
      'Cuantificar efecto en objetivos con datos numéricos',
      'Definir responsables',
    ],
    answerIndex: 2,
    explanation:
      'El análisis cuantitativo cuantifica el efecto con modelos numéricos.',
    domain: 'Análisis cuantitativo',
  },
  {
    id: 'simq8',
    prompt: 'Reserva usada para eventos identificados con plan de respuesta:',
    options: [
      'Reserva de gestión',
      'Reserva de contingencia',
      'Amortiguador de cadena crítica',
      'Holgura total',
    ],
    answerIndex: 1,
    explanation:
      'Contingencia = para riesgos identificados; gestión = para desconocidos.',
    domain: 'Planificación de respuestas',
  },
  {
    id: 'simq9',
    prompt: 'Mejor técnica para descubrir riesgos sistémicos entre áreas:',
    options: [
      'Lista de verificación',
      'Entrevistas 1:1',
      'Análisis de supuestos y restricciones',
      'Análisis de árbol de fallos',
    ],
    answerIndex: 2,
    explanation:
      'Los supuestos/restricciones mal planteados revelan riesgos sistémicos.',
    domain: 'Identificación',
  },
  {
    id: 'simq10',
    prompt:
      'En un árbol de decisiones, eligiendo una alternativa con EMV mayor, ¿qué estás maximizando?',
    options: [
      'Valor esperado',
      'Valor mínimo garantizado',
      'Probabilidad de éxito',
      'ROI contable',
    ],
    answerIndex: 0,
    explanation: 'El EMV guía la elección bajo incertidumbre.',
    domain: 'Cuantitativo',
  },
  {
    id: 'simq11',
    prompt: 'Qué estrategia NO corresponde a amenazas:',
    options: ['Evitar', 'Mitigar', 'Transferir', 'Explotar'],
    answerIndex: 3,
    explanation: 'Explotar es estrategia de oportunidades.',
    domain: 'Respuestas',
  },
  {
    id: 'simq12',
    prompt:
      'Indicador útil en seguimiento de riesgos para saber si las respuestas están funcionando:',
    options: ['SPI', 'KRI (indicador clave de riesgo)', 'IRR', 'Lead time'],
    answerIndex: 1,
    explanation: 'KRIs miden exposición y eficacia de respuestas.',
    domain: 'Monitoreo',
  },
  {
    id: 'simq13',
    prompt:
      'Qué documento define “quién informa qué, a quién y cuándo” sobre riesgos?',
    options: ['Plan de comunicaciones', 'Registro de interesados', 'Plan de riesgos', 'Acta de constitución'],
    answerIndex: 2,
    explanation: 'El plan de riesgos incluye reporting/formatos de comunicación.',
    domain: 'Planificación',
  },
  {
    id: 'simq14',
    prompt:
      'Qué técnica acelera la identificación en grupos numerosos y reduce sesgo del dominador?',
    options: ['Entrevistas', 'Delphi', 'Revisión de documentos', 'Lluvia de ideas abierta'],
    answerIndex: 1,
    explanation: 'Delphi logra consenso anónimo y reduce sesgos.',
    domain: 'Identificación',
  },
  {
    id: 'simq15',
    prompt:
      'Si la distribución de duraciones es altamente asimétrica, qué simulación captura mejor esa realidad?',
    options: ['Uniforme', 'Normal', 'Triangular/PERT', 'Binomial'],
    answerIndex: 2,
    explanation: 'Triangular/PERT modelan asimetría en tareas.',
    domain: 'Cuantitativo',
  },
  {
    id: 'simq16',
    prompt:
      'Cambiar proveedor para reducir probabilidad de falla es ejemplo de:',
    options: ['Mitigar', 'Transferir', 'Aceptar', 'Escalar'],
    answerIndex: 0,
    explanation: 'Mitigar reduce probabilidad/impacto de amenazas.',
    domain: 'Respuestas',
  },
  {
    id: 'simq17',
    prompt:
      'Qué elemento del registro de riesgos facilita auditar la efectividad de las respuestas?',
    options: [
      'Categoría RBS',
      'Propietario del riesgo',
      'Estrategia y plan de respuesta',
      'Fecha de identificación',
    ],
    answerIndex: 2,
    explanation: 'Estrategia + plan permiten evaluar ejecución/efectividad.',
    domain: 'Registro',
  },
  {
    id: 'simq18',
    prompt: 'Cuál es la mejor fuente para identificar riesgos de cumplimiento en banca?',
    options: ['Lecciones aprendidas internas', 'Normativa del regulador', 'Encuesta de clima', 'WBS'],
    answerIndex: 1,
    explanation: 'La normativa aplicable origina requisitos y riesgos de cumplimiento.',
    domain: 'Identificación',
  },
  {
    id: 'simq19',
    prompt: 'Una respuesta a oportunidad “compartir” se parece más a:',
    options: ['Mitigar', 'Transferir', 'Explotar', 'Escalar'],
    answerIndex: 1,
    explanation: 'Compartir oportunidades = alianza/contrato para repartir beneficios.',
    domain: 'Respuestas',
  },
  {
    id: 'simq20',
    prompt: 'Qué debes hacer si un riesgo residual supera el umbral?',
    options: [
      'Aceptarlo documentado',
      'Escalarlo y/o planificar respuesta adicional',
      'Cerrar el riesgo',
      'Ignorarlo si la probabilidad es baja',
    ],
    answerIndex: 1,
    explanation: 'Si supera umbral, requiere decisión/escalamiento o respuesta extra.',
    domain: 'Monitoreo',
  },
  {
    id: 'simq21',
    prompt: 'Relación correcta entre RBS y EDT:',
    options: [
      'RBS descompone entregables',
      'RBS descompone fuentes/categorías de riesgo',
      'Son equivalentes',
      'Ninguna',
    ],
    answerIndex: 1,
    explanation: 'EDT = entregables; RBS = categorías/fuentes de riesgo.',
    domain: 'Fundamentos',
  },
  {
    id: 'simq22',
    prompt: 'Cuál es una salida del análisis cualitativo?',
    options: ['Lista priorizada de riesgos', 'Curvas S', 'EMV de alternativas', 'Plan de reservas'],
    answerIndex: 0,
    explanation: 'Salida típica: lista priorizada con puntuaciones y racionales.',
    domain: 'Cualitativo',
  },
  {
    id: 'simq23',
    prompt: 'Quién es responsable de ejecutar el plan de respuesta?',
    options: ['PMO', 'Propietario del riesgo', 'Patrocinador', 'Comité de dirección'],
    answerIndex: 1,
    explanation: 'Cada riesgo tiene un owner para ejecutar/coordinar respuestas.',
    domain: 'Gobernanza',
  },
  {
    id: 'simq24',
    prompt: 'Cuál métrica mirarías para saber si una respuesta de transferencia (seguro) fue adecuada?',
    options: ['Prima vs cobertura y deducible', 'Nº de reuniones', 'Duración del proyecto', '% de alcance completado'],
    answerIndex: 0,
    explanation: 'Transferir = analizar cobertura efectiva y costo asociado.',
    domain: 'Respuestas',
  },
  {
    id: 'simq25',
    prompt: 'Qué práctica evita “listas infinitas” y centra el análisis en lo material?',
    options: ['Categorización RBS', 'Definir criterios y umbrales claros', 'Reuniones más largas', 'Añadir más participantes'],
    answerIndex: 1,
    explanation: 'Criterios/umbrales evitan dispersión y enfocan en lo relevante.',
    domain: 'Planificación',
  },
];

export default FINAL_EXAM;
