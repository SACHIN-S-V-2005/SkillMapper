'use server';

import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

const SESSION_COOKIE_NAME = '__session';

export async function GET(request: NextRequest) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const adminAuth = getAdminAuth(getAdminApp());
        const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);

        if (!decodedIdToken) {
            return new Response('Unauthorized', { status: 401 });
        }
        return NextResponse.json({ success: true, uid: decodedIdToken.uid });
    } catch (error) {
        console.error('Failed to verify session:', error);
        return new Response('Unauthorized', { status: 401 });
    }
}
