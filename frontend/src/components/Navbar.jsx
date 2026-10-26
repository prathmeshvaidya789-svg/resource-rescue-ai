import React from 'react';
import { 
  Leaf, 
  Search, 
  Sparkles, 
  ArrowLeftRight, 
  BarChart3, 
  Plus, 
  HelpCircle, 
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  backendStatus, 
  listingsCount,
  onOpenNewListing,
  onOpenOllamaGuide
}) {
  const isOnline = backendStatus?.ollama_available;
  const isPreferred = backendStatus?.is_preferred_installed;
  const activeModel = backendStatus?.active_model || 'qwen2.5:3b';

  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Clean Logo */}
        <div className="brand" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-icon">
            <Leaf size={20} strokeWidth={2.2} />
          </div>
          <div>
            <div className="brand-title">
              <span>Resource Rescue</span>
              <span className="brand-badge">Platform</span>
            </div>
            <div className="brand-subtitle">Verified Circular Resource Exchange</div>
          </div>
        </div>

        {/* Navigation Tabs (Discover Resources, AI Solution Lab, Matches, Impact Dashboard) */}
        <nav className="nav-tabs" aria-label="Main Navigation">
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={15} />
            <span>Impact Dashboard</span>
          </button>

          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketplace')}
          >
            <Search size={15} />
            <span>Discover Resources</span>
            <span className="tab-count">{listingsCount}</span>
          </button>

          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'analyzer' ? 'active' : ''}`}
            onClick={() => setActiveTab('analyzer')}
          >
            <Sparkles size={15} />
            <span>AI Solution Lab</span>
          </button>

          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'matcher' ? 'active' : ''}`}
            onClick={() => setActiveTab('matcher')}
          >
            <ArrowLeftRight size={15} />
            <span>Matches</span>
          </button>
        </nav>

        {/* Right Actions & Truthful Ollama Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Status Pill */}
          <button 
            type="button"
            className={`status-pill ${
              isOnline 
                ? (isPreferred ? 'online' : 'fallback') 
                : 'offline'
            }`}
            onClick={onOpenOllamaGuide}
            title="Click for local Ollama configuration and setup details"
          >
            <span className="status-dot"></span>
            <span>
              {isOnline 
                ? (isPreferred ? `Ollama: ${activeModel}` : `Ollama (Fallback: ${activeModel})`)
                : 'Ollama: Offline'}
            </span>
          </button>

          {/* Primary Action Button */}
          <button 
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenNewListing}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Post Resource</span>
          </button>
        </div>
      </div>
    </header>
  );
}
