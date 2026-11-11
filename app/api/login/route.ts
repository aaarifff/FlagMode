import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByUsername } from '@/lib/db';
import { createSession, COOKIE_NAME } from '@/lib/auth';

// Simple in-memory attempt tracker for rate-limiting (FR-A6)
const failedAttempts = new Map<string, { count: number; blockedUntil: number }>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const now = Date.now();

    const record = failedAttempts.get(ip);
    if (record && record.blockedUntil > now) {
      const waitSec = Math.ceil((record.blockedUntil - now) / 1000);
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${waitSec}s.` },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = getUserByUsername(username);
    if (!user) {
      handleFailedAttempt(ip);
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      handleFailedAttempt(ip);
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Reset failed attempts on success
    failedAttempts.delete(ip);

    // Create session token
    const token = await createSession(user.username);

    const response = NextResponse.json({ success: true, user: user.username });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 12 * 60 * 60, // 12 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

function handleFailedAttempt(ip: string) {
  const current = failedAttempts.get(ip) || { count: 0, blockedUntil: 0 };
  current.count++;
  if (current.count >= 5) {
    current.blockedUntil = Date.now() + 60 * 1000; // Block for 1 min
    current.count = 0;
  }
  failedAttempts.set(ip, current);
}

