type Listener = (enabled: boolean) => void

/**
 * Central audio manager: Spanish TTS narration (Web Speech API) plus
 * subtle WebAudio blips. Starts muted — browsers require a user gesture
 * before any audio, so the speaker button is the single entry point.
 */
class AudioManager {
  enabled = false

  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private voice: SpeechSynthesisVoice | null = null
  private listeners = new Set<Listener>()
  private lastBlipAt = 0
  private speakToken = 0

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // voices load asynchronously; re-pick when the list changes
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        this.voice = null
      })
    }
  }

  toggle(): void {
    if (this.enabled) this.disable()
    else this.enable()
  }

  enable(): void {
    this.enabled = true
    this.ensureCtx()
    void this.ctx?.resume()
    this.emit()
  }

  disable(): void {
    this.enabled = false
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    this.emit()
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  /** Read a phrase aloud, replacing anything currently being spoken. */
  speak(text: string): void {
    if (!this.enabled || !('speechSynthesis' in window)) return
    const synth = window.speechSynthesis
    const token = ++this.speakToken
    synth.cancel()
    // Chrome drops utterances queued in the same tick as cancel()
    window.setTimeout(() => {
      if (token !== this.speakToken || !this.enabled) return
      const utterance = new SpeechSynthesisUtterance(text)
      if (!this.voice) this.voice = this.pickVoice()
      if (this.voice) {
        utterance.voice = this.voice
        utterance.lang = this.voice.lang
      } else {
        utterance.lang = 'es-MX'
      }
      utterance.rate = 1.02
      utterance.pitch = 1.04
      utterance.volume = 0.95
      synth.speak(utterance)
    }, 60)
  }

  /**
   * Soft synthesized chime for the map interaction.
   * @param pitch01 0..1 — mapped onto the musical range (higher = brighter)
   * @param strength01 0..1 — loudness of this blip
   */
  blip(pitch01: number, strength01: number): void {
    if (!this.enabled) return
    const now = performance.now()
    if (now - this.lastBlipAt < 70) return
    this.lastBlipAt = now

    this.ensureCtx()
    const ctx = this.ctx
    const master = this.master
    if (!ctx || !master || ctx.state !== 'running') return

    // pentatonic-ish steps keep random pitches consonant
    const steps = [0, 2, 4, 7, 9, 12]
    const step = steps[Math.min(steps.length - 1, Math.floor(pitch01 * steps.length))]
    const freq = 392 * Math.pow(2, step / 12) * (1 + (Math.random() - 0.5) * 0.01)

    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.86, t + 0.16)
    const peak = 0.015 + strength01 * 0.045
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(peak, t + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
    osc.connect(gain)
    gain.connect(master)
    osc.start(t)
    osc.stop(t + 0.2)
  }

  private emit(): void {
    for (const listener of this.listeners) listener(this.enabled)
  }

  private ensureCtx(): void {
    if (this.ctx) return
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return
    this.ctx = new Ctor()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.7
    this.master.connect(this.ctx.destination)
  }

  private pickVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices()
    const spanish = voices.filter((v) => v.lang.toLowerCase().startsWith('es'))
    if (!spanish.length) return null
    const femaleNames = [
      'paulina', 'mónica', 'monica', 'sabina', 'angélica', 'angelica',
      'francisca', 'soledad', 'marisol', 'helena', 'elvira', 'dalia',
      'renata', 'lucía', 'lucia', 'camila', 'female', 'mujer',
    ]
    const score = (v: SpeechSynthesisVoice) => {
      let s = 0
      const name = v.name.toLowerCase()
      if (/mx/i.test(v.lang)) s += 2
      if (femaleNames.some((n) => name.includes(n))) s += 4
      if (name.includes('google')) s += 1 // Google español voices are female
      if (v.localService) s += 1
      return s
    }
    return [...spanish].sort((a, b) => score(b) - score(a))[0]
  }
}

export const audio = new AudioManager()
