import { ofetch } from 'ofetch'

export const tmdb = ofetch.create({
  baseURL: import.meta.env.DEV ? 'https://localhost:3000/api' : '/api',
  credentials: 'include',
})
