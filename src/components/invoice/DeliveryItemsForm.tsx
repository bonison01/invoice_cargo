import { DeliveryItem, InvoiceData } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface DeliveryItemsFormProps {
  data: InvoiceData;
  updateData: (field: keyof InvoiceData, value: any) => void;
}

export const DeliveryItemsForm = ({ data, updateData }: DeliveryItemsFormProps) => {
  const addItem = () => {
    const newItem: DeliveryItem = {
      id: Date.now().toString(),
      itemType: "parcel",
      weight: 0,
      weightUnit: "kg",
      quantity: 1,
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryMode: "standard",
      remarks: "",
      baseCharge: 0,
      weightCharge: 0,
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
        const updatedItem = { ...item, [field]: value };
        if (field === 'baseCharge' || field === 'weightCharge') {
          updatedItem.amount = updatedItem.baseCharge + updatedItem.weightCharge;
        }
        return updatedItem;
      }
      return item;
    });
    updateData('items', updatedItems);
  };

  return (
    <div className="space-y-4">
      {data.items.map((item, index) => (
        <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">Parcel {index + 1}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Item Type</Label>
              <Select value={item.itemType} onValueChange={(value) => updateItem(item.id, 'itemType', value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="parcel">Parcel</SelectItem>
                  <SelectItem value="fragile">Fragile Item</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Quantity</Label>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Weight</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={item.weight}
                onChange={(e) => updateItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Unit</Label>
              <Select value={item.weightUnit} onValueChange={(value) => updateItem(item.id, 'weightUnit', value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Delivery Date</Label>
              <Input
                type="date"
                value={item.deliveryDate}
                onChange={(e) => updateItem(item.id, 'deliveryDate', e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Delivery Mode</Label>
              <Select value={item.deliveryMode} onValueChange={(value) => updateItem(item.id, 'deliveryMode', value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="10-min">10-Min Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Base Charge (₹)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={item.baseCharge}
                onChange={(e) => updateItem(item.id, 'baseCharge', parseFloat(e.target.value) || 0)}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Weight Charge (₹)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={item.weightCharge}
                onChange={(e) => updateItem(item.id, 'weightCharge', parseFloat(e.target.value) || 0)}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Total (₹)</Label>
              <Input
                type="text"
                value={item.amount.toFixed(2)}
                readOnly
                className="text-sm bg-muted font-semibold"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Remarks / Notes (Optional)</Label>
            <Input
              type="text"
              value={item.remarks}
              onChange={(e) => updateItem(item.id, 'remarks', e.target.value)}
              className="text-sm"
              placeholder="Any additional notes..."
            />
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
        Add Parcel
      </Button>
    </div>
  );
};
