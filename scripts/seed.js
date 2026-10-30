const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dns = require('dns');

// Safely parse local .env.local if present
try {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        if (!process.env[k.trim()]) {
          process.env[k.trim()] = v.join('=').trim();
        }
      }
    });
  }
} catch (_) {}

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (_) {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/srirama_cycles';

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
    reviews: [
      {
        userName: String,
        rating: Number,
        comment: String,
        isSample: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

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

const SiteSettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'Sri Rama Cycle Store & Auto Spares' },
    registeredName: { type: String, default: 'SRI RAMA CYCLE AND AUTO SPARE PARTS' },
    proprietor: { type: String, default: 'Ravula Rakesh Kumar' },
    phone: { type: String, default: '+91 95736 53194' },
    email: { type: String, default: 'sreeramacycle@gmail.com' },
    whatsapp: { type: String, default: '+919573653194' },
    address: {
      type: String,
      default: 'SSS COMPLEX B-3, Main Road, Kazipet, Hanumakonda (District) - 506003, Telangana, India',
    },
    openingHoursWeekdays: { type: String, default: 'Monday to Saturday: 9:00 AM – 8:30 PM' },
    openingHoursSunday: { type: String, default: 'Sunday: 9:00 AM – 1:00 PM' },
    announcementBar: { type: String, default: '🚲 Special Festive Offer: Flat 10% Off on Premium Road & MTB Cycles! Doorstep Delivery Available.' },
    aboutUsShort: {
      type: String,
      default:
        'Sri Rama Cycle Store & Auto Spares is Telangana’s premier bicycle showroom and authorized genuine spares destination, serving riders with top brand cycles, certified workshop repair, and authentic accessories.',
    },
    historyText: {
      type: String,
      default:
        'Established as a trusted community bicycle hub, Sri Rama Cycle Store has proudly served generations of cyclists across Kazipet, Hanumakonda, and Warangal with genuine cycles and authorized auto spares.',
    },
    footerCopyright: {
      type: String,
      default: '© 2026 Sri Rama Cycle Store & Auto Spares. All rights reserved.',
    },
    footerCredit: {
      type: String,
      default: 'Developed by Abhivorn Technologies & DigiLevelUp.',
    },
  },
  { timestamps: true }
);

