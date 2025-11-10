import { InvoiceData } from "@/pages/Index";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PaymentFormProps {
  data: InvoiceData;
  updateData: (field: keyof InvoiceData, value: any) => void;
}

export const PaymentForm = ({ data, updateData }: PaymentFormProps) => {
  return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="trackingId">Tracking ID</Label>
          <Input
            id="trackingId"
            value={data.trackingId}
            onChange={(e) => updateData("trackingId", e.target.value)}
            placeholder="MTG12345678"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            type="text"
            value={data.invoiceNumber}
            onChange={(e) => updateData('invoiceNumber', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="invoiceDate">Invoice Date</Label>
          <Input
            id="invoiceDate"
            type="date"
            value={data.invoiceDate}
            onChange={(e) => updateData('invoiceDate', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="paymentMode">Payment Mode</Label>
          <Select value={data.paymentMode} onValueChange={(value) => updateData('paymentMode', value)}>
            <SelectTrigger id="paymentMode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="paymentStatus">Payment Status</Label>
          <Select value={data.paymentStatus} onValueChange={(value) => updateData('paymentStatus', value)}>
            <SelectTrigger id="paymentStatus">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="taxRate">GST / Tax Rate (%)</Label>
        <Input
          id="taxRate"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={data.taxRate}
          onChange={(e) => updateData('taxRate', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes / Additional Remarks (Optional)</Label>
        <Textarea
          id="notes"
          rows={3}
          value={data.notes}
          onChange={(e) => updateData('notes', e.target.value)}
          placeholder="Add any additional notes or terms..."
        />
      </div>
    </div>
  );
};
