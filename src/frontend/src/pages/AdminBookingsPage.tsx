import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Phone, Smartphone, AlertCircle } from 'lucide-react';
import { useGetAllBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { formatDateTime } from '@/utils/time';
import type { Booking, BookingStatus } from '@/backend';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BookingDetailDialog from '@/components/booking/BookingDetailDialog';

export default function AdminBookingsPage() {
  const { data: bookings, isLoading, error } = useGetAllBookings();
  const updateStatus = useUpdateBookingStatus();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const handleStatusUpdate = async (bookingId: bigint, newStatus: BookingStatus) => {
    try {
      await updateStatus.mutateAsync({ bookingId, status: newStatus });
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  // Filter bookings based on selected status
  const filteredBookings = bookings?.filter((booking) => {
    if (statusFilter === 'all') return true;
    return booking.status === statusFilter;
  }) || [];

  // Count bookings by status
  const statusCounts = {
    all: bookings?.length || 0,
    pending: bookings?.filter(b => b.status === 'pending').length || 0,
    confirmed: bookings?.filter(b => b.status === 'confirmed').length || 0,
    completed: bookings?.filter(b => b.status === 'completed').length || 0,
    cancelled: bookings?.filter(b => b.status === 'cancelled').length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Bookings</h1>
          <p className="text-muted-foreground">View all repair bookings</p>
        </div>

        {/* Status Filter Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all">
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Confirmed ({statusCounts.confirmed})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({statusCounts.completed})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({statusCounts.cancelled})
            </TabsTrigger>
          </TabsList>
        </Tabs>

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
        {!isLoading && !error && filteredBookings.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {statusFilter === 'all' ? 'No Bookings Yet' : `No ${getStatusLabel(statusFilter)} Bookings`}
              </h3>
              <p className="text-muted-foreground">
                {statusFilter === 'all' 
                  ? 'There are no bookings to display at the moment.'
                  : `There are no ${statusFilter} bookings at the moment.`
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Bookings Grid */}
        {!isLoading && !error && filteredBookings.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id.toString()}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedBooking(booking)}
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

                  {/* Status Update Dropdown */}
                  <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={booking.status}
                      onValueChange={(value) => handleStatusUpdate(booking.id, value as BookingStatus)}
                      disabled={updateStatus.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Booking Detail Dialog */}
        <BookingDetailDialog
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={updateStatus.isPending}
        />
      </div>
    </div>
  );
}
