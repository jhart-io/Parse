import { db } from '@/db';
import { accounts, persons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from './password.service';
import { SignupInput, LoginInput } from './auth.validation';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'parse_session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

interface SessionData {
  personId: string;
  username: string;
}

/**
 * Create a new user account
 */
export async function signup(data: SignupInput) {
  // Check if username already exists
  const existing = await db.query.persons.findFirst({
    where: eq(persons.username, data.username),
  });

  if (existing) {
    throw new Error('Username already taken');
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create account
  const [account] = await db.insert(accounts).values({
    passwordHash,
    loginMethod: 'password',
  }).returning();

  // Create person
  const [person] = await db.insert(persons).values({
    accountId: account.id,
    username: data.username,
    displayName: data.displayName,
    bio: data.bio,
  }).returning();

  return { person, account };
}

/**
 * Log in a user
 */
export async function login(data: LoginInput) {
  // Find person by username
  const person = await db.query.persons.findFirst({
    where: eq(persons.username, data.username),
    with: {
      account: true,
    },
  });

  if (!person || !person.account) {
    throw new Error('Invalid username or password');
  }

  // Verify password
  const isValid = await verifyPassword(data.password, person.account.passwordHash);

  if (!isValid) {
    throw new Error('Invalid username or password');
  }

  return person;
}

/**
 * Create a session for a user
 */
export async function createSession(personId: string, username: string) {
  const sessionData: SessionData = { personId, username };
  const sessionValue = Buffer.from(JSON.stringify(sessionData)).toString('base64');

  (await cookies()).set(SESSION_COOKIE_NAME, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

/**
 * Get the current session
 */
export async function getSession(): Promise<SessionData | null> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    );
    return sessionData;
  } catch {
    return null;
  }
}

/**
 * Destroy the current session
 */
export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}

/**
 * Get the current authenticated user's person ID
 */
export async function getCurrentUser(): Promise<{ personId: string } | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return {
    personId: session.personId,
  };
}

/**
 * Check if a user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}
