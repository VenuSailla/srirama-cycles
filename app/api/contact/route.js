import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, phone, subject, message, honeypot } = body;

    // Spam honeypot detection
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Enquiry received' });
    }

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields (Name, Email, Phone, Subject, Message) are required.' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'New',
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our team will contact you shortly.',
      enquiryId: enquiry._id,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
