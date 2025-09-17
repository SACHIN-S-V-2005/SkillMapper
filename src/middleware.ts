
import {NextRequest, NextResponse} from 'next/server';

const SESSION_COOKIE_NAME = '__session';

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return false;
  }

  const response = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
    headers: {
      Cookie: `${SESSION_COOKIE_NAME}=${sessionCookie}`,
    },
  });

  return response.ok;
}


export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const authenticated = await isAuthenticated(request);

  const isAuthRoute = pathname.startsWith('/auth');

  if (isAuthRoute) {
    if (authenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!authenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
