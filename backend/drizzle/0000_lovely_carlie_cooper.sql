CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed');--> statement-breakpoint
CREATE TABLE "bookings" (
	"booking_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"hotel_id" integer NOT NULL,
	"check_in_date" date NOT NULL,
	"check_out_date" date NOT NULL,
	"guests" integer NOT NULL,
	"status" "booking_status" DEFAULT 'pending',
	CONSTRAINT "guests_check" CHECK ("bookings"."guests" > 0),
	CONSTRAINT "check_out_date_check" CHECK ("bookings"."check_out_date" > "bookings"."check_in_date")
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"hotel_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"star_rating" integer,
	"user_rating" integer,
	"room_type" varchar(25) NOT NULL,
	"price_per_night" numeric(10, 2) NOT NULL,
	"description" text,
	CONSTRAINT "star_rating_check" CHECK ("hotels"."star_rating" >= 1 AND "hotels"."star_rating" <= 5),
	CONSTRAINT "user_rating_check" CHECK ("hotels"."user_rating" >= 1 AND "hotels"."user_rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"hotel_id" integer NOT NULL,
	"user_rating" integer,
	"comment" text,
	"time" timestamp DEFAULT now(),
	CONSTRAINT "review_user_rating_check" CHECK ("reviews"."user_rating" >= 1 AND "reviews"."user_rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(25) NOT NULL,
	"last_name" varchar(25) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hotel_id_hotels_hotel_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("hotel_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_hotel_id_hotels_hotel_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("hotel_id") ON DELETE no action ON UPDATE no action;