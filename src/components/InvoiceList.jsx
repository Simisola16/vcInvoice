import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  RefreshCw,
  Eye,
  Loader2,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function InvoiceList({
  onEditInvoice,
  onNewInvoice,
  onPreviewInvoice,
  showToast
}) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.getInvoices(params);
      if (res.success) {
        setInvoices(res.data || []);
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to load invoices', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInvoices();
  };

  const handleDelete = async (id, invNum) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${invNum}?`)) return;
    try {
      await api.deleteInvoice(id);
      showToast(`Invoice ${invNum} deleted successfully`, 'success');
      fetchInvoices();
    } catch (err) {
      showToast(err.message || 'Failed to delete invoice', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateInvoiceStatus(id, newStatus);
      showToast(`Status updated to ${newStatus.toUpperCase()}`, 'success');
      fetchInvoices();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDownloadPdf = async (inv) => {
    try {
      setDownloadingId(inv._id);
      await api.downloadSavedPdf(inv._id, inv.invoiceNumber);
      showToast(`Downloaded ${inv.invoiceNumber}.pdf`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to download PDF', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="invoice-list-container">
      {/* Top Header Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Invoices Management</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              View, search, edit and download past invoices saved in MongoDB Atlas.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="btn btn-secondary btn-sm" onClick={fetchInvoices} title="Refresh list">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button className="btn btn-primary" onClick={onNewInvoice}>
              <Plus size={16} />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '20px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Invoice #, Client Name, Company or Email..."
            />
          </form>

          <div className="nav-tabs" style={{ background: 'var(--color-bg-subtle)' }}>
            {['all', 'paid', 'pending', 'overdue', 'draft'].map((st) => (
              <button
                key={st}
                className={`nav-tab-btn ${statusFilter === st ? 'active' : ''}`}
                style={{ textTransform: 'capitalize', padding: '6px 14px', fontSize: '12.5px' }}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--color-primary)' }} />
            <p style={{ fontWeight: '600' }}>Fetching invoices from MongoDB...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--color-text-subtle)' }}>
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>No invoices found</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 18px auto' }}>
              {search || statusFilter !== 'all' 
                ? 'No invoices match your current search or filter criteria. Try changing filters.'
                : 'You have not saved any invoices yet. Create your first professional invoice now!'}
            </p>
            <button className="btn btn-primary btn-sm" onClick={onNewInvoice}>
              <Plus size={15} />
              <span>Create New Invoice</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client / Company</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Total Amount</th>
                  <th>Balance Due</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const symbol = inv.currency?.symbol || '$';
                  const total = inv.pricing?.total || 0;
                  const balance = inv.pricing?.balanceDue || 0;
                  const isDownloading = downloadingId === inv._id;

                  return (
                    <tr key={inv._id}>
                      <td>
                        <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
                          {inv.invoiceNumber}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>
                          {inv.client?.name || 'N/A'}
                        </div>
                        {inv.client?.company && (
                          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                            {inv.client.company}
                          </div>
                        )}
                      </td>
                      <td>{formatDate(inv.issueDate)}</td>
                      <td>{formatDate(inv.dueDate)}</td>
                      <td>
                        <span style={{ fontWeight: '700' }}>
                          {symbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: '700', color: balance > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                          {symbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', width: 'auto' }}
                          value={inv.status}
                          onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                        >
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                          <option value="overdue">Overdue</option>
                          <option value="draft">Draft</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          {/* Live Preview */}
                          <button 
                            className="btn-icon" 
                            onClick={() => onPreviewInvoice(inv)}
                            title="Preview Invoice"
                          >
                            <Eye size={14} />
                          </button>

                          {/* Edit */}
                          <button 
                            className="btn-icon" 
                            onClick={() => onEditInvoice(inv)}
                            title="Edit Invoice"
                          >
                            <Edit3 size={14} />
                          </button>

                          {/* Puppeteer PDF Download */}
                          <button 
                            className="btn-icon" 
                            style={{ color: 'var(--color-primary)' }}
                            onClick={() => handleDownloadPdf(inv)}
                            disabled={isDownloading}
                            title="Download Puppeteer PDF"
                          >
                            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                          </button>

                          {/* Delete */}
                          <button 
                            className="btn-icon" 
                            style={{ color: 'var(--color-danger)' }}
                            onClick={() => handleDelete(inv._id, inv.invoiceNumber)}
                            title="Delete Invoice"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
