// courseData.js
// Contiene el contenido del curso: módulos, lecciones, actividades y mini-exámenes.
// OJO: las preguntas del simulador final NO van aquí. Solo la duración.
// Las preguntas del simulador están en finalExam.js.

const COURSE = {
  title: 'Preparación para Certificación en Gestión de Riesgos (PMI-RMP®)',
  subtitle: 'Curso práctico con actividades y exámenes',
  simulator: {
    durationMinutes: 60, // Las preguntas se importan desde finalExam.js
  },
  modules: [
    {
      id: 'm1',
      title: 'Fundamentos y marco de referencia',
      lessons: [
        {
          id: 'm1l1',
          title: 'Conceptos clave y terminología',
          content: `Riesgo: evento incierto que, si ocurre, impacta objetivos.
Issue: evento que ya ocurrió.
Amenaza vs Oportunidad: impacto negativo vs positivo.
Apetito: preferencia organizacional por el riesgo (macro).
Tolerancia/Umbral: límites medibles que disparan acciones.`,
          chart: {
            data: [
              { label: 'Amenaza', value: 60 },
              { label: 'Oport.', value: 40 },
              { label: 'Apet.', value: 70 },
              { label: 'Umbral', value: 50 },
            ],
            caption: 'Relación conceptual entre tipos de riesgo y gobierno',
          },
          video: 'https://www.youtube.com/watch?v=1G5a3Q_risk',
        },
        {
          id: 'm1l2',
          title: 'Procesos de gestión de riesgos',
          content: `Secuencia típica: Planificar → Identificar → Analizar (cuali/cuanti) → Planificar respuestas → Implementar → Monitorear/Controlar.
Cada proceso tiene entradas, herramientas y salidas específicas (ITTOs) que conviene dominar para el examen.`,
          chart: {
            data: [
              { label: 'Plan', value: 20 },
              { label: 'ID', value: 30 },
              { label: 'Cuali', value: 40 },
              { label: 'Cuanti', value: 35 },
              { label: 'Resp', value: 25 },
              { label: 'Mon', value: 30 },
            ],
            caption: 'Peso relativo aproximado de esfuerzo por proceso',
          },
          video: 'https://www.youtube.com/watch?v=2H7p9Q_process',
        },
      ],
      activities: [
        {
          id: 'm1a1',
          title: 'Mapa conceptual de riesgos',
          brief:
            'Relaciona apetito, umbrales, RBS y procesos. Describe 3 ejemplos de tu contexto.',
          placeholder: 'Describe tu mapa o pega enlace a Miro/Mural…',
        },
      ],
      quizzes: [
        {
          id: 'm1q1',
          title: 'Mini-examen Módulo 1 (6 preguntas)',
          questions: [
            {
              id: 'm1q1_1',
              prompt:
                '¿Qué diferencia principal hay entre apetito y tolerancia al riesgo?',
              options: [
                'Apetito = máximo permitido; Tolerancia = preferencia',
                'Apetito = preferencia general; Tolerancia = rangos medibles',
                'Son sinónimos',
                'Apetito solo a amenazas',
              ],
              answerIndex: 1,
              explanation:
                'Apetito (macro) vs Tolerancia (límites operativos).',
              domain: 'Fundamentos',
            },
            {
              id: 'm1q1_2',
              prompt: 'Selecciona el mejor ejemplo de riesgo (no issue):',
              options: [
                'Retraso ya ocurrido',
                'Podría faltar un ingeniero clave',
                'Factura rechazada',
                'Servidor caído ahora',
              ],
              answerIndex: 1,
              explanation: 'Riesgo = evento incierto futuro.',
              domain: 'Fundamentos',
            },
            {
              id: 'm1q1_3',
              prompt:
                'Qué artefacto define la estrategia general de gestión de riesgos?',
              options: [
                'Acta',
                'Plan de riesgos',
                'Registro de interesados',
                'Matriz RACI',
              ],
              answerIndex: 1,
              explanation:
                'El plan de riesgos define enfoque, roles y reporting.',
              domain: 'Planificación',
            },
            {
              id: 'm1q1_4',
              prompt: 'Qué significa oportunidad en gestión de riesgos?',
              options: [
                'Evento incierto con efecto positivo',
                'Evento seguro con efecto neutro',
                'Costo hundido',
                'Evento fuera de alcance',
              ],
              answerIndex: 0,
              explanation: 'Oportunidad = impacto positivo si ocurre.',
              domain: 'Fundamentos',
            },
            {
              id: 'm1q1_5',
              prompt: 'El apetito de riesgo lo define…',
              options: [
                'El equipo de proyecto',
                'La alta dirección/Patrocinador',
                'El proveedor',
                'PMO obligatoriamente',
              ],
              answerIndex: 1,
              explanation:
                'Se establece a nivel organizacional/patrocinio.',
              domain: 'Gobernanza',
            },
            {
              id: 'm1q1_6',
              prompt: 'Cuál NO es un beneficio del registro de riesgos?',
              options: [
                'Trazabilidad de decisiones',
                'Evitar todos los riesgos',
                'Responsables claros',
                'Estado y próximos pasos',
              ],
              answerIndex: 1,
              explanation: 'No se puede “evitar todos los riesgos”.',
              domain: 'Registro',
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
          content: `Incluye: objetivo y alcance; roles y responsabilidades; RBS; criterios prob-impacto; métodos de análisis; umbrales; reservas y gobernanza; reporting y frecuencia.
El plan estandariza y evita decisiones ad hoc.`,
          chart: {
            data: [
              { label: 'Roles', value: 20 },
              { label: 'RBS', value: 30 },
              { label: 'Criterios', value: 40 },
              { label: 'Umbrales', value: 35 },
              { label: 'Rep.', value: 25 },
            ],
            caption: 'Énfasis típico al redactar un plan',
          },
          video: 'https://www.youtube.com/watch?v=3Q2planRBS',
        },
        {
          id: 'm2l2',
          title: 'Gobernanza y responsabilidades',
          content: `Define propietarios de riesgo, comité de riesgos, niveles de escalamiento y auditoría.
Un owner por riesgo asegura ejecución de respuestas y seguimiento.`,
          chart: {
            data: [
              { label: 'Owner', value: 45 },
              { label: 'Comité', value: 35 },
              { label: 'Escala', value: 30 },
              { label: 'Aud.', value: 20 },
            ],
            caption: 'Elementos clave de gobernanza',
          },
          video: 'https://www.youtube.com/watch?v=4govRisk',
        },
      ],
      activities: [
        {
          id: 'm2a1',
          title: 'Esbozo de plan de riesgos',
          brief:
            'Redacta 1 página con roles, criterios y umbrales para un proyecto real.',
          placeholder: 'Escribe tu esbozo aquí…',
        },
      ],
      quizzes: [
        {
          id: 'm2q1',
          title: 'Mini-examen Módulo 2 (5 preguntas)',
          questions: [
            {
              id: 'm2q1_1',
              prompt:
                '¿Qué artefacto organiza categorías de riesgo por áreas?',
              options: ['RACI', 'RBS', 'OBS', 'PBS'],
              answerIndex: 1,
              explanation: 'RBS = Risk Breakdown Structure.',
              domain: 'Planificación',
            },
            {
              id: 'm2q1_2',
              prompt:
                'Qué sección del plan define cuándo reportar y a quién?',
              options: ['Metodología', 'Reporting', 'Criterios', 'Cronograma'],
              answerIndex: 1,
              explanation:
                'El plan especifica formatos y frecuencia de reporting.',
              domain: 'Planificación',
            },
            {
              id: 'm2q1_3',
              prompt: 'Los umbrales sirven para…',
              options: [
                'Estimaciones de costo',
                'Disparar acciones al superarse límites',
                'Definir EDT',
                'Definir roles contables',
              ],
              answerIndex: 1,
              explanation: 'Umbrales disparan acciones.',
              domain: 'Planificación',
            },
            {
              id: 'm2q1_4',
              prompt: 'Quién aprueba el plan de riesgos típicamente?',
              options: [
                'Patrocinador/Steering',
                'Proveedor',
                'Cualquier miembro',
                'Oficial de cumplimiento exclusivamente',
              ],
              answerIndex: 0,
              explanation: 'Alta dirección/steering aprueba planes clave.',
              domain: 'Gobernanza',
            },
            {
              id: 'm2q1_5',
              prompt: 'Qué relación tienen apetito y umbrales?',
              options: [
                'Independientes',
                'Umbrales operacionalizan el apetito',
                'Umbrales sustituyen apetito',
                'No se relacionan',
              ],
              answerIndex: 1,
              explanation:
                'Umbrales traducen apetito a límites medibles.',
              domain: 'Planificación',
            },
          ],
        },
      ],
    },

    {
      id: 'm3',
      title: 'Identificación de riesgos',
      lessons: [
        {
          id: 'm3l1',
          title: 'Técnicas y fuentes',
          content:
            'Combina técnicas para reducir sesgo: Delphi (consenso anónimo), brainstorming (divergencia), entrevistas (profundidad), checklists (cobertura), análisis de supuestos y restricciones (desbloquea riesgos sistémicos).',
          chart: {
            data: [
              { label: 'Delphi', value: 35 },
              { label: 'Brain', value: 30 },
              { label: 'Entrev', value: 25 },
              { label: 'Chk', value: 20 },
              { label: 'Sup/Res', value: 40 },
            ],
            caption: 'Eficacia relativa (ejemplo) por técnica',
          },
          video: 'https://www.youtube.com/watch?v=5idRiskTech',
        },
        {
          id: 'm3l2',
          title: 'Registro de riesgos (atributos)',
          content: `Registra: causa → riesgo → impacto esperado; categoría RBS; disparadores; owner propuesto; respuesta preliminar.
Mantén descripciones claras: “Debido a [causa], podría ocurrir [riesgo], lo que resultaría en [impacto]”.`,
          chart: {
            data: [
              { label: 'Causa', value: 30 },
              { label: 'Riesgo', value: 40 },
              { label: 'Impacto', value: 35 },
              { label: 'RBS', value: 20 },
            ],
            caption: 'Atributos mínimos recomendados',
          },
          video: 'https://www.youtube.com/watch?v=6regRiskLog',
        },
      ],
      activities: [
        {
          id: 'm3a1',
          title: 'Ejercicio de identificación',
          brief:
            'Identifica 8 riesgos (5 amenazas, 3 oportunidades) para un caso ERP y clasifícalos en RBS.',
          placeholder: 'Lista y clasifica tus riesgos…',
        },
      ],
      quizzes: [
        {
          id: 'm3q1',
          title: 'Mini-examen Módulo 3 (6 preguntas)',
          questions: [
            {
              id: 'm3q1_1',
              prompt: 'Mejor técnica para evitar sesgo de líder dominante:',
              options: [
                'Brainstorming abierto',
                'Delphi',
                'Entrevistas públicas',
                'Votación a mano alzada',
              ],
              answerIndex: 1,
              explanation: 'Delphi garantiza anonimato y consenso.',
              domain: 'Identificación',
            },
            {
              id: 'm3q1_2',
              prompt: 'Cuál es una ENTRADA de Identificar Riesgos?',
              options: ['Plan de riesgos', 'Registro de riesgos', 'EMV', 'Curva S'],
              answerIndex: 0,
              explanation: 'Plan de riesgos guía la identificación.',
              domain: 'Entradas',
            },
            {
              id: 'm3q1_3',
              prompt:
                'Elemento que NO es típico del registro en esta fase:',
              options: [
                'Causa',
                'Impacto monetario exacto',
                'Categoría RBS',
                'Disparadores',
              ],
              answerIndex: 1,
              explanation:
                'El impacto monetario exacto es del cuantitativo.',
              domain: 'Registro',
            },
            {
              id: 'm3q1_4',
              prompt:
                'Qué técnica ayuda a descubrir “puntos ciegos” regulatorios?',
              options: ['Revisión normativa', 'Mapa de calor', 'PERT', 'Planning poker'],
              answerIndex: 0,
              explanation:
                'La base regulatoria es crítica para cumplimiento.',
              domain: 'Identificación',
            },
            {
              id: 'm3q1_5',
              prompt: 'Riesgo vs causa:',
              options: [
                'Son lo mismo',
                'La causa antecede al riesgo',
                'La causa es la respuesta',
                'La causa es el impacto',
              ],
              answerIndex: 1,
              explanation: 'Causa → Riesgo → Impacto.',
              domain: 'Fundamentos',
            },
            {
              id: 'm3q1_6',
              prompt:
                'Qué documento histórico ayuda más en identificación?',
              options: [
                'Lecciones aprendidas',
                'Presupuesto vigente',
                'Plan de adquisiciones',
                'WBS sólo',
              ],
              answerIndex: 0,
              explanation:
                'Lecciones aprendidas evitan repetir errores.',
              domain: 'Lecciones',
            },
          ],
        },
      ],
    },

    {
      id: 'm4',
      title: 'Análisis cualitativo y cuantitativo',
      lessons: [
        {
          id: 'm4l1',
          title: 'Cualitativo (prob-impacto, urgencia)',
          content:
            'Normaliza escalas (por ejemplo 1–5) y criterios de probabilidad e impacto. Añade urgencia y detectabilidad si aplica. La salida es una lista priorizada con racionales.',
          chart: {
            data: [
              { label: 'Prob', value: 50 },
              { label: 'Impact', value: 50 },
              { label: 'Urg', value: 30 },
            ],
            caption: 'Criterios frecuentes en cualitativo',
          },
          video: 'https://www.youtube.com/watch?v=7qualRisk',
        },
        {
          id: 'm4l2',
          title: 'Cuantitativo (EMV, Monte Carlo)',
          content:
            'El análisis cuantitativo convierte la incertidumbre en métricas: EMV = p × i, árboles de decisión para alternativas, simulación Monte Carlo para distribución de resultados. Considera correlaciones.',
          chart: {
            data: [
              { label: 'EMV', value: 40 },
              { label: 'Tornado', value: 35 },
              { label: 'MC', value: 45 },
            ],
            caption: 'Herramientas clave del cuantitativo',
          },
          video: 'https://www.youtube.com/watch?v=8quantRisk',
        },
      ],
      activities: [
        {
          id: 'm4a1',
          title: 'Priorización cualitativa',
          brief:
            'Construye una matriz prob-impacto para 12 riesgos identificados y prioriza el Top 5.',
          placeholder:
            'Pega tu matriz o describe el Top 5 con razones…',
        },
      ],
      quizzes: [
        {
          id: 'm4q1',
          title: 'Mini-examen Módulo 4 (6 preguntas)',
          questions: [
            {
              id: 'm4q1_1',
              prompt: 'Una salida del análisis cualitativo es:',
              options: [
                'Lista priorizada de riesgos',
                'EMV por alternativa',
                'Reserva de gestión',
                'Ruta crítica',
              ],
              answerIndex: 0,
              explanation: 'Resultado típico: ranking priorizado.',
              domain: 'Cualitativo',
            },
            {
              id: 'm4q1_2',
              prompt: 'Qué distribución suele usarse en PERT?',
              options: ['Triangular', 'Normal', 'Beta', 'Poisson'],
              answerIndex: 2,
              explanation: 'PERT emplea beta (o aproximación).',
              domain: 'Cuantitativo',
            },
            {
              id: 'm4q1_3',
              prompt: 'El EMV se calcula como:',
              options: [
                'Impacto × Costo fijo',
                'Probabilidad × Impacto',
                'Impacto / Probabilidad',
                'Probabilidad + Impacto',
              ],
              answerIndex: 1,
              explanation: 'EMV = p × i.',
              domain: 'Cuantitativo',
            },
            {
              id: 'm4q1_4',
              prompt:
                'Si hay correlación alta entre riesgos, la simulación debe:',
              options: [
                'Ignorarla',
                'Asumir independencia',
                'Modelarla explícitamente',
                'Reducir iteraciones',
              ],
              answerIndex: 2,
              explanation:
                'La correlación cambia la dispersión de resultados.',
              domain: 'Cuantitativo',
            },
            {
              id: 'm4q1_5',
              prompt: 'Qué sesgo puede inflar impactos estimados?',
              options: ['Anclaje', 'Optimismo', 'Disponibilidad', 'Todos'],
              answerIndex: 3,
              explanation: 'Varios sesgos afectan estimaciones.',
              domain: 'Psicología del riesgo',
            },
            {
              id: 'm4q1_6',
              prompt: 'La matriz de calor sirve para:',
              options: [
                'Reporte ejecutivo visual',
                'Calcular EMV',
                'Definir EDT',
                'Asignar contratos',
              ],
              answerIndex: 0,
              explanation: 'Facilita comunicación y foco.',
              domain: 'Cualitativo',
            },
          ],
        },
      ],
    },

    {
      id: 'm5',
      title: 'Planificación e implementación de respuestas',
      lessons: [
        {
          id: 'm5l1',
          title: 'Estrategias para amenazas y oportunidades',
          content: `Amenazas: evitar, mitigar, transferir, aceptar.
Oportunidades: explotar, compartir, mejorar, aceptar.
Selecciona estrategia según probabilidad, impacto, costo y apetito.`,
          chart: {
            data: [
              { label: 'Evitar', value: 25 },
              { label: 'Mitigar', value: 40 },
              { label: 'Transf', value: 30 },
              { label: 'Aceptar', value: 20 },
            ],
            caption: 'Frecuencia típica de uso (ejemplo)',
          },
          video: 'https://www.youtube.com/watch?v=9respRisk',
        },
        {
          id: 'm5l2',
          title: 'Reservas, triggers y contingencias',
          content: `Contingencia: para riesgos identificados; Gestión: para desconocidos.
Define triggers observables para activar planes. Documenta supuestos y límites de uso de reservas.`,
          chart: {
            data: [
              { label: 'Cont', value: 45 },
              { label: 'Gest', value: 35 },
              { label: 'Trig', value: 40 },
            ],
            caption: 'Componentes críticos en la respuesta',
          },
          video: 'https://www.youtube.com/watch?v=10contRisk',
        },
      ],
      activities: [
        {
          id: 'm5a1',
          title: 'Diseño de plan de respuesta',
          brief:
            'Para los 5 riesgos Top, define estrategia, responsable, trigger y costo estimado.',
          placeholder: 'Plan de respuesta por riesgo…',
        },
      ],
      quizzes: [
        {
          id: 'm5q1',
          title: 'Mini-examen Módulo 5 (5 preguntas)',
          questions: [
            {
              id: 'm5q1_1',
              prompt: 'Transferir una amenaza implica:',
              options: [
                'Eliminar su causa',
                'Reducir su probabilidad',
                'Mover el impacto a un tercero mediante contrato/seguro',
                'Aceptarla sin acción',
              ],
              answerIndex: 2,
              explanation: 'Transferencia contractual/seguro.',
              domain: 'Respuestas',
            },
            {
              id: 'm5q1_2',
              prompt: 'Explotar una oportunidad busca:',
              options: [
                'Aumentar impacto negativo',
                'Maximizar probabilidad de beneficio',
                'Reducir variabilidad',
                'Documentar sin actuar',
              ],
              answerIndex: 1,
              explanation: 'Explotar = asegurar que ocurra.',
              domain: 'Respuestas',
            },
            {
              id: 'm5q1_3',
              prompt: 'Las reservas de gestión cubren:',
              options: [
                'Riesgos identificados',
                'Riesgos desconocidos',
                'Costos fijos',
                'Gastos operativos',
              ],
              answerIndex: 1,
              explanation: 'Gestión = unknown unknowns.',
              domain: 'Reservas',
            },
            {
              id: 'm5q1_4',
              prompt: 'Qué debes definir para poder activar una contingencia?',
              options: [
                'KPI de ventas',
                'Trigger/condición',
                'Ruta crítica',
                'SLA del proveedor',
              ],
              answerIndex: 1,
              explanation: 'Trigger define cuándo activar.',
              domain: 'Planificación',
            },
            {
              id: 'm5q1_5',
              prompt: 'Quién ejecuta la respuesta?',
              options: ['Propietario del riesgo', 'PMO', 'Patrocinador', 'QA'],
              answerIndex: 0,
              explanation:
                'Owner responsable de ejecutar/coordinar.',
              domain: 'Gobernanza',
            },
          ],
        },
      ],
    },

    {
      id: 'm6',
      title: 'Monitoreo, control y mejora',
      lessons: [
        {
          id: 'm6l1',
          title: 'Seguimiento de respuestas y KRIs',
          content:
            'Define indicadores adelantados (KRIs) y umbrales de alerta. Revisa ejecución de respuestas, riesgos residuales y emergentes. Usa tableros visuales.',
          chart: {
            data: [
              { label: 'KRI', value: 50 },
              { label: 'Resp', value: 35 },
              { label: 'Resid', value: 30 },
            ],
            caption: 'Focos de monitoreo',
          },
          video: 'https://www.youtube.com/watch?v=11kriRisk',
        },
        {
          id: 'm6l2',
          title: 'Lecciones y mejora continua',
          content:
            'Captura sistemática: qué se esperaba, qué ocurrió, por qué, qué haríamos distinto. Integra las lecciones al plan y a la RBS. Comunica a toda la organización.',
          chart: {
            data: [
              { label: 'Capt', value: 30 },
              { label: 'Anal', value: 35 },
              { label: 'Integr', value: 40 },
            ],
            caption: 'Ciclo de lecciones aprendidas',
          },
          video: 'https://www.youtube.com/watch?v=12lessonRisk',
        },
      ],
      activities: [
        {
          id: 'm6a1',
          title: 'Simulación de comité de riesgos',
          brief:
            'Redacta minuta con decisiones de escalamiento, cierre y actualización de reservas.',
          placeholder: 'Minuta de comité…',
        },
      ],
      quizzes: [
        {
          id: 'm6q1',
          title: 'Mini-examen Módulo 6 (5 preguntas)',
          questions: [
            {
              id: 'm6q1_1',
              prompt: 'Indicador más adecuado para anticipar materialización:',
              options: ['KRI', 'KPI de ventas', 'ROI', 'EVA'],
              answerIndex: 0,
              explanation: 'KRIs monitorean exposición.',
              domain: 'Monitoreo',
            },
            {
              id: 'm6q1_2',
              prompt: 'Qué hacer con un riesgo que ya ocurrió?',
              options: [
                'Mantener como riesgo',
                'Convertirlo en issue y gestionar',
                'Eliminar del registro sin más',
                'Ignorarlo',
              ],
              answerIndex: 1,
              explanation:
                'Pasa a issue/gestión de incidentes.',
              domain: 'Control',
            },
            {
              id: 'm6q1_3',
              prompt:
                'Qué documento debe actualizarse tras ejecutar una respuesta?',
              options: [
                'Diccionario EDT',
                'Registro de riesgos',
                'Acta constitución',
                'Contrato marco',
              ],
              answerIndex: 1,
              explanation: 'Registro refleja estado/residual.',
              domain: 'Registro',
            },
            {
              id: 'm6q1_4',
              prompt: 'Cuándo conviene cerrar un riesgo?',
              options: [
                'Nunca',
                'Cuando prob y/o impacto son insignificantes o ya no aplican',
                'Solo al final del proyecto',
                'Cuando el patrocinador lo pida',
              ],
              answerIndex: 1,
              explanation:
                'Se cierra si pierde relevancia o ya no puede ocurrir.',
              domain: 'Control',
            },
            {
              id: 'm6q1_5',
              prompt: 'Qué práctica asegura aprendizaje organizacional?',
              options: [
                'No documentar para ahorrar tiempo',
                'Lecciones aprendidas integradas a procesos',
                'Reuniones ad hoc sin registros',
                'Delegar todo a QA',
              ],
              answerIndex: 1,
              explanation:
                'Lecciones integradas y reutilizadas.',
              domain: 'Mejora continua',
            },
          ],
        },
      ],
    },
  ],
};

export default COURSE;
