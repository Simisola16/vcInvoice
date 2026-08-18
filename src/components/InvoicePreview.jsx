import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download, 
  Printer, 
  Loader2,
  Calendar,
  Building,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

export default function InvoicePreview({ invoice, onDownloadPdf, isGeneratingPdf }) {
  const [zoom, setZoom] = useState(0.85);

  const {
    invoiceNumber = 'VC-INV-0001',
    title = 'INVOICE',
    status = 'pending',
    issueDate = '',
    dueDate = '',
    poNumber = '',
    client = {},
    sender = {},
    currency = { code: 'NGN', symbol: '₦' },
    items = [],
    pricing = {},
    paymentDetails = {},
    signature = {}
  } = invoice || {};

  const symbol = currency?.symbol || '₦';
  const subtotal = pricing?.subtotal || 0;
  const discountAmount = pricing?.discountAmount || 0;
  const taxRate = pricing?.taxRate || 0;
  const taxAmount = pricing?.taxAmount || 0;
  const shipping = pricing?.shipping || 0;
  const deposit = pricing?.deposit || 0;
  const total = pricing?.total || 0;
  const balanceDue = pricing?.balanceDue || total;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="preview-sticky-wrapper">
      {/* Top Toolbar */}
      <div className="preview-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--color-text-main)' }}>
            Invoice Preview
          </span>
          <span className="badge badge-paid" style={{ fontSize: '9.5px' }}>Official</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Zoom controls (desktop only) */}
          <div className="hide-on-xs" style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: '2px 4px' }}>
            <button 
              className="btn-icon" 
              style={{ border: 'none', background: 'transparent', padding: '3px', minWidth: '26px', minHeight: '26px' }}
              onClick={() => setZoom(prev => Math.max(0.4, prev - 0.1))}
              title="Zoom out"
            >
              <ZoomOut size={13} />
            </button>
            <span style={{ fontSize: '11px', fontWeight: '600', padding: '0 4px' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button 
              className="btn-icon" 
              style={{ border: 'none', background: 'transparent', padding: '3px', minWidth: '26px', minHeight: '26px' }}
              onClick={() => setZoom(prev => Math.min(1.2, prev + 0.1))}
              title="Zoom in"
            >
              <ZoomIn size={13} />
            </button>
            <button 
              className="btn-icon" 
              style={{ border: 'none', background: 'transparent', padding: '3px', minWidth: '26px', minHeight: '26px' }}
              onClick={() => setZoom(0.85)}
              title="Fit Screen"
            >
              <Maximize2 size={12} />
            </button>
          </div>

          {/* Print button */}
          <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print Invoice">
            <Printer size={13} />
            <span>Print</span>
          </button>

          {/* Puppeteer PDF Download */}
          <button 
            className="btn btn-primary btn-sm" 
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            title="Download Official PDF"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>PDF...</span>
              </>
            ) : (
              <>
                <Download size={13} />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          📱 1. MOBILE RESPONSIVE DOCUMENT CARD (<= 768px)
          ======================================================== */}
      <div className="mobile-doc-view">
        {/* Brand Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <img 
            src="/logo.png" 
            alt="Village Coders" 
            style={{ height: '90px', maxWidth: '260px', objectFit: 'contain' }} 
          />
          <div style={{ textAlign: 'right', fontSize: '10.5px', color: '#475569', lineHeight: 1.35 }}>
            <div style={{ fontWeight: '700', color: '#0f172a' }}>Village Coders</div>
            <div>villagecoders7@gmail.com</div>
            <div>+234 808 5742 261</div>
          </div>
        </div>

        {/* Gradient Line */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #1097a8 0%, #15b0c4 60%, #44cadc 100%)', borderRadius: '2px', marginBottom: '14px' }} />

        {/* Invoice Title & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
              {title || 'INVOICE'}
            </h2>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#028090', marginTop: '2px' }}>
              #{invoiceNumber}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className={`badge badge-${status.toLowerCase()}`}>
              {status.toUpperCase()}
            </span>
            {poNumber && <div style={{ fontSize: '10px', color: '#64748b', marginTop: '3px' }}>PO: {poNumber}</div>}
          </div>
        </div>

        {/* Client & Dates Info Card */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: '#028090', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Billed To:
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
            {client?.name || 'Valued Client'}
          </div>
          {client?.company && <div style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>{client.company}</div>}
          {client?.address && <div style={{ fontSize: '11px', color: '#475569' }}>{client.address}{client.city ? `, ${client.city}` : ''}</div>}
          {client?.email && <div style={{ fontSize: '11px', color: '#475569' }}>{client.email}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1', fontSize: '11px' }}>
            <div>
              <span style={{ color: '#64748b' }}>Issue Date: </span>
              <strong>{formatDate(issueDate)}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Due Date: </span>
              <strong>{formatDate(dueDate) || 'On Receipt'}</strong>
            </div>
          </div>
        </div>

        {/* Line Items List */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>
            Services & Items:
          </div>
          {items && items.map((it, idx) => (
            <div key={it.id || idx} style={{ borderBottom: '1px solid #f1f5f9', padding: '8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, paddingRight: '8px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{it.description || 'Service'}</div>
                  {it.details && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>{it.details}</div>}
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {it.quantity || 1} &times; {formatCurrency(it.rate)}
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap' }}>
                  {formatCurrency(it.amount || ((it.quantity || 1) * (it.rate || 0)))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Breakdown */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '11.5px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b' }}>Subtotal:</span>
            <span style={{ fontWeight: '600' }}>{formatCurrency(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '11.5px', borderBottom: '1px solid #f1f5f9', color: '#16a34a' }}>
              <span>Discount ({pricing.discountValue}%):</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          {taxAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '11.5px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Tax ({taxRate}%):</span>
              <span>+{formatCurrency(taxAmount)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', fontSize: '13px', fontWeight: '700', borderBottom: '1px solid #cbd5e1' }}>
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', color: '#ffffff', padding: '10px 12px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#38bdf8' }}>Balance Due</span>
            <span style={{ fontSize: '17px', fontWeight: '800' }}>{formatCurrency(balanceDue)}</span>
          </div>
        </div>

        {/* Payment Instructions */}
        {paymentDetails?.bankName && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', fontSize: '11px' }}>
            <div style={{ fontWeight: '700', color: '#028090', textTransform: 'uppercase', marginBottom: '4px' }}>Bank Payment:</div>
            <div>Bank: <strong>{paymentDetails.bankName}</strong></div>
            <div>Account: <strong>{paymentDetails.accountNumber}</strong> ({paymentDetails.accountName})</div>
            {paymentDetails?.paymentTerms && <div style={{ marginTop: '4px', color: '#64748b' }}>Terms: {paymentDetails.paymentTerms}</div>}
          </div>
        )}

        {/* Signature */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#64748b' }}>Authorized By:</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>{signature?.signerName || 'Village Coders Ltd'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: '20px', color: '#0f172a' }}>
              {signature?.type === 'drawn' && signature.value ? (
                <img src={signature.value} alt="Sig" style={{ height: '24px' }} />
              ) : (
                signature?.value || 'Village Coders'
              )}
            </div>
          </div>
        </div>

        {/* Big Action Button for Mobile */}
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '16px', padding: '11px', fontSize: '14px' }}
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          <span>Download Official PDF ({invoiceNumber})</span>
        </button>
      </div>

      {/* ========================================================
          💻 2. DESKTOP A4 LETTERHEAD VIEWPORT (> 768px)
          ======================================================== */}
      <div className="preview-a4-viewport desktop-a4-viewport">
        <div 
          className="a4-sheet"
          style={{
            transform: `scale(${zoom})`,
            marginBottom: `${(zoom - 1) * 1123}px`
          }}
        >
          {/* Watermark */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '560px',
            opacity: 0.06,
            pointerEvents: 'none',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/logo.png" 
              alt="Watermark" 
              style={{ width: '500px', height: 'auto', objectFit: 'contain' }} 
            />
          </div>

          {/* Letterhead Header */}
          <div style={{ position: 'relative', zIndex: 10, padding: '20px 40px 10px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img 
                  src="/logo.png" 
                  alt="Village Coders" 
                  style={{ height: '125px', maxWidth: '380px', objectFit: 'contain' }} 
                />
              </div>

              <div style={{ width: '2px', height: '88px', backgroundColor: '#8c725c', margin: '0 12px', borderRadius: '2px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px', color: '#2d3748', fontWeight: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📍</span>
                  <span>{sender?.address || 'Fully Remote | Operating Worldwide'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📞</span>
                  <span>{sender?.phone || '+234 808 5742 261'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✉️</span>
                  <span>{sender?.email || 'villagecoders7@gmail.com'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🌐</span>
                  <span>{sender?.website || 'villagecoders.io'}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '14px', height: '3.5px', background: 'linear-gradient(90deg, #1097a8 0%, #15b0c4 60%, #44cadc 100%)', borderRadius: '2px', width: '100%' }} />
          </div>

          {/* Invoice Body Content */}
          <div style={{ position: 'relative', zIndex: 10, padding: '6px 40px 22px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* Meta Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.6px', lineHeight: 1 }}>
                  {title || 'INVOICE'}
                </h1>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#028090', letterSpacing: '0.5px' }}>
                  # {invoiceNumber}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <span className={`badge badge-${status.toLowerCase()}`} style={{ fontSize: '10.5px', padding: '3px 12px' }}>
                  {status.toUpperCase()}
                </span>
                {poNumber && <span style={{ fontSize: '10.5px', color: '#64748b' }}>PO: <strong>{poNumber}</strong></span>}
              </div>
            </div>

            {/* Billed To & Invoice Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 18px' }}>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#028090', marginBottom: '5px' }}>
                  Billed To:
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                  {client?.name || 'Valued Client'}
                </div>
                {client?.company && <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '3px' }}>{client.company}</div>}
                {client?.address && <div style={{ fontSize: '11px', color: '#475569' }}>{client.address}{client.city ? `, ${client.city}` : ''}</div>}
                {client?.email && <div style={{ fontSize: '11px', color: '#475569' }}>Email: {client.email}</div>}
                {client?.phone && <div style={{ fontSize: '11px', color: '#475569' }}>Phone: {client.phone}</div>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#028090', marginBottom: '2px' }}>
                  Invoice Details:
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: '#64748b' }}>Issue Date:</span>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{formatDate(issueDate)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: '#64748b' }}>Due Date:</span>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{formatDate(dueDate) || 'On Receipt'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: '#64748b' }}>Currency:</span>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{currency?.code} ({currency?.symbol})</span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div style={{ marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                    <th style={{ width: '30px', textAlign: 'center', padding: '8px 10px', fontSize: '10px', fontFamily: "'Outfit', sans-serif", borderTopLeftRadius: '6px' }}>#</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: '10px', fontFamily: "'Outfit', sans-serif" }}>Item & Description</th>
                    <th style={{ width: '55px', textAlign: 'center', padding: '8px 10px', fontSize: '10px', fontFamily: "'Outfit', sans-serif" }}>Qty</th>
                    <th style={{ width: '100px', textAlign: 'right', padding: '8px 12px', fontSize: '10px', fontFamily: "'Outfit', sans-serif" }}>Price</th>
                    <th style={{ width: '110px', textAlign: 'right', padding: '8px 12px', fontSize: '10px', fontFamily: "'Outfit', sans-serif", borderTopRightRadius: '6px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items && items.length > 0 ? (
                    items.map((it, idx) => (
                      <tr key={it.id || idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 1 ? '#fafbfc' : 'transparent' }}>
                        <td style={{ textAlign: 'center', padding: '8px 10px', fontSize: '10.5px', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <div style={{ fontWeight: 600, fontSize: '11.5px', color: '#0f172a' }}>{it.description || 'Service'}</div>
                          {it.details && <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', whiteSpace: 'pre-line' }}>{it.details}</div>}
                        </td>
                        <td style={{ textAlign: 'center', padding: '8px 10px', fontSize: '11.5px', fontWeight: 600, color: '#334155' }}>{it.quantity || 1}</td>
                        <td style={{ textAlign: 'right', padding: '8px 12px', fontSize: '11.5px', color: '#334155' }}>{formatCurrency(it.rate)}</td>
                        <td style={{ textAlign: 'right', padding: '8px 12px', fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>
                          {formatCurrency(it.amount || ((it.quantity || 1) * (it.rate || 0)))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '16px', fontSize: '11px' }}>
                        No items added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Split: Payment Info vs Totals */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '20px', alignItems: 'start' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#028090', marginBottom: '8px' }}>
                  Payment Instructions
                </div>
                {paymentDetails?.bankName && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Bank Name:</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{paymentDetails.bankName}</span>
                  </div>
                )}
                {paymentDetails?.accountName && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Account Name:</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{paymentDetails.accountName}</span>
                  </div>
                )}
                {paymentDetails?.accountNumber && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Account Number:</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{paymentDetails.accountNumber}</span>
                  </div>
                )}
                {paymentDetails?.paymentTerms && (
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1', fontSize: '10px', color: '#475569', lineHeight: 1.35 }}>
                    <strong>Terms:</strong> {paymentDetails.paymentTerms}
                  </div>
                )}
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 14px', fontSize: '11px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b' }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 14px', fontSize: '11px', borderBottom: '1px solid #f1f5f9', color: '#16a34a' }}>
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                {taxAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 14px', fontSize: '11px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Tax / VAT ({taxRate}%)</span>
                    <span style={{ fontWeight: 600 }}>+{formatCurrency(taxAmount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', fontSize: '12px', fontWeight: 700, background: '#f8fafc', borderBottom: '1px solid #cbd5e1', borderTop: '1px solid #cbd5e1' }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", color: '#0f172a' }}>Total</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", color: '#0f172a' }}>{formatCurrency(total)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', color: '#ffffff', padding: '10px 14px' }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#38bdf8' }}>
                    Balance Due
                  </span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                    {formatCurrency(balanceDue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Closing & Signature */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ maxWidth: '320px' }}>
                {paymentDetails?.notes && (
                  <div>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '2px' }}>Remarks:</div>
                    <div style={{ fontSize: '10.5px', color: '#475569', fontStyle: 'italic', lineHeight: 1.35 }}>{paymentDetails.notes}</div>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center', minWidth: '160px' }}>
                <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {signature?.type === 'drawn' && signature.value ? (
                    <img src={signature.value} alt="Signature" style={{ maxHeight: '34px', maxWidth: '140px' }} />
                  ) : (
                    <span style={{ fontFamily: "'Caveat', cursive", fontSize: '22px', color: '#0f172a' }}>
                      {signature?.value || 'Village Coders'}
                    </span>
                  )}
                </div>
                <div style={{ width: '100%', height: '1px', background: '#94a3b8', margin: '4px 0' }} />
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#1e293b' }}>{signature?.signerName || 'Authorized Signatory'}</div>
                <div style={{ fontSize: '9px', color: '#64748b' }}>{signature?.date ? `Signed: ${formatDate(signature.date)}` : 'Village Coders Ltd'}</div>
              </div>
            </div>

          </div>

          {/* Footer Strip */}
          <div style={{ position: 'relative', zIndex: 10, background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '8px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#64748b' }}>
            <div>Village Coders &bull; Web & Software Developers</div>
            <div>Questions? <strong style={{ color: '#028090' }}>villagecoders7@gmail.com</strong></div>
            <div>Page 1 of 1</div>
          </div>

        </div>
      </div>
    </div>
  );
}
