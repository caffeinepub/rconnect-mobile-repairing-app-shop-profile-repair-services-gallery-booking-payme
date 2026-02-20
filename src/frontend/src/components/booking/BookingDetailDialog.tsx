import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Smartphone, FileText, Calendar, Clock, CreditCard, Loader2 } from 'lucide-react';
import { formatDateTime } from '@/utils/time';
import type { Booking, BookingStatus } from '@/backend';

interface BookingDetailDialogProps {
  booking: Booking | null;
  onClose: () => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  onStatusUpdate?: (bookingId: bigint, status: BookingStatus) => void;
  isUpdating?: boolean;
  isPublic?: boolean;
}

export default function BookingDetailDialog({
  booking,
  onClose,
  getStatusColor,
  getStatusLabel,
  onStatusUpdate,
  isUpdating = false,
  isPublic = false,
}: BookingDetailDialogProps) {
  if (!booking) return null;

  return (
    <Dialog open={!!booking} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

          {/* Admin Status Update */}
          {!isPublic && onStatusUpdate && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Update Status</label>
              <Select
                value={booking.status}
                onValueChange={(value) => onStatusUpdate(booking.id, value as BookingStatus)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {isUpdating && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Updating status...
                </p>
              )}
            </div>
          )}

          <Separator />

          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-amber-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-7">
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

          <Separator />

          {/* Device Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-600" />
              Device Information
            </h3>
            <div className="space-y-3 pl-7">
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
          </div>

          <Separator />

          {/* Appointment Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              Appointment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-7">
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

          <Separator />

          {/* Payment Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              Payment Information
            </h3>
            <div className="space-y-1 pl-7">
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium capitalize">{booking.paymentMethod}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
