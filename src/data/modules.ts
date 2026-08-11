export interface Screenshot {
  src: string
  alt: string
  /** intrinsic width/height ratio, reserves space before the image loads */
  aspect: number
}

export interface ModuleData {
  id: string
  index: number
  accent: string
  kicker: string
  title: string
  tagline: string
  description: string[]
  features: string[]
  screenshots: Screenshot[]
}

export const MODULES: ModuleData[] = [
  {
    id: 'comunidad',
    index: 1,
    accent: '#ff2d78',
    kicker: 'Módulo 01',
    title: 'Comunidad',
    tagline: 'Conecta a los ciudadanos con su gobierno',
    description: [
      'Los ciudadanos reportan incidencias en segundos: eligen categoría, agregan fotografía y ubicación. El sistema asigna automáticamente el reporte a la dependencia responsable y genera un folio de seguimiento.',
      'Durante todo el proceso, el ciudadano recibe notificaciones sobre los avances hasta la solución del problema — y la comunidad puede votar, comentar y sumarse a cada reporte público.',
    ],
    features: [
      'Reportes con foto, ubicación y folio automático',
      'Notificaciones de avance en tiempo real',
      'Votos, comentarios y seguimiento comunitario',
      'Encuestas para recopilar información ciudadana',
      'Publicación de eventos de la ciudad',
    ],
    screenshots: [
      { src: '/screenshots/comunidad-panel.png', alt: 'Panel de solicitudes ciudadanas con tablero de seguimiento', aspect: 1.6879 },
      { src: '/screenshots/comunidad-evento.png', alt: 'Publicación de eventos municipales', aspect: 1.2534 },
      { src: '/screenshots/comunidad-encuesta.png', alt: 'Creación de encuestas ciudadanas', aspect: 1.8578 },
    ],
  },
  {
    id: 'intranet',
    index: 2,
    accent: '#8b5cf6',
    kicker: 'Módulo 02',
    title: 'Intranet Gubernamental',
    tagline: 'Todas tus dependencias, un solo espacio digital',
    description: [
      'Integra a todas las áreas del gobierno en una sola plataforma para coordinar tareas, proyectos y solicitudes — con inteligencia artificial que detecta y resuelve cuellos de botella burocráticos.',
      'Cada proyecto tiene responsables, fechas límite, documentos y seguimiento en tiempo real. Los directivos visualizan indicadores estratégicos, identifican retrasos y deciden con información actualizada.',
    ],
    features: [
      'Gestión de tareas y proyectos entre dependencias',
      'Historial completo de cada actividad',
      'Indicadores estratégicos para directivos',
      'Colaboración a nivel municipal o estatal',
      'IA que detecta reportes estancados',
    ],
    screenshots: [
      { src: '/screenshots/intranet-gestion.png', alt: 'Gestión de estado, dependencia y seguimiento', aspect: 0.5243 },
      { src: '/screenshots/intranet-estancados.png', alt: 'Alerta de reportes estancados sin movimiento', aspect: 1.8962 },
      { src: '/screenshots/intranet-kpis.png', alt: 'Indicadores de reportes y tasa de resolución', aspect: 1.4521 },
    ],
  },
  {
    id: 'cobranza',
    index: 3,
    accent: '#25d366',
    kicker: 'Módulo 03',
    title: 'Cobranza Inteligente',
    tagline: 'IA y WhatsApp para recuperar impuestos y adeudos',
    description: [
      'La plataforma identifica a los contribuyentes con adeudos, segmenta la información y genera campañas automáticas por WhatsApp, correo electrónico y otros canales digitales.',
      'Cada mensaje incluye información personalizada y enlaces directos de pago. El bot con IA gestiona convenios ágiles, aplica descuentos estratégicos y resuelve dudas al instante — sin que nadie salga de casa.',
    ],
    features: [
      'Segmentación automática de deudores',
      'Campañas por WhatsApp, correo y más canales',
      'Bot de cobranza impulsado por IA',
      'Enlaces directos de pago personalizados',
      'Métricas de desempeño por campaña',
    ],
    screenshots: [
      { src: '/screenshots/cobranza-whatsapp.png', alt: 'Conversación del bot de cobranza por WhatsApp', aspect: 1.0097 },
      { src: '/screenshots/cobranza-conversaciones.png', alt: 'Tablero de conversaciones de campaña', aspect: 2.039 },
      { src: '/screenshots/cobranza-campanas.png', alt: 'Gestión de campañas de cobranza', aspect: 2.3129 },
    ],
  },
  {
    id: 'ventanilla',
    index: 4,
    accent: '#f5a623',
    kicker: 'Módulo 04',
    title: 'Ventanilla Digital de Pagos',
    tagline: 'Trámites y pagos 100% en línea',
    description: [
      'Desde una computadora o un teléfono, los ciudadanos solicitan servicios, cargan documentos, realizan pagos y consultan el estado de sus trámites en cualquier momento.',
      'Permisos para eventos, predial, licencias comerciales, infracciones: cualquier pago se da de alta en segundos para cualquier dependencia municipal o estatal. Todo digitalizado, sin filas ni procesos innecesarios.',
    ],
    features: [
      'Pagos y trámites desde cualquier dispositivo',
      'Alta de nuevos cobros en cuestión de segundos',
      'Documentos y expedientes 100% digitales',
      'Predial, licencias, permisos e infracciones',
      'Menores tiempos de atención ciudadana',
    ],
    screenshots: [
      { src: '/screenshots/ventanilla-pagos.png', alt: 'Gestión de pagos ciudadanos por dependencia', aspect: 2.3143 },
      { src: '/screenshots/ventanilla-registrar.png', alt: 'Registro de pago en ventanilla con comprobante', aspect: 0.6444 },
    ],
  },
  {
    id: 'multas',
    index: 5,
    accent: '#22d3ee',
    kicker: 'Módulo 05',
    title: 'Multas y Requerimientos Digitales',
    tagline: 'Tu dependencia opera desde el móvil',
    description: [
      'Los agentes emiten multas y requerimientos directamente desde su dispositivo móvil, registrando fotografías, ubicación, firmas y toda la evidencia necesaria.',
      'La información queda almacenada de inmediato: seguimiento, expedientes y transparencia total del proceso. El ciudadano recibe una boleta digital con código QR para pagar fácil y rápido.',
    ],
    features: [
      'Emisión de multas desde el dispositivo móvil',
      'Evidencia con fotos, ubicación y firmas',
      'Boletas digitales con código QR',
      'Catálogo de infracciones configurable',
      'Menos papel, más control y transparencia',
    ],
    screenshots: [
      { src: '/screenshots/multas-boleta.png', alt: 'Boleta de infracción generada con código QR', aspect: 0.5016 },
      { src: '/screenshots/multas-infracciones.png', alt: 'Generación de nueva multa desde el móvil', aspect: 0.7205 },
      { src: '/screenshots/multas-catalogo.png', alt: 'Catálogo de multas e infracciones de tránsito', aspect: 3.0495 },
    ],
  },
]

