import React, { useRef, useState, useEffect } from 'react';
import { X, Check, Trash2, PenTool, Type } from 'lucide-react';

export default function SignatureModal({ isOpen, onClose, currentSignature, onSave }) {
  if (!isOpen) return null;

  const [sigType, setSigType] = useState(currentSignature?.type || 'typed');
  const [typedName, setTypedName] = useState(currentSignature?.value || 'Village Coders Management');
  const [signerName, setSignerName] = useState(currentSignature?.signerName || 'Village Coders Ltd');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (sigType === 'drawn' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#0f172a';

      if (currentSignature?.type === 'drawn' && currentSignature.value) {
        const img = new Image();
        img.src = currentSignature.value;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
      }
    }
  }, [sigType]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSave = () => {
    if (sigType === 'typed') {
      onSave({
        type: 'typed',
        value: typedName,
        signerName: signerName || 'Authorized Signatory',
        date: new Date().toISOString().split('T')[0]
      });
    } else {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      onSave({
        type: 'drawn',
        value: dataUrl,
        signerName: signerName || 'Authorized Signatory',
        date: new Date().toISOString().split('T')[0]
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="card-header" style={{ padding: '14px 18px', margin: 0 }}>
          <div className="card-title">
            <PenTool size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Digital Signature</span>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={15} /></button>
        </div>

        <div style={{ padding: '16px 18px' }}>
          {/* Mode Switch */}
          <div className="nav-tabs" style={{ marginBottom: '14px' }}>
            <button 
              className={`nav-tab-btn ${sigType === 'typed' ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setSigType('typed')}
            >
              <Type size={14} />
              <span>Type Signature</span>
            </button>
            <button 
              className={`nav-tab-btn ${sigType === 'drawn' ? 'active' : ''}`}
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setSigType('drawn')}
            >
              <PenTool size={14} />
              <span>Draw (Touch/Mouse)</span>
            </button>
          </div>

          {sigType === 'typed' ? (
            <div>
              <div className="form-group">
                <label className="form-label">Signature Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Enter name to sign"
                />
              </div>
              <div style={{ 
                background: '#fafbfc', 
                border: '1.5px dashed #cbd5e1', 
                borderRadius: '8px', 
                padding: '20px', 
                textAlign: 'center', 
                marginTop: '10px' 
              }}>
                <div style={{ 
                  fontFamily: 'Caveat, cursive', 
                  fontSize: '30px', 
                  color: '#0f172a',
                  lineHeight: '1.2' 
                }}>
                  {typedName || 'Your Signature'}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="form-label" style={{ marginBottom: '6px' }}>Draw your signature below:</label>
              <div style={{ position: 'relative', border: '1.5px dashed #cbd5e1', borderRadius: '8px', background: '#ffffff', touchAction: 'none' }}>
                <canvas 
                  ref={canvasRef}
                  width={420}
                  height={140}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ display: 'block', width: '100%', height: '140px', cursor: 'crosshair', touchAction: 'none' }}
                />
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={clearCanvas}
                  style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(255,255,255,0.9)' }}
                >
                  <Trash2 size={12} />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginTop: '14px' }}>
            <label className="form-label">Signer / Legal Title</label>
            <input 
              type="text" 
              className="form-input"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="e.g. Village Coders Ltd"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              <Check size={14} />
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
