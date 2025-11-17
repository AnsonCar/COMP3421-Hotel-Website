import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { env } from '../env.js'
import type { JwtVariables } from 'hono/jwt'
import {
  getHotelReviews,
  createReview,
  updateReview,
  deleteReview
} from '../controller/reviewController.js'

type Variables = JwtVariables

const reviewRouter = new Hono<{ Variables: Variables }>()

// Public route - Get reviews for a hotel
reviewRouter.get('/hotels/:hotelId/reviews', getHotelReviews)

// JWT middleware for protected routes
reviewRouter.use('/hotels/:hotelId/reviews', jwt({ secret: env.JWT_SECRET }))
reviewRouter.use('/reviews/:id', jwt({ secret: env.JWT_SECRET }))

// Create a new review
reviewRouter.post('/hotels/:hotelId/reviews', createReview)

// Update a review
reviewRouter.put('/reviews/:id', updateReview)

// Delete a review
reviewRouter.delete('/reviews/:id', deleteReview)

export default reviewRouter