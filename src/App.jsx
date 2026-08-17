import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import Header from './components/Header';
import InvoiceEditor from './components/InvoiceEditor';
import InvoicePreview from './components/InvoicePreview';
import InvoiceList from './components/InvoiceList';
import StatsDashboard from './components/StatsDashboard';
import PresetsModal from './components/PresetsModal';
import SignatureModal from './components/SignatureModal';
import { DEFAULT_INVOICE_STATE } from './utils/presets';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'list' | 'stats'
  const [theme, setTheme] = useState(() => localStorage.getItem('vc_theme') || 'light');
  const [invoice, setInvoice] = useState(DEFAULT_INVOICE_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [dbConnected, setDbConnected] = useState(true);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vc_theme', theme);
  }, [theme]);

  // Load next invoice number on mount
  useEffect(() => {
    const initApp = async () => {
      try {
        const nextRes = await api.getNextInvoiceNumber();
        if (nextRes.success && nextRes.nextNumber) {
          setInvoice(prev => ({
            ...prev,
            invoiceNumber: nextRes.nextNumber
          }));
        }
        const isHealthy = await api.checkHealth();
        setDbConnected(isHealthy);
      } catch (err) {
        console.warn('Initial server connect note:', err.message);
      }
    };
    initApp();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleSaveInvoice = async () => {
    if (!invoice.client?.name) {
      showToast('Please enter the client name.', 'error');
      return;
    }
    if (!invoice.items || invoice.items.length === 0) {
      showToast('Please add at least one line item to the invoice.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      let res;
      if (invoice._id) {
        res = await api.updateInvoice(invoice._id, invoice);
        showToast(`Invoice ${invoice.invoiceNumber} updated in database!`, 'success');
      } else {
        res = await api.createInvoice(invoice);
        showToast(`Invoice ${invoice.invoiceNumber} saved to MongoDB Atlas!`, 'success');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      if (res.success && res.data) {
        setInvoice(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to save invoice', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      showToast('Generating official PDF with Puppeteer...', 'info');
      const downloadedFile = await api.downloadInvoicePdf(invoice);

      showToast(`Downloaded ${downloadedFile}!`, 'success');
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast(err.message || 'PDF Generation failed. You can also use the Print button.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleNewInvoice = async () => {
    try {
      const nextRes = await api.getNextInvoiceNumber();
      const nextNum = nextRes.success ? nextRes.nextNumber : `VC-${new Date().getFullYear()}-0001`;
      setInvoice({
        ...DEFAULT_INVOICE_STATE,
        invoiceNumber: nextNum,
        issueDate: new Date().toISOString().split('T')[0]
      });
      setActiveTab('editor');
      showToast('New invoice blank sheet ready', 'info');
    } catch (err) {
      setInvoice({
        ...DEFAULT_INVOICE_STATE,
        invoiceNumber: `VC-${new Date().getFullYear()}-0001`,
        issueDate: new Date().toISOString().split('T')[0]
      });
      setActiveTab('editor');
    }
  };

  const handleEditInvoice = (selectedInvoice) => {
    setInvoice(selectedInvoice);
    setActiveTab('editor');
  };

  const handlePreviewInvoice = (selectedInvoice) => {
    setInvoice(selectedInvoice);
    setActiveTab('editor');
  };

  const handleSelectPreset = (preset) => {
    setInvoice(prev => {
      let subtotal = 0;
      const updatedItems = preset.items.map(item => {
        const amt = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
        subtotal += amt;
        return { ...item, amount: amt };
      });

      const discountVal = Number(preset.pricing.discountValue) || 0;
      let discountAmount = 0;
      if (preset.pricing.discountType === 'percent') {
        discountAmount = (subtotal * discountVal) / 100;
      } else {
        discountAmount = discountVal;
      }

      const taxableAmount = Math.max(0, subtotal - discountAmount);
      const taxRate = Number(preset.pricing.taxRate) || 0;
      const taxAmount = (taxableAmount * taxRate) / 100;
      const shipping = Number(preset.pricing.shipping) || 0;
      const total = taxableAmount + taxAmount + shipping;
      const deposit = Number(preset.pricing.deposit) || 0;
      const balanceDue = Math.max(0, total - deposit);

      return {
        ...prev,
        title: preset.title || prev.title,
        currency: preset.currency,
        items: updatedItems,
        pricing: {
          subtotal: Number(subtotal.toFixed(2)),
          discountType: preset.pricing.discountType || 'percent',
          discountValue: preset.pricing.discountValue || 0,
          discountAmount: Number(discountAmount.toFixed(2)),
          taxRate: preset.pricing.taxRate || 0,
          taxAmount: Number(taxAmount.toFixed(2)),
          shipping: preset.pricing.shipping || 0,
          deposit: preset.pricing.deposit || 0,
          total: Number(total.toFixed(2)),
          balanceDue: Number(balanceDue.toFixed(2))
        },
        paymentDetails: {
          ...prev.paymentDetails,
          ...preset.paymentDetails
        }
      };
    });
    showToast(`Loaded preset "${preset.name}"`, 'success');
  };

  const handleSaveSignature = (newSignature) => {
    setInvoice(prev => ({
      ...prev,
      signature: newSignature
    }));
    showToast('Signature updated', 'success');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        dbConnected={dbConnected}
        onNewInvoice={handleNewInvoice}
        onOpenPresets={() => setIsPresetsOpen(true)}
      />

      {/* Main Content Body */}
      <main className="main-content">
        {activeTab === 'editor' && (
          <div className="editor-layout">
            {/* Left Column: Form Editor */}
            <InvoiceEditor 
              invoice={invoice}
              onChange={setInvoice}
              onSave={handleSaveInvoice}
              onDownloadPdf={handleDownloadPdf}
              onOpenPresets={() => setIsPresetsOpen(true)}
              onOpenSignature={() => setIsSignatureOpen(true)}
              onReset={handleNewInvoice}
              isSaving={isSaving}
              isGeneratingPdf={isGeneratingPdf}
            />

            {/* Right Column: Live Letterhead A4 Preview */}
            <InvoicePreview 
              invoice={invoice}
              onDownloadPdf={handleDownloadPdf}
              isGeneratingPdf={isGeneratingPdf}
            />
          </div>
        )}

        {activeTab === 'list' && (
          <InvoiceList 
            onEditInvoice={handleEditInvoice}
            onNewInvoice={handleNewInvoice}
            onPreviewInvoice={handlePreviewInvoice}
            showToast={showToast}
          />
        )}

        {activeTab === 'stats' && (
          <StatsDashboard 
            onEditInvoice={handleEditInvoice}
            onNewInvoice={handleNewInvoice}
            showToast={showToast}
          />
        )}
      </main>

      {/* Modals */}
      <PresetsModal 
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <SignatureModal 
        isOpen={isSignatureOpen}
        onClose={() => setIsSignatureOpen(false)}
        currentSignature={invoice.signature}
        onSave={handleSaveSignature}
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast" style={{
            borderLeft: `4px solid ${
              t.type === 'error' ? 'var(--color-danger)' : 
              t.type === 'info' ? 'var(--color-info)' : 'var(--color-success)'
            }`
          }}>
            {t.type === 'error' ? (
              <AlertCircle size={18} style={{ color: 'var(--color-danger)' }} />
            ) : t.type === 'info' ? (
              <Info size={18} style={{ color: 'var(--color-info)' }} />
            ) : (
              <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