const sampleProducts = [
  {
    name: 'Srirama Urban Glide City Commuter 700C',
    slug: 'srirama-urban-glide-city-commuter-700c',
    brand: 'Srirama City',
    category: 'City & Hybrid Cycles',
    price: 19999,
    originalPrice: 23999,
    discount: 17,
    description:
      'Engineered for effortless daily commutes and fitness rides. Features a lightweight 6061 alloy frame, 700x35C anti-puncture fast-rolling tires, ergonomic grips, and smooth Shimano 7-speed shifting for city streets.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80',
    ],
    size: '18 Inch Frame / 700C Wheels',
    stock: 14,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    specifications: {
      Frame: 'Hydroformed 6061 Lightweight Alloy',
      Gears: 'Shimano Tourney 7-Speed with RevoShift',
      Brakes: 'Dual Mechanical Disc Brakes (160mm)',
      Wheels: '700C Double Wall Alloy Rims',
      Tires: 'Wanda 700x35C City Commuter Grippy',
      Fork: 'Rigid Aerodynamic Steel Fork',
      Weight: '12.8 kg',
    },
    warranty: 'Lifetime Frame Warranty, 1 Year Components',
    rating: 4.8,
    reviewCount: 18,
    reviews: [
      {
        userName: 'Vikram Reddy',
        rating: 5,
        comment: 'Super smooth riding posture. Perfect for Kazipet-Warangal daily commute!',
        isSample: true,
      },
    ],
  },
  {
    name: 'Srirama Original Auto Spare Parts & Pro Toolkit Kit',
    slug: 'srirama-original-auto-spare-parts-pro-toolkit-kit',
    brand: 'Sri Rama Genuine Spares',
    category: 'Bicycle Spare Parts and Accessories',
    price: 2499,
    originalPrice: 3199,
    discount: 22,
    description:
      'Comprehensive maintenance toolkit with genuine high-grade carbon steel bicycle tools, patch repair kits, chain breaker, hex wrench set, spoke adjuster, and compact carry pouch for emergency on-the-go maintenance.',
    images: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530982011887-3ce11ab85697?auto=format&fit=crop&w=1200&q=80',
    ],
    size: 'Universal Multi-Tool Set',
    stock: 35,
    isAvailable: true,
    isFeatured: false,
    isBestSeller: true,
    specifications: {
      'Tools Included': '16-in-1 Multi-Tool, Chain Tool, Tire Levers, Glueless Patch Kit',
      Material: 'Heat-Treated CR-V Chrome Vanadium Steel',
      Case: 'Weather-Resistant Ballistic Nylon Case',
      Compatibility: 'All MTB, Road, and Hybrid Cycles',
    },
    warranty: '2 Years Manufacturer Tool Warranty',
    rating: 4.9,
    reviewCount: 24,
    reviews: [
      {
        userName: 'Srinivas Rao',
        rating: 5,
        comment: 'Every cyclist must carry this kit. Very durable tools from Sri Rama!',
        isSample: true,
      },
    ],
  },
  {
    name: 'Srirama Starlet 16-inch Kids Cycle',
    slug: 'srirama-starlet-16-inch-kids-cycle',
    brand: 'Srirama Junior',
    category: 'Kids Cycles',
    price: 6499,
    originalPrice: 7999,
    discount: 19,
    description:
      'Delightful, sturdy, and safe bicycle designed for children aged 4 to 7 years. Equipped with heavy-duty training wheels, full protective chain guard, cushioned handlebar pads, and front utility basket.',
    images: [
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1200&q=80',
    ],
    size: '16 Inch Wheels',
    stock: 20,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: false,
    specifications: {
      'Age Group': '4 to 7 Years (Height: 3.5 - 4.2 ft)',
      Frame: 'High Tensile Reinforced Steel',
      Safety: 'Full Chain Guard, Front & Rear Mudguards',
      Brakes: 'Smooth Caliper Front & Rear V-Brakes',
      Accessories: 'Removable Heavy Duty Training Wheels & Basket',
    },
    warranty: '1 Year Warranty on Frame and Fork',
    rating: 4.7,
    reviewCount: 15,
  },
  {
    name: 'Srirama High-Lumen Bike Headlight Set',
    slug: 'srirama-high-lumen-bike-headlight-set',
    brand: 'Sri Rama Genuine Spares',
    category: 'Bicycle Spare Parts and Accessories',
    price: 1599,
    originalPrice: 2199,
    discount: 27,
    description:
      'Ultra-bright 1000-lumen USB rechargeable front cycle headlight paired with multi-mode red rear safety tail light. IPX6 waterproof certified with up to 10 hours runtime for night safety and dawn touring.',
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=80',
    ],
    size: 'Universal Mount',
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    isBestSeller: true,
    specifications: {
      Brightness: '1000 Lumens Max Output',
      Battery: '2600mAh USB-C Rechargeable Lithium-Ion',
      Waterproof: 'IPX6 Rated for Heavy Monsoon Rains',
      Modes: 'High, Medium, Low, Strobe, Breathing Flasher',
    },
    warranty: '6 Months Replacement Warranty',
    rating: 4.9,
    reviewCount: 31,
  },
  {
    name: 'Srirama AeroShield Pro Cycling Helmet',
    slug: 'srirama-aeroshield-pro-cycling-helmet',
    brand: 'Sri Rama Genuine Spares',
    category: 'Bicycle Spare Parts and Accessories',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    description:
      'Aerodynamically optimized, ultra-lightweight in-mold cycling helmet with high-density EPS impact foam and dial-fit retention system. Features 21 wind-tunnel cooling vents and detachable sun visor.',
    images: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    ],
    size: 'Medium / Large (56-61 cm Adjustable)',
    stock: 25,
    isAvailable: true,
    isFeatured: false,
    isBestSeller: false,
    specifications: {
      Safety: 'CE EN1078 & CPSC Certified',
      Weight: '240 grams Ultra-Lightweight',
      Ventilation: '21 Flow-Through Cooling Vents',
      Lining: 'Removable, Washable Moisture-Wicking Pads',
    },
    warranty: '1 Year Manufacturer Defect Warranty',
    rating: 4.8,
    reviewCount: 19,
  },
  {
    name: 'Srirama Apex Carbon Aero Road Bike',
    slug: 'srirama-apex-carbon-aero-road-bike',
    brand: 'Srirama Pro',
    category: 'Road Cycles',
    price: 58999,
    originalPrice: 68999,
    discount: 15,
    description:
      'A true masterclass in speed and road aerodynamics. Crafted with Toray T700 carbon fiber composite frame and fork, Shimano 105 2x11 speed groupset, integrated cable routing, and deep dish aero wheelset for ultimate podium speeds.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
    ],
    size: '52 cm / 54 cm Medium Frame',
    stock: 6,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    specifications: {
      Frame: 'Toray T700 Monocoque Carbon Aero Frame',
      Fork: 'Full Carbon Tapered Steerer Road Fork',
      Groupset: 'Shimano 105 R7000 2x11 Speed',
      Brakes: 'Shimano 105 Flat Mount Hydraulic Disc Brakes',
      Wheelset: '38mm Carbon-Alloy Hybrid Aero Clincher',
      Tires: 'Continental Ultra Sport III 700x25C',
      Weight: '8.4 kg Total',
    },
    warranty: '5 Years Carbon Frame Warranty, 2 Years Shimano Parts',
    rating: 5.0,
    reviewCount: 9,
  },
  {
    name: 'Srirama Elegance 26-inch Ladies Cycle',
    slug: 'srirama-elegance-26-inch-ladies-cycle',
    brand: 'Srirama Ladies',
    category: 'Ladies Cycles',
    price: 14999,
    originalPrice: 17999,
    discount: 17,
    description:
      'Graceful, low-step-through bicycle tailored for modern ladies and girls. Features a comfort spring saddle, Dutch upright cruiser handlebars, front woven basket, dress guard, and soft pastel finish.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80',
    ],
    size: '26 Inch Wheels / Low Step-Through',
    stock: 12,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: false,
    specifications: {
      Frame: 'Low Step-Through Ergonomic Steel Frame',
      Gears: 'Single Speed Low Maintenance Drive',
      Brakes: 'V-Brakes Front and Rear with Soft-Touch Levers',
      Comfort: 'Wide Dual-Spring Comfort Saddle & Upright Posture',
      Accessories: 'Front Woven Basket, Full Chain Cover, Rear Carrier',
    },
    warranty: '2 Years Frame Warranty',
    rating: 4.8,
    reviewCount: 14,
  },
  {
    name: 'Srirama Terra Pro 29-inch Mountain Bike',
    slug: 'srirama-terra-pro-29-inch-mountain-bike',
    brand: 'Srirama Trail',
    category: 'Mountain Cycles',
    price: 47999,
    originalPrice: 54999,
    discount: 13,
    description:
      'Tackle rugged single-tracks, mountain trails, and rough terrains with supreme poise. Equipped with Suntour XCR 120mm air suspension with lockout, 1x12 wide-ratio gear drivetrain, and high-traction 29x2.35 off-road Maxxis knobby tires.',
    images: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1200&q=80',
    ],
    size: '19 Inch Large Frame / 29 Inch Wheels',
    stock: 8,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    specifications: {
      Frame: 'Butted 6061 Trail MTB Geometry with Internal Routing',
      Suspension: 'SR Suntour 120mm Air Fork with Remote Lockout',
      Drivetrain: 'SRAM SX Eagle 1x12 Speed Wide Range',
      Brakes: 'Shimano MT200 Hydraulic Disc Brakes (180mm/160mm)',
      Tires: 'Maxxis Rekon Race 29x2.35" High Traction',
      Weight: '13.2 kg',
    },
    warranty: 'Lifetime Frame Warranty, 1 Year Components',
    rating: 4.9,
    reviewCount: 22,
  },
  {
    name: 'Srirama Phantom Pro 27.5-inch Disc Brake Cycle',
    slug: 'srirama-phantom-pro-27-5-inch-disc-brake-cycle',
    brand: 'Srirama Gear',
    category: 'Disc Brake Cycles',
    price: 21999,
    originalPrice: 26999,
    discount: 19,
    description:
      'Sleek and aggressive sport bicycle featuring responsive dual disc brakes, front lock-out suspension fork, Shimano 21-speed gears, and lightweight alloy rims. Ideal for sporty daily fitness and weekend adventures.',
    images: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
    ],
    size: '17.5 Inch Frame / 27.5 Inch Wheels',
    stock: 16,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    specifications: {
      Frame: 'Aerodynamic Alloy 6061 Hydroformed Frame',
      Fork: '100mm Suspension Fork with Mechanical Lockout',
      Gears: 'Shimano Tourney TY300 21-Speed Combo',
      Brakes: 'Dual Zoom Mechanical Disc Brakes',
      Tires: 'Kenda 27.5x2.10 All-Terrain Grip Tires',
    },
    warranty: '3 Years Frame Warranty, 1 Year Parts',
    rating: 4.8,
    reviewCount: 27,
  },
];