export type BenefitIcon =
  | 'papel'
  | 'recaudacion'
  | 'atencion'
  | 'transparencia'
  | 'datos'
  | 'escala'

export interface Benefit {
  title: string
  text: string
  icon: BenefitIcon
}

export const BENEFITS: Benefit[] = [
  {
    icon: 'papel',
    title: 'Menos papel',
    text: 'Expedientes, boletas y comprobantes 100% digitales, con respaldo inmediato de toda la información.',
  },
  {
    icon: 'recaudacion',
    title: 'Mayor recaudación',
    text: 'Campañas con IA por WhatsApp y correo que convierten adeudos en pagos sin que nadie salga de casa.',
  },
  {
    icon: 'atencion',
    title: 'Atención 24/7',
    text: 'El bot con inteligencia artificial responde dudas, gestiona convenios y aplica descuentos al instante.',
  },
  {
    icon: 'transparencia',
    title: 'Transparencia total',
    text: 'Cada reporte, trámite y multa genera folio, historial y evidencia consultable en tiempo real.',
  },
  {
    icon: 'datos',
    title: 'Decisiones con datos',
    text: 'Indicadores estratégicos para directivos: retrasos, tasas de resolución y desempeño por dependencia.',
  },
  {
    icon: 'escala',
    title: 'Escala municipal o estatal',
    text: 'Funciona en una dependencia, en todo el municipio o en colaboración a nivel estatal.',
  },
]
