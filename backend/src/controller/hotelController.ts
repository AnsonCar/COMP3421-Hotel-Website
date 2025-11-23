import { db } from '../db/index.js';
import { hotels, reviews } from '../db/schema.js';
import { eq, gte, lte, like, desc, asc, sql, and } from 'drizzle-orm';

// Get hotels list with filtering and sorting
export const getHotels = async (c: any) => {
  try {
    const {
      starRating,
      minPrice,
      maxPrice,
      address,
      sortBy = 'name_asc'
    } = c.req.query();

    let query: any = db.select().from(hotels);

    // Build conditions
    const conditions = [];
    if (starRating) {
      conditions.push(eq(hotels.starRating, parseInt(starRating)));
    }
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        conditions.push(sql`${hotels.pricePerNight} >= ${min}`);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        conditions.push(sql`${hotels.pricePerNight} <= ${max}`);
      }
    }
    if (address) {
      // Search in both name and address for better user experience
      conditions.push(sql`(${hotels.name} ILIKE ${`%${address}%`} OR ${hotels.address} ILIKE ${`%${address}%`})`);
    }

    // Apply filters
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        query = query.orderBy(asc(hotels.pricePerNight));
        break;
      case 'price_desc':
        query = query.orderBy(desc(hotels.pricePerNight));
        break;
      case 'rating_asc':
        query = query.orderBy(asc(hotels.userRating));
        break;
      case 'rating_desc':
        query = query.orderBy(desc(hotels.userRating));
        break;
      case 'name_asc':
      default:
        query = query.orderBy(asc(hotels.name));
        break;
    }

    const hotelList = await query;

    return c.json({ hotels: hotelList }, 200);
  } catch (error) {
    console.error('Get hotels error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// Get featured hotels (top rated)
export const getFeaturedHotels = async (c: any) => {
  try {
    const featuredHotels = await db
      .select()
      .from(hotels)
      .orderBy(desc(hotels.userRating))
      .limit(10);

    return c.json({ hotels: featuredHotels }, 200);
  } catch (error) {
    console.error('Get featured hotels error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// Get hotel details with reviews
export const getHotelDetails = async (c: any) => {
  try {
    const hotelId = parseInt(c.req.param('id'));

    if (!hotelId || isNaN(hotelId)) {
      return c.json({ error: 'Invalid hotel ID' }, 400);
    }

    // Get hotel info
    const hotelResult = await db
      .select()
      .from(hotels)
      .where(eq(hotels.hotelId, hotelId))
      .limit(1);

    if (hotelResult.length === 0) {
      return c.json({ error: 'Hotel not found' }, 404);
    }

    const hotel = hotelResult[0];

    // Get reviews
    const hotelReviews = await db
      .select({
        reviewId: reviews.reviewId,
        userRating: reviews.userRating,
        comment: reviews.comment,
        time: reviews.time,
      })
      .from(reviews)
      .where(eq(reviews.hotelId, hotelId))
      .orderBy(desc(reviews.time));

    // Calculate average rating from reviews
    const avgRating = hotelReviews.length > 0
      ? hotelReviews.reduce((sum, review) => sum + (review.userRating || 0), 0) / hotelReviews.length
      : (hotel.userRating || 0);

    return c.json({
      hotel: {
        ...hotel,
        averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      },
      reviews: hotelReviews
    }, 200);
  } catch (error) {
    console.error('Get hotel details error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};