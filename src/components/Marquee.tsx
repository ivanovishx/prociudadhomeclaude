const ITEMS = [
  'Comunidad',
  'Intranet Gubernamental',
  'Cobranza Inteligente',
  'Ventanilla Digital',
  'Multas Digitales',
  'Inteligencia Artificial',
  'WhatsApp',
  'Gobierno Digital',
]

function Sequence() {
  return (
    <>
      {ITEMS.map((item) => (
        <span className="marquee-item" key={item}>
          {item}
          <span className="star">✦</span>
        </span>
      ))}
    </>
  )
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <Sequence />
        <Sequence />
      </div>
    </div>
  )
}
