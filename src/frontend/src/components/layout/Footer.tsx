import { Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { SHOP_INFO } from '@/constants/shopInfo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'rconnect-mobile-repair'
  );

  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {SHOP_INFO.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Professional mobile repair services with quality parts and expert technicians.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-foreground transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-foreground transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-foreground transition-colors">
                  Book Repair
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={`tel:${SHOP_INFO.phone}`} className="hover:text-foreground transition-colors">
                  {SHOP_INFO.phone}
                </a>
              </li>
              <li>
                <a href={`tel:${SHOP_INFO.customerCare}`} className="hover:text-foreground transition-colors">
                  Customer Care: {SHOP_INFO.customerCare}
                </a>
              </li>
              <li className="text-xs leading-relaxed">{SHOP_INFO.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1 flex-wrap">
            <span>© {currentYear} {SHOP_INFO.name}. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
