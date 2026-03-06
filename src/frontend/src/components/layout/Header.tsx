import LoginButton from "@/components/auth/LoginButton";
import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/gallery", label: "Gallery" },
    { to: "/booking", label: "Book Now" },
    { to: "/bookings", label: "Bookings" },
    { to: "/income", label: "Income" },
    { to: "/reviews", label: "Reviews" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-900/40 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80 print:hidden">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Logo variant="header" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium transition-colors hover:text-blue-400"
              activeProps={{ className: "text-blue-400" }}
            >
              {link.label}
            </Link>
          ))}
          <LoginButton />
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.to}>
                  <Link
                    to={link.to}
                    className="text-lg font-medium transition-colors hover:text-blue-400 py-2"
                    activeProps={{ className: "text-blue-400" }}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              <div className="pt-4 border-t">
                <LoginButton />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
