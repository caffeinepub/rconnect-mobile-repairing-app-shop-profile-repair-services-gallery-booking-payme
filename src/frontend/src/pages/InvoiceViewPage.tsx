import { useEffect, useState } from 'react';
import { useParams, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Printer, AlertCircle } from 'lucide-react';
import { useGetInvoicePublic } from '@/hooks/useInvoices';
import InvoiceReceipt from '@/components/invoice/InvoiceReceipt';
import { printHiddenClass } from '@/components/invoice/receiptTheme';

export default function InvoiceViewPage() {
  const params = useParams({ strict: false });
  const search = useSearch({ strict: false });
  
  const invoiceIdStr = params.invoiceId || '';
  const accessCode = (search as any)?.code || null;
  
  const [invoiceId, setInvoiceId] = useState<bigint | null>(null);

  useEffect(() => {
    if (invoiceIdStr) {
      try {
        setInvoiceId(BigInt(invoiceIdStr));
      } catch (e) {
        setInvoiceId(null);
      }
    }
  }, [invoiceIdStr]);

  const { data: invoice, isLoading, error } = useGetInvoicePublic(invoiceId, accessCode);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <AlertDescription className="ml-2">
              <strong>Invoice not found or access denied.</strong>
              <br />
              Please check the link and try again. The invoice may have been removed or the access code is invalid.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Print Button */}
        <div className={`mb-6 flex justify-end ${printHiddenClass}`}>
          <Button onClick={handlePrint} size="lg" className="gap-2">
            <Printer className="w-4 h-4" />
            Print Invoice
          </Button>
        </div>

        {/* Invoice Receipt */}
        <InvoiceReceipt invoice={invoice} />
      </div>
    </div>
  );
}
