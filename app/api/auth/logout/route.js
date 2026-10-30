import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set('sri_rama_session', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });
  return response;
}
