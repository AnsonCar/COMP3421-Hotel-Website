import { serve } from '@hono/node-server'
import userRouter from './view/user.js'
import hotelRouter from './view/hotel.js'
import bookingRouter from './view/booking.js'
import reviewRouter from './view/review.js'
import contactRouter from './view/contact.js'
import { Hono } from 'hono'
const app = new Hono()

// Public routes
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// User routes
app.route('/auth', userRouter)

// Hotel routes
app.route('/api', hotelRouter)

// Booking routes
app.route('/api', bookingRouter)

// Review routes
app.route('/api', reviewRouter)

// Contact routes
app.route('/api', contactRouter)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
