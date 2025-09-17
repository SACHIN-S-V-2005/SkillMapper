
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';

import { initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app';


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

export const SESSION_COOKIE_NAME = '__session';

export const auth = {
  // Client-side methods
  ...clientAuth,
  createUserWithEmailAndPassword: (email: string, password: string) => createUserWithEmailAndPassword(clientAuth, email, password),
  signInWithEmailAndPassword: (email: string, password: string) => signInWithEmailAndPassword(clientAuth, email, password),
  signOut: () => signOut(clientAuth),
};
