import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { filterProducts } from '@/lib/catalogData';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    await connectToDatabase();

    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const isFeatured = searchParams.get('isFeatured');
    const isBestSeller = searchParams.get('isBestSeller');
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const overallCount = await Product.estimatedDocumentCount().catch(() => 0);
    if (overallCount === 0) {
      return NextResponse.json(filterProducts(searchParams));
    }

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      const catLower = category.toLowerCase().trim();
      if (catLower.includes('spare')) {
        query.category = { $regex: 'spare', $options: 'i' };
      } else {
        const cleanCat = category.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.category = { $regex: cleanCat, $options: 'i' };
      }
    }

    if (brand && brand !== 'All') {
      query.brand = brand;
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    if (isBestSeller === 'true') {
      query.isBestSeller = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { price: 1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'popularity') sortObj = { rating: -1, reviewCount: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    // If query returned 0 products, verify if fallback catalog has matches
    if (products.length === 0 && (category || search)) {
      const fallback = filterProducts(searchParams);
      if (fallback.products.length > 0) {
        return NextResponse.json(fallback);
      }
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      products,
    });
  } catch (error) {
    console.warn('Database query failed; serving resilient fallback catalog:', error.message);
    try {
      const fallback = filterProducts(searchParams);
      return NextResponse.json(fallback);
    } catch (_) {
      return NextResponse.json({
        success: true,
        count: 0,
        total: 0,
        page: 1,
        pages: 1,
        products: [],
      });
    }
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

    if (!data.name || !data.brand || !data.category || data.price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, brand, category, and price are required' },
        { status: 400 }
      );
    }

    const product = await Product.create(data);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
