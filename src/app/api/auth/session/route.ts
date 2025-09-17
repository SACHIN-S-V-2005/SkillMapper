'use server';

import { type NextRequest, NextResponse } from 'next/server';
import { User } from 'firebase/auth';
import { cookies } from 'next/headers';
import { getAdminAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

const SESSION_COOKIE_NAME = '__session';

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
