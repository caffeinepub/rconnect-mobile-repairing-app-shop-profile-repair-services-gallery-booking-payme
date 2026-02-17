import { Receipt } from 'lucide-react';
import type { Invoice } from '@/backend';
import { formatDateTime } from '@/utils/time';
import { receiptClasses } from './receiptTheme';
import { formatCurrency } from './invoiceMath';
import type { LineItem } from './invoiceMath';

interface InvoiceReceiptProps {
  invoice: Invoice;
}

export default function InvoiceReceipt({ invoice }: InvoiceReceiptProps) {
  // Parse the description JSON to extract line items and other details
  let lineItems: LineItem[] = [];
  let discountPercent = 0;
  let taxPercent = 0;
  let notes = '';

  try {
    const parsed = JSON.parse(invoice.description);
    lineItems = parsed.lineItems || [];
    discountPercent = parsed.discountPercent || 0;
    taxPercent = parsed.taxPercent || 0;
    notes = parsed.notes || '';
  } catch (e) {
    // Fallback for simple description
    lineItems = [{ description: invoice.description, quantity: 1, unitPrice: parseFloat(invoice.amount) }];
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const total = parseFloat(invoice.amount);

  return (
    <div className={receiptClasses.container}>
      {/* Header */}
      <div className={receiptClasses.header}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt className="w-8 h-8 text-amber-600" />
            <div>
              <h1 className="text-2xl font-bold">Rconnect</h1>
              <p className="text-sm text-muted-foreground">Mobile Repair Service</p>
            </div>
          </div>
          <div className="text-right">
            <p className={receiptClasses.label}>Invoice</p>
            <p className="text-lg font-bold">#{invoice.id.toString()}</p>
          </div>
        </div>
      </div>

      {/* Invoice Info */}
      <div className={receiptClasses.section}>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className={receiptClasses.label}>Invoice Date</p>
            <p className={receiptClasses.value}>{formatDateTime(invoice.createdAt)}</p>
          </div>
          <div className="space-y-1">
            <p className={receiptClasses.label}>Status</p>
            <p className={receiptClasses.value}>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  invoice.status === 'paid'
                    ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400'
                    : invoice.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
                }`}
              >
                {invoice.status.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className={receiptClasses.section}>
        <p className={receiptClasses.label}>Bill To</p>
        <p className="text-base font-semibold">{invoice.customerName}</p>
        <p className="text-sm text-muted-foreground">Booking #{invoice.bookingId.toString()}</p>
      </div>

      {/* Line Items */}
      <div className={receiptClasses.section}>
        <table className={receiptClasses.table}>
          <thead>
            <tr className={receiptClasses.tableHeader}>
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-center w-20">Qty</th>
              <th className="py-2 text-right w-24">Unit Price</th>
              <th className="py-2 text-right w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className={receiptClasses.tableCell}>{item.description}</td>
                <td className={`${receiptClasses.tableCell} text-center`}>{item.quantity}</td>
                <td className={`${receiptClasses.tableCell} text-right`}>{formatCurrency(item.unitPrice)}</td>
                <td className={`${receiptClasses.tableCell} text-right font-medium`}>
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className={receiptClasses.section}>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discountPercent > 0 && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <span>Discount ({discountPercent}%):</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          {taxPercent > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax ({taxPercent}%):</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t-2">
            <span>Total Amount:</span>
            <span className="text-amber-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className={receiptClasses.section}>
          <p className={receiptClasses.label}>Notes</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className={`${receiptClasses.section} text-center text-xs text-muted-foreground`}>
        <p>Thank you for choosing Rconnect!</p>
        <p className="mt-1">For any queries, please contact us.</p>
      </div>
    </div>
  );
}
