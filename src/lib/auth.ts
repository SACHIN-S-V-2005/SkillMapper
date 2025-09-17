
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';

import {auth as firebaseAuth} from '@/lib/firebase';

const SESSION_COOKIE_NAME = 'session';

async function getSession() {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  return await auth.verifySessionCookie(session, true);
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return false;

  try {
    const decodedIdToken = await auth.verifySessionCookie(sessionCookie, true);
    return !!decodedIdToken;
  } catch (error) {
    return false;
  }
}

async function signIn(user: User) {
  const idToken = await user.getIdToken();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await auth.createSessionCookie(idToken, {expiresIn});

  cookies().set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
  });
}

async function signOutAndRedirect() {
  cookies().delete(SESSION_COOKIE_NAME);
}

export const auth = {
  ...firebaseAuth,
  getSession,
  isAuthenticated,
  signIn,
  signOutAndRedirect,
  createUserWithEmailAndPassword: (email:string,password:string)=>createUserWithEmailAndPassword(firebaseAuth,email,password),
  signInWithEmailAndPassword: (email:string,password:string)=>signInWithEmailAndPassword(firebaseAuth,email,password),
  signOut: ()=>signOut(firebaseAuth),
};
