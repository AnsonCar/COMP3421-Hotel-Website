import { Hono } from 'hono'
import { getHotels, getFeaturedHotels, getHotelDetails } from '../controller/hotelController.js'

const hotelRouter = new Hono()

// Get hotels list with optional filtering and sorting
hotelRouter.get('/hotels', getHotels)

// Get featured hotels
hotelRouter.get('/hotels/featured', getFeaturedHotels)

// Get hotel details by ID
hotelRouter.get('/hotels/:id', getHotelDetails)

export default hotelRouter