import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Enquiry from '@/models/Enquiry';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const [totalProducts, lowStockCount, totalOrders, totalEnquiries, totalCustomers, pendingOrdersCount, lowStockProducts] =
      await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ stock: { $lte: 5 } }),
        Order.countDocuments(),
        Enquiry.countDocuments(),
        User.countDocuments({ role: 'customer' }),
        Order.countDocuments({
          orderStatus: { $in: ['Order Placed', 'Confirmed', 'Processing and Assembly', 'Pending'] },
        }),
        Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 }).limit(10),
      ]);

    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(8);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        lowStockCount,
        pendingOrdersCount,
        totalEnquiries,
        totalCustomers,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
