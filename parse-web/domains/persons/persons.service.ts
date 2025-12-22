import { db } from '@/db';
import { persons } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Get a person by username
 */
export async function getPersonByUsername(username: string) {
  return db.query.persons.findFirst({
    where: eq(persons.username, username),
  });
}
