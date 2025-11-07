import { InvoiceData } from "@/pages/Index";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

interface InvoicePreviewProps {
  data: InvoiceData;
  subtotal: number;
  tax: number;
  total: number;
}

export const InvoicePreview = ({ data, subtotal, tax, total }: InvoicePreviewProps) => {
  return (
    <div className="bg-card border border-invoice-border rounded-lg p-6 shadow-sm" id="invoice-preview">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold text-primary">{data.companyName}</h3>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{data.companyAddress}</p>
          <p className="text-sm text-muted-foreground">Phone: {data.companyPhone}</p>
          {data.companyEmail && <p className="text-sm text-muted-foreground">Email: {data.companyEmail}</p>}
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-primary">INVOICE</h2>
          <p className="text-sm mt-2"><span className="font-medium">Invoice #:</span> {data.invoiceNumber}</p>
          <p className="text-sm"><span className="font-medium">Date:</span> {data.invoiceDate}</p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Bill To */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-2">BILL TO:</h4>
        <div className="text-sm">
          <p className="font-semibold">{data.clientName || "Client Name"}</p>
          <p className="text-muted-foreground whitespace-pre-line">{data.clientAddress || "Client Address"}</p>
          {data.clientPhone && <p className="text-muted-foreground">Phone: {data.clientPhone}</p>}
          {data.clientEmail && <p className="text-muted-foreground">Email: {data.clientEmail}</p>}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-primary">
              <th className="text-left py-2 text-sm font-semibold">DESCRIPTION</th>
              <th className="text-center py-2 text-sm font-semibold w-20">QTY</th>
              <th className="text-right py-2 text-sm font-semibold w-24">RATE</th>
              <th className="text-right py-2 text-sm font-semibold w-28">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                  No items added yet
                </td>
              </tr>
            ) : (
              data.items.map((item) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="py-3 text-sm">{item.description}</td>
                  <td className="py-3 text-center text-sm">{item.quantity}</td>
                  <td className="py-3 text-right text-sm">₹{item.rate.toFixed(2)}</td>
                  <td className="py-3 text-right text-sm font-medium">₹{item.amount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          {data.taxRate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax ({data.taxRate}%):</span>
              <span className="font-medium">₹{tax.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-2">Notes:</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{data.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
};
