import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Copy, CheckCircle2, Receipt } from 'lucide-react';
import { useCreateInvoice } from '@/hooks/useInvoices';
import type { Booking } from '@/backend';
import LineItemsEditor from './LineItemsEditor';
import type { LineItem } from './invoiceMath';
import { calculateSubtotal, calculateDiscount, calculateTax, calculateTotal, formatCurrency } from './invoiceMath';
import { receiptClasses } from './receiptTheme';
import { toast } from 'sonner';

interface InvoiceComposerDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InvoiceComposerDialog({ booking, open, onOpenChange }: InvoiceComposerDialogProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: 'Mobile Repair Service', quantity: 1, unitPrice: 0 },
  ]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [createdAccessCode, setCreatedAccessCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const createInvoice = useCreateInvoice();

  const subtotal = calculateSubtotal(lineItems);
  const discountAmount = calculateDiscount(subtotal, discountPercent);
  const taxAmount = calculateTax(subtotal, discountAmount, taxPercent);
  const total = calculateTotal(subtotal, discountAmount, taxAmount);

  const handleCreate = async () => {
    if (!booking) return;

    const isValid = lineItems.every(
      (item) => item.description.trim() !== '' && item.quantity > 0 && item.unitPrice >= 0
    );

    if (!isValid) {
      toast.error('Please fill in all line items correctly');
      return;
    }

    try {
      const description = JSON.stringify({
        lineItems,
        discountPercent,
        taxPercent,
        notes: notes.trim() || undefined,
      });

      const accessCode = await createInvoice.mutateAsync({
        bookingId: booking.id,
        amount: total.toFixed(2),
        description,
      });

      setCreatedAccessCode(accessCode);
      toast.success('Invoice created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create invoice');
    }
  };

  const handleClose = () => {
    setLineItems([{ description: 'Mobile Repair Service', quantity: 1, unitPrice: 0 }]);
    setDiscountPercent(0);
    setTaxPercent(0);
    setNotes('');
    setCreatedAccessCode(null);
    setCopiedLink(false);
    onOpenChange(false);
  };

  const getShareableLink = () => {
    if (!booking || !createdAccessCode) return '';
    // We'll use a simple approach: invoiceId is derived from bookingId for now
    // In production, the backend should return the invoiceId
    const baseUrl = window.location.origin;
    return `${baseUrl}/invoice/${booking.id}?code=${createdAccessCode}`;
  };

  const copyShareableLink = () => {
    const link = getShareableLink();
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Receipt className="w-6 h-6 text-amber-600" />
            Generate Invoice
          </DialogTitle>
          <DialogDescription>
            Create an invoice for booking #{booking.id.toString()} - {booking.customerName}
          </DialogDescription>
        </DialogHeader>

        {createdAccessCode ? (
          <div className="space-y-4 py-4">
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <AlertDescription className="ml-2">
                <strong>Invoice created successfully!</strong>
                <br />
                Share the link below with your customer to view and print their invoice.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Shareable Invoice Link</Label>
              <div className="flex gap-2">
                <Input value={getShareableLink()} readOnly className="font-mono text-sm" />
                <Button onClick={copyShareableLink} variant="outline" size="icon">
                  {copiedLink ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This link includes a secure access code. Only share it with the customer.
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Line Items */}
            <LineItemsEditor lineItems={lineItems} onChange={setLineItems} />

            {/* Discount & Tax */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">Tax (%)</Label>
                <Input
                  id="tax"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or terms..."
                rows={3}
              />
            </div>

            {/* Totals Preview */}
            <div className={`${receiptClasses.container} p-4 space-y-2`}>
              <h3 className="font-semibold text-sm mb-3">Invoice Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({discountPercent}%):</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                {taxPercent > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ({taxPercent}%):</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-amber-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={createInvoice.isPending}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createInvoice.isPending || lineItems.length === 0}>
                {createInvoice.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Invoice'
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
