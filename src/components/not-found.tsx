import { Icon } from '@iconify/react'
import { Button } from '@mantine/core'
import { Link } from '@tanstack/react-router'

export const NotFound = () => {
  return (
    <main className="page space-y-9">
      <header className="flex items-center justify-center">
        <Icon icon="mdi:robot-confused" className="text-5xl inline mr-4" />
        <h1 className="font-bold text-3xl">Page not found</h1>
      </header>
      <p className="max-w-lg text-center">
        The page you are looking for does not exist. You are at {window.location.href}.
      </p>
      <div className="flex justify-center gap-4">
        <Button replace size="xs" color="teal" component={Link} to="/">
          Go Home
        </Button>
      </div>
    </main>
  )
}
