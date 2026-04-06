/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        text: 'var(--text)',
        accent: 'var(--accent)',
        'code-block': 'var(--code-block)',
        sidebar: 'var(--sidebar)',
        border: 'var(--border)',
        'muted-text': 'var(--muted-text)',
        editor: {
          bg: 'var(--editor-bg)',
          text: 'var(--editor-text)',
          accent: 'var(--editor-accent)',
        }
      },
    },
  },
  plugins: [],
}
