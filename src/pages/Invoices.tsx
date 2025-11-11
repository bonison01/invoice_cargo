import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { FileText, Edit, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SavedInvoice {
  id: string;
  tracking_id: string;
  invoice_number: string;
  invoice_date: string;
  company_name: string;
  sender_name: string;
  receiver_name: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
}

const Invoices = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast({
        title: "Error",
        description: "Failed to load invoices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (invoiceId: string) => {
    try {
      // Fetch complete invoice data including items
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", invoiceId)
        .single();

      if (invoiceError) throw invoiceError;

      const { data: itemsData, error: itemsError } = await supabase
        .from("delivery_items")
        .select("*")
        .eq("invoice_id", invoiceId);

      if (itemsError) throw itemsError;

      // Navigate to home with invoice data in state
      navigate("/", {
        state: {
          editInvoice: {
            id: invoiceData.id,
            trackingId: invoiceData.tracking_id,
            companyName: invoiceData.company_name,
            companyAddress: invoiceData.company_address,
            companyPhone: invoiceData.company_phone,
            companyEmail: invoiceData.company_email,
            companyGST: invoiceData.company_gst,
            senderName: invoiceData.sender_name,
            senderPhone: invoiceData.sender_phone,
            senderAddress: invoiceData.sender_address,
            receiverName: invoiceData.receiver_name,
            receiverPhone: invoiceData.receiver_phone,
            receiverAddress: invoiceData.receiver_address,
            receiverEmail: invoiceData.receiver_email,
            items: itemsData.map((item) => ({
              id: item.id,
              itemType: item.item_type,
              weight: item.weight,
              weightUnit: item.weight_unit,
              quantity: item.quantity,
              deliveryDate: item.delivery_date,
              deliveryMode: item.delivery_mode,
              remarks: item.remarks || "",
              baseCharge: item.base_charge,
              weightCharge: item.weight_charge,
              amount: item.amount,
            })),
            notes: invoiceData.notes || "",
            taxRate: invoiceData.tax_rate,
            invoiceNumber: invoiceData.invoice_number,
            invoiceDate: invoiceData.invoice_date,
            paymentMode: invoiceData.payment_mode,
            paymentStatus: invoiceData.payment_status,
          },
        },
      });
    } catch (error) {
      console.error("Error loading invoice:", error);
      toast({
        title: "Error",
        description: "Failed to load invoice for editing.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Saved Invoices</h1>
                <p className="text-sm opacity-90">View and manage your invoices</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/")}
              variant="secondary"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Create
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <Card className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No invoices saved yet.</p>
              <Button onClick={() => navigate("/")} className="mt-4">
                Create Your First Invoice
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{invoice.tracking_id}</TableCell>
                      <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.sender_name}</TableCell>
                      <TableCell>{invoice.receiver_name}</TableCell>
                      <TableCell className="font-semibold">₹{invoice.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.payment_status === "paid" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        }`}>
                          {invoice.payment_status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleEdit(invoice.id)}
                          size="sm"
                          variant="outline"
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Invoices;
