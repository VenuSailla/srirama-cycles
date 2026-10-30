import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { customer, shippingAddress, items, paymentMethod } = body;

    if (!customer?.name || !customer?.phone || !customer?.email) {
      return NextResponse.json(
        { success: false, error: 'Customer name, phone, and email are required' },
        { status: 400 }
      );
    }

    if (
      !shippingAddress?.street ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
      return NextResponse.json(
        { success: false, error: 'Complete delivery address and pincode are required' },
        { status: 400 }
      );
    }

    if (!items || !items.length) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one product' },
        { status: 400 }
      );
    }

    // Authoritative price and stock validation from database
    let computedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item._id);
      if (!dbProduct) {
        return NextResponse.json(
          { success: false, error: `Product "${item.name}" is no longer available` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, parseInt(item.quantity || 1, 10));
      if (dbProduct.stock < qty) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} left.`,
          },
          { status: 400 }
        );
      }

      const itemPrice = dbProduct.price;
      computedSubtotal += itemPrice * qty;

      verifiedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        brand: dbProduct.brand,
        price: itemPrice,
        quantity: qty,
        image: dbProduct.images?.[0] || '',
        size: item.selectedSize || 'Standard',
      });
    }

    const shippingThreshold = 20000;
    const shippingCost = computedSubtotal >= shippingThreshold ? 0 : 499;
    const total = computedSubtotal + shippingCost;

    // Generate unique order ID e.g. SRC-102938
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderId = `SRC-${randomDigits}`;

    // Estimated delivery in 4-6 business days
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 5);

    // Initial timeline
    const timeline = [
      {
        status: 'Order Placed',
        date: new Date(),
        comment: 'Order received and logged in system successfully.',
        completed: true,
      },
    ];

    // Optional user session
    const userSession = requireUser(request);

    const order = await Order.create({
      orderId,
      customer: {
        userId: userSession?.id || null,
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
      },
      shippingAddress: {
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
      },
      items: verifiedItems,
      subtotal: computedSubtotal,
      shippingCost,
      total,
      paymentMethod: paymentMethod === 'Online Payment' ? 'Online Payment' : 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Order Placed',
      timeline,
      estimatedDeliveryDate: estimatedDate,
    });

    // Safely decrement stock for each ordered item
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const user = requireUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const orders = await Order.find({
      $or: [{ 'customer.userId': user.id }, { 'customer.email': user.email }],
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
