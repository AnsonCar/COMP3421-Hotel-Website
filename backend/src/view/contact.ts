import { Hono } from 'hono'
import { submitContact } from '../controller/contactController.js'

const contactRouter = new Hono()

// Submit contact message
contactRouter.post('/contact', submitContact)

export default contactRouter