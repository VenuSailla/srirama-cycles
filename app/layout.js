import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Sri Rama Cycle Store & Auto Spares | Official Showroom & Workshop Kazipet',
  description:
    'Premier Bicycle Store & Multi-Brand Workshop in Kazipet, Hanumakonda, Telangana. Discover Mountain Bikes, Road Cycles, Kids & Ladies Cycles, and Genuine Auto Spares.',
  keywords:
    'Sri Rama Cycles, Bicycle Store Kazipet, Cycle showroom Hanumakonda, MTB, Road Bike, Auto Spares, Bicycle Repair Workshop, Telangana cycles',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Sri Rama Cycle Store & Auto Spares | Official Showroom',
    description:
      'Explore high performance mountain cycles, road bikes, kids cycles, and authentic spares with doorstep delivery.',
    siteName: 'Sri Rama Cycle Store & Auto Spares',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
