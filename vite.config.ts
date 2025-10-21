import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import vercel from 'vite-plugin-vercel'
import tsconfigPaths from 'vite-tsconfig-paths'

const tanstackRouterPlugin = tanstackRouter({
  autoCodeSplitting: true,
  target: 'react',
})

const reactJS = react({ babel: { plugins: [['babel-plugin-react-compiler']] } })

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackRouterPlugin,
    reactJS,
    tailwindcss(),
    vercel(),
  ],
})
