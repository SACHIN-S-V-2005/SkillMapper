
import { auth } from '@/lib/auth';
import { type NextRequest, NextResponse } from 'next/server';
import { User } from 'firebase/auth';

export async function POST(request: NextRequest) {
    try {
        const { user } = (await request.json()) as { user: User };
        await auth.createSession(user);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to create session:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await auth.signOutAndClearSession();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to sign out:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
