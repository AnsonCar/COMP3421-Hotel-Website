import { config } from "dotenv";

// Determine which env file to use
const isLocal = process.env.NODE_ENV !== "production";
const envPath = isLocal ? "envs/.env.local" : "envs/.env";

// Load the appropriate env file
config({ path: envPath });

// Validate required environment variables first
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;
const JWT_SECRET = process.env.JWT_SECRET;
const requiredEnvVars = [
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DB",
  "JWT_SECRET",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Construct database URL
let DATABASE_URL: string;
if (process.env.DATABASE_URL) {
  DATABASE_URL = process.env.DATABASE_URL;
} else {
  DATABASE_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${
    process.env.POSTGRES_SERVER || "localhost"
  }:${process.env.POSTGRES_PORT || "5432"}/${POSTGRES_DB}`;
}

// Export environment variables
export const env = {
  // Database
  DATABASE_URL,
  POSTGRES_SERVER: process.env.POSTGRES_SERVER,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_DB: POSTGRES_DB!,
  POSTGRES_USER: POSTGRES_USER!,
  POSTGRES_PASSWORD: POSTGRES_PASSWORD!,

  // JWT
  JWT_SECRET: JWT_SECRET!,

  // Node
  NODE_ENV: process.env.NODE_ENV || "development",
};
