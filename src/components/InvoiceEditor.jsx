import React from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Save, 
  Download, 
  Sparkles, 
  RotateCcw, 
  Calendar, 
  User, 
  DollarSign, 
  CreditCard, 
  PenTool, 
  FileText,
  Percent,
  Hash,
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
  // Update invoice top-level field
  const updateField = (field, val) => {
    onChange({ ...invoice, [field]: val });
  };

  // Update nested client field
  const updateClient = (field, val) => {
    onChange({
      ...invoice,
      client: { ...invoice.client, [field]: val }
    });
  };

  // Update nested paymentDetails field
  const updatePayment = (field, val) => {
    onChange({
      ...invoice,
      paymentDetails: { ...invoice.paymentDetails, [field]: val }
    });
  };

  // Update nested pricing field and recalculate totals
  const updatePricing = (field, val) => {
    const newPricing = { ...invoice.pricing, [field]: val };
    recalcPricing(invoice.items, newPricing);
  };

  // Recalculate all amounts
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

  // Item helpers
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

  return (
    <div className="invoice-editor-wrap">
      {/* Top Action Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-primary)' }}>
              Village Coders Studio
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
              {invoice._id ? `Edit Invoice (${invoice.invoiceNumber})` : 'Create New Invoice'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={onReset} title="Reset Form to Defaults">
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onOpenPresets} title="Load Template Preset">
              <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
              <span>Presets</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              title="Download Puppeteer PDF"
            >
              {isGeneratingPdf ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              <span>Puppeteer PDF</span>
            </button>
            <button 
              className="btn btn-primary" 
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              <span>{invoice._id ? 'Update in Database' : 'Save to Database'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. General Invoice Details */}
      <div className="form-section-card">
        <div className="section-title">
          <FileText size={17} style={{ color: 'var(--color-primary)' }} />
          <span>1. Invoice Information</span>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Invoice Number</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-input"
                value={invoice.invoiceNumber}
                onChange={(e) => updateField('invoiceNumber', e.target.value)}
                placeholder="e.g. VC-2026-0001"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Invoice Title / Header</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. INVOICE / SERVICES INVOICE"
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
            <label className="form-label">Payment Due Date</label>
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
              value={invoice.currency?.code || 'USD'}
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
            <label className="form-label">PO / Reference Number (Optional)</label>
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

      {/* 2. Client / Billed To */}
      <div className="form-section-card">
        <div className="section-title">
          <User size={17} style={{ color: 'var(--color-primary)' }} />
          <span>2. Client Details (Billed To)</span>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Client Name / Contact Person *</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.client?.name || ''}
              onChange={(e) => updateClient('name', e.target.value)}
              placeholder="e.g. Alex Morgan"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Client Company Name</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.client?.company || ''}
              onChange={(e) => updateClient('company', e.target.value)}
              placeholder="e.g. Acme Innovations Corp"
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Client Email Address</label>
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
              placeholder="e.g. +1 555 123 4567"
            />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Street Address</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.client?.address || ''}
              onChange={(e) => updateClient('address', e.target.value)}
              placeholder="e.g. 100 Tech Blvd, Suite 400"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">City, State / Zip</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.client?.city || ''}
              onChange={(e) => updateClient('city', e.target.value)}
              placeholder="e.g. New York, NY 10001"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Tax / VAT ID (Optional)</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.client?.taxId || ''}
              onChange={(e) => updateClient('taxId', e.target.value)}
              placeholder="e.g. US-EIN-12345678"
            />
          </div>
        </div>
      </div>

      {/* 3. Line Items */}
      <div className="form-section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="section-title" style={{ margin: 0 }}>
            <DollarSign size={17} style={{ color: 'var(--color-primary)' }} />
            <span>3. Line Items & Services</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={addItem}>
            <Plus size={14} />
            <span>Add Item</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="items-form-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Item & Description</th>
                <th style={{ width: '15%' }}>Qty</th>
                <th style={{ width: '20%' }}>Unit Price ({invoice.currency?.symbol})</th>
                <th style={{ width: '15%' }}>Amount</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items && invoice.items.map((item, idx) => (
                <tr key={item.id || idx} className="item-row">
                  <td>
                    <input 
                      type="text"
                      className="form-input"
                      style={{ fontWeight: '600', marginBottom: '6px' }}
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      placeholder="Item / Service Name"
                    />
                    <textarea 
                      className="form-textarea"
                      style={{ minHeight: '50px', fontSize: '12px' }}
                      value={item.details}
                      onChange={(e) => handleItemChange(idx, 'details', e.target.value)}
                      placeholder="Detailed description, deliverables, or specifications (optional)"
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
                  <td style={{ verticalAlign: 'middle', fontWeight: '700', fontSize: '14px', color: 'var(--color-text-main)' }}>
                    {invoice.currency?.symbol}{Number(item.amount || (item.quantity * item.rate)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button 
                        className="btn-icon" 
                        onClick={() => duplicateItem(idx)}
                        title="Duplicate row"
                      >
                        <Copy size={13} />
                      </button>
                      <button 
                        className="btn-icon" 
                        style={{ color: 'var(--color-danger)' }}
                        onClick={() => removeItem(idx)}
                        title="Delete row"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', marginTop: '14px', borderStyle: 'dashed' }}
          onClick={addItem}
        >
          <Plus size={15} />
          <span>Add Another Line Item</span>
        </button>
      </div>

      {/* 4. Financial Calculations / Pricing */}
      <div className="form-section-card">
        <div className="section-title">
          <Percent size={17} style={{ color: 'var(--color-primary)' }} />
          <span>4. Discounts, Taxes & Deposit</span>
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
              <option value="fixed">Fixed Amount ({invoice.currency?.symbol})</option>
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
            <label className="form-label">Tax / VAT Rate (%)</label>
            <input 
              type="number"
              min="0"
              step="any"
              className="form-input"
              value={invoice.pricing?.taxRate || 0}
              onChange={(e) => updatePricing('taxRate', e.target.value)}
              placeholder="e.g. 7.5 or 20"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shipping / Extra Fee</label>
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
            <label className="form-label">Deposit / Paid in Advance ({invoice.currency?.symbol})</label>
            <input 
              type="number"
              min="0"
              step="any"
              className="form-input"
              value={invoice.pricing?.deposit || 0}
              onChange={(e) => updatePricing('deposit', e.target.value)}
              placeholder="Amount client already paid"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px', padding: '10px 16px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600' }}>TOTAL AMOUNT</div>
              <div style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--color-text-main)' }}>
                {invoice.currency?.symbol}{Number(invoice.pricing?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--color-border)' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: '700' }}>BALANCE DUE</div>
              <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                {invoice.currency?.symbol}{Number(invoice.pricing?.balanceDue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Payment Details & Bank Information */}
      <div className="form-section-card">
        <div className="section-title">
          <CreditCard size={17} style={{ color: 'var(--color-primary)' }} />
          <span>5. Payment Instructions & Bank Details</span>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Bank Name</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.paymentDetails?.bankName || ''}
              onChange={(e) => updatePayment('bankName', e.target.value)}
              placeholder="e.g. Standard Chartered Bank"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Name</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.paymentDetails?.accountName || ''}
              onChange={(e) => updatePayment('accountName', e.target.value)}
              placeholder="e.g. Village Coders Tech Ltd"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Number / IBAN</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.paymentDetails?.accountNumber || ''}
              onChange={(e) => updatePayment('accountNumber', e.target.value)}
              placeholder="e.g. 0123456789"
            />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">SWIFT / BIC Code</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.paymentDetails?.swift || ''}
              onChange={(e) => updatePayment('swift', e.target.value)}
              placeholder="e.g. SCBLNGLA"
            />
          </div>

          <div className="form-group">
            <label className="form-label">PayPal Email (Optional)</label>
            <input 
              type="email" 
              className="form-input"
              value={invoice.paymentDetails?.paypalEmail || ''}
              onChange={(e) => updatePayment('paypalEmail', e.target.value)}
              placeholder="e.g. payments@villagecoders.io"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Crypto / Web3 Wallet (Optional)</label>
            <input 
              type="text" 
              className="form-input"
              value={invoice.paymentDetails?.cryptoAddress || ''}
              onChange={(e) => updatePayment('cryptoAddress', e.target.value)}
              placeholder="e.g. 0x... (USDT ERC20/TRC20)"
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
              placeholder="e.g. Payment due within 14 days"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Notes & Remarks to Client</label>
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
            <PenTool size={17} style={{ color: 'var(--color-primary)' }} />
            <span>6. Digital Signature</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onOpenSignature}>
            <PenTool size={13} />
            <span>Edit Signature</span>
          </button>
        </div>

        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-bg-subtle)', padding: '12px 18px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              fontFamily: invoice.signature?.type === 'typed' ? 'Caveat, cursive' : 'inherit',
              fontSize: invoice.signature?.type === 'typed' ? '24px' : '14px',
              color: 'var(--color-text-main)'
            }}>
              {invoice.signature?.type === 'drawn' && invoice.signature?.value ? (
                <img src={invoice.signature.value} alt="Sig" style={{ height: '36px' }} />
              ) : (
                invoice.signature?.value || 'Village Coders Management'
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              ({invoice.signature?.signerName || 'Village Coders Ltd'})
            </div>
          </div>

          <span className="badge badge-paid" style={{ fontSize: '10px' }}>
            {invoice.signature?.type === 'drawn' ? 'Drawn Signature' : 'Electronic Signature'}
          </span>
        </div>
      </div>
    </div>
  );
}
