import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { orderId, contact } = await request.json();

    if (!orderId || !contact) {
      return NextResponse.json(
        { success: false, error: 'Both Order ID and registered Mobile Number/Email are required.' },
        { status: 400 }
      );
    }

    const cleanOrderId = orderId.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase();

    // Find order by orderId
    const order = await Order.findOne({ orderId: cleanOrderId });
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found. Please verify your Order ID and try again.' },
        { status: 404 }
      );
    }

    // Verify contact info (mobile phone or email)
    const emailMatch = order.customer.email.toLowerCase() === cleanContact;
    const phoneMatch = order.customer.phone.replace(/[^0-9]/g, '').includes(cleanContact.replace(/[^0-9]/g, ''));

    if (!emailMatch && !phoneMatch) {
      return NextResponse.json(
        {
          success: false,
          error: 'The registered phone or email provided does not match this Order ID.',
        },
        { status: 403 }
      );
    }

    // Standard ordered stages
    const allStages = [
      'Order Placed',
      'Confirmed',
      'Processing and Assembly',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];

    const currentIdx = allStages.indexOf(order.orderStatus);

    const fullTimeline = allStages.map((stageName, idx) => {
      const isPastOrCurrent = currentIdx >= 0 && idx <= currentIdx;
      const matchedTimelineItem = order.timeline?.find((t) => t.status === stageName);

      return {
        stage: stageName,
        completed: isPastOrCurrent,
        isCurrent: idx === currentIdx,
        date: matchedTimelineItem ? matchedTimelineItem.date : null,
        comment: matchedTimelineItem?.comment || '',
      };
    });

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        total: order.total,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        customerName: order.customer.name,
        shippingAddress: order.shippingAddress,
        items: order.items,
        timeline: fullTimeline,
      },
    });
  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          'Unable to reach showroom tracking system right now. Please verify your Order ID or call our helpline at +91 95736 53194.',
      },
      { status: 500 }
    );
  }
}
