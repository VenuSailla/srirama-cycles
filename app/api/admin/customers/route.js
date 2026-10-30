import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access required' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const query = { role: 'customer' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await User.find(query).select('-password').sort({ createdAt: -1 });

    // Attach order summary for each customer
    const customersWithOrders = await Promise.all(
      customers.map(async (c) => {
        const customerOrders = await Order.find({
          $or: [{ 'customer.userId': c._id }, { 'customer.email': c.email }],
        });
        const totalSpent = customerOrders.reduce((sum, o) => (o.orderStatus !== 'Cancelled' ? sum + o.total : sum), 0);
        return {
          ...c.toObject(),
          orderCount: customerOrders.length,
          totalSpent,
        };
      })
    );

    return NextResponse.json({
      success: true,
      count: customersWithOrders.length,
      customers: customersWithOrders,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
