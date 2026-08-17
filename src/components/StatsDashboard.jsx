import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

export default function StatsDashboard({ onEditInvoice, onNewInvoice, showToast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--color-primary)' }} />
        <p style={{ fontWeight: '600' }}>Loading live analytics & financial summaries...</p>
      </div>
    );
  }

  const {
    totalInvoiced = 0,
    totalPaid = 0,
    totalPending = 0,
    totalOverdue = 0,
    counts = {},
    recentInvoices = []
  } = stats || {};

  const collectionRate = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;

  return (
    <div className="stats-dashboard-wrap">
      {/* Header */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Financial Overview & Insights</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Real-time revenue metrics, collection status, and invoice pipeline.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchStats}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Stats</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-grid">
        {/* Total Invoiced */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #028090, #00a896)' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Invoiced</span>
            <span className="stat-value">${totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Across {counts.all || 0} total invoices
            </span>
          </div>
        </div>

        {/* Total Paid */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Collected</span>
            <span className="stat-value" style={{ color: 'var(--color-success)' }}>
              ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: '600', marginTop: '2px' }}>
              {collectionRate}% collection rate
            </span>
          </div>
        </div>

        {/* Total Pending */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Invoices</span>
            <span className="stat-value" style={{ color: 'var(--color-warning)' }}>
              ${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {counts.pending || 0} awaiting payment
            </span>
          </div>
        </div>

        {/* Total Overdue */}
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Overdue Balance</span>
            <span className="stat-value" style={{ color: 'var(--color-danger)' }}>
              ${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-danger)', fontWeight: '600', marginTop: '2px' }}>
              {counts.overdue || 0} overdue invoices
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', marginBottom: '24px' }}>
        {/* Status Distribution */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '18px' }}>
            <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Status Distribution</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '5px' }}>
                <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>Paid ({counts.paid || 0})</span>
                <span style={{ fontWeight: '700' }}>
                  {counts.all > 0 ? Math.round(((counts.paid || 0) / counts.all) * 100) : 0}%
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${counts.all > 0 ? ((counts.paid || 0) / counts.all) * 100 : 0}%`, height: '100%', background: 'var(--color-success)', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '5px' }}>
                <span style={{ fontWeight: '600', color: 'var(--color-warning)' }}>Pending ({counts.pending || 0})</span>
                <span style={{ fontWeight: '700' }}>
                  {counts.all > 0 ? Math.round(((counts.pending || 0) / counts.all) * 100) : 0}%
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${counts.all > 0 ? ((counts.pending || 0) / counts.all) * 100 : 0}%`, height: '100%', background: 'var(--color-warning)', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '5px' }}>
                <span style={{ fontWeight: '600', color: 'var(--color-danger)' }}>Overdue ({counts.overdue || 0})</span>
                <span style={{ fontWeight: '700' }}>
                  {counts.all > 0 ? Math.round(((counts.overdue || 0) / counts.all) * 100) : 0}%
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${counts.all > 0 ? ((counts.overdue || 0) / counts.all) * 100 : 0}%`, height: '100%', background: 'var(--color-danger)', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '5px' }}>
                <span style={{ fontWeight: '600', color: 'var(--color-text-muted)' }}>Draft ({counts.draft || 0})</span>
                <span style={{ fontWeight: '700' }}>
                  {counts.all > 0 ? Math.round(((counts.draft || 0) / counts.all) * 100) : 0}%
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${counts.all > 0 ? ((counts.draft || 0) / counts.all) * 100 : 0}%`, height: '100%', background: 'var(--color-text-subtle)', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FileText size={18} style={{ color: 'var(--color-primary)' }} />
              <span>Recent Activity</span>
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={onNewInvoice}>
              + Create Invoice
            </button>
          </div>

          {recentInvoices.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              No recent activity recorded yet.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map(inv => (
                    <tr 
                      key={inv._id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => onEditInvoice(inv)}
                    >
                      <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{inv.invoiceNumber}</td>
                      <td>{inv.client?.name || 'N/A'}</td>
                      <td style={{ fontWeight: '700' }}>
                        {inv.currency?.symbol || '$'}{(inv.pricing?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`badge badge-${inv.status.toLowerCase()}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
