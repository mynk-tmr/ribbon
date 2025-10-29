import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/activity/')({ component: Page })

function Page() {
  return 'hello'
}
