import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { NewsletterSignup } from '@/components/ui/newsletter-signup';

const footerSections = [
  {
    title: 'Shop',
    links: [
      { name: 'Athletic Shoes', href: '/categories/athletic-shoes' },
      { name: 'Casual Sneakers', href: '/categories/casual-sneakers' },
      { name: 'Formal Shoes', href: '/categories/formal-shoes' },
      { name: 'Sandals', href: '/categories/sandals' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Size Guide', href: '/size-guide' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
  },
];

const shippingInfo = [
  {
    title: 'Free Shipping',
    description: 'On orders over $100',
    icon: '🚚',
  },
  {
    title: '30-Day Returns',
    description: 'Easy return policy',
    icon: '↩️',
  },
  {
    title: 'Secure Payment',
    description: 'SSL encrypted checkout',
    icon: '🔒',
  },
  {
    title: '24/7 Support',
    description: 'Customer service',
    icon: '💬',
  },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      {/* Shipping Info Bar */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shippingInfo.map((info, index) => (
              <div key={index} className="flex items-center gap-3 text-center md:text-left">
                <span className="text-2xl">{info.icon}</span>
                <div>
                  <h4 className="font-medium text-sm">{info.title}</h4>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-foreground">HappyFeet</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Discover premium footwear that combines style, comfort, and quality. 
              Step into happiness with HappyFeet - your trusted partner for every journey.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Douala, Cameroon - Akwa District</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+237 6XX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@happyfeet.cm</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="max-w-md mx-auto">
            <NewsletterSignup variant="footer" showBenefits={false} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 HappyFeet. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}