import { serve } from '@hono/node-server'
import userRouter from './view/user.js'
import { Hono } from 'hono'
const app = new Hono()

// Public routes
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// User routes
app.route('/auth', userRouter)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
