import { SHOP_INFO } from "@/constants/shopInfo";
import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    window.location.hostname || "rconnect-mobile-repair",
  );

  return (
    <footer className="bg-slate-900 border-t border-blue-900/40 mt-auto print:hidden">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shop Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center">
                <span className="text-blue-400 text-xs font-bold">RC</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                {SHOP_INFO.name}
              </h3>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Professional mobile repair services for all brands — quality
              parts, expert technicians, fast turnaround.
            </p>
            <a
              href={`https://wa.me/91${SHOP_INFO.phone}?text=${encodeURIComponent("Hello! I need help with a mobile repair.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              💬 WhatsApp Us
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-base text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/services", label: "Services" },
                { to: "/gallery", label: "Gallery" },
                { to: "/booking", label: "Book Repair" },
                { to: "/bookings", label: "All Bookings" },
                { to: "/income", label: "Daily Income" },
                { to: "/reviews", label: "Reviews" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-bold text-base text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <div>
                  <a
                    href={`tel:${SHOP_INFO.phone}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {SHOP_INFO.phone}
                  </a>
                  <br />
                  <a
                    href={`tel:${SHOP_INFO.customerCare}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {SHOP_INFO.customerCare}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-400" />
                <span>{SHOP_INFO.address}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-400" />
                <span>Mon–Sat: 10 AM – 8 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-900/30 mt-8 pt-6 text-center text-sm text-slate-500">
          <p>
            © {currentYear} {SHOP_INFO.name}. All rights reserved.
          </p>
          <p className="mt-1">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
