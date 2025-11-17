import { db } from '../db/index.js';
import { contacts } from '../db/schema.js';

// Submit a contact message
export const submitContact = async (c: any) => {
  try {
    const { name, email, subject, message } = await c.req.json();

    // Input validation
    if (!name || !email || !subject || !message) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    if (name.trim().length === 0 || name.length > 100) {
      return c.json({ error: 'Name must be between 1 and 100 characters' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return c.json({ error: 'Invalid email format or too long' }, 400);
    }

    if (subject.trim().length === 0 || subject.length > 255) {
      return c.json({ error: 'Subject must be between 1 and 255 characters' }, 400);
    }

    if (message.trim().length === 0) {
      return c.json({ error: 'Message cannot be empty' }, 400);
    }

    // Store the contact message
    const newContact = await db.insert(contacts).values({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    }).returning();

    return c.json({ message: 'Contact message submitted successfully', contact: newContact[0] }, 201);
  } catch (error) {
    console.error('Submit contact error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};