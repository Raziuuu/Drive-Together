import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'DriveTogether — Buy Together. Save More. | Vehicle Group-Buying Platform',
  description:
    'Join genuine vehicle buyers in Mangalore, Puttur, BC Road, and Uppinangady. Pool combined purchasing demand to negotiate authentic fleet deals with verified regional dealerships.',
  keywords: [
    'vehicle group buying',
    'car group discount',
    'bike deals mangalore',
    'puttur car offers',
    'uppinangady scooters',
    'bc road auto rickshaw group',
    'DriveTogether',
  ],
  openGraph: {
    title: 'DriveTogether — Buy Together. Save More.',
    description: 'Bring serious buyers together, combine purchasing power, and negotiate better vehicle prices with dealerships.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        <AuthProvider>
          <Navbar />
          <AuthModal />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
