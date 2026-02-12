import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, Mail } from 'lucide-react';
import { SHOP_INFO } from '@/constants/shopInfo';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Get in touch with us for any queries or support
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone Numbers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-600" />
                Phone Numbers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Main Contact</p>
                <a href={`tel:${SHOP_INFO.phone}`}>
                  <Button variant="default" className="w-full gap-2 justify-start">
                    <Phone className="w-4 h-4" />
                    {SHOP_INFO.phone}
                  </Button>
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Customer Care</p>
                <a href={`tel:${SHOP_INFO.customerCare}`}>
                  <Button variant="outline" className="w-full gap-2 justify-start">
                    <Phone className="w-4 h-4" />
                    {SHOP_INFO.customerCare}
                  </Button>
                </a>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Call us during business hours for immediate assistance
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Our Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{SHOP_INFO.address}</p>
              <Button variant="outline" className="w-full gap-2" asChild>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP_INFO.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                Easily accessible location in Vasai West
              </p>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">Monday</span>
                    <span className="text-sm text-muted-foreground">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">Tuesday</span>
                    <span className="text-sm text-muted-foreground">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">Wednesday</span>
                    <span className="text-sm text-muted-foreground">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">Thursday</span>
                    <span className="text-sm text-muted-foreground">10:00 AM - 8:00 PM</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">Friday</span>
                    <span className="text-sm text-muted-foreground">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">Saturday</span>
                    <span className="text-sm text-muted-foreground">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-amber-100 dark:bg-amber-950 border border-amber-200 dark:border-amber-900">
                    <span className="font-medium">Sunday</span>
                    <span className="text-sm text-muted-foreground">10:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
