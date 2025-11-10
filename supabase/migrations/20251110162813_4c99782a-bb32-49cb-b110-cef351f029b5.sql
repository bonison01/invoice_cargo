-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT UNIQUE NOT NULL,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  company_name TEXT NOT NULL,
  company_address TEXT NOT NULL,
  company_phone TEXT NOT NULL,
  company_email TEXT,
  company_gst TEXT,
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_phone TEXT NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_email TEXT,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 18,
  tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_mode TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create delivery_items table
CREATE TABLE public.delivery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  weight_unit TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  delivery_date DATE NOT NULL,
  delivery_mode TEXT NOT NULL,
  remarks TEXT,
  base_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
  weight_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication required)
CREATE POLICY "Allow public read access to invoices"
  ON public.invoices FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to invoices"
  ON public.invoices FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to invoices"
  ON public.invoices FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access to invoices"
  ON public.invoices FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to delivery_items"
  ON public.delivery_items FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to delivery_items"
  ON public.delivery_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to delivery_items"
  ON public.delivery_items FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access to delivery_items"
  ON public.delivery_items FOR DELETE
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_invoices_tracking_id ON public.invoices(tracking_id);
CREATE INDEX idx_delivery_items_invoice_id ON public.delivery_items(invoice_id);