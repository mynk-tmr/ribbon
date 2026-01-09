import './app.css'
import { MantineProvider } from '@mantine/core'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { initializeApp } from './application/api'
import { routeTree } from './routeTree.gen'
import theme from './shared/config/theme'

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultStaleTime: 25 * 60 * 1000,
  scrollRestoration: true,
  defaultViewTransition: true,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Initialize app (clear IndexedDB, check auth)
initializeApp().catch(console.error)

// Render the app
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Could not find root element')
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <RouterProvider router={router} />
      </MantineProvider>
    </StrictMode>,
  )
}
