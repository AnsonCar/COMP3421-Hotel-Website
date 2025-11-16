import { pgTable, serial, varchar, text, integer, decimal, timestamp, date, pgEnum, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Define enums
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed']);

// Users table
export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  firstName: varchar('first_name', { length: 25 }).notNull(),
  lastName: varchar('last_name', { length: 25 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
});

// Hotels table
export const hotels = pgTable('hotels', {
  hotelId: serial('hotel_id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  starRating: integer('star_rating'),
  userRating: integer('user_rating'),
  roomType: varchar('room_type', { length: 25 }).notNull(),
  pricePerNight: decimal('price_per_night', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
}, (table) => [
  check('star_rating_check', sql`${table.starRating} >= 1 AND ${table.starRating} <= 5`),
  check('user_rating_check', sql`${table.userRating} >= 1 AND ${table.userRating} <= 5`),
]);

// Reviews table
export const reviews = pgTable('reviews', {
  reviewId: serial('review_id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.userId),
  hotelId: integer('hotel_id').notNull().references(() => hotels.hotelId),
  userRating: integer('user_rating'),
  comment: text('comment'),
  time: timestamp('time').defaultNow(),
}, (table) => [
  check('review_user_rating_check', sql`${table.userRating} >= 1 AND ${table.userRating} <= 5`),
]);

// Bookings table
export const bookings = pgTable('bookings', {
  bookingId: serial('booking_id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.userId),
  hotelId: integer('hotel_id').notNull().references(() => hotels.hotelId),
  checkInDate: date('check_in_date').notNull(),
  checkOutDate: date('check_out_date').notNull(),
  guests: integer('guests').notNull(),
  status: bookingStatusEnum('status').default('pending'),
}, (table) => [
  check('guests_check', sql`${table.guests} > 0`),
  check('check_out_date_check', sql`${table.checkOutDate} > ${table.checkInDate}`),
]);