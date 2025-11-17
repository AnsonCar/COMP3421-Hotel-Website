import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env.js';
import * as schema from './schema.js';

// Create the connection
const client = postgres(env.DATABASE_URL);

// Create the database instance
export const db = drizzle(client, { schema });

// Export the client for closing connections if needed
export { client };