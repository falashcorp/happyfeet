import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HappyFeet - Premium Footwear for Every Step',
  description: 'Discover premium footwear that combines style, comfort, and quality. Step into happiness with HappyFeet - your trusted partner for every journey in Cameroon.',
  keywords: 'shoes, footwear, sneakers, athletic shoes, formal shoes, sandals, Cameroon, premium, comfort, style',
  authors: [{ name: 'HappyFeet Team' }],
  creator: 'HappyFeet',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://happyfeet.cm',
    title: 'HappyFeet - Premium Footwear for Every Step',
    description: 'Discover premium footwear that combines style, comfort, and quality.',
    siteName: 'HappyFeet',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HappyFeet - Premium Footwear for Every Step',
    description: 'Discover premium footwear that combines style, comfort, and quality.',
    creator: '@happyfeet_cm',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}