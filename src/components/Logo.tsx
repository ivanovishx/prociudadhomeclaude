/**
 * Color version of the ProCiudad logo for light backgrounds:
 * pink map-pin next to the wordmark, matching www.prociudad.com.
 */
export default function Logo() {
  return (
    <span className="logo">
      <svg
        className="logo-pin"
        viewBox="0 0 24 32"
        width="26"
        height="34"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e91e63" />
            <stop offset="1" stopColor="#7d0f4c" />
          </linearGradient>
        </defs>
        <path
          fill="url(#logo-grad)"
          d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.37 18.63 0 12 0z"
        />
        <circle cx="12" cy="11.4" r="4.6" fill="#fff" />
      </svg>
      <span className="logo-text">
        <strong>ProCiudad</strong>
        <em>Portal Ciudadano</em>
      </span>
    </span>
  )
}
