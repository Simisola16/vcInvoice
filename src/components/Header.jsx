import React from 'react';
import { 
  FileText, 
  List, 
  BarChart3, 
  Sparkles, 
  Moon, 
  Sun, 
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
        {/* Top / Left: Brand Group & Actions on mobile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} className="header-top-row">
          <div className="brand-group" onClick={() => setActiveTab('editor')}>
            <img 
              src="/logo.png" 
              alt="Village Coders" 
              style={{ 
                height: '38px', 
                objectFit: 'contain',
                filter: theme === 'dark' ? 'drop-shadow(0 0 6px rgba(255,255,255,0.2))' : 'none'
              }} 
            />
            <div className="brand-title-wrap">
              <h1>Invoice Studio</h1>
              <p>Village Coders</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="header-actions">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onOpenPresets}
              title="Load template presets"
            >
              <Sparkles size={13} style={{ color: 'var(--color-accent)' }} />
              <span className="hide-on-xs">Templates</span>
            </button>

            <button 
              className="btn btn-primary btn-sm"
              onClick={onNewInvoice}
              title="Create new blank invoice"
            >
              <PlusCircle size={14} />
              <span>New</span>
            </button>

            {/* DB Live Status */}
            <div className="db-badge" title="Connected to MongoDB Atlas">
              <span className="db-dot"></span>
              <span className="hide-on-xs">Live</span>
            </div>

            {/* Theme Toggle */}
            <button 
              className="btn-icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button 
            className={`nav-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <FileText size={15} />
            <span>Builder</span>
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <List size={15} />
            <span>History</span>
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={15} />
            <span>Dashboard</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
