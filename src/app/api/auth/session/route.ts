
import { type NextRequest, NextResponse } from 'next/server';
import { User } from 'firebase/auth';
import { cookies } from 'next/headers';
import { initializeApp as initializeAdminApp, getApps as getAdminApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

const SESSION_COOKIE_NAME = '__session';

const serviceAccount: ServiceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
}

function getAdminApp() {
    if (getAdminApps().length > 0) {
        return getAdminApps()[0]!;
    }
    return initializeAdminApp({
        credential: cert(serviceAccount)
    });
}

async function createSession(user: User) {
  const idToken = await user.getIdToken();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await getAdminAuth(getAdminApp()).createSessionCookie(idToken, { expiresIn });

  cookies().set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });
}

async function signOutAndClearSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}


export async function POST(request: NextRequest) {
    try {
        const { user } = (await request.json()) as { user: User };
        await createSession(user);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to create session:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await signOutAndClearSession();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to sign out:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
