import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, admin: null });
  }

  return NextResponse.json({
    success: true,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
    },
  });
}
