import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  mode: 'development',
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  plugins: [react()],
})
