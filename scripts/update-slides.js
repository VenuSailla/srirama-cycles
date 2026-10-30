const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (_) {}

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

const Slide = mongoose.models.Slide || mongoose.model('Slide', SlideSchema);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const slides = [
    {
      order: 1,
      title: 'Sri Rama Cycles',
      subtitle: 'SERVING TELANGANA & HANUMAKONDA SINCE 1976',
      description: 'Sri Rama Cycles – Your Trusted Partner on Every Road! Experience 50 years of trusted bicycle craftsmanship, pro assembly, and reliable quality for every journey.',
      buttonText: 'Shop All Bicycles',
      buttonLink: '/shop',
      secondaryButtonText: 'Visit Showroom',
      secondaryButtonLink: '/contact',
      imageUrl: '/slider/hero-specialized-mtb.jpg',
      tag: '50 Years Landmark',
      isActive: true,
    },
    {
      order: 2,
      title: 'Embrace The Wild Trails',
      subtitle: 'NATURAL TRAIL ADVENTURE',
      description: 'Conquer rocky paths, steep forest slopes, and singletracks with dual disc brakes, lightweight alloy geometry, and responsive front suspension.',
      buttonText: 'Explore Mountain Bikes',
      buttonLink: '/shop?category=Mountain%20Cycles',
      secondaryButtonText: 'View MTB Lineup',
      secondaryButtonLink: '/shop?category=Mountain%20Cycles',
      imageUrl: '/slider/trail-mountain-bike.jpg',
      tag: 'Trail Ready & Rugged',
      isActive: true,
    },
    {
      order: 3,
      title: 'Smooth Glide, Pure Speed',
      subtitle: 'HIGH PERFORMANCE ENDURANCE',
      description: 'Feel the rush of fresh morning air on open highways with ultra-light carbon & alloy road racers crafted for pure speed and long-distance comfort.',
      buttonText: 'Shop Road Cycles',
      buttonLink: '/shop?category=Road%20Cycles',
      secondaryButtonText: 'View Road Bikes',
      secondaryButtonLink: '/shop?category=Road%20Cycles',
      imageUrl: '/slider/road-speed-racer.jpg',
      tag: 'Aero & Endurance',
      isActive: true,
    },
    {
      order: 4,
      title: 'Serene Countryside Journeys',
      subtitle: 'CASUAL OUTDOOR COMMUTE',
      description: 'Delightful low-step frames, upright posture geometry, and plush cushioned saddles designed for peaceful evening rides through tree-lined streets.',
      buttonText: 'Shop Ladies & City',
      buttonLink: '/shop?category=Ladies%20Cycles',
      secondaryButtonText: 'City Collection',
      secondaryButtonLink: '/shop?category=City%20and%20Hybrid%20Bikes',
      imageUrl: '/slider/city-cruiser-bike.jpg',
      tag: 'Family Favorite',
      isActive: true,
    },
    {
      order: 5,
      title: 'Sunlit Pathways & Family Joy',
      subtitle: 'STARTING EARLY ADVENTURES',
      description: 'Safe, durable, colorful children bicycles fitted with sturdy training wheels and impact-resistant components for healthy smiles in the park.',
      buttonText: 'Shop Kids Cycles',
      buttonLink: '/shop?category=Kids%20Cycles',
      secondaryButtonText: 'View All Models',
      secondaryButtonLink: '/shop',
      imageUrl: '/slider/kids-family-bicycle.jpg',
      tag: 'Family & Recreation',
      isActive: true,
    },
  ];

  await Slide.deleteMany({});
  await Slide.insertMany(slides);
  console.log('Successfully saved 5 natural cycle slides to MongoDB');
  await mongoose.disconnect();
}

main().catch(console.error);
