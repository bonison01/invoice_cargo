import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CompanyForm } from "@/components/invoice/CompanyForm";
import { SenderForm } from "@/components/invoice/SenderForm";
import { ReceiverForm } from "@/components/invoice/ReceiverForm";
import { DeliveryItemsForm } from "@/components/invoice/DeliveryItemsForm";
import { PaymentForm } from "@/components/invoice/PaymentForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download } from "lucide-react";

export interface DeliveryItem {
  id: string;
  trackingId: string;
  itemType: string;
  weight: number;
  weightUnit: string;
  quantity: number;
  deliveryDate: string;
  deliveryMode: string;
  remarks: string;
  baseCharge: number;
  weightCharge: number;
  amount: number;
}

export interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyGST: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverEmail: string;
  items: DeliveryItem[];
  notes: string;
  taxRate: number;
  invoiceNumber: string;
  invoiceDate: string;
  paymentMode: string;
  paymentStatus: string;
}

const Index = () => {
  const { toast } = useToast();
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: "Mateng",
    companyAddress: "Sagolband Sayang Leirak, Sagolband, Imphal, Manipur-795004",
    companyPhone: "8787649928",
    companyEmail: "",
    companyGST: "",
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverEmail: "",
    items: [],
    notes: "",
    taxRate: 18,
    invoiceNumber: `INV-${Date.now()}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentMode: "cash",
    paymentStatus: "paid",
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
              <h2 className="text-xl font-semibold mb-4">Sender Information</h2>
              <SenderForm data={invoiceData} updateData={updateInvoiceData} />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Receiver Information</h2>
              <ReceiverForm data={invoiceData} updateData={updateInvoiceData} />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Parcel/Delivery Details</h2>
              <DeliveryItemsForm data={invoiceData} updateData={updateInvoiceData} />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment & Invoice Details</h2>
              <PaymentForm data={invoiceData} updateData={updateInvoiceData} />
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
