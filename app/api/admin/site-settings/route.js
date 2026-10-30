import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();
    const body = await request.json();

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(body);
    } else {
      settings = await SiteSettings.findOneAndUpdate({}, body, { new: true });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
