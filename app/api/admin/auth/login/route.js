import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'saillavenu012@gmail.com').toLowerCase();
    const envAdminPass = process.env.ADMIN_PASSWORD || '12345678';

    let adminUser = await User.findOne({ email: cleanEmail });

    // Auto-initialize admin account if matching configured admin email
    if (!adminUser && cleanEmail === envAdminEmail) {
      const hashedPassword = await hashPassword(envAdminPass);
      adminUser = await User.create({
        name: 'Ravula Rakesh Kumar (Admin)',
        email: cleanEmail,
        password: hashedPassword,
        role: 'admin',
        phone: '+91 95736 53194',
      });
    }

    if (!adminUser || (adminUser.role !== 'admin' && cleanEmail !== envAdminEmail)) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
    }

    // Verify password against DB hash or configured development password
    const isMatch = (await comparePassword(password, adminUser.password)) || (cleanEmail === envAdminEmail && password === envAdminPass);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = signToken({
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: 'admin',
      isAdmin: true,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: 'admin',
      },
    });

    response.cookies.set('sri_rama_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
