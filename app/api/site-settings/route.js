import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
