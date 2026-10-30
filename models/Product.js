import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isSample: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    description: { type: String, default: '' },
    images: { type: [String], default: [] },
    size: { type: String, default: 'Standard' },
    stock: { type: Number, default: 10, min: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    specifications: { type: Map, of: String, default: {} },
    warranty: { type: String, default: '1 Year Frame Warranty, 6 Months Parts' },
    deliveryInfo: { type: String, default: 'Doorstep delivery available (charges based on location); 95% pre-assembled.' },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 12 },
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

// Auto compute isAvailable from stock
ProductSchema.pre('save', function (next) {
  if (this.stock <= 0) {
    this.isAvailable = false;
  }
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
