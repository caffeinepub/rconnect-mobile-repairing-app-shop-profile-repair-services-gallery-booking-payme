import type { Booking, BookingStatus } from "@/backend";
import BookingDetailDialog from "@/components/booking/BookingDetailDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { formatDateTime } from "@/utils/time";
import { AlertCircle, Calendar, ListChecks, Search } from "lucide-react";
import { useMemo, useState } from "react";

function getStatusConfig(status: string) {
  const configs: Record<string, { label: string; className: string }> = {
    pending: {
      label: "🟡 Pending",
      className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    confirmed: {
      label: "🔵 In Progress",
      className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    completed: {
      label: "🟢 Completed",
      className: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    cancelled: {
      label: "❌ Cancelled",
      className: "bg-red-500/10 text-red-400 border-red-500/20",
    },
  };
  return (
    configs[status] ?? {
      label: status,
      className: "bg-muted text-muted-foreground",
    }
  );
}

function getStatusColor(status: string) {
  return getStatusConfig(status).className;
}

function getStatusLabel(status: string) {
  return getStatusConfig(status).label;
}

export default function AdminBookingsPage() {
  const { data: bookings, isLoading, error } = useGetAllBookings();
  const updateStatus = useUpdateBookingStatus();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusUpdate = async (
    bookingId: bigint,
    newStatus: BookingStatus,
  ) => {
    try {
      await updateStatus.mutateAsync({ bookingId, status: newStatus });
    } catch (err) {
      console.error("Failed to update booking status:", err);
    }
  };

  const statusCounts = useMemo(
    () => ({
      all: bookings?.length || 0,
      pending: bookings?.filter((b) => b.status === "pending").length || 0,
      confirmed: bookings?.filter((b) => b.status === "confirmed").length || 0,
      completed: bookings?.filter((b) => b.status === "completed").length || 0,
      cancelled: bookings?.filter((b) => b.status === "cancelled").length || 0,
    }),
    [bookings],
  );

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    const q = searchQuery.toLowerCase().trim();
    return bookings.filter((b) => {
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      if (!matchStatus) return false;
      if (!q) return true;
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.phoneNumber.toLowerCase().includes(q) ||
        b.deviceModel.toLowerCase().includes(q) ||
        b.id.toString().includes(q)
      );
    });
  }, [bookings, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                Customer List
              </h1>
              <p className="text-blue-200/70 text-sm mt-0.5">
                All repair bookings — search, filter, update status
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="bookings.search_input"
            placeholder="Search by name, phone, model, or Job #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50 focus:border-blue-500/50"
          />
        </div>

        {/* Status Filter Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="bg-secondary/50 border border-border/50 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger
              value="all"
              className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="text-xs data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              🟡 Pending ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger
              value="confirmed"
              className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              🔵 In Progress ({statusCounts.confirmed})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-xs data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              🟢 Completed ({statusCounts.completed})
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="text-xs data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              ❌ Cancelled ({statusCounts.cancelled})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Loading State */}
        {isLoading && (
          <div data-ocid="bookings.loading_state" className="space-y-3">
            {["s1", "s2", "s3", "s4", "s5"].map((key) => (
              <Card key={key} className="border-border/50">
                <CardContent className="p-4 flex gap-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" data-ocid="bookings.error_state">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load bookings. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredBookings.length === 0 && (
          <Card data-ocid="bookings.empty_state" className="border-border/50">
            <CardContent className="text-center py-16">
              <Calendar className="w-14 h-14 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery
                  ? "No results found"
                  : statusFilter === "all"
                    ? "No Bookings Yet"
                    : `No ${statusFilter} Bookings`}
              </h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery
                  ? `No bookings match "${searchQuery}"`
                  : "There are no bookings to display at the moment."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Desktop Table */}
        {!isLoading && !error && filteredBookings.length > 0 && (
          <div>
            {/* Desktop */}
            <Card
              data-ocid="bookings.table"
              className="hidden md:block border-border/50 overflow-hidden"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 bg-secondary/30">
                    <TableHead className="text-muted-foreground font-semibold">
                      Job Card #
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold">
                      Customer
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold">
                      Mobile Model
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold">
                      Problem
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold">
                      Update
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking, idx) => (
                    <TableRow
                      key={booking.id.toString()}
                      data-ocid={`bookings.row.${idx + 1}`}
                      className="border-border/30 hover:bg-muted/20 cursor-pointer"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <TableCell>
                        <span className="font-mono text-xs font-bold text-blue-400">
                          #{booking.id.toString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm">
                            {booking.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.phoneNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {booking.deviceModel}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">
                        {booking.issueDescription}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateTime(booking.preferredDateTime)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusConfig(booking.status).className}
                        >
                          {getStatusConfig(booking.status).label}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={booking.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(
                              booking.id,
                              value as BookingStatus,
                            )
                          }
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger className="w-[120px] h-8 text-xs border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">🟡 Pending</SelectItem>
                            <SelectItem value="confirmed">
                              🔵 In Progress
                            </SelectItem>
                            <SelectItem value="completed">
                              🟢 Completed
                            </SelectItem>
                            <SelectItem value="cancelled">
                              ❌ Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredBookings.map((booking, idx) => (
                <Card
                  key={booking.id.toString()}
                  data-ocid={`bookings.row.${idx + 1}`}
                  className="border-border/50 cursor-pointer hover:border-blue-500/40 transition-colors"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{booking.customerName}</p>
                        <p className="text-xs font-mono text-blue-400">
                          Job #{booking.id.toString()}
                        </p>
                      </div>
                      <Badge
                        className={getStatusConfig(booking.status).className}
                      >
                        {getStatusConfig(booking.status).label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>📱 {booking.deviceModel}</p>
                      <p>📞 {booking.phoneNumber}</p>
                      <p className="truncate">⚠️ {booking.issueDescription}</p>
                    </div>
                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation for nested select */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={booking.status}
                        onValueChange={(value) =>
                          handleStatusUpdate(booking.id, value as BookingStatus)
                        }
                        disabled={updateStatus.isPending}
                      >
                        <SelectTrigger className="w-full h-8 text-xs border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">🟡 Pending</SelectItem>
                          <SelectItem value="confirmed">
                            🔵 In Progress
                          </SelectItem>
                          <SelectItem value="completed">
                            🟢 Completed
                          </SelectItem>
                          <SelectItem value="cancelled">
                            ❌ Cancelled
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
      </section>
    </div>
  );
}
