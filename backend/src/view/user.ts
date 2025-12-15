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

    if (!firstName?.trim() || !email?.trim() || !password?.trim()) {
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

// Update user profile
userRouter.put('/profile', async (c) => {
  try {
    const userId = parseInt(c.get('jwtPayload').sub)
    const { firstName, lastName, email } = await c.req.json()

    if (!firstName || !lastName || !email) {
      return c.json({ error: 'All fields are required' }, 400)
    }

    // Update user in database
    const updatedUser = await db
      .update(users)
      .set({
        firstName,
        lastName,
        email
      })
      .where(eq(users.userId, userId))
      .returning()

    if (updatedUser.length === 0) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      message: 'Profile updated successfully',
      user: {
        userId: updatedUser[0].userId,
        email: updatedUser[0].email,
        firstName: updatedUser[0].firstName,
        lastName: updatedUser[0].lastName
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Change password
userRouter.put('/password', async (c) => {
  try {
    const userId = parseInt(c.get('jwtPayload').sub)
    const { currentPassword, newPassword } = await c.req.json()

    if (!currentPassword || !newPassword) {
      return c.json({ error: 'Current password and new password are required' }, 400)
    }

    // Get current user
    const userResult = await db.select().from(users).where(eq(users.userId, userId)).limit(1)
    if (userResult.length === 0) {
      return c.json({ error: 'User not found' }, 404)
    }

    const user = userResult[0]

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return c.json({ error: 'Current password is incorrect' }, 400)
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await db
      .update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.userId, userId))

    return c.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Password change error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Delete account
userRouter.delete('/account', async (c) => {
  try {
    const userId = parseInt(c.get('jwtPayload').sub)

    // Delete user from database
    await db.delete(users).where(eq(users.userId, userId))

    return c.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Account deletion error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Forgot password - send reset link (public route, no JWT required)
userRouter.post('/forgot-password', async (c) => {
  try {
    const { email } = await c.req.json()

    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }

    // Check if user exists
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (userResult.length === 0) {
      // Don't reveal if email exists or not for security
      return c.json({ message: 'If an account with this email exists, a password reset link has been sent.' })
    }

    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Store it in the database with expiration
    // 3. Send an email with the reset link
    // For demo purposes, we'll just return success

    return c.json({ message: 'If an account with this email exists, a password reset link has been sent.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default userRouter