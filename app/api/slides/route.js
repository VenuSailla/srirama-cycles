import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Slide from '@/models/Slide';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const slides = await Slide.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
