import type { Booking } from "@/backend";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllBookings } from "@/hooks/useBookings";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";

/** Parse a price from issueDescription or photoNotes.
 * Looks for patterns: ₹500, Rs 500, Rs. 500, Price: ₹500, or just standalone numbers. */
function parsePrice(booking: Booking): number {
  const sources = [booking.issueDescription, booking.photoNotes ?? ""].join(
    " ",
  );

  // Try ₹NNN or Rs NNN or Rs. NNN or Price: ₹NNN
  const patterns = [
    /₹\s*(\d+(?:[.,]\d+)?)/,
    /Rs\.?\s*(\d+(?:[.,]\d+)?)/i,
    /Price:\s*(\d+(?:[.,]\d+)?)/i,
    /price[:\s]+₹?\s*(\d+(?:[.,]\d+)?)/i,
  ];

  for (const re of patterns) {
    const m = sources.match(re);
    if (m) {
      return Number.parseFloat(m[1].replace(",", "."));
    }
  }
  return 0;
}

/** Convert bigint nanosecond timestamp to a date string YYYY-MM-DD in local time */
function nanoToDateStr(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  const d = new Date(ms);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

function todayDateStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

function formatDate(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
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
  const c = config[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };
  return <Badge className={c.className}>{c.label}</Badge>;
}

interface IncomeTableProps {
  bookings: Booking[];
  ocidPrefix: string;
}

function IncomeTable({ bookings, ocidPrefix }: IncomeTableProps) {
  if (bookings.length === 0) {
    return (
      <div
        data-ocid={`${ocidPrefix}.empty_state`}
        className="text-center py-12"
      >
        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
        <p className="text-muted-foreground">No bookings in this category</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div
        data-ocid={`${ocidPrefix}.table`}
        className="hidden md:block overflow-x-auto"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-muted-foreground">Job #</TableHead>
              <TableHead className="text-muted-foreground">Customer</TableHead>
              <TableHead className="text-muted-foreground">
                Device Model
              </TableHead>
              <TableHead className="text-muted-foreground">Issue</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">
                Est. Price
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking, idx) => {
              const price = parsePrice(booking);
              return (
                <TableRow
                  key={booking.id.toString()}
                  data-ocid={`${ocidPrefix}.item.${idx + 1}`}
                  className="border-border/30 hover:bg-muted/30"
                >
                  <TableCell className="font-mono text-xs text-blue-400">
                    #{booking.id.toString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {booking.customerName}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {booking.deviceModel}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[180px] truncate">
                    {booking.issueDescription}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green-400">
                    {price > 0 ? `₹${price.toLocaleString("en-IN")}` : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {bookings.map((booking, idx) => {
          const price = parsePrice(booking);
          return (
            <div
              key={booking.id.toString()}
              data-ocid={`${ocidPrefix}.item.${idx + 1}`}
              className="p-4 rounded-xl border border-border/50 bg-card/50 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{booking.customerName}</p>
                  <p className="text-xs font-mono text-blue-400">
                    #{booking.id.toString()}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {booking.deviceModel}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {booking.issueDescription}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  {formatDate(booking.timestamp)}
                </span>
                <span className="font-semibold text-green-400 text-sm">
                  {price > 0 ? `₹${price.toLocaleString("en-IN")}` : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function IncomePage() {
  const { data: bookings, isLoading, error } = useGetAllBookings();
  const today = todayDateStr();

  const {
    todayBookings,
    completedBookings,
    todayTotal,
    totalRevenue,
    completedCount,
  } = useMemo(() => {
    if (!bookings) {
      return {
        todayBookings: [],
        completedBookings: [],
        todayTotal: 0,
        totalRevenue: 0,
        completedCount: 0,
      };
    }

    const tb = bookings.filter((b) => nanoToDateStr(b.timestamp) === today);
    const cb = bookings.filter((b) => b.status === "completed");

    const todayTotal = tb.reduce((sum, b) => sum + parsePrice(b), 0);
    const totalRevenue = cb.reduce((sum, b) => sum + parsePrice(b), 0);

    return {
      todayBookings: tb,
      completedBookings: cb,
      todayTotal,
      totalRevenue,
      completedCount: cb.length,
    };
  }, [bookings, today]);

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div data-ocid="income.page" className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                Daily Income Report
              </h1>
              <p className="text-blue-200/70 text-sm flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                {todayLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 space-y-8">
        {/* Loading */}
        {isLoading && (
          <div
            data-ocid="income.loading_state"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive" data-ocid="income.error_state">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load income data. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Today's Bookings */}
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Today's Bookings
                  </span>
                </div>
                <p className="text-3xl font-display font-bold text-white">
                  {todayBookings.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  new repair entries
                </p>
              </CardContent>
            </Card>

            {/* Today's Revenue */}
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Today's Income
                  </span>
                </div>
                <p className="text-3xl font-display font-bold text-green-400">
                  ₹{todayTotal.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  from today's entries
                </p>
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="border-cyan-500/20 bg-cyan-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Total Revenue
                  </span>
                </div>
                <p className="text-3xl font-display font-bold text-cyan-400">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  from {completedCount} completed repairs
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Today's Bookings Table */}
        {!isLoading && !error && (
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-blue-400" />
                Today's Bookings
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 ml-1">
                  {todayBookings.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <IncomeTable bookings={todayBookings} ocidPrefix="income.today" />
            </CardContent>
          </Card>
        )}

        {/* All Completed Repairs */}
        {!isLoading && !error && (
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                All Completed Repairs
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 ml-1">
                  {completedBookings.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent data-ocid="income.table" className="pt-0">
              <IncomeTable bookings={completedBookings} ocidPrefix="income" />
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
