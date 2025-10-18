import { ofetch } from 'ofetch'

const { DEV } = import.meta.env

const api = ofetch.create({
  baseURL: DEV ? 'http://localhost:3000/api/auth' : '/api/auth',
  credentials: 'include',
  mode: 'cors',
})

export interface IUser {
  id: number
  fullname: string
  email: string
  avatar: string | null
}

export const authApi = {
  validateToken: () =>
    api('/validateToken').catch(() => null) as Promise<IUser> | null,
  logout: () => api('/logout'),
  forgotPassword: (email: string) =>
    api('/forgotPassword', { method: 'POST', body: { email } }),
  login: (email: string, password: string) =>
    api('/login', { method: 'POST', body: { email, password } }),
  register: (fullname: string, email: string, password: string) =>
    api('/register', { method: 'POST', body: { fullname, email, password } }),
}
