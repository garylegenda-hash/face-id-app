import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export function generateInvoicePDF(data: InvoiceData): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('FACTURA DE VENTA', 105, 20, { align: 'center' });
  
  // Invoice details
  doc.setFontSize(12);
  doc.text(`Número de Factura: ${data.invoiceNumber}`, 14, 35);
  doc.text(`Fecha: ${data.date}`, 14, 42);
  doc.text(`Cliente: ${data.customerName}`, 14, 49);
  doc.text(`ID Cliente: ${data.customerId}`, 14, 56);
  
  // Table
  autoTable(doc, {
    startY: 65,
    head: [['Producto', 'Cantidad', 'Precio Unit.', 'Total']],
    body: data.items.map(item => [
      item.name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${item.total.toFixed(2)}`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] },
  });
  
  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Subtotal: $${data.subtotal.toFixed(2)}`, 140, finalY);
  doc.text(`IVA (19%): $${data.tax.toFixed(2)}`, 140, finalY + 7);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`TOTAL: $${data.total.toFixed(2)}`, 140, finalY + 15);
  
  // Footer
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Gracias por su compra', 105, 280, { align: 'center' });
  
  // Save PDF
  doc.save(`factura-${data.invoiceNumber}.pdf`);
}

