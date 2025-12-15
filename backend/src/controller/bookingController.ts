import { db } from '../db/index.js';
import { bookings, hotels } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

// Create a new booking
export const createBooking = async (c: any) => {
  try {
    const userId = parseInt(c.get('jwtPayload').sub);
    const { hotelId, checkInDate, checkOutDate, guests } = await c.req.json();

    if (!hotelId || !checkInDate || !checkOutDate || !guests) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return c.json({ error: 'Invalid date format' }, 400);
    }

    if (checkOut <= checkIn) {
      return c.json({ error: 'Check-out date must be after check-in date' }, 400);
    }

    if (guests <= 0) {
      return c.json({ error: 'Number of guests must be greater than 0' }, 400);
    }

    // Check if hotel exists
    const hotelResult = await db.select().from(hotels).where(eq(hotels.hotelId, hotelId)).limit(1);
    if (hotelResult.length === 0) {
      return c.json({ error: 'Hotel not found' }, 404);
    }

    // Create booking
    const newBooking = await db.insert(bookings).values({
      userId,
      hotelId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      guests,
      status: 'pending',
    }).returning();

    return c.json({ message: 'Booking created successfully', booking: newBooking[0] }, 201);
  } catch (error) {
    console.error('Create booking error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// Get user's bookings
export const getUserBookings = async (c: any) => {
  try {
    const userId = parseInt(c.get('jwtPayload').sub);

    const userBookings = await db
      .select({
        bookingId: bookings.bookingId,
        hotelId: bookings.hotelId,
        checkInDate: bookings.checkInDate,
        checkOutDate: bookings.checkOutDate,
        guests: bookings.guests,
        status: bookings.status,
        hotelName: hotels.name,
        hotelAddress: hotels.address,
        pricePerNight: hotels.pricePerNight,
      })
      .from(bookings)
      .innerJoin(hotels, eq(bookings.hotelId, hotels.hotelId))
      .where(eq(bookings.userId, userId))
      .orderBy(bookings.bookingId);

    return c.json({ bookings: userBookings }, 200);
  } catch (error) {
    console.error('Get user bookings error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// Get bookings for settings page
export const getBookings = async (c: any) => {
  try {
    const jwtPayload = c.get('jwtPayload');
    if (!jwtPayload || !jwtPayload.sub) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const userId = parseInt(jwtPayload.sub);
    if (isNaN(userId)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const rawBookings = await db
      .select({
        id: bookings.bookingId,
        status: bookings.status,
        checkIn: bookings.checkInDate,
        checkOut: bookings.checkOutDate,
        hotelName: hotels.name,
        roomType: hotels.roomType,
        hotelId: hotels.hotelId,
      })
      .from(bookings)
      .innerJoin(hotels, eq(bookings.hotelId, hotels.hotelId))
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.checkInDate));

    const bookingsArray = rawBookings.map(booking => ({
      id: booking.id,
      status: booking.status,
      confirmationNumber: `#LH${booking.id}`,
      hotel: {
        name: booking.hotelName,
        imageUrl: `images/room-${(booking.hotelId % 3) + 1}.jpg`,
        roomType: booking.roomType || 'Standard Room'
      },
      dates: {
        checkIn: new Date(booking.checkIn).toISOString(),
        checkOut: new Date(booking.checkOut).toISOString()
      }
    }));

    return c.json(bookingsArray, 200);
  } catch (error) {
    console.error('Get bookings error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// Get booking details
export const getBookingDetails = async (c: any) => {
  try {
    const userId = parseInt(c.get('jwtPayload').sub);
    const bookingId = parseInt(c.req.param('id'));

    if (!bookingId || isNaN(bookingId)) {
      return c.json({ error: 'Invalid booking ID' }, 400);
    }

    const bookingResult = await db
      .select({
        bookingId: bookings.bookingId,
        hotelId: bookings.hotelId,
        checkInDate: bookings.checkInDate,
        checkOutDate: bookings.checkOutDate,
        guests: bookings.guests,
        status: bookings.status,
        hotelName: hotels.name,
        hotelAddress: hotels.address,
        starRating: hotels.starRating,
        pricePerNight: hotels.pricePerNight,
        description: hotels.description,
      })
      .from(bookings)
      .innerJoin(hotels, eq(bookings.hotelId, hotels.hotelId))
      .where(and(eq(bookings.bookingId, bookingId), eq(bookings.userId, userId)))
      .limit(1);

    if (bookingResult.length === 0) {
      return c.json({ error: 'Booking not found or access denied' }, 404);
    }

    return c.json({ booking: bookingResult[0] }, 200);
  } catch (error) {
    console.error('Get booking details error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// Update booking
export const updateBooking = async (c: any) => {
  try {
    const userId = parseInt(c.get('jwtPayload').sub);
    const bookingId = parseInt(c.req.param('id'));
    const { checkInDate, checkOutDate, guests } = await c.req.json();

    if (!bookingId || isNaN(bookingId)) {
      return c.json({ error: 'Invalid booking ID' }, 400);
    }

    // Check if booking exists and belongs to user
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.bookingId, bookingId), eq(bookings.userId, userId)))
      .limit(1);

    if (existingBooking.length === 0) {
      return c.json({ error: 'Booking not found or access denied' }, 404);
    }

    const booking = existingBooking[0];

    if (booking.status !== 'pending') {
      return c.json({ error: 'Cannot update confirmed booking' }, 400);
    }

    const updateData: any = {};

    if (checkInDate) {
      const checkIn = new Date(checkInDate);
      if (isNaN(checkIn.getTime())) {
        return c.json({ error: 'Invalid check-in date' }, 400);
      }
      updateData.checkInDate = checkInDate;
    }

    if (checkOutDate) {
      const checkOut = new Date(checkOutDate);
      if (isNaN(checkOut.getTime())) {
        return c.json({ error: 'Invalid check-out date' }, 400);
      }
      updateData.checkOutDate = checkOutDate;
    }

    if (checkInDate && checkOutDate) {
      if (new Date(checkOutDate) <= new Date(checkInDate)) {
        return c.json({ error: 'Check-out date must be after check-in date' }, 400);
      }
    } else if (checkInDate && !checkOutDate) {
      if (new Date(checkOutDate) <= new Date(checkInDate)) {
        return c.json({ error: 'Check-out date must be after check-in date' }, 400);
      }
    } else if (!checkInDate && checkOutDate) {
      if (new Date(checkOutDate) <= new Date(booking.checkInDate)) {
        return c.json({ error: 'Check-out date must be after check-in date' }, 400);
      }
    }

    if (guests !== undefined) {
      if (guests <= 0) {
        return c.json({ error: 'Number of guests must be greater than 0' }, 400);
      }
      updateData.guests = guests;
    }

    if (Object.keys(updateData).length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400);
    }

    const updatedBooking = await db
      .update(bookings)
      .set(updateData)
      .where(and(eq(bookings.bookingId, bookingId), eq(bookings.userId, userId)))
      .returning();

    return c.json({ message: 'Booking updated successfully', booking: updatedBooking[0] }, 200);
  } catch (error) {
    console.error('Update booking error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// Cancel booking
export const cancelBooking = async (c: any) => {
  try {
    const userId = parseInt(c.get('jwtPayload').sub);
    const bookingId = parseInt(c.req.param('id'));

    if (!bookingId || isNaN(bookingId)) {
      return c.json({ error: 'Invalid booking ID' }, 400);
    }

    // Check if booking exists and belongs to user
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.bookingId, bookingId), eq(bookings.userId, userId)))
      .limit(1);

    if (existingBooking.length === 0) {
      return c.json({ error: 'Booking not found or access denied' }, 404);
    }

    const booking = existingBooking[0];

    if (booking.status !== 'pending') {
      return c.json({ error: 'Cannot cancel confirmed booking' }, 400);
    }

    // Delete the booking
    await db.delete(bookings).where(and(eq(bookings.bookingId, bookingId), eq(bookings.userId, userId)));

    return c.json({ message: 'Booking cancelled successfully' }, 200);
  } catch (error) {
    console.error('Cancel booking error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};