const sampleSlides = [
  {
    order: 1,
    title: 'Find Your Perfect Ride',
    subtitle: 'PREMIUM BICYCLES',
    description: 'Explore premium bicycles designed for everyday comfort, adventure, and performance.',
    buttonText: 'Shop Bicycles',
    buttonLink: '/shop?category=Road%20Cycles',
    secondaryButtonText: 'Explore Collection',
    secondaryButtonLink: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1920&q=80',
    isActive: true,
    tag: 'Showroom Spotlight',
  },
  {
    order: 2,
    title: 'Adventure Starts Here',
    subtitle: 'MOUNTAIN BIKES',
    description: 'Discover durable mountain bikes built for exciting trails and outdoor adventures.',
    buttonText: 'Explore Mountain Bikes',
    buttonLink: '/shop?category=Mountain%20Cycles',
    secondaryButtonText: 'View All MTB',
    secondaryButtonLink: '/shop?category=Mountain%20Cycles',
    imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1920&q=80',
    isActive: true,
    tag: 'Trail Ready',
  },
  {
    order: 3,
    title: 'A Perfect Ride for Everyone',
    subtitle: 'LADIES & KIDS CYCLES',
    description: 'Discover comfortable and stylish bicycles for every age and every journey.',
    buttonText: 'Explore Collections',
    buttonLink: '/shop?category=Kids%20Cycles',
    secondaryButtonText: 'Ladies Cycles',
    secondaryButtonLink: '/shop?category=Ladies%20Cycles',
    imageUrl: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1920&q=80',
    isActive: true,
    tag: 'Family & Junior',
  },
  {
    order: 4,
    title: 'Quality Parts. Reliable Performance.',
    subtitle: 'GENUINE SPARE PARTS',
    description: 'Shop genuine bicycle spare parts, helmets, lights, tools, and accessories.',
    buttonText: 'Shop Spare Parts',
    buttonLink: '/shop?category=Bicycle%20Spare%20Parts%20and%20Accessories',
    secondaryButtonText: 'Explore Accessories',
    secondaryButtonLink: '/shop?category=Bicycle%20Spare%20Parts%20and%20Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1530982011887-3ce11ab85697?auto=format&fit=crop&w=1920&q=80',
    isActive: true,
    tag: 'Certified Auto Spares',
  },
];

