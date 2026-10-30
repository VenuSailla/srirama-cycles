import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
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
    const { orderStatus, paymentStatus, adminNotes, timelineNote } = await request.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (orderStatus && orderStatus !== order.orderStatus) {
      order.orderStatus = orderStatus;
      order.timeline.push({
        status: orderStatus,
        date: new Date(),
        comment: timelineNote || `Status updated to ${orderStatus} by store administrator.`,
        completed: true,
      });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (adminNotes !== undefined) {
      order.adminNotes = adminNotes;
    }

    await order.save();
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
