/**
 * API Service for communicating with Express + MongoDB backend
 */

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const API_BASE = rawApiUrl ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`) : '/api';

export const api = {
  // Invoices
  async getInvoices(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/invoices?${query}`);
    if (!res.ok) throw new Error('Failed to fetch invoices');
    return res.json();
  },

  async getInvoiceById(id) {
    const res = await fetch(`${API_BASE}/invoices/${id}`);
    if (!res.ok) throw new Error('Failed to fetch invoice');
    return res.json();
  },

  async getNextInvoiceNumber() {
    const res = await fetch(`${API_BASE}/invoices/next-number`);
    if (!res.ok) throw new Error('Failed to get next invoice number');
    return res.json();
  },

  async createInvoice(invoiceData) {
    const res = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create invoice');
    return data;
  },

  async updateInvoice(id, invoiceData) {
    const res = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update invoice');
    return data;
  },

  async updateInvoiceStatus(id, status) {
    const res = await fetch(`${API_BASE}/invoices/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update invoice status');
    return data;
  },

  async deleteInvoice(id) {
    const res = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete invoice');
    return res.json();
  },

  // Puppeteer PDF Generation & Direct Download
  async downloadInvoicePdf(invoiceData) {
    const cleanNum = (invoiceData.invoiceNumber || 'VC-INV').replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `Invoice-${cleanNum}.pdf`;

    const res = await fetch(`${API_BASE}/invoices/generate-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'PDF Generation failed' }));
      throw new Error(err.message || 'PDF Generation failed');
    }

    const arrayBuf = await res.arrayBuffer();
    const pdfBlob = new Blob([arrayBuf], { type: 'application/pdf' });
    
    // Create download link with explicit .pdf filename
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.setAttribute('download', fileName);
    link.setAttribute('type', 'application/pdf');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 3000);

    return fileName;
  },

  async downloadSavedPdf(invoiceId, invoiceNumber = 'VC-INV') {
    const cleanNum = String(invoiceNumber).replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `Invoice-${cleanNum}.pdf`;

    const res = await fetch(`${API_BASE}/invoices/${invoiceId}/pdf`);
    if (!res.ok) throw new Error('Failed to download saved invoice PDF');
    
    const arrayBuf = await res.arrayBuffer();
    const pdfBlob = new Blob([arrayBuf], { type: 'application/pdf' });

    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.setAttribute('download', fileName);
    a.setAttribute('type', 'application/pdf');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 3000);

    return fileName;
  },

  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return res.json();
  },

  // Health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
};
