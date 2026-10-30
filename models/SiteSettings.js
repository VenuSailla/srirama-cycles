import mongoose from 'mongoose';

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
    slogan: { type: String, default: 'Sri Rama Cycles – Your Trusted Partner on Every Road!' },
    aboutFounderStory: {
      type: String,
      default:
        'Sri Rama Cycle & Auto Spare Parts has been the backbone of reliable transportation in Hanumakonda for nearly five decades. Founded in 1976 and led by proprietor Ravula Rakesh Kumar, our landmark showroom in Kazipet brings genuine bicycle brands, Shimano components, and pro workshop tuning to cyclists across Telangana.',
    },
    aboutReceipt1980Text: {
      type: String,
      default:
        'Archival 1980 Cash Bill (Bill No. 1297) – Hand-written vintage receipt preserving four decades of genuine trust and customer relationships.',
    },
    aboutReceipt2026Text: {
      type: String,
      default:
        'Modern 2026 GST Computerized Tax Invoice – State-of-the-art digital billing, factory-authorized warranty, and complete transparency.',
    },
    trackOrderNotice: {
      type: String,
      default:
        'All cycles are assembled by certified mechanics, tuned, tested, and dispatched with live courier tracking. Enter your Order ID to track stage-by-stage progress.',
    },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=Sri+Rama+Cycle+Store+Kazipet',
    },
    deliveryNotice: {
      type: String,
      default: 'Doorstep Delivery Available Across Telangana. 95% Pre-Assembled with Pro Tool Kit.',
    },
    warrantyNotice: {
      type: String,
      default: '1 Year Frame Warranty & 6 Months Components Guarantee on All Premium Cycles.',
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

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
