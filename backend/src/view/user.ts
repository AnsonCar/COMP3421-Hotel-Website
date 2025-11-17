import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { sign } from 'hono/jwt'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import { env } from '../env.js'
import type { JwtVariables } from 'hono/jwt'

type Variables = JwtVariables

const userRouter = new Hono<{ Variables: Variables }>()

// Register route
userRouter.post('/register', async (c) => {
  try {
    const { firstName, lastName, email, password } = await c.req.json()

    if (!firstName || !lastName || !email || !password) {
      return c.json({ error: 'All fields are required' }, 400)
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existingUser.length > 0) {
      return c.json({ error: 'User already exists' }, 409)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).returning()

    return c.json({ message: 'User registered successfully', user: { userId: newUser[0].userId, email: newUser[0].email } }, 201)
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Login route
userRouter.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    // Find user
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (userResult.length === 0) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const user = userResult[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Generate JWT
    const payload = {
      sub: user.userId.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
    }

    const token = await sign(payload, env.JWT_SECRET)

    return c.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Protected routes - JWT middleware
userRouter.use('*', jwt({ secret: env.JWT_SECRET }))

// Get current user profile
userRouter.get('/profile', (c) => {
  const payload = c.get('jwtPayload')
  return c.json({ user: payload })
})

export default userRouter