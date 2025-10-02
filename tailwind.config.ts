import type { Config } from 'tailwindcss'
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          light: '#ffffff',
          dark: '#0a0a0a',
        },
        text: {
          light: '#0a0a0a',
          dark: '#f5f5f5',
          dim: '#8a8a8a',
        },
        line: '#eaeaea',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)',
        softdark: '0 10px 30px rgba(255,255,255,0.06)',
      }
    }
  },
  plugins: []
}
export default config
