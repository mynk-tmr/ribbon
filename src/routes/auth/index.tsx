import { AuthForm } from '@/components/molecules/AuthForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/')({
  validateSearch: (s) => ({ isLogin: (s.isLogin as boolean) ?? true }),
  component: RouteComponent,
})

function RouteComponent() {
  const { isLogin } = Route.useSearch()
  const goto = Route.useNavigate()
  return (
    <AuthForm
      isLogin={isLogin}
      onModeChange={() => goto({ search: { isLogin: !isLogin } })}
    />
  )
}
