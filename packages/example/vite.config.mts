import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  mode: isGitHubPages ? 'production' : 'development',
  base: isGitHubPages ? '/grid-table/' : '/',
  define: {
    'process.env.NODE_ENV': isGitHubPages ? '"production"' : '"development"',
  },
  plugins: [react()],
})
