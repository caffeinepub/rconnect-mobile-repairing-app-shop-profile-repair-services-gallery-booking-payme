import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Phone, Smartphone, Clock, User, FileText, CreditCard, Loader2 } from 'lucide-react';
import { useGetAllBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { formatDateTime } from '@/utils/time';
import type { Booking, BookingStatus } from '@/backend';
import AdminGate from '@/components/auth/AdminGate';
import { Alert, AlertDescription } from '@/components/ui/alert';

function BookingsContent() {
  const { data: bookings, isLoading, error } = useGetAllBookings();
  const updateStatus = useUpdateBookingStatus();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState<BookingStatus | null>(null);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking || !newStatus) return;

    try {
      await updateStatus.mutateAsync({
        bookingId: selectedBooking.id,
        status: newStatus,
      });
      setSelectedBooking(null);
      setNewStatus(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load bookings. Please try again.</AlertDescription>
      </Alert>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
          <p className="text-sm text-muted-foreground">
            Bookings will appear here once customers submit repair requests
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card
            key={booking.id.toString()}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedBooking(booking)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {booking.customerName}
                      </h3>
                      <p className="text-sm text-muted-foreground">Booking #{booking.id.toString()}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {booking.phoneNumber}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Smartphone className="w-4 h-4" />
                      {booking.deviceModel}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(booking.preferredDateTime)}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      {booking.paymentMethod}
                    </div>
                  </div>
                  <p className="text-sm line-clamp-2">{booking.issueDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Booking Details</DialogTitle>
                <DialogDescription>Booking #{selectedBooking.id.toString()}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <span className="font-medium">Status</span>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                </div>

                {/* Customer Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Customer Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedBooking.customerName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a href={`tel:${selectedBooking.phoneNumber}`} className="font-medium hover:text-amber-600">
                        {selectedBooking.phoneNumber}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Device Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Device Information</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Model Name</p>
                    <p className="font-medium">{selectedBooking.deviceModel}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Issue Description</p>
                    <p className="text-sm leading-relaxed">{selectedBooking.issueDescription}</p>
                  </div>
                  {selectedBooking.photoNotes && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Additional Notes</p>
                      <p className="text-sm leading-relaxed">{selectedBooking.photoNotes}</p>
                    </div>
                  )}
                </div>

                {/* Appointment Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Appointment Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Preferred Date & Time</p>
                      <p className="font-medium">{formatDateTime(selectedBooking.preferredDateTime)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Booking Created</p>
                      <p className="font-medium">{formatDateTime(selectedBooking.timestamp)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Payment Information</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{selectedBooking.paymentMethod}</p>
                  </div>
                </div>

                {/* Update Status */}
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Update Status</h3>
                  <div className="flex gap-3">
                    <Select
                      value={newStatus || selectedBooking.status}
                      onValueChange={(value) => setNewStatus(value as BookingStatus)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={!newStatus || newStatus === selectedBooking.status || updateStatus.isPending}
                    >
                      {updateStatus.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AdminBookingsPage() {
  return (
    <AdminGate>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Manage Bookings</h1>
            <p className="text-lg opacity-90">View and manage all customer repair bookings</p>
          </div>
        </section>

        {/* Bookings List */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <BookingsContent />
          </div>
        </section>
      </div>
    </AdminGate>
  );
}
