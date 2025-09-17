
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth/lite';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth as getAdminAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { initializeApp as initializeAdminApp, getApps as getAdminApps, credential, ServiceAccount } from 'firebase-admin/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const clientApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const clientAuth = getAuth(clientApp);


// Admin-side auth
const serviceAccount: ServiceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
}

const adminApp = !getAdminApps().length ? initializeAdminApp({
    credential: credential.cert(serviceAccount)
}) : getAdminApps()[0]!;

const adminAuth = getAdminAuth(adminApp);


const SESSION_COOKIE_NAME = 'session';

async function getSession(): Promise<DecodedIdToken | null> {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    return await adminAuth.verifySessionCookie(session, true);
  } catch (error) {
    console.error('Error verifying session cookie in getSession:', error);
    return null;
  }
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return false;

  try {
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return !!decodedIdToken;
  } catch (error) {
    // Session cookie is invalid.
    return false;
  }
}

async function createSession(user: User) {
  const idToken = await user.getIdToken();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

  cookies().set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
  });
}

async function signOutAndClearSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}

export const auth = {
  // Client-side methods
  ...clientAuth,
  createUserWithEmailAndPassword: (email: string, password: string) => createUserWithEmailAndPassword(clientAuth, email, password),
  signInWithEmailAndPassword: (email: string, password: string) => signInWithEmailAndPassword(clientAuth, email, password),
  signOut: () => signOut(clientAuth),
  
  // Server-side methods
  getSession,
  isAuthenticated,
  createSession,
  signOutAndClearSession,
};
