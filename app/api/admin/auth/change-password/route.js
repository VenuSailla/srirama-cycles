import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin, comparePassword, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const adminSession = requireAdmin(request);
    if (!adminSession) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password, new password, and confirmation are required.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New password and confirmation password do not match.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const adminUser = await User.findById(adminSession.id);
    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Admin user not found' }, { status: 404 });
    }

    const envAdminPass = process.env.ADMIN_PASSWORD || '12345678';
    const isCurrentValid =
      (await comparePassword(currentPassword, adminUser.password)) ||
      currentPassword === envAdminPass;

    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);
    adminUser.password = hashedPassword;
    await adminUser.save();

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully! Please use your new password next time you sign in.',
    });
  } catch (error) {
    console.error('Error changing admin password:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

