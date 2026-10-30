import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Slide from '@/models/Slide';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();
    const { id } = params;
    const body = await request.json();

    const slide = await Slide.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, slide });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();
    const { id } = params;

    await Slide.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Slide deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
