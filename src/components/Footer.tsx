import { MODULES } from '../data/modules'
import { asset } from '../lib/asset'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={asset('/logo-prociudad-white.png')} alt="ProCiudad" />
            <p>
              El sistema operativo digital enfocado a gobierno, impulsado por
              inteligencia artificial.
            </p>
          </div>
          <div className="footer-col">
            <h4>Módulos</h4>
            <ul>
              {MODULES.map((m) => (
                <li key={m.id}>
                  <a href={`#${m.id}`}>{m.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li>
                <a href="mailto:prociudad1@gmail.com">prociudad1@gmail.com</a>
              </li>
              <li>
                <a href="https://www.prociudad.com" target="_blank" rel="noreferrer">
                  www.prociudad.com
                </a>
              </li>
              <li>
                <a href="https://prociudad.com/login" target="_blank" rel="noreferrer">
                  Iniciar sesión
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="https://prociudad.com/privacy" target="_blank" rel="noreferrer">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="https://prociudad.com/terms" target="_blank" rel="noreferrer">
                  Acuerdo de Usuario
                </a>
              </li>
              <li>
                <a href="https://prociudad.com/rules" target="_blank" rel="noreferrer">
                  Reglas ProCiudad
                </a>
              </li>
              <li>
                <a href="https://prociudad.com/accessibility" target="_blank" rel="noreferrer">
                  Accesibilidad
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ProCiudad. Todos los derechos reservados.</span>
          <span>Hecho para gobiernos que piensan en sus ciudadanos.</span>
        </div>
      </div>
    </footer>
  )
}
