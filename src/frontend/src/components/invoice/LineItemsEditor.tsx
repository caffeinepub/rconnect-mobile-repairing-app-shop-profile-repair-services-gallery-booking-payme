import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import type { LineItem } from './invoiceMath';

interface LineItemsEditorProps {
  lineItems: LineItem[];
  onChange: (lineItems: LineItem[]) => void;
}

export default function LineItemsEditor({ lineItems, onChange }: LineItemsEditorProps) {
  const addLineItem = () => {
    onChange([...lineItems, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeLineItem = (index: number) => {
    onChange(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Line Items</Label>
        <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {lineItems.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg border bg-muted/30">
            <div className="col-span-12 sm:col-span-5">
              <Label htmlFor={`desc-${index}`} className="text-xs">
                Description
              </Label>
              <Input
                id={`desc-${index}`}
                value={item.description}
                onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                placeholder="Service description"
                className="mt-1"
              />
            </div>
            <div className="col-span-5 sm:col-span-3">
              <Label htmlFor={`qty-${index}`} className="text-xs">
                Quantity
              </Label>
              <Input
                id={`qty-${index}`}
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
            <div className="col-span-5 sm:col-span-3">
              <Label htmlFor={`price-${index}`} className="text-xs">
                Unit Price (₹)
              </Label>
              <Input
                id={`price-${index}`}
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLineItem(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {lineItems.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
          No items added yet. Click "Add Item" to get started.
        </div>
      )}
    </div>
  );
}
