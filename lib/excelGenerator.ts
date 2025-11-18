import * as XLSX from 'xlsx';

export interface SalesReport {
  totalSales: number;
  sales: Array<{
    date: string;
    customer: string;
    total: number;
  }>;
}

export interface StockReport {
  totalProducts: number;
  products: Array<{
    id: string;
    name: string;
    stock: number;
    price: number;
  }>;
}

export interface CustomerReport {
  customerId: string;
  customerName: string;
  totalPurchases: number;
  purchases: Array<{
    date: string;
    invoiceNumber: string;
    total: number;
  }>;
}

export function generateSalesReport(data: SalesReport): void {
  const wsData = [
    ['REPORTE DE VENTAS'],
    [],
    ['Fecha', 'Cliente', 'Total'],
    ...data.sales.map(sale => [sale.date, sale.customer, sale.total]),
    [],
    ['VALOR TOTAL DE VENTAS', data.totalSales],
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
  XLSX.writeFile(wb, 'reporte-ventas.xlsx');
}

export function generateStockReport(data: StockReport): void {
  const wsData = [
    ['REPORTE DE INVENTARIO'],
    [],
    ['ID', 'Producto', 'Stock', 'Precio'],
    ...data.products.map(product => [
      product.id,
      product.name,
      product.stock,
      product.price,
    ]),
    [],
    ['TOTAL DE PRODUCTOS EN STOCK', data.totalProducts],
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
  XLSX.writeFile(wb, 'reporte-inventario.xlsx');
}

export function generateCustomerReport(data: CustomerReport): void {
  const wsData = [
    ['REPORTE DE COMPRAS POR CLIENTE'],
    [],
    ['ID Cliente', data.customerId],
    ['Nombre Cliente', data.customerName],
    [],
    ['Fecha', 'Número de Factura', 'Total'],
    ...data.purchases.map(purchase => [
      purchase.date,
      purchase.invoiceNumber,
      purchase.total,
    ]),
    [],
    ['TOTAL DE COMPRAS', data.totalPurchases],
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Compras Cliente');
  XLSX.writeFile(wb, `reporte-cliente-${data.customerId}.xlsx`);
}

