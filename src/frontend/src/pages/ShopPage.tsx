import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SHOP_INFO } from "@/constants/shopInfo";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Clock,
  ListChecks,
  MapPin,
  Phone,
  PhoneCall,
  Shield,
  Star,
  Wrench,
  Zap,
} from "lucide-react";

const BRANDS = [
  { name: "iPhone", emoji: "🍎", models: "All models iPhone 6–15" },
  { name: "Samsung", emoji: "📱", models: "Galaxy S, A, M series" },
  { name: "OnePlus", emoji: "🔴", models: "Nord, OnePlus 12 & more" },
  { name: "Xiaomi", emoji: "📲", models: "Redmi, POCO & more" },
  { name: "Vivo", emoji: "📳", models: "V, Y series & more" },
  { name: "OPPO", emoji: "🟢", models: "A, Reno series & more" },
  { name: "Realme", emoji: "🔵", models: "Narzo, C, GT series" },
  { name: "Motorola", emoji: "⚡", models: "Moto G, Edge & more" },
];

export default function ShopPage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: <Wrench className="w-10 h-10" />,
      label: "New Repair Entry",
      subtitle: "Book a new repair job",
      to: "/booking",
      ocid: "home.new_repair_button",
      gradient: "from-blue-600 to-blue-800",
      glow: "hover:shadow-blue-500/30",
    },
    {
      icon: <ListChecks className="w-10 h-10" />,
      label: "Customer List",
      subtitle: "View all bookings",
      to: "/bookings",
      ocid: "home.customer_list_button",
      gradient: "from-cyan-600 to-blue-700",
      glow: "hover:shadow-cyan-500/30",
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      label: "Daily Income",
      subtitle: "Income reports & stats",
      to: "/income",
      ocid: "home.daily_income_button",
      gradient: "from-indigo-600 to-blue-800",
      glow: "hover:shadow-indigo-500/30",
    },
    {
      icon: <PhoneCall className="w-10 h-10" />,
      label: "Contact Shop",
      subtitle: "Call or WhatsApp us",
      to: "/contact",
      ocid: "home.contact_shop_button",
      gradient: "from-blue-700 to-slate-800",
      glow: "hover:shadow-blue-400/30",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ─── Hero Header ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-16 md:py-24">
        {/* Decorative circuit lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-8 w-32 h-32 border border-blue-500/10 rounded-full" />
          <div className="absolute top-4 left-4 w-48 h-48 border border-blue-500/5 rounded-full" />
          <div className="absolute bottom-8 right-8 w-40 h-40 border border-cyan-500/10 rounded-full" />
          <div className="absolute bottom-4 right-4 w-56 h-56 border border-cyan-500/5 rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_oklch(62%_0.22_250_/_0.08)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_oklch(70%_0.18_195_/_0.06)_0%,_transparent_60%)]" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          {/* Logo / Brand */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center tech-glow">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs font-mono text-blue-400 tracking-[0.3em] uppercase">
                RCONNECT
              </p>
              <h1 className="text-2xl font-display font-bold text-white leading-tight">
                Mobile Repairing
              </h1>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
            Mobile Repairing{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Experts
            </span>
          </h2>
          <p className="text-base md:text-lg text-blue-200/80 mb-8 max-w-xl mx-auto">
            Professional repair services for all smartphone brands — fast,
            reliable, quality guaranteed.
          </p>

          {/* Stats Bar */}
          <div className="inline-flex flex-wrap justify-center gap-4 md:gap-8 bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-white font-medium">
                Trusted by 1000+ customers
              </span>
            </div>
            <div className="hidden sm:block w-px bg-blue-500/30" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white font-medium">
                All Brands Repaired
              </span>
            </div>
            <div className="hidden sm:block w-px bg-blue-500/30" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white font-medium">
                Same Day Service
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quick Contact Bar ─── */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium text-sm">{SHOP_INFO.phone}</span>
            </a>
            <span className="hidden sm:inline text-blue-300/50">|</span>
            <a
              href={`tel:${SHOP_INFO.customerCare}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium text-sm">
                Customer Care: {SHOP_INFO.customerCare}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 4 Big Action Buttons ─── */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-center text-lg font-display font-semibold text-muted-foreground mb-6 tracking-wide uppercase text-sm">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {quickActions.map((action) => (
            <button
              key={action.to}
              type="button"
              data-ocid={action.ocid}
              onClick={() => navigate({ to: action.to })}
              className={`
                group relative overflow-hidden rounded-2xl p-6 text-left
                bg-gradient-to-br ${action.gradient}
                border border-blue-500/20
                shadow-lg hover:shadow-2xl ${action.glow}
                transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
              `}
            >
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Decorative circle */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5 group-hover:bg-white/8 transition-colors" />

              <div className="relative flex items-start gap-4">
                <div className="text-white/90 group-hover:text-white transition-colors mt-1">
                  {action.icon}
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white mb-1">
                    {action.label}
                  </h3>
                  <p className="text-sm text-white/70">{action.subtitle}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Brands We Repair ─── */}
      <section className="container mx-auto px-4 pb-10">
        <Card className="border-border/50">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-xl font-display font-bold">
                Brands We Repair
              </h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              From Android to iPhone — all major smartphone brands repaired with
              genuine parts.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BRANDS.map((brand) => (
                <div
                  key={brand.name}
                  className="flex flex-col gap-1 p-3 rounded-xl bg-secondary/50 border border-border/50 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{brand.emoji}</span>
                    <span className="font-semibold text-sm">{brand.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {brand.models}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─── Shop Info ─── */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Our Location</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {SHOP_INFO.address}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-600/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Business Hours</p>
                <p className="text-xs text-muted-foreground">
                  Mon–Sat: 10 AM – 8 PM
                </p>
                <p className="text-xs text-muted-foreground">
                  Sunday: 10 AM – 6 PM
                </p>
                <Badge className="mt-2 text-xs bg-green-500/10 text-green-400 border-green-500/20">
                  Open Today
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-2">Contact Us</p>
                <a href={`tel:${SHOP_INFO.phone}`}>
                  <Button
                    size="sm"
                    className="w-full mb-2 h-8 text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    <Phone className="w-3 h-3 mr-1.5" />
                    Call {SHOP_INFO.phone}
                  </Button>
                </a>
                <a
                  href={`https://wa.me/91${SHOP_INFO.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs border-green-600/50 text-green-400 hover:bg-green-600/10"
                  >
                    💬 WhatsApp
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
