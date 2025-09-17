
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const sessionCookie = request.cookies.get(auth.SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const decodedIdToken = await auth.getSession();
        if (!decodedIdToken) {
            return new Response('Unauthorized', { status: 401 });
        }
        return NextResponse.json({ success: true, uid: decodedIdToken.uid });
    } catch (error) {
        console.error('Failed to verify session:', error);
        return new Response('Unauthorized', { status: 401 });
    }
}
