import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Slide from '@/models/Slide';
import { defaultSlides } from '@/lib/catalogData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const slides = await Slide.find({ isActive: true }).sort({ order: 1 });
    if (slides && slides.length > 0) {
      return NextResponse.json({ success: true, slides });
    }
    return NextResponse.json({ success: true, slides: defaultSlides });
  } catch (error) {
    console.warn('Error fetching slides from DB, serving fallback slides:', error.message);
    return NextResponse.json({ success: true, slides: defaultSlides });
  }
}
