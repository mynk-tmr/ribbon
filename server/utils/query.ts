import { ofetch } from 'ofetch'
import { ENV } from './dotenv'

export const echo = <T>(...args: T[]) => {
  if (ENV.VERCEL) return
  console.log(...args)
}

export const query = ofetch.create({
  baseURL: ENV.TMDB_BASE,
  headers: { Authorization: `Bearer ${ENV.TMDB_TOKEN}` },
  onRequest: (vars) => echo(`🚀 ${vars.request}`),
})
