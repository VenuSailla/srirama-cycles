import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: { $regex: new RegExp(`^${cat.name}$`, 'i') },
        });
        return {
          ...cat.toObject(),
          productCount: count,
        };
      })
    );

    return NextResponse.json({ success: true, count: categoriesWithCount.length, categories: categoriesWithCount });
  } catch (error) {
    console.error('Error fetching public categories:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
