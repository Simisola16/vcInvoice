import React from 'react';
import { 
  FileText, 
  List, 
  BarChart3, 
  Sparkles, 
  Moon, 
  Sun, 
  Database,
  PlusCircle
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  dbConnected, 
  onNewInvoice,
  onOpenPresets 
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand Group with Logo Image */}
        <div className="brand-group" onClick={() => setActiveTab('editor')}>
          <div style={{ display: 'flex', alignItems: 'center', height: '44px' }}>
            <img 
              src="/logo.png" 
              alt="Village Coders" 
              style={{ 
                height: '42px', 
                objectFit: 'contain',
                filter: theme === 'dark' ? 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' : 'none'
              }} 
            />
          </div>
          <div className="brand-title-wrap">
            <h1 style={{ fontSize: '18px' }}>Invoice Generator</h1>
            <p style={{ color: 'var(--color-primary)' }}>Official Letterhead Studio</p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="nav-tabs">
          <button 
            className={`nav-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <FileText size={16} />
            <span>Invoice Builder</span>
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <List size={16} />
            <span>Invoices History</span>
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={16} />
            <span>Dashboard</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Quick Preset Button */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenPresets}
            title="Load template presets"
          >
            <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
            <span>Templates</span>
          </button>

          {/* New Invoice Button */}
          <button 
            className="btn btn-primary btn-sm"
            onClick={onNewInvoice}
          >
            <PlusCircle size={15} />
            <span>New Invoice</span>
          </button>

          {/* DB Live Status */}
          <div className="db-badge" title="Connected to MongoDB Atlas">
            <span className="db-dot"></span>
            <span>MongoDB Atlas</span>
          </div>

          {/* Theme Toggle */}
          <button 
            className="btn-icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
