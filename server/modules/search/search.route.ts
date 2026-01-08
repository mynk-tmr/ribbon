import { Hono } from 'hono'
import { authMiddleware } from '../../middleware/auth.middleware'
import {
  addSearchController,
  clearAllSearchesController,
  deleteSearchController,
  getAllSearchesController,
} from './search.controller'

const searchApp = new Hono()

// All search routes require authentication
searchApp.use('/*', authMiddleware)

searchApp.get('/', getAllSearchesController)
searchApp.post('/', addSearchController)
searchApp.delete('/:id', deleteSearchController)
searchApp.delete('/', clearAllSearchesController)

export { searchApp }
