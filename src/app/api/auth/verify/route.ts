
import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { initializeApp as initializeAdminApp, getApps as getAdminApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth as getAdminAuth, type DecodedIdToken } from 'firebase-admin/auth';

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

async function getSession(): Promise<DecodedIdToken | null> {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    return await getAdminAuth(getAdminApp()).verifySessionCookie(session, true);
  } catch (error) {
    console.error('Error verifying session cookie in getSession:', error);
    return null;
  }
}

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
