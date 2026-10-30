import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { defaultProducts } from '@/lib/catalogData';

export const dynamic = 'force-dynamic';

function getFallbackProduct(id) {
  const found = defaultProducts.find((p) => p._id === id || p.slug === id);
  if (!found) return null;
  const related = defaultProducts
    .filter((p) => p.category === found.category && p._id !== found._id)
    .slice(0, 4);
  return { product: found, related };
}

export async function GET(request, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      const fallback = getFallbackProduct(id);
      if (fallback) {
        return NextResponse.json({ success: true, ...fallback });
      }
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Fetch related products in same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    return NextResponse.json({ success: true, product, related });
  } catch (error) {
    console.warn('Error querying product by ID from DB, checking fallback catalog:', error.message);
    const fallback = getFallbackProduct(id);
    if (fallback) {
      return NextResponse.json({ success: true, ...fallback });
    }
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access required' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = params;
    const body = await request.json();

    const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized admin access required' }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
