import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { SERVICES_CATALOG } from '@/data/servicesCatalog';

export default function ServicesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Professional mobile repair services for all major brands with quality parts and expert care
          </p>
        </div>
      </section>

      {/* Services Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Accordion type="single" collapsible className="space-y-4">
            {SERVICES_CATALOG.map((category) => (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border rounded-lg bg-card overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white flex-shrink-0">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.services.length} services available</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {category.services.map((service) => (
                      <Card key={service.id} className="border-muted">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-start justify-between gap-2">
                            <span>{service.name}</span>
                            {service.popular && (
                              <Badge variant="secondary" className="text-xs">Popular</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm">{service.description}</CardDescription>
                        </CardHeader>
                        {service.estimatedTime && (
                          <CardContent className="pt-0">
                            <p className="text-xs text-muted-foreground">
                              Estimated time: {service.estimatedTime}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold">Ready to Get Your Device Fixed?</h2>
              <p className="opacity-90">Book your repair appointment now and get your device back in perfect condition</p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate({ to: '/booking' })}
                className="mt-4"
              >
                Book Repair Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
