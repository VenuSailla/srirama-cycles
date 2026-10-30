import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { defaultSettings } from '@/lib/catalogData';

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
    console.warn('Error fetching site-settings from DB, serving fallback settings:', error.message);
    return NextResponse.json({ success: true, settings: defaultSettings });
  }
}
