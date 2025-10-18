import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/error')({
  beforeLoad() {
    const random = Math.random().toString(16)
    throw new Error('This is Test Error. Dont Panic. Random String: ' + random)
  },
})
