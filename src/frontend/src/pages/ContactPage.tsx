import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SHOP_INFO } from "@/constants/shopInfo";
import { Clock, MapPin, MessageCircle, Phone, PhoneCall } from "lucide-react";

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/91${SHOP_INFO.phone}?text=${encodeURIComponent("Hello! I need help with a mobile repair.")}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP_INFO.address)}`;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <PhoneCall className="w-6 h-6 text-blue-400" />
            <span className="text-blue-300 font-mono text-sm tracking-wider uppercase">
              Get In Touch
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Contact Shop
          </h1>
          <p className="text-base opacity-80 max-w-xl mx-auto">
            Call us, WhatsApp us, or visit the shop — we're here to help
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Primary CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Call Now */}
            <a href={`tel:${SHOP_INFO.phone}`} data-ocid="contact.call_button">
              <Card className="border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all cursor-pointer group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Main Contact
                    </p>
                    <p className="text-xl font-display font-bold text-blue-400">
                      Call Now
                    </p>
                    <p className="text-sm font-mono font-semibold text-white">
                      📞 {SHOP_INFO.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* WhatsApp Chat */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="contact.whatsapp_button"
            >
              <Card className="border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50 transition-all cursor-pointer group">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Instant Messaging
                    </p>
                    <p className="text-xl font-display font-bold text-green-400">
                      WhatsApp Chat
                    </p>
                    <p className="text-sm font-mono font-semibold text-white">
                      💬 {SHOP_INFO.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>
          </div>

          {/* Detailed Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Numbers */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="w-5 h-5 text-blue-400" />
                  Phone Numbers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Main Contact
                  </p>
                  <a href={`tel:${SHOP_INFO.phone}`}>
                    <Button
                      className="w-full gap-2 justify-start bg-blue-600 hover:bg-blue-700"
                      data-ocid="contact.phone.primary_button"
                    >
                      <PhoneCall className="w-4 h-4" />
                      {SHOP_INFO.phone}
                    </Button>
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Customer Care
                  </p>
                  <a href={`tel:${SHOP_INFO.customerCare}`}>
                    <Button
                      variant="outline"
                      className="w-full gap-2 justify-start border-blue-600/50 text-blue-400 hover:bg-blue-600/10"
                      data-ocid="contact.phone.secondary_button"
                    >
                      <Phone className="w-4 h-4" />
                      {SHOP_INFO.customerCare}
                    </Button>
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">WhatsApp</p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-full gap-2 justify-start border-green-600/50 text-green-400 hover:bg-green-600/10"
                      data-ocid="contact.whatsapp.secondary_button"
                    >
                      💬 WhatsApp Chat
                    </Button>
                  </a>
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Call or WhatsApp us during business hours for immediate
                  assistance
                </p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Shop Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <p className="text-sm leading-relaxed">
                    📍 {SHOP_INFO.address}
                  </p>
                </div>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-cyan-600/50 text-cyan-400 hover:bg-cyan-600/10"
                    data-ocid="contact.maps_button"
                  >
                    <MapPin className="w-4 h-4" />
                    Get Directions on Google Maps
                  </Button>
                </a>
                <p className="text-xs text-muted-foreground">
                  Shop No. 07, Dream House Building, Sai Nagar, Vasai West
                </p>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="md:col-span-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday"].map(
                      (day) => (
                        <div
                          key={day}
                          className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/30"
                        >
                          <span className="font-medium text-sm">{day}</span>
                          <span className="text-xs text-muted-foreground">
                            10:00 AM – 8:00 PM
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="space-y-2">
                    {["Friday", "Saturday"].map((day) => (
                      <div
                        key={day}
                        className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/30"
                      >
                        <span className="font-medium text-sm">{day}</span>
                        <span className="text-xs text-muted-foreground">
                          10:00 AM – 8:00 PM
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <span className="font-medium text-sm text-blue-300">
                        Sunday
                      </span>
                      <span className="text-xs text-blue-400">
                        10:00 AM – 6:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <span className="font-medium text-sm text-green-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                        Open Today
                      </span>
                      <span className="text-xs text-green-400">
                        We are open now!
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
