import { db } from '../db/index.js';
import { reviews, users, hotels } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

// Get reviews for a specific hotel
export const getHotelReviews = async (c: any) => {
  try {
    const hotelId = parseInt(c.req.param('hotelId'));

    if (!hotelId || isNaN(hotelId)) {
      return c.json({ error: 'Invalid hotel ID' }, 400);
    }

    // Check if hotel exists
    const hotelResult = await db.select().from(hotels).where(eq(hotels.hotelId, hotelId)).limit(1);
    if (hotelResult.length === 0) {
      return c.json({ error: 'Hotel not found' }, 404);
    }

    // Get reviews with user information
    const hotelReviews = await db
      .select({
        reviewId: reviews.reviewId,
        userRating: reviews.userRating,
        comment: reviews.comment,
        time: reviews.time,
        userId: users.userId,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.userId))
      .where(eq(reviews.hotelId, hotelId))
      .orderBy(desc(reviews.time));

    return c.json({ reviews: hotelReviews }, 200);
  } catch (error) {
    console.error('Get hotel reviews error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// Create a new review
export const createReview = async (c: any) => {
  try {
    const userId = parseInt(c.get('jwtPayload').sub);
    const hotelId = parseInt(c.req.param('hotelId'));
    const { userRating, comment } = await c.req.json();

    if (!hotelId || isNaN(hotelId)) {
      return c.json({ error: 'Invalid hotel ID' }, 400);
    }

    if (userRating === undefined || userRating === null) {
      return c.json({ error: 'Rating is required' }, 400);
    }

    if (userRating < 1 || userRating > 5) {
      return c.json({ error: 'Rating must be between 1 and 5' }, 400);
    }

    // Check if hotel exists
    const hotelResult = await db.select().from(hotels).where(eq(hotels.hotelId, hotelId)).limit(1);
    if (hotelResult.length === 0) {
      return c.json({ error: 'Hotel not found' }, 404);
    }

    // Check if user already reviewed this hotel
    const existingReview = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.hotelId, hotelId)))
      .limit(1);

    if (existingReview.length > 0) {
      return c.json({ error: 'You have already reviewed this hotel' }, 409);
    }

    // Create review
    const newReview = await db.insert(reviews).values({
      userId,
      hotelId,
      userRating,
      comment: comment || null,
    }).returning();

    return c.json({ message: 'Review created successfully', review: newReview[0] }, 201);
  } catch (error) {
    console.error('Create review error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// Update a review
export const updateReview = async (c: any) => {
  try {
    const userId = parseInt(c.get('jwtPayload').sub);
    const reviewId = parseInt(c.req.param('id'));
    const { userRating, comment } = await c.req.json();

    if (!reviewId || isNaN(reviewId)) {
      return c.json({ error: 'Invalid review ID' }, 400);
    }

    // Check if review exists and belongs to user
    const existingReview = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.reviewId, reviewId), eq(reviews.userId, userId)))
      .limit(1);

    if (existingReview.length === 0) {
      return c.json({ error: 'Review not found or access denied' }, 404);
    }

    const updateData: any = {};

    if (userRating !== undefined && userRating !== null) {
      if (userRating < 1 || userRating > 5) {
        return c.json({ error: 'Rating must be between 1 and 5' }, 400);
      }
      updateData.userRating = userRating;
    }

    if (comment !== undefined) {
      updateData.comment = comment || null;
    }

    if (Object.keys(updateData).length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400);
    }

    const updatedReview = await db
      .update(reviews)
      .set(updateData)
      .where(and(eq(reviews.reviewId, reviewId), eq(reviews.userId, userId)))
      .returning();

    return c.json({ message: 'Review updated successfully', review: updatedReview[0] }, 200);
  } catch (error) {
    console.error('Update review error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};

// Delete a review
export const deleteReview = async (c: any) => {
  try {
    const userId = parseInt(c.get('jwtPayload').sub);
    const reviewId = parseInt(c.req.param('id'));

    if (!reviewId || isNaN(reviewId)) {
      return c.json({ error: 'Invalid review ID' }, 400);
    }

    // Check if review exists and belongs to user
    const existingReview = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.reviewId, reviewId), eq(reviews.userId, userId)))
      .limit(1);

    if (existingReview.length === 0) {
      return c.json({ error: 'Review not found or access denied' }, 404);
    }

    // Delete the review
    await db.delete(reviews).where(and(eq(reviews.reviewId, reviewId), eq(reviews.userId, userId)));

    return c.json({ message: 'Review deleted successfully' }, 200);
  } catch (error) {
    console.error('Delete review error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};