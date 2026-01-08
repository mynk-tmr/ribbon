import { Hono } from 'hono'
import { authMiddleware } from '../../middleware/auth.middleware'
import {
  addMediaController,
  getAllMediaController,
  removeMediaController,
  updateProgressController,
  updateStatusController,
} from './media.controller'

const mediaApp = new Hono()

// All media routes require authentication
mediaApp.use('/*', authMiddleware)

mediaApp.get('/', getAllMediaController)
mediaApp.post('/', addMediaController)
mediaApp.delete('/:tmdbId', removeMediaController)
mediaApp.patch('/:tmdbId/status', updateStatusController)
mediaApp.put('/:tmdbId/progress', updateProgressController)

export { mediaApp }
