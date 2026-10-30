import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Slide from '@/models/Slide';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();
    const slides = await Slide.find().sort({ order: 1 });
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();
    const body = await request.json();
    const count = await Slide.countDocuments();
    const slide = await Slide.create({
      ...body,
      order: body.order || count + 1,
    });
    return NextResponse.json({ success: true, slide }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
