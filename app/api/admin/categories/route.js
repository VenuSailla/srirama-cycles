import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
  { name: 'Road Bikes', description: 'Lightweight & Aerodynamic road racing bicycles', order: 1, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mountain Bikes', description: 'Rugged trails, dual disc brakes & front suspension MTBs', order: 2, image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=600&q=80' },
  { name: "Ladies' Cycles", description: 'Comfortable step-through frames & upright posture', order: 3, image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80' },
  { name: "Kids' Cycles", description: 'Safe, durable training wheels & vibrant colors', order: 4, image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=600&q=80' },
  { name: 'City and Hybrid Bikes', description: 'Versatile daily commuters with fast-rolling tires', order: 5, image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80' },
  { name: 'Cycle Accessories', description: 'Helmets, waterproof lights, bottle cages & locks', order: 6, image: 'https://images.unsplash.com/photo-1530982011887-3ce11ab85697?auto=format&fit=crop&w=600&q=80' },
  { name: 'Spare Parts', description: '100% Genuine Shimano chains, brake pads, tubes & tools', order: 7, image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=600&q=80' },
];

export async function GET(request) {
  try {
    await connectToDatabase();
    let categories = await Category.find().sort({ order: 1, createdAt: 1 });

    // Seed default categories if none exist
    if (categories.length === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find().sort({ order: 1, createdAt: 1 });
    }

    // Attach real-time product counts for each category
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
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access required' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();

    if (!data.name || !data.name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Category with this name already exists' }, { status: 400 });
    }

    const category = await Category.create({
      name: data.name.trim(),
      description: data.description || '',
      image: data.image || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
      order: Number(data.order) || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
