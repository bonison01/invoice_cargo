import jsPDF from 'jspdf';
import { InvoiceData } from '@/pages/Index';

const generateInvoiceCopy = (
  doc: jsPDF,
  data: InvoiceData,
  subtotal: number,
  tax: number,
  total: number,
  copyType: 'sender' | 'receiver',
  startY: number
) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = startY;

  const primaryColor: [number, number, number] = [59, 130, 246];
  const textColor: [number, number, number] = [0, 0, 0];
  const lightGray: [number, number, number] = [240, 240, 240];

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(10, yPosition, pageWidth - 20, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.companyName, pageWidth / 2, yPosition + 10, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(data.companyAddress, pageWidth / 2, yPosition + 16, { align: 'center' });
  doc.text(`Phone: ${data.companyPhone}${data.companyEmail ? ' | Email: ' + data.companyEmail : ''}`, pageWidth / 2, yPosition + 20, { align: 'center' });
  if (data.companyGST) {
    doc.text(`GST: ${data.companyGST}`, pageWidth / 2, yPosition + 24, { align: 'center' });
  }

  yPosition += 35;

  // Copy Type Badge
  doc.setFillColor(...primaryColor);
  const badgeText = copyType === 'sender' ? "SENDER'S COPY" : "RECEIVER'S COPY";
  const badgeWidth = 50;
  doc.rect((pageWidth - badgeWidth) / 2, yPosition, badgeWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(badgeText, pageWidth / 2, yPosition + 5, { align: 'center' });

  yPosition += 12;

  // Invoice Details
  doc.setTextColor(...textColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Invoice #: ${data.invoiceNumber}`, 15, yPosition);
  doc.text(`Date: ${data.invoiceDate}`, 15, yPosition + 4);
  doc.text(`Payment: ${data.paymentMode.toUpperCase()}`, pageWidth - 15, yPosition, { align: 'right' });
  doc.text(`Status: ${data.paymentStatus.toUpperCase()}`, pageWidth - 15, yPosition + 4, { align: 'right' });

  yPosition += 10;

  // Sender & Receiver
  doc.setFillColor(...lightGray);
  doc.rect(15, yPosition, (pageWidth - 35) / 2, 20, 'F');
  doc.rect(15 + (pageWidth - 35) / 2 + 5, yPosition, (pageWidth - 35) / 2, 20, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.text('FROM (SENDER):', 17, yPosition + 4);
  doc.text('TO (RECEIVER):', 17 + (pageWidth - 35) / 2 + 5, yPosition + 4);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  doc.setFontSize(7);
  doc.text(data.senderName || 'N/A', 17, yPosition + 8);
  doc.text(data.senderPhone || 'N/A', 17, yPosition + 11);
  const senderAddr = doc.splitTextToSize(data.senderAddress || 'N/A', 40);
  doc.text(senderAddr, 17, yPosition + 14);

  doc.text(data.receiverName || 'N/A', 17 + (pageWidth - 35) / 2 + 5, yPosition + 8);
  doc.text(data.receiverPhone || 'N/A', 17 + (pageWidth - 35) / 2 + 5, yPosition + 11);
  const receiverAddr = doc.splitTextToSize(data.receiverAddress || 'N/A', 40);
  doc.text(receiverAddr, 17 + (pageWidth - 35) / 2 + 5, yPosition + 14);

  yPosition += 25;

  // Items Table Header
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPosition, pageWidth - 30, 7, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('TRACKING ID', 17, yPosition + 4.5);
  doc.text('ITEM', 50, yPosition + 4.5);
  doc.text('WEIGHT', 100, yPosition + 4.5);
  doc.text('MODE', 125, yPosition + 4.5);
  doc.text('AMOUNT', pageWidth - 17, yPosition + 4.5, { align: 'right' });

  yPosition += 9;

  // Items
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  
  if (data.items.length === 0) {
    doc.text('No items added', pageWidth / 2, yPosition + 5, { align: 'center' });
    yPosition += 10;
  } else {
    data.items.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(15, yPosition - 2, pageWidth - 30, 7, 'F');
      }

      doc.text(item.trackingId, 17, yPosition + 2);
      doc.setFont('helvetica', 'bold');
      doc.text(item.itemType, 50, yPosition + 2);
      doc.setFont('helvetica', 'normal');
      if (item.remarks) {
        doc.setFontSize(6);
        doc.text(item.remarks.substring(0, 20), 50, yPosition + 5);
        doc.setFontSize(7);
      }
      doc.text(`${item.weight}${item.weightUnit}`, 100, yPosition + 2);
      doc.text(item.deliveryMode, 125, yPosition + 2);
      doc.setFont('helvetica', 'bold');
      doc.text(`₹${item.amount.toFixed(2)}`, pageWidth - 17, yPosition + 2, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      
      yPosition += 7;
    });
  }

  yPosition += 3;

  // Totals
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - 70, yPosition, pageWidth - 15, yPosition);
  yPosition += 5;

  doc.setFontSize(8);
  doc.text('Subtotal:', pageWidth - 70, yPosition);
  doc.text(`₹${subtotal.toFixed(2)}`, pageWidth - 17, yPosition, { align: 'right' });
  
  if (data.taxRate > 0) {
    yPosition += 4;
    doc.text(`GST (${data.taxRate}%):`, pageWidth - 70, yPosition);
    doc.text(`₹${tax.toFixed(2)}`, pageWidth - 17, yPosition, { align: 'right' });
  }

  yPosition += 5;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 70, yPosition - 1, pageWidth - 15, yPosition - 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('Total:', pageWidth - 70, yPosition);
  doc.text(`₹${total.toFixed(2)}`, pageWidth - 17, yPosition, { align: 'right' });

  yPosition += 5;

  // Notes
  if (data.notes) {
    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition, pageWidth - 30, 10, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Notes:', 17, yPosition + 3);
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(data.notes, pageWidth - 35);
    doc.text(notesLines, 17, yPosition + 6);
    yPosition += 12;
  }

  // Footer
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  doc.text(`Thank you for choosing ${data.companyName}!`, pageWidth / 2, yPosition + 3, { align: 'center' });
  doc.setFontSize(6);
  doc.text('This is a computer generated invoice', pageWidth / 2, yPosition + 6, { align: 'center' });

  return yPosition + 10;
};

export const generateInvoicePDF = (data: InvoiceData) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();

  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  // Generate Sender's Copy
  let currentY = 10;
  currentY = generateInvoiceCopy(doc, data, subtotal, tax, total, 'sender', currentY);

  // Separator line
  currentY += 5;
  doc.setDrawColor(200, 200, 200);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(10, currentY, doc.internal.pageSize.getWidth() - 10, currentY);
  doc.setLineDashPattern([], 0);
  
  doc.setFontSize(7);
  doc.setTextColor(128, 128, 128);
  doc.text('✂ CUT HERE ✂', doc.internal.pageSize.getWidth() / 2, currentY - 1, { align: 'center' });

  currentY += 5;

  // Generate Receiver's Copy
  if (currentY > pageHeight - 100) {
    doc.addPage();
    currentY = 10;
  }
  generateInvoiceCopy(doc, data, subtotal, tax, total, 'receiver', currentY);

  doc.save(`Invoice_${data.invoiceNumber}.pdf`);
};
