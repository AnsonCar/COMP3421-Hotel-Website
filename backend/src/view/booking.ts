import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { env } from '../env.js'
import type { JwtVariables } from 'hono/jwt'
import {
  createBooking,
  getUserBookings,
  getBookingDetails,
  updateBooking,
  cancelBooking
} from '../controller/bookingController.js'

type Variables = JwtVariables

const bookingRouter = new Hono<{ Variables: Variables }>()

// JWT middleware for all routes
bookingRouter.use('*', jwt({ secret: env.JWT_SECRET }))

// Create a new booking
bookingRouter.post('/bookings', createBooking)

// Get user's bookings
bookingRouter.get('/bookings', getUserBookings)

// Get booking details
bookingRouter.get('/bookings/:id', getBookingDetails)

// Update booking
bookingRouter.put('/bookings/:id', updateBooking)

// Cancel booking
bookingRouter.delete('/bookings/:id', cancelBooking)

export default bookingRouter