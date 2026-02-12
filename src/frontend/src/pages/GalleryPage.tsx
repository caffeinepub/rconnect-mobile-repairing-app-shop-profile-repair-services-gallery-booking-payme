import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { GALLERY_ITEMS, type GalleryItem } from '@/data/galleryItems';

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Browse our collection of successful repairs and quality work
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
              onClick={() => setSelectedItem(item)}
            >
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950 relative overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {item.icon}
                  </div>
                )}
                {item.badge && (
                  <Badge className="absolute top-3 right-3 bg-amber-600 hover:bg-amber-700">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedItem.title}</DialogTitle>
                {selectedItem.badge && (
                  <Badge className="w-fit bg-amber-600 hover:bg-amber-700 mt-2">
                    {selectedItem.badge}
                  </Badge>
                )}
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950 rounded-lg overflow-hidden">
                  {selectedItem.image ? (
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">
                      {selectedItem.icon}
                    </div>
                  )}
                </div>
                <DialogDescription className="text-base leading-relaxed">
                  {selectedItem.fullDescription || selectedItem.description}
                </DialogDescription>
                {selectedItem.details && (
                  <div className="space-y-2 pt-4 border-t">
                    {selectedItem.details.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
