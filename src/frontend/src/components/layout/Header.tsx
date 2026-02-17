import { useState } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone } from 'lucide-react';
import { SHOP_INFO } from '@/constants/shopInfo';
import Logo from '@/components/branding/Logo';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { label: 'Shop', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Booking', path: '/booking' },
    { label: 'Bookings', path: '/bookings' },
    { label: 'Payments', path: '/payments' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate({ to: path });
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-top">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Logo variant="header" />
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {SHOP_INFO.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={currentPath === item.path ? 'default' : 'ghost'}
                onClick={() => handleNavClick(item.path)}
                className="font-medium"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Call Button & Mobile Menu */}
          <div className="flex items-center gap-2">
            <a href={`tel:${SHOP_INFO.phone}`} className="hidden sm:block">
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">Call Now</span>
              </Button>
            </a>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Logo variant="header" />
                    <span className="font-bold text-lg bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {SHOP_INFO.name}
                    </span>
                  </div>
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={currentPath === item.path ? 'default' : 'ghost'}
                      onClick={() => handleNavClick(item.path)}
                      className="justify-start font-medium"
                    >
                      {item.label}
                    </Button>
                  ))}
                  <a href={`tel:${SHOP_INFO.phone}`} className="mt-4">
                    <Button variant="outline" className="w-full gap-2">
                      <Phone className="w-4 h-4" />
                      Call Now
                    </Button>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
