import React from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { INVOICE_PRESETS } from '../utils/presets';

export default function PresetsModal({ isOpen, onClose, onSelectPreset }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="card-header" style={{ padding: '18px 24px', margin: 0 }}>
          <div className="card-title">
            <Sparkles size={18} style={{ color: 'var(--color-accent)' }} />
            <span>Choose Invoice Template Preset</span>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="presets-grid">
          {INVOICE_PRESETS.map((preset) => (
            <div 
              key={preset.id} 
              className="preset-card"
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge badge-paid" style={{ fontSize: '10.5px' }}>{preset.category}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: '700' }}>
                    {preset.currency.symbol}{preset.items.reduce((sum, it) => sum + it.amount, 0).toLocaleString()}
                  </span>
                </div>
                <h4 style={{ fontSize: '14.5px', fontWeight: '700', marginBottom: '6px' }}>{preset.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                  {preset.description}
                </p>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>{preset.items.length} Line Items</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Use Preset &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
