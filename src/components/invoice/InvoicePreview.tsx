import { InvoiceData } from "@/pages/Index";
import { Separator } from "@/components/ui/separator";
import { Package, Scissors } from "lucide-react";

interface InvoicePreviewProps {
  data: InvoiceData;
  subtotal: number;
  tax: number;
  total: number;
}

const InvoiceCopy = ({ 
  data, 
  subtotal, 
  tax, 
  total, 
  copyType 
}: InvoicePreviewProps & { copyType: "sender" | "receiver" }) => {
  return (
    <div className="bg-card border-2 border-primary rounded-lg p-6">
      {/* Header */}
      <div className="text-center border-b-2 border-primary pb-4 mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Package className="h-8 w-8 text-primary" />
          <h3 className="text-3xl font-bold text-primary">{data.companyName}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{data.companyAddress}</p>
        <p className="text-xs text-muted-foreground">Phone: {data.companyPhone} {data.companyEmail && `| Email: ${data.companyEmail}`}</p>
        {data.companyGST && <p className="text-xs text-muted-foreground">GST: {data.companyGST}</p>}
        <div className="mt-2 bg-primary text-primary-foreground px-4 py-1 inline-block rounded font-semibold text-sm">
          {copyType === "sender" ? "SENDER'S COPY" : "RECEIVER'S COPY"}
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div>
          <p className="font-semibold">Invoice #: <span className="font-mono">{data.invoiceNumber}</span></p>
          <p className="font-semibold">Date: {data.invoiceDate}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Payment: {data.paymentMode.toUpperCase()}</p>
          <p className={`font-semibold ${data.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
            Status: {data.paymentStatus.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Sender & Receiver */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-muted p-3 rounded">
          <h4 className="text-xs font-bold mb-1 text-primary">FROM (SENDER):</h4>
          <p className="text-xs font-semibold">{data.senderName || "N/A"}</p>
          <p className="text-xs text-muted-foreground">{data.senderPhone || "N/A"}</p>
          <p className="text-xs text-muted-foreground">{data.senderAddress || "N/A"}</p>
        </div>
        <div className="bg-muted p-3 rounded">
          <h4 className="text-xs font-bold mb-1 text-primary">TO (RECEIVER):</h4>
          <p className="text-xs font-semibold">{data.receiverName || "N/A"}</p>
          <p className="text-xs text-muted-foreground">{data.receiverPhone || "N/A"}</p>
          <p className="text-xs text-muted-foreground">{data.receiverAddress || "N/A"}</p>
          {data.receiverEmail && <p className="text-xs text-muted-foreground">{data.receiverEmail}</p>}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="text-left py-2 px-2">Tracking ID</th>
              <th className="text-left py-2 px-2">Item</th>
              <th className="text-center py-2 px-2">Weight</th>
              <th className="text-center py-2 px-2">Mode</th>
              <th className="text-right py-2 px-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-foreground">
                  No items added
                </td>
              </tr>
            ) : (
              data.items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-muted/50' : ''}>
                  <td className="py-2 px-2 font-mono">{item.trackingId}</td>
                  <td className="py-2 px-2">
                    <div className="font-semibold capitalize">{item.itemType}</div>
                    {item.remarks && <div className="text-muted-foreground text-[10px]">{item.remarks}</div>}
                  </td>
                  <td className="py-2 px-2 text-center">{item.weight}{item.weightUnit}</td>
                  <td className="py-2 px-2 text-center capitalize">{item.deliveryMode}</td>
                  <td className="py-2 px-2 text-right font-semibold">₹{item.amount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-4">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {data.taxRate > 0 && (
            <div className="flex justify-between">
              <span>GST ({data.taxRate}%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold text-primary">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="bg-muted p-3 rounded text-xs">
          <h4 className="font-bold mb-1">Notes:</h4>
          <p className="text-muted-foreground">{data.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t text-center text-xs text-muted-foreground">
        <p>Thank you for choosing {data.companyName}!</p>
        <p className="text-[10px] mt-1">This is a computer generated invoice</p>
      </div>
    </div>
  );
};

export const InvoicePreview = ({ data, subtotal, tax, total }: InvoicePreviewProps) => {
  return (
    <div className="space-y-6">
      <InvoiceCopy data={data} subtotal={subtotal} tax={tax} total={total} copyType="sender" />
      
      <div className="flex items-center gap-2 text-muted-foreground">
        <Separator className="flex-1" />
        <Scissors className="h-4 w-4" />
        <span className="text-xs font-medium">CUT HERE</span>
        <Scissors className="h-4 w-4" />
        <Separator className="flex-1" />
      </div>
      
      <InvoiceCopy data={data} subtotal={subtotal} tax={tax} total={total} copyType="receiver" />
    </div>
  );
};
