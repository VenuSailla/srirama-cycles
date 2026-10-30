import mongoose from 'mongoose';

const SlideSchema = new mongoose.Schema(
  {
    order: { type: Number, default: 0 },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, required: true },
    buttonText: { type: String, default: 'Shop Now' },
    buttonLink: { type: String, default: '/shop' },
    secondaryButtonText: { type: String, default: 'Explore Collection' },
    secondaryButtonLink: { type: String, default: '/shop' },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    tag: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Slide || mongoose.model('Slide', SlideSchema);
