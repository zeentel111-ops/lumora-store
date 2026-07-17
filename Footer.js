import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lumora-syria.com'),
  title: {
    default: 'Lumora | مستحضرات تجميل طبيعية فاخرة - حلب، اعزاز',
    template: '%s | Lumora',
  },
  description: 'Lumora - متجر مستحضرات تجميل طبيعية فاخرة في حلب - اعزاز. سيروم، مرطبات، مكياج، عطور وعناية بالشعر.',
  keywords: ['مستحضرات تجميل', 'تجميل طبيعي', 'حلب', 'اعزاز', 'سوريا', 'مكياج', 'سيروم', 'Lumora'],
  openGraph: {
    title: 'Lumora | مستحضرات تجميل طبيعية فاخرة',
    description: 'مستحضرات تجميل طبيعية فاخرة من حلب - اعزاز.',
    locale: 'ar_AR',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <WhatsAppButton />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
