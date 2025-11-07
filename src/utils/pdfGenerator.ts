import jsPDF from 'jspdf';
import { InvoiceData } from '@/pages/Index';

export const generateInvoicePDF = (data: InvoiceData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Color scheme
  const primaryColor: [number, number, number] = [59, 130, 246]; // Blue
  const textColor: [number, number, number] = [0, 0, 0];
  const lightGray: [number, number, number] = [240, 240, 240];

  // Header with company name
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(data.companyName, 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Delivery Service Invoice', 15, 28);

  yPosition = 45;

  // Company details
  doc.setTextColor(...textColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const companyLines = doc.splitTextToSize(data.companyAddress, 80);
  doc.text(companyLines, 15, yPosition);
  yPosition += companyLines.length * 5;
  doc.text(`Phone: ${data.companyPhone}`, 15, yPosition);
  if (data.companyEmail) {
    yPosition += 5;
    doc.text(`Email: ${data.companyEmail}`, 15, yPosition);
  }

  // Invoice details (right side)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('INVOICE', pageWidth - 15, 50, { align: 'right' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  doc.text(`Invoice #: ${data.invoiceNumber}`, pageWidth - 15, 58, { align: 'right' });
  doc.text(`Date: ${data.invoiceDate}`, pageWidth - 15, 63, { align: 'right' });

  yPosition = 80;

  // Bill To section
  doc.setFillColor(...lightGray);
  doc.rect(15, yPosition - 5, pageWidth - 30, 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 18, yPosition);
  
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.text(data.clientName || 'Client Name', 18, yPosition);
  
  yPosition += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const clientAddressLines = doc.splitTextToSize(data.clientAddress || 'Client Address', 80);
  doc.text(clientAddressLines, 18, yPosition);
  yPosition += clientAddressLines.length * 5;
  
  if (data.clientPhone) {
    doc.text(`Phone: ${data.clientPhone}`, 18, yPosition);
    yPosition += 5;
  }
  if (data.clientEmail) {
    doc.text(`Email: ${data.clientEmail}`, 18, yPosition);
    yPosition += 5;
  }

  yPosition += 10;

  // Items table header
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DESCRIPTION', 18, yPosition + 5);
  doc.text('QTY', pageWidth - 75, yPosition + 5, { align: 'right' });
  doc.text('RATE', pageWidth - 50, yPosition + 5, { align: 'right' });
  doc.text('AMOUNT', pageWidth - 18, yPosition + 5, { align: 'right' });

  yPosition += 10;

  // Items
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  
  if (data.items.length === 0) {
    doc.text('No items added', pageWidth / 2, yPosition + 10, { align: 'center' });
    yPosition += 20;
  } else {
    data.items.forEach((item, index) => {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(15, yPosition - 3, pageWidth - 30, 8, 'F');
      }

      const descLines = doc.splitTextToSize(item.description, 90);
      doc.text(descLines, 18, yPosition + 2);
      doc.text(item.quantity.toString(), pageWidth - 75, yPosition + 2, { align: 'right' });
      doc.text(`₹${item.rate.toFixed(2)}`, pageWidth - 50, yPosition + 2, { align: 'right' });
      doc.text(`₹${item.amount.toFixed(2)}`, pageWidth - 18, yPosition + 2, { align: 'right' });
      
      yPosition += Math.max(8, descLines.length * 5);
    });
  }

  yPosition += 5;

  // Totals section
  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - 80, yPosition, pageWidth - 15, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', pageWidth - 80, yPosition);
  doc.text(`₹${subtotal.toFixed(2)}`, pageWidth - 18, yPosition, { align: 'right' });
  
  if (data.taxRate > 0) {
    yPosition += 6;
    doc.text(`Tax (${data.taxRate}%):`, pageWidth - 80, yPosition);
    doc.text(`₹${tax.toFixed(2)}`, pageWidth - 18, yPosition, { align: 'right' });
  }

  yPosition += 8;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 80, yPosition - 2, pageWidth - 15, yPosition - 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('Total:', pageWidth - 80, yPosition);
  doc.text(`₹${total.toFixed(2)}`, pageWidth - 18, yPosition, { align: 'right' });

  // Notes
  if (data.notes) {
    yPosition += 15;
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Notes:', 15, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const notesLines = doc.splitTextToSize(data.notes, pageWidth - 30);
    doc.text(notesLines, 15, yPosition);
  }

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 15, { align: 'center' });

  // Save PDF
  doc.save(`Invoice_${data.invoiceNumber}.pdf`);
};