async function seedDatabase() {
  console.log('🚲 Sri Rama Cycle Store & Auto Spares - Seeding Database...');
  console.log(`Connecting to: ${MONGODB_URI.substring(0, 35)}...`);

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB successfully.');

    const ProductModel = conn.model('Product', ProductSchema);
    const SlideModel = conn.model('Slide', SlideSchema);
    const SiteSettingsModel = conn.model('SiteSettings', SiteSettingsSchema);

    // 1. Seed or update Site Settings
    const existingSettings = await SiteSettingsModel.findOne();
    if (!existingSettings) {
      await SiteSettingsModel.create({});
      console.log('✅ Default Site Settings initialized.');
    } else {
      console.log('ℹ️ Site Settings already present, preserved.');
    }

    // 2. Seed or update Slides
    for (const slide of sampleSlides) {
      await SlideModel.findOneAndUpdate(
        { order: slide.order },
        { $set: slide },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${sampleSlides.length} Homepage Slides verified/seeded.`);

    // 3. Seed or update Sample Products (Safe upsert by name to avoid duplicates)
    for (const prod of sampleProducts) {
      await ProductModel.findOneAndUpdate(
        { name: prod.name },
        { $set: prod },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${sampleProducts.length} Sample Products verified/seeded successfully.`);

    console.log('\n🎉 Database seeding finished without duplicates!\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Database seeding error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
