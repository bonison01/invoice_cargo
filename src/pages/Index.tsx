import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CompanyForm } from "@/components/invoice/CompanyForm";
import { ClientForm } from "@/components/invoice/ClientForm";
import { DeliveryItemsForm } from "@/components/invoice/DeliveryItemsForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download } from "lucide-react";

export interface DeliveryItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  items: DeliveryItem[];
  notes: string;
  taxRate: number;
  invoiceNumber: string;
  invoiceDate: string;
}

const Index = () => {
  const { toast } = useToast();
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: "Mateng",
    companyAddress: "Sagolband Sayang Leirak, Sagolband, Imphal, Manipur-795004",
    companyPhone: "8787649928",
    companyEmail: "",
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientEmail: "",
    items: [],
    notes: "",
    taxRate: 0,
    invoiceNumber: `INV-${Date.now()}`,
    invoiceDate: new Date().toISOString().split('T')[0],
  });

  const updateInvoiceData = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadPDF = () => {
    try {
      generateInvoicePDF(invoiceData);
      toast({
        title: "Success!",
        description: "Invoice PDF downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (invoiceData.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Mateng Invoice Generator</h1>
                <p className="text-sm opacity-90">Professional Delivery Service Invoicing</p>
              </div>
            </div>
            <Button
              onClick={handleDownloadPDF}
              size="lg"
              variant="secondary"
              className="gap-2 font-semibold"
            >
              <Download className="h-5 w-5" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Forms Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Company Details</h2>
              <CompanyForm data={invoiceData} updateData={updateInvoiceData} />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Client Information</h2>
              <ClientForm data={invoiceData} updateData={updateInvoiceData} />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Items</h2>
              <DeliveryItemsForm data={invoiceData} updateData={updateInvoiceData} />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => updateInvoiceData('invoiceNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceData.invoiceDate}
                    onChange={(e) => updateInvoiceData('invoiceDate', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={invoiceData.taxRate}
                    onChange={(e) => updateInvoiceData('taxRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Notes (Optional)</label>
                  <textarea
                    rows={3}
                    value={invoiceData.notes}
                    onChange={(e) => updateInvoiceData('notes', e.target.value)}
                    placeholder="Add any additional notes or terms..."
                    className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Invoice Preview</h2>
                <div className="text-right text-sm">
                  <div className="font-semibold">Total Amount</div>
                  <div className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</div>
                </div>
              </div>
              <Separator className="mb-4" />
              <InvoicePreview data={invoiceData} subtotal={subtotal} tax={tax} total={total} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
