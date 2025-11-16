import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Determine which env file to use
const isLocal = process.env.NODE_ENV !== 'production' && existsSync(resolve('.env.local'));
const envPath = isLocal ? '.env.local' : 'envs/.env';

// Load the appropriate env file
config({ path: envPath });

// Validate required environment variables first
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;
const requiredEnvVars = ['POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB'];
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
  DATABASE_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${process.env.POSTGRES_SERVER || 'localhost'}:${process.env.POSTGRES_PORT || '5432'}/${POSTGRES_DB}`;
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

  // Node
  NODE_ENV: process.env.NODE_ENV || 'development',
};