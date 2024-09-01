'use server';

import { createAuthSession, destroySession } from '@/lib/auth';
import { hashUserPassword, verifyPassword } from '@/lib/hash';
import { createUser, getUserByEmail } from '@/lib/user';
import { redirect } from 'next/navigation';

export const signup = async (prevState, formData) => {
  const email = formData.get('email');
  const password = formData.get('password');

  let errors = {};

  if (!email?.includes('@')) {
    errors.email = 'Please enter a valid email';
  }

  if (password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const hashedPassword = hashUserPassword(password);
  try {
    const id = await createUser(email, hashedPassword);
    await createAuthSession(id);
    redirect('/training');
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors: {
          email: 'User with that email already exists',
        },
      };
    }

    throw error;
  }
};

export const login = async (prevData, formData) => {
  const email = formData.get('email');
  const password = formData.get('password');
  const existingUser = getUserByEmail(email);

  let errors = {};

  if (!existingUser) {
    return {
      errors: {
        email: 'User with that email does not exist',
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    return {
      errors: {
        password: 'Password is incorrect',
      },
    };
  }

  await createAuthSession(existingUser.id);
  redirect('/training');
};

export const auth = async (mode, prevState, formData) => {
  if (mode === 'login') {
    return login(prevState, formData);
  }

  return signup(prevState, formData);
};

export const logout = async () => {
  await destroySession();
  return redirect('/');
};
