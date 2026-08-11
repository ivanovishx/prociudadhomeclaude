import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { audio } from '../lib/audio'

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(audio.enabled)

  useEffect(() => audio.subscribe(setEnabled), [])

  const onClick = () => {
    const turningOn = !audio.enabled
    audio.toggle()
    if (turningOn) {
      audio.speak('Audio activado. Desplázate para escuchar la experiencia.')
    }
  }

  return (
    <button
      type="button"
      className={`sound-toggle${enabled ? ' is-on' : ''}`}
      onClick={onClick}
      aria-label={enabled ? 'Silenciar audio' : 'Activar audio'}
      aria-pressed={enabled}
      title={enabled ? 'Silenciar audio' : 'Activar audio'}
    >
      {enabled ? <Volume2 size={18} strokeWidth={1.6} /> : <VolumeX size={18} strokeWidth={1.6} />}
    </button>
  )
}
