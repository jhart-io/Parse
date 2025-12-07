'use server';

import { redirect } from 'next/navigation';
import { signup, login, createSession, destroySession } from '@/domains/auth/auth.service';
import { signupSchema, loginSchema } from '@/domains/auth/auth.validation';

type ActionResult = {
  success: boolean;
  error?: string;
};

/**
 * Sign up a new user
 */
export async function signupAction(data: {
  username: string;
  password: string;
  displayName: string;
  bio?: string;
}): Promise<ActionResult> {
  try {
    const validated = signupSchema.parse(data);
    const { person } = await signup(validated);

    // Create session
    await createSession(person.id, person.username);

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Log in a user
 */
export async function loginAction(data: {
  username: string;
  password: string;
}): Promise<ActionResult> {
  try {
    const validated = loginSchema.parse(data);
    const person = await login(validated);

    // Create session
    await createSession(person.id, person.username);

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Log out the current user
 */
export async function logoutAction() {
  await destroySession();
  redirect('/login');
}
