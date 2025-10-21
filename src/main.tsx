import '@/styles/entry.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './lib/firebase/AuthProvider'
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultStaleTime: 25 * 60 * 1000,
  scrollRestoration: true,
  scrollRestorationBehavior: 'smooth',
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
      <RouterProvider InnerWrap={AuthProvider} router={router} />
    </StrictMode>,
  )
}
