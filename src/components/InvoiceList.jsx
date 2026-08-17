import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Edit3, 
  Trash2, 
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
      <div className="card" style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Invoices History</h2>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Manage, edit, filter and download invoices saved in MongoDB Atlas.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={fetchInvoices} title="Refresh list">
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button className="btn btn-primary btn-sm" onClick={onNewInvoice}>
              <Plus size={14} />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client, invoice #..."
            />
          </form>

          <div className="nav-tabs" style={{ background: 'var(--color-bg-subtle)', overflowX: 'auto' }}>
            {['all', 'paid', 'pending', 'overdue', 'draft'].map((st) => (
              <button
                key={st}
                className={`nav-tab-btn ${statusFilter === st ? 'active' : ''}`}
                style={{ textTransform: 'capitalize', padding: '5px 12px', fontSize: '12px' }}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices List View */}
      {loading ? (
        <div className="card" style={{ padding: '50px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto 10px auto', color: 'var(--color-primary)' }} />
          <p style={{ fontWeight: '600', fontSize: '13px' }}>Loading invoices from database...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="card" style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: 'var(--color-text-subtle)' }}>
            <FileText size={24} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>No invoices found</h3>
          <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', maxWidth: '380px', margin: '0 auto 14px auto' }}>
            {search || statusFilter !== 'all' 
              ? 'No invoices match your filters. Try clearing search.'
              : 'Create your first invoice in the Invoice Builder!'}
          </p>
          <button className="btn btn-primary btn-sm" onClick={onNewInvoice}>
            <Plus size={14} />
            <span>Create Invoice</span>
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="card desktop-invoices-table" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Issue Date</th>
                    <th>Total</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const symbol = inv.currency?.symbol || '₦';
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
                          <div style={{ fontWeight: '600' }}>{inv.client?.name || 'N/A'}</div>
                          {inv.client?.company && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{inv.client.company}</div>}
                        </td>
                        <td>{formatDate(inv.issueDate)}</td>
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
                            style={{ padding: '3px 8px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', width: 'auto', minHeight: '30px' }}
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
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            <button className="btn-icon" onClick={() => onPreviewInvoice(inv)} title="Preview"><Eye size={13} /></button>
                            <button className="btn-icon" onClick={() => onEditInvoice(inv)} title="Edit"><Edit3 size={13} /></button>
                            <button className="btn-icon" style={{ color: 'var(--color-primary)' }} onClick={() => handleDownloadPdf(inv)} disabled={isDownloading} title="Download PDF">
                              {isDownloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                            </button>
                            <button className="btn-icon" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(inv._id, inv.invoiceNumber)} title="Delete"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-invoices-list">
            {invoices.map((inv) => {
              const symbol = inv.currency?.symbol || '₦';
              const total = inv.pricing?.total || 0;
              const balance = inv.pricing?.balanceDue || 0;
              const isDownloading = downloadingId === inv._id;

              return (
                <div key={inv._id} className="mobile-invoice-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
                        {inv.invoiceNumber}
                      </span>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)', marginTop: '2px' }}>
                        {inv.client?.name || 'Valued Client'}
                      </div>
                      {inv.client?.company && (
                        <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>{inv.client.company}</div>
                      )}
                    </div>

                    <select
                      className="form-select"
                      style={{ padding: '3px 8px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', width: 'auto', minHeight: '28px' }}
                      value={inv.status}
                      onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', margin: '10px 0' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Total Amount</div>
                      <div style={{ fontSize: '13.5px', fontWeight: '800' }}>
                        {symbol}{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Balance Due</div>
                      <div style={{ fontSize: '13.5px', fontWeight: '800', color: balance > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                        {symbol}{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                      Date: {formatDate(inv.issueDate)}
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => onEditInvoice(inv)}>
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleDownloadPdf(inv)} disabled={isDownloading}>
                        {isDownloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                        <span>PDF</span>
                      </button>
                      <button className="btn-icon btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(inv._id, inv.invoiceNumber)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
