export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export function calculateSubtotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function calculateDiscount(subtotal: number, discountPercent: number): number {
  return (subtotal * discountPercent) / 100;
}

export function calculateTax(subtotal: number, discountAmount: number, taxPercent: number): number {
  const taxableAmount = subtotal - discountAmount;
  return (taxableAmount * taxPercent) / 100;
}

export function calculateTotal(
  subtotal: number,
  discountAmount: number,
  taxAmount: number
): number {
  return subtotal - discountAmount + taxAmount;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}
