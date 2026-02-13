import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Clock, Award, Shield, Wrench } from 'lucide-react';
import { SHOP_INFO } from '@/constants/shopInfo';
import { useNavigate } from '@tanstack/react-router';
import Logo from '@/components/branding/Logo';

export default function ShopPage() {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Shop Photo */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950">
        {!imageError ? (
          <img
            src="/assets/generated/mobile-repair-tools-hero.dim_1600x800.jpg"
            alt="Mobile Repair Tools"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <Wrench className="w-12 h-12" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {SHOP_INFO.name}
              </h1>
              <p className="text-lg text-muted-foreground">Professional Mobile Repair Services</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <div className="flex flex-col items-start gap-4">
              <Logo 
                variant="hero" 
                className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
              />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  {SHOP_INFO.name}
                </h1>
                <p className="text-lg text-muted-foreground">Your Trusted Mobile Repair Expert</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Bar */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <a href={`tel:${SHOP_INFO.phone}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="w-5 h-5" />
              <span className="font-medium">{SHOP_INFO.phone}</span>
            </a>
            <span className="hidden sm:inline text-white/50">|</span>
            <a href={`tel:${SHOP_INFO.customerCare}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Customer Care: {SHOP_INFO.customerCare}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About & Features */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">About Our Shop</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to {SHOP_INFO.name}, your one-stop solution for all mobile repair needs. We specialize in
                  professional repair services for all major smartphone brands with genuine parts and expert technicians.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Expert Technicians</h3>
                      <p className="text-sm text-muted-foreground">Certified professionals with years of experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Quality Parts</h3>
                      <p className="text-sm text-muted-foreground">Genuine and high-quality replacement parts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Quick Service</h3>
                      <p className="text-sm text-muted-foreground">Fast turnaround time for most repairs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">All Brands</h3>
                      <p className="text-sm text-muted-foreground">We repair all major smartphone brands</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Brands We Repair Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Brands We Repair</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  From Android to iPhone, we repair all major smartphone brands with expertise and care.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 hover:shadow-md transition-shadow">
                    <img
                      src="/assets/generated/brand-android.dim_256x256.png"
                      alt="Android"
                      className="w-16 h-16 object-contain"
                    />
                    <span className="text-sm font-medium text-center">Android</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 hover:shadow-md transition-shadow">
                    <img
                      src="/assets/generated/brand-iphone.dim_256x256.png"
                      alt="iPhone"
                      className="w-16 h-16 object-contain"
                    />
                    <span className="text-sm font-medium text-center">iPhone</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 hover:shadow-md transition-shadow">
                    <img
                      src="/assets/generated/brand-samsung.dim_256x256.png"
                      alt="Samsung"
                      className="w-16 h-16 object-contain"
                    />
                    <span className="text-sm font-medium text-center">Samsung</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 hover:shadow-md transition-shadow">
                    <img
                      src="/assets/generated/brand-oneplus.dim_256x256.png"
                      alt="OnePlus"
                      className="w-16 h-16 object-contain"
                    />
                    <span className="text-sm font-medium text-center">OnePlus</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 hover:shadow-md transition-shadow">
                    <img
                      src="/assets/generated/brand-xiaomi.dim_256x256.png"
                      alt="Xiaomi"
                      className="w-16 h-16 object-contain"
                    />
                    <span className="text-sm font-medium text-center">Xiaomi</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                size="lg"
                className="h-auto py-6 flex-col gap-2"
                onClick={() => navigate({ to: '/booking' })}
              >
                <Wrench className="w-6 h-6" />
                <span>Book Repair</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-auto py-6 flex-col gap-2"
                onClick={() => navigate({ to: '/services' })}
              >
                <Award className="w-6 h-6" />
                <span>Our Services</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-auto py-6 flex-col gap-2"
                onClick={() => navigate({ to: '/gallery' })}
              >
                <Shield className="w-6 h-6" />
                <span>View Gallery</span>
              </Button>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{SHOP_INFO.address}</p>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP_INFO.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Saturday</span>
                  <span className="font-medium">10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </div>
                <Badge variant="outline" className="mt-2">Open Today</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-amber-600" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href={`tel:${SHOP_INFO.phone}`}>
                  <Button variant="default" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    Call {SHOP_INFO.phone}
                  </Button>
                </a>
                <a href={`tel:${SHOP_INFO.customerCare}`}>
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    Customer Care
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
