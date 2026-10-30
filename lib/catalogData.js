// lib/catalogData.js
// High-fidelity fallback catalog and settings for Sri Rama Cycle Store & Auto Spares.
// Ensures 100% uptime and instant product availability across all devices and networks.

export const defaultSettings = {
  storeName: 'Sri Rama Cycle Store & Auto Spares',
  registeredName: 'SRI RAMA CYCLE AND AUTO SPARE PARTS',
  proprietor: 'Ravula Rakesh Kumar',
  phone: '+91 95736 53194',
  email: 'sreeramacycle@gmail.com',
  whatsapp: '+919573653194',
  address: 'SSS COMPLEX B-3, Main Road, Kazipet, Hanumakonda (District) - 506003, Telangana, India',
  openingHoursWeekdays: 'Monday to Saturday: 9:00 AM – 8:30 PM',
  openingHoursSunday: 'Sunday: 9:00 AM – 1:00 PM',
  announcementBar: '🚲 Special Festive Offer: Flat 10% Off on Premium Road & MTB Cycles! Doorstep Delivery Available.',
  slogan: 'Honest Cycles • Genuine Spares • Trusted Service Since 1976',
  aboutUsShort:
    'Sri Rama Cycle Store & Auto Spares is Telangana’s premier bicycle showroom and authorized genuine spares destination, serving riders with top brand cycles, certified workshop repair, and authentic accessories.',
  historyText:
    'Established as a trusted community bicycle hub, Sri Rama Cycle Store has proudly served generations of cyclists across Kazipet, Hanumakonda, and Warangal with genuine cycles and authorized auto spares.',
  footerCopyright: '© 2026 Sri Rama Cycle Store & Auto Spares. All rights reserved.',
  footerCredit: 'Developed by Abhivorn Technologies & DigiLevelUp.',
};

export const defaultSlides = [
  {
    _id: 'slide-01',
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
    _id: 'slide-02',
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
    _id: 'slide-03',
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
    _id: 'slide-04',
    order: 4,
    title: 'Quality Parts. Reliable Performance.',
    subtitle: 'GENUINE SPARE PARTS',
    description: 'Shop genuine bicycle spare parts, helmets, lights, tools, and accessories.',
    buttonText: 'Shop Spare Parts',
    buttonLink: '/shop?category=Bicycle%20Spare%20Parts%20and%20Accessories',
    secondaryButtonText: 'City & Hybrid',
    secondaryButtonLink: '/shop?category=City%20%26%20Hybrid%20Cycles',
    imageUrl: 'https://images.unsplash.com/photo-1530982011887-3ce11ab85697?auto=format&fit=crop&w=1920&q=80',
    isActive: true,
    tag: 'Certified Genuine Spares',
  },
];

export const defaultProducts = [
  {
    _id: '67c100000000000000000001',
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
    deliveryInfo: 'Doorstep delivery available across Telangana; 95% pre-assembled in protective wooden crate.',
    rating: 5.0,
    reviewCount: 9,
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    _id: '67c100000000000000000002',
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
    deliveryInfo: 'Doorstep delivery available across Telangana; 95% pre-assembled.',
    rating: 4.9,
    reviewCount: 22,
    createdAt: '2026-01-16T08:00:00.000Z',
  },
  {
    _id: '67c100000000000000000003',
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
    isFeatured: true,
    isBestSeller: true,
    specifications: {
      'Tools Included': '16-in-1 Multi-Tool, Chain Tool, Tire Levers, Glueless Patch Kit',
      Material: 'Heat-Treated CR-V Chrome Vanadium Steel',
      Case: 'Weather-Resistant Ballistic Nylon Case',
      Compatibility: 'All MTB, Road, and Hybrid Cycles',
    },
    warranty: '2 Years Manufacturer Tool Warranty',
    deliveryInfo: 'Standard courier delivery in 2-3 business days across India.',
    rating: 4.9,
    reviewCount: 24,
    createdAt: '2026-01-17T08:00:00.000Z',
  },
  {
    _id: '67c100000000000000000004',
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
    deliveryInfo: 'Same-day showroom pickup or fast courier delivery.',
    rating: 4.9,
    reviewCount: 31,
    createdAt: '2026-01-18T08:00:00.000Z',
  },
  {
    _id: '67c100000000000000000005',
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
    deliveryInfo: 'Delivered in secure protective helmet box.',
    rating: 4.8,
    reviewCount: 19,
    createdAt: '2026-01-19T08:00:00.000Z',
  },
  {
    _id: '67c100000000000000000006',
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
    deliveryInfo: 'Doorstep delivery available across Telangana; 95% pre-assembled.',
    rating: 4.8,
    reviewCount: 18,
    createdAt: '2026-01-20T08:00:00.000Z',
  },
  {
    _id: '67c100000000000000000007',
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
    deliveryInfo: 'Doorstep delivery available; pre-assembled with accessories.',
    rating: 4.8,
    reviewCount: 14,
    createdAt: '2026-01-21T08:00:00.000Z',
  },
  {
    _id: '67c100000000000000000008',
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
    deliveryInfo: 'Doorstep delivery available across Telangana.',
    rating: 4.8,
    reviewCount: 27,
    createdAt: '2026-01-22T08:00:00.000Z',
  },
  {
    _id: '67c100000000000000000009',
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
    deliveryInfo: 'Doorstep delivery available with training wheels attached.',
    rating: 4.7,
    reviewCount: 15,
    createdAt: '2026-01-23T08:00:00.000Z',
  },
];

/**
 * Normalizes and matches category strings leniently.
 * Handles "Spare Parts", "Bicycle Spare Parts and Accessories", "Road Cycles", etc.
 */
export function matchesCategoryQuery(productCategory, queryCategory) {
  if (!queryCategory || queryCategory === 'All') return true;
  const pNorm = (productCategory || '').toLowerCase().trim();
  const qNorm = queryCategory.toLowerCase().trim();

  if (pNorm === qNorm) return true;
  if (pNorm.includes(qNorm) || qNorm.includes(pNorm)) return true;

  // Keyword-level alias matching
  if (qNorm.includes('spare') && pNorm.includes('spare')) return true;
  if (qNorm.includes('road') && pNorm.includes('road')) return true;
  if (qNorm.includes('mountain') && pNorm.includes('mountain')) return true;
  if (qNorm.includes('ladies') && pNorm.includes('ladies')) return true;
  if (qNorm.includes('kid') && pNorm.includes('kid')) return true;
  if ((qNorm.includes('city') || qNorm.includes('hybrid')) && (pNorm.includes('city') || pNorm.includes('hybrid'))) return true;
  if (qNorm.includes('disc') && pNorm.includes('disc')) return true;

  return false;
}

/**
 * Filter defaultProducts using search parameters
 */
export function filterProducts(searchParams) {
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

  let filtered = [...defaultProducts];

  if (search) {
    const s = search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s)
    );
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((p) => matchesCategoryQuery(p.category, category));
  }

  if (brand && brand !== 'All') {
    filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (inStock === 'true') {
    filtered = filtered.filter((p) => p.stock > 0 && p.isAvailable);
  }

  if (isFeatured === 'true') {
    filtered = filtered.filter((p) => p.isFeatured);
  }

  if (isBestSeller === 'true') {
    filtered = filtered.filter((p) => p.isBestSeller);
  }

  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'popularity') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // newest
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    success: true,
    count: paginated.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    products: paginated,
  };
}
