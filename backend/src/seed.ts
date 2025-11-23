import { db } from "./db/index.js";
import { hotels } from "./db/schema.js";

const testHotels = [
  {
    name: "The Plaza Hotel",
    address: "768 5th Ave, New York, NY 10019",
    starRating: 5,
    userRating: 5,
    roomType: "Deluxe Suite",
    pricePerNight: "1500.00",
    description: "An iconic luxury hotel in the heart of Manhattan",
  },
  {
    name: "The St. Regis New York",
    address: "2 E 55th St, New York, NY 10022",
    starRating: 5,
    userRating: 5,
    roomType: "King Suite",
    pricePerNight: "1200.00",
    description: "Timeless elegance and impeccable service",
  },
  {
    name: "Four Seasons Hotel New York",
    address: "57 E 57th St, New York, NY 10022",
    starRating: 5,
    userRating: 5,
    roomType: "Premier Suite",
    pricePerNight: "1800.00",
    description: "World-class luxury with stunning city views",
  },
  {
    name: "Mandarin Oriental",
    address: "80 Columbus Circle, New York, NY 10023",
    starRating: 5,
    userRating: 5,
    roomType: "City View Suite",
    pricePerNight: "1400.00",
    description: "Sophisticated luxury in a prime location",
  },
  {
    name: "The Ritz-Carlton New York",
    address: "50 Central Park S, New York, NY 10019",
    starRating: 5,
    userRating: 5,
    roomType: "Club Suite",
    pricePerNight: "1600.00",
    description: "Exceptional service and Central Park views",
  },
  {
    name: "Waldorf Astoria New York",
    address: "301 Park Ave, New York, NY 10022",
    starRating: 5,
    userRating: 4,
    roomType: "Park Suite",
    pricePerNight: "1300.00",
    description: "Historic luxury with modern amenities",
  },
  {
    name: "Hyatt Regency New York",
    address: "135 E 57th St, New York, NY 10022",
    starRating: 4,
    userRating: 4,
    roomType: "Executive Suite",
    pricePerNight: "800.00",
    description: "Contemporary luxury in Midtown",
  },
  {
    name: "Sheraton New York Times Square",
    address: "811 7th Ave, New York, NY 10019",
    starRating: 4,
    userRating: 4,
    roomType: "Times Square View",
    pricePerNight: "600.00",
    description: "Convenient location with great views",
  },
];

async function seedDatabase() {
  try {
    console.log("Seeding database with test hotels...");

    // Clear existing hotels
    // await db.delete(hotels);

    // Insert test hotels
    await db.insert(hotels).values(testHotels);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
