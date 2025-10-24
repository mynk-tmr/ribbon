import { type } from 'arktype'
import { Hono } from 'hono'

export const userApp = new Hono()

const scheme = type({
  email: 'string.email',
  password: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$/',
})

userApp.post('/register', async (c) => {
  const data = await c.req.json()
  const { email, password } = scheme.assert(data)
})
