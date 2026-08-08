/**
 * Prefixes a public-folder path with Vite's base URL so images resolve
 * both locally ("/") and on GitHub Pages ("/prociudadhomeclaude/").
 */
export const asset = (path: string): string =>
  import.meta.env.BASE_URL + path.replace(/^\//, '')
