import { serve } from '@hono/node-server'
import userRouter from './view/user.js'
import hotelRouter from './view/hotel.js'
import bookingRouter from './view/booking.js'
import reviewRouter from './view/review.js'
import contactRouter from './view/contact.js'
import { Hono } from 'hono'
const app = new Hono()

// CORS middleware
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (c.req.method === 'OPTIONS') {
    return c.text('', 200)
  }

  await next()
})

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
