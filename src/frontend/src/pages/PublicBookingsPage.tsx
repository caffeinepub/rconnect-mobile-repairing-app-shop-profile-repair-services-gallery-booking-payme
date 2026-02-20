import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Search, AlertCircle, Loader2, Calendar, Smartphone, FileText } from 'lucide-react';
import { useTrackBooking, useCustomerBookings } from '@/hooks/useBookings';
import BookingDetailDialog from '@/components/booking/BookingDetailDialog';
import type { Booking } from '@/backend';

export default function PublicBookingsPage() {
  const [bookingId, setBookingId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const trackBooking = useTrackBooking();
  const customerBookings = useCustomerBookings(verifiedPhoneNumber);

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

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingId && phoneNumber) {
      try {
        const booking = await trackBooking.mutateAsync({
          bookingId: BigInt(bookingId),
          phoneNumber: phoneNumber,
        });
        setFoundBooking(booking);
        setVerifiedPhoneNumber(phoneNumber);
      } catch (error) {
        console.error('Failed to track booking:', error);
        setFoundBooking(null);
        setVerifiedPhoneNumber(null);
      }
    }
  };

  const handleReset = () => {
    setBookingId('');
    setPhoneNumber('');
    setFoundBooking(null);
    setVerifiedPhoneNumber(null);
    setSelectedBooking(null);
    trackBooking.reset();
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseDialog = () => {
    setSelectedBooking(null);
  };

  // Filter out the searched booking from previous bookings
  const previousBookings = customerBookings.data?.filter(
    (booking) => booking.id !== foundBooking?.id
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Track Your Booking
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enter your booking ID and phone number to view your repair service status
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Find Your Booking</CardTitle>
              <CardDescription>
                Enter your booking reference number and the phone number you used when booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingId">Booking ID</Label>
                  <Input
                    id="bookingId"
                    type="number"
                    placeholder="Enter booking ID (e.g., 1)"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your 10-digit phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1" disabled={trackBooking.isPending}>
                    {trackBooking.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Track Booking
                      </>
                    )}
                  </Button>
                  {(foundBooking || trackBooking.isError) && (
                    <Button type="button" variant="outline" onClick={handleReset}>
                      Reset
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {trackBooking.isError && (
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Booking not found or phone number doesn't match. Please check your details and try again.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Current Booking Result */}
        {foundBooking && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Current Booking</h2>
              <Card 
                className="border-2 border-primary/50 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleBookingClick(foundBooking)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Booking #{foundBooking.id.toString()}</CardTitle>
                      <CardDescription className="mt-1">{foundBooking.customerName}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(foundBooking.status)}>
                      {getStatusLabel(foundBooking.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{foundBooking.deviceModel}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground line-clamp-2">{foundBooking.issueDescription}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Booked on {formatDate(foundBooking.timestamp)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Previous Bookings Section */}
            {customerBookings.isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading booking history...</span>
              </div>
            )}

            {customerBookings.isError && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unable to load booking history. This feature requires admin access.
                </AlertDescription>
              </Alert>
            )}

            {customerBookings.isSuccess && previousBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Previous Bookings</h2>
                <div className="grid gap-4">
                  {previousBookings.map((booking) => (
                    <Card 
                      key={booking.id.toString()} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleBookingClick(booking)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">Booking #{booking.id.toString()}</CardTitle>
                            <CardDescription className="mt-1">{booking.customerName}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Smartphone className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{booking.deviceModel}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground line-clamp-2">{booking.issueDescription}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Booked on {formatDate(booking.timestamp)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {customerBookings.isSuccess && previousBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No previous bookings found.</p>
              </div>
            )}
          </div>
        )}

        {/* Booking Detail Dialog */}
        {selectedBooking && (
          <BookingDetailDialog
            booking={selectedBooking}
            onClose={handleCloseDialog}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            isPublic={true}
          />
        )}
      </div>
    </div>
  );
}
