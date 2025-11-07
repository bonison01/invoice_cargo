import { Button } from "@/components/ui/button";
import { InvoiceData, DeliveryItem } from "@/pages/Index";
import { Plus, Trash2 } from "lucide-react";

interface DeliveryItemsFormProps {
  data: InvoiceData;
  updateData: (field: keyof InvoiceData, value: any) => void;
}

export const DeliveryItemsForm = ({ data, updateData }: DeliveryItemsFormProps) => {
  const addItem = () => {
    const newItem: DeliveryItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    updateData('items', [...data.items, newItem]);
  };

  const removeItem = (id: string) => {
    updateData('items', data.items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof DeliveryItem, value: any) => {
    const updatedItems = data.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    });
    updateData('items', updatedItems);
  };

  return (
    <div className="space-y-4">
      {data.items.map((item, index) => (
        <div key={item.id} className="p-4 border border-border rounded-lg space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Item {index + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-2">Description</label>
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder="Item description"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium block mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Rate (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.rate}
                onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Amount (₹)</label>
              <input
                type="number"
                value={item.amount.toFixed(2)}
                readOnly
                className="w-full px-3 py-2 border border-input rounded-md bg-muted"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={addItem}
        variant="outline"
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Delivery Item
      </Button>
    </div>
  );
};
