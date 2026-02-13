import { useState } from 'react';
import { useGetAllBookingsPublic, useGetBookingPublic } from '@/hooks/useBookings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, Phone, Smartphone, AlertCircle, FileText } from 'lucide-react';
import { formatDateTime } from '@/utils/time';
import type { Booking } from '@/backend';

export default function PublicBookingsPage() {
  const { data: bookings, isLoading, error } = useGetAllBookingsPublic();
  const [selectedBookingId, setSelectedBookingId] = useState<bigint | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            All Bookings
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            View all repair service bookings and their current status
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load bookings. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && !error && bookings && bookings.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground">
                There are no bookings to display at the moment.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Bookings Grid */}
        {!isLoading && !error && bookings && bookings.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <Card
                key={booking.id.toString()}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedBookingId(booking.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{booking.customerName}</CardTitle>
                      <CardDescription className="mt-1">
                        Booking #{booking.id.toString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusLabel(booking.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{booking.deviceModel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{booking.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{formatDateTime(booking.preferredDateTime)}</span>
                  </div>
                  <p className="text-sm line-clamp-2 text-muted-foreground">
                    {booking.issueDescription}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Booking Detail Dialog */}
        <BookingDetailDialog
          bookingId={selectedBookingId}
          onClose={() => setSelectedBookingId(null)}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
        />
      </div>
    </div>
  );
}

function BookingDetailDialog({
  bookingId,
  onClose,
  getStatusColor,
  getStatusLabel,
}: {
  bookingId: bigint | null;
  onClose: () => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}) {
  const { data: booking, isLoading } = useGetBookingPublic(bookingId);

  return (
    <Dialog open={!!bookingId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isLoading && (
          <div className="space-y-4 py-8">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {!isLoading && booking && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Booking Details</DialogTitle>
              <DialogDescription>Booking #{booking.id.toString()}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <span className="font-medium">Status</span>
                <Badge className={getStatusColor(booking.status)}>
                  {getStatusLabel(booking.status)}
                </Badge>
              </div>

              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Customer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{booking.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{booking.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Device Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Device Information</h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Model Name</p>
                  <p className="font-medium">{booking.deviceModel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Issue Description</p>
                  <p className="text-sm leading-relaxed">{booking.issueDescription}</p>
                </div>
                {booking.photoNotes && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Additional Notes</p>
                    <p className="text-sm leading-relaxed">{booking.photoNotes}</p>
                  </div>
                )}
              </div>

              {/* Appointment Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Appointment Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Preferred Date & Time</p>
                    <p className="font-medium">{formatDateTime(booking.preferredDateTime)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Booking Created</p>
                    <p className="font-medium">{formatDateTime(booking.timestamp)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Payment Information</h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">{booking.paymentMethod}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
