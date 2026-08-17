import React from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Save, 
  Download, 
  Sparkles, 
  RotateCcw, 
  User, 
  DollarSign, 
  CreditCard, 
  PenTool, 
  FileText,
  Percent,
  Loader2
} from 'lucide-react';
import { CURRENCIES } from '../utils/presets';

export default function InvoiceEditor({
  invoice,
  onChange,
  onSave,
  onDownloadPdf,
  onOpenPresets,
  onOpenSignature,
  onReset,
  isSaving,
  isGeneratingPdf
}) {
  const updateField = (field, val) => {
    onChange({ ...invoice, [field]: val });
  };

  const updateClient = (field, val) => {
    onChange({
      ...invoice,
      client: { ...invoice.client, [field]: val }
    });
  };

  const updatePayment = (field, val) => {
    onChange({
      ...invoice,
      paymentDetails: { ...invoice.paymentDetails, [field]: val }
    });
  };

  const updatePricing = (field, val) => {
    const newPricing = { ...invoice.pricing, [field]: val };
    recalcPricing(invoice.items, newPricing);
  };

  const recalcPricing = (items = invoice.items, pricingConfig = invoice.pricing) => {
    let subtotal = 0;
    const updatedItems = items.map(item => {
      const q = Number(item.quantity) || 0;
      const r = Number(item.rate) || 0;
      const amount = q * r;
      subtotal += amount;
      return { ...item, amount };
    });

    const discountVal = Number(pricingConfig.discountValue) || 0;
    let discountAmount = 0;
    if (pricingConfig.discountType === 'percent') {
      discountAmount = (subtotal * discountVal) / 100;
    } else {
      discountAmount = discountVal;
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxRate = Number(pricingConfig.taxRate) || 0;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const shipping = Number(pricingConfig.shipping) || 0;
    const total = taxableAmount + taxAmount + shipping;
    const deposit = Number(pricingConfig.deposit) || 0;
    const balanceDue = Math.max(0, total - deposit);

    onChange({
      ...invoice,
      items: updatedItems,
      pricing: {
        ...pricingConfig,
        subtotal: Number(subtotal.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        total: Number(total.toFixed(2)),
        balanceDue: Number(balanceDue.toFixed(2))
      }
    });
  };

  const handleItemChange = (index, field, val) => {
    const updated = [...invoice.items];
    updated[index] = { ...updated[index], [field]: val };
    recalcPricing(updated, invoice.pricing);
  };

  const addItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      description: '',
      details: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    recalcPricing([...invoice.items, newItem], invoice.pricing);
  };

  const removeItem = (index) => {
    const updated = invoice.items.filter((_, idx) => idx !== index);
    recalcPricing(updated, invoice.pricing);
  };

  const duplicateItem = (index) => {
    const itemToClone = invoice.items[index];
    const cloned = { ...itemToClone, id: `item-${Date.now()}` };
    const updated = [...invoice.items];
    updated.splice(index + 1, 0, cloned);
    recalcPricing(updated, invoice.pricing);
  };

  const handleCurrencyChange = (currencyCode) => {
    const found = CURRENCIES.find(c => c.code === currencyCode);
    if (found) {
      updateField('currency', found);
    }
  };

  const symbol = invoice.currency?.symbol || '₦';

  return (
    <div className="invoice-editor-wrap">
      {/* Top Action Bar */}
      <div className="card" style={{ marginBottom: '16px', padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-primary)' }}>
              Village Coders Studio
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>
              {invoice._id ? `Edit ${invoice.invoiceNumber}` : 'Create Invoice'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={onReset} title="Reset Form">
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onOpenPresets} title="Load Template Preset">
              <Sparkles size={13} style={{ color: 'var(--color-accent)' }} />
              <span>Presets</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              title="Download Puppeteer PDF"
            >
              {isGeneratingPdf ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              <span>PDF</span>
            </button>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              <span>{invoice._id ? 'Update' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. General Invoice Details */}
      <div className="form-section-card">
        <div className="section-title">
          <FileText size={16} style={{ color: 'var(--color-primary)' }} />
          <span>1. Invoice Information</span>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Invoice Number</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.invoiceNumber}
              onChange={(e) => updateField('invoiceNumber', e.target.value)}
              placeholder="e.g. VC-2026-0001"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Invoice Title</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. INVOICE"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              className="form-select"
              value={invoice.status}
              onChange={(e) => updateField('status', e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Issue Date</label>
            <input 
              type="date" 
              className="form-input"
              value={invoice.issueDate}
              onChange={(e) => updateField('issueDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input 
              type="date" 
              className="form-input"
              value={invoice.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Currency</label>
            <select 
              className="form-select"
              value={invoice.currency?.code || 'NGN'}
              onChange={(e) => handleCurrencyChange(e.target.value)}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">PO / Reference (Optional)</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.poNumber}
              onChange={(e) => updateField('poNumber', e.target.value)}
              placeholder="e.g. PO-84920"
            />
          </div>
        </div>
      </div>

      {/* 2. Client Details */}
      <div className="form-section-card">
        <div className="section-title">
          <User size={16} style={{ color: 'var(--color-primary)' }} />
          <span>2. Client Details (Billed To)</span>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.client?.name || ''}
              onChange={(e) => updateClient('name', e.target.value)}
              placeholder="e.g. Alex Morgan"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.client?.company || ''}
              onChange={(e) => updateClient('company', e.target.value)}
              placeholder="e.g. Acme Innovations Ltd"
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input"
              value={invoice.client?.email || ''}
              onChange={(e) => updateClient('email', e.target.value)}
              placeholder="e.g. billing@acme.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.client?.phone || ''}
              onChange={(e) => updateClient('phone', e.target.value)}
              placeholder="e.g. +234 802 345 6789"
            />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Address</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.client?.address || ''}
              onChange={(e) => updateClient('address', e.target.value)}
              placeholder="e.g. 14 Admiralty Way"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">City / State</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.client?.city || ''}
              onChange={(e) => updateClient('city', e.target.value)}
              placeholder="e.g. Lagos"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Tax / TIN ID</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.client?.taxId || ''}
              onChange={(e) => updateClient('taxId', e.target.value)}
              placeholder="e.g. TIN-12345678"
            />
          </div>
        </div>
      </div>

      {/* 3. Line Items (Desktop Table + Mobile Cards) */}
      <div className="form-section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div className="section-title" style={{ margin: 0 }}>
            <DollarSign size={16} style={{ color: 'var(--color-primary)' }} />
            <span>3. Line Items ({invoice.items?.length || 0})</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={addItem}>
            <Plus size={13} />
            <span>Add Item</span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="table-responsive desktop-table-view">
          <table className="items-form-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Item & Description</th>
                <th style={{ width: '15%' }}>Qty</th>
                <th style={{ width: '20%' }}>Unit Price ({symbol})</th>
                <th style={{ width: '15%' }}>Amount</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items && invoice.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>
                    <input 
                      type="text"
                      className="form-input"
                      style={{ fontWeight: '600', marginBottom: '5px' }}
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      placeholder="Service / Item Name"
                    />
                    <textarea 
                      className="form-textarea"
                      style={{ minHeight: '45px', fontSize: '11.5px' }}
                      value={item.details}
                      onChange={(e) => handleItemChange(idx, 'details', e.target.value)}
                      placeholder="Scope, specifications, or notes"
                    />
                  </td>
                  <td>
                    <input 
                      type="number"
                      min="0"
                      step="any"
                      className="form-input"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number"
                      min="0"
                      step="any"
                      className="form-input"
                      value={item.rate}
                      onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                    />
                  </td>
                  <td style={{ verticalAlign: 'middle', fontWeight: '700', fontSize: '13px', color: 'var(--color-text-main)' }}>
                    {symbol}{Number(item.amount || (item.quantity * item.rate)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button className="btn-icon" onClick={() => duplicateItem(idx)} title="Duplicate">
                        <Copy size={12} />
                      </button>
                      <button className="btn-icon" style={{ color: 'var(--color-danger)' }} onClick={() => removeItem(idx)} title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Item Cards View */}
        <div>
          {invoice.items && invoice.items.map((item, idx) => (
            <div key={item.id || idx} className="mobile-item-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)' }}>Item #{idx + 1}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn-icon btn-sm" onClick={() => duplicateItem(idx)}><Copy size={12} /></button>
                  <button className="btn-icon btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => removeItem(idx)}><Trash2 size={12} /></button>
                </div>
              </div>

              <div className="form-group">
                <input 
                  type="text"
                  className="form-input"
                  style={{ fontWeight: '600' }}
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  placeholder="Item / Service Name"
                />
              </div>

              <div className="form-group">
                <textarea 
                  className="form-textarea"
                  style={{ minHeight: '40px', fontSize: '12px' }}
                  value={item.details}
                  onChange={(e) => handleItemChange(idx, 'details', e.target.value)}
                  placeholder="Details (optional)"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Qty</label>
                  <input 
                    type="number"
                    min="0"
                    step="any"
                    className="form-input"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Rate ({symbol})</label>
                  <input 
                    type="number"
                    min="0"
                    step="any"
                    className="form-input"
                    value={item.rate}
                    onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed var(--color-border)' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: '600' }}>Item Total:</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-main)' }}>
                  {symbol}{Number(item.amount || (item.quantity * item.rate)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', marginTop: '10px', borderStyle: 'dashed' }}
          onClick={addItem}
        >
          <Plus size={14} />
          <span>Add Another Line Item</span>
        </button>
      </div>

      {/* 4. Pricing / Calculations */}
      <div className="form-section-card">
        <div className="section-title">
          <Percent size={16} style={{ color: 'var(--color-primary)' }} />
          <span>4. Discounts & Adjustments</span>
        </div>

        <div className="grid-4">
          <div className="form-group">
            <label className="form-label">Discount Type</label>
            <select 
              className="form-select"
              value={invoice.pricing?.discountType || 'percent'}
              onChange={(e) => updatePricing('discountType', e.target.value)}
            >
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed ({symbol})</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Discount Value</label>
            <input 
              type="number"
              min="0"
              step="any"
              className="form-input"
              value={invoice.pricing?.discountValue || 0}
              onChange={(e) => updatePricing('discountValue', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tax Rate (%)</label>
            <input 
              type="number"
              min="0"
              step="any"
              className="form-input"
              value={invoice.pricing?.taxRate || 0}
              onChange={(e) => updatePricing('taxRate', e.target.value)}
              placeholder="e.g. 7.5"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Extra Fee ({symbol})</label>
            <input 
              type="number"
              min="0"
              step="any"
              className="form-input"
              value={invoice.pricing?.shipping || 0}
              onChange={(e) => updatePricing('shipping', e.target.value)}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Deposit / Paid Advance ({symbol})</label>
            <input 
              type="number"
              min="0"
              step="any"
              className="form-input"
              value={invoice.pricing?.deposit || 0}
              onChange={(e) => updatePricing('deposit', e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: '600' }}>TOTAL</div>
              <div style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
                {symbol}{Number(invoice.pricing?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: '700' }}>BALANCE DUE</div>
              <div style={{ fontSize: '17px', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                {symbol}{Number(invoice.pricing?.balanceDue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Payment Details */}
      <div className="form-section-card">
        <div className="section-title">
          <CreditCard size={16} style={{ color: 'var(--color-primary)' }} />
          <span>5. Payment Instructions</span>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Bank Name</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.paymentDetails?.bankName || ''}
              onChange={(e) => updatePayment('bankName', e.target.value)}
              placeholder="e.g. Access Bank"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Name</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.paymentDetails?.accountName || ''}
              onChange={(e) => updatePayment('accountName', e.target.value)}
              placeholder="e.g. Village Coders Ltd"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Number</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.paymentDetails?.accountNumber || ''}
              onChange={(e) => updatePayment('accountNumber', e.target.value)}
              placeholder="e.g. 0123456789"
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Payment Terms</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.paymentDetails?.paymentTerms || ''}
              onChange={(e) => updatePayment('paymentTerms', e.target.value)}
              placeholder="e.g. Due within 14 days"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Notes to Client</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.paymentDetails?.notes || ''}
              onChange={(e) => updatePayment('notes', e.target.value)}
              placeholder="e.g. Thank you for your business!"
            />
          </div>
        </div>
      </div>

      {/* 6. Signature */}
      <div className="form-section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-title" style={{ margin: 0 }}>
            <PenTool size={16} style={{ color: 'var(--color-primary)' }} />
            <span>6. Digital Signature</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onOpenSignature}>
            <PenTool size={12} />
            <span>Edit Signature</span>
          </button>
        </div>

        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-bg-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              fontFamily: invoice.signature?.type === 'typed' ? 'Caveat, cursive' : 'inherit',
              fontSize: invoice.signature?.type === 'typed' ? '22px' : '13px',
              color: 'var(--color-text-main)'
            }}>
              {invoice.signature?.type === 'drawn' && invoice.signature?.value ? (
                <img src={invoice.signature.value} alt="Sig" style={{ height: '30px' }} />
              ) : (
                invoice.signature?.value || 'Village Coders Management'
              )}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              ({invoice.signature?.signerName || 'Village Coders Ltd'})
            </div>
          </div>

          <span className="badge badge-paid" style={{ fontSize: '9.5px' }}>
            Signed
          </span>
        </div>
      </div>
    </div>
  );
}
