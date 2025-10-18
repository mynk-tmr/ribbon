import '@/styles/entry.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { authApi } from './lib/auth-api'
import { routeTree } from './routeTree.gen'

export const context = {
  app_user: await authApi.validateToken(),
}

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultStaleTime: 25 * 60 * 1000,
  scrollRestoration: true,
  scrollRestorationBehavior: 'smooth',
  context,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
