import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import ListingCard from './components/ListingCard';
import ProblemAnalyzer from './components/ProblemAnalyzer';
import MatchExplorer from './components/MatchExplorer';
import ListingFormModal from './components/ListingFormModal';
import OllamaGuideModal from './components/OllamaGuideModal';

import { 
  getStoredListings, 
  saveListing, 
  updateListingStatus, 
  deleteListing, 
  resetToSampleListings 
} from './services/storage';
import { checkBackendHealth } from './services/api';

import { 
  Search, 
  Filter, 
  Layers, 
  Plus, 
  Sparkles, 
  ArrowRight,
  Package,
  HandHeart,
  Info
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'marketplace', 'analyzer', 'matcher'
  const [listings, setListings] = useState([]);
  const [backendStatus, setBackendStatus] = useState(null);
  
  // Marketplace filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'offer', 'request'
  
  // Modals & Drafts
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isOllamaGuideOpen, setIsOllamaGuideOpen] = useState(false);
  const [prefillDraft, setPrefillDraft] = useState(null);
  const [selectedListingForMatch, setSelectedListingForMatch] = useState(null);

  // Load listings from LocalStorage
  useEffect(() => {
    const data = getStoredListings();
    setListings(data);
  }, []);

  // Poll backend health status
  const refreshHealth = async () => {
    try {
      const status = await checkBackendHealth();
      setBackendStatus(status);
    } catch (err) {
      console.warn('Backend health check error:', err);
    }
  };

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleSaveListing = (listingData) => {
    const saved = saveListing(listingData);
    setListings(prev => [saved, ...prev.filter(p => p.id !== saved.id)]);
    setActiveTab('marketplace');
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = updateListingStatus(id, newStatus);
    setListings(updated);
  };

  const handleDeleteListing = (id) => {
    if (window.confirm('Remove this circular resource listing from the board?')) {
      const updated = deleteListing(id);
      setListings(updated);
    }
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset resource listings to default demonstration inventory (Electronics, Surplus Food, Water)?')) {
      const reset = resetToSampleListings();
      setListings(reset);
      setSelectedListingForMatch(null);
    }
  };

  const handleFindMatches = (listing) => {
    setSelectedListingForMatch(listing.id);
    setActiveTab('matcher');
  };

  const handleAddDraftFromAI = (draft) => {
    setPrefillDraft(draft);
    setIsListingModalOpen(true);
  };

  const handleOpenOfferModal = () => {
    setPrefillDraft({ type: 'offer' });
    setIsListingModalOpen(true);
  };

  const handleOpenRequestModal = () => {
    setPrefillDraft({ type: 'request' });
    setIsListingModalOpen(true);
  };

  // Filtered listings for Marketplace
  const filteredListings = listings.filter(item => {
    const text = `${item.title} ${item.description} ${(item.tags || []).join(' ')} ${item.location}`.toLowerCase();
    const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = [
    'All',
    'Reusable Electronics',
    'Surplus Packaged Food',
    'Water Conservation',
    'Upcycling & Materials',
    'Tools & Equipment'
  ];

  return (
    <div className="app-layout">
      {/* Editorial Navigation */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        listingsCount={listings.length}
        onOpenNewListing={() => {
          setPrefillDraft(null);
          setIsListingModalOpen(true);
        }}
        onOpenOllamaGuide={() => setIsOllamaGuideOpen(true)}
      />

      <main className="app-container">
        {/* ====================================================================
            SECTION 1: IMPACT DASHBOARD (Landing & High-Level Overview)
            ==================================================================== */}
        {activeTab === 'dashboard' && (
          <div>
            <DashboardStats 
              listings={listings}
              onOfferResource={handleOpenOfferModal}
              onFindResource={handleOpenRequestModal}
              onResetDemo={handleResetDemo}
            />

            {/* Quick Preview of Recent Resources */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-900)' }}>Recent Marketplace Activity</h2>
                  <p style={{ fontSize: '0.84rem' }}>Latest available community resource offers and needs.</p>
                </div>

                <button 
                  type="button" 
                  className="btn btn-outline btn-sm"
                  onClick={() => setActiveTab('marketplace')}
                >
                  <span>View All Marketplace Resources</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="listings-grid">
                {listings.slice(0, 3).map(item => (
                  <ListingCard 
                    key={item.id}
                    listing={item}
                    onFindMatches={handleFindMatches}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteListing}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            SECTION 2: DISCOVER RESOURCES (Resource Marketplace)
            ==================================================================== */}
        {activeTab === 'marketplace' && (
          <div>
            {/* Toolbar: Search, Type Toggle, and Category Chips */}
            <div className="marketplace-toolbar">
              <div className="toolbar-top-row">
                <div className="search-box">
                  <Search size={16} className="search-box-icon" />
                  <input 
                    type="text"
                    className="search-input"
                    placeholder="Search by keywords, hardware specifications, location, or tags..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    aria-label="Search resources"
                  />
                </div>

                <div className="type-filter-group" role="group" aria-label="Filter by listing intent">
                  <button 
                    type="button"
                    className={`type-filter-btn ${selectedType === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedType('all')}
                  >
                    All Items ({listings.length})
                  </button>
                  <button 
                    type="button"
                    className={`type-filter-btn ${selectedType === 'offer' ? 'active' : ''}`}
                    onClick={() => setSelectedType('offer')}
                  >
                    🎁 Offers ({listings.filter(l => l.type === 'offer').length})
                  </button>
                  <button 
                    type="button"
                    className={`type-filter-btn ${selectedType === 'request' ? 'active' : ''}`}
                    onClick={() => setSelectedType('request')}
                  >
                    🎯 Needs ({listings.filter(l => l.type === 'request').length})
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="category-chips-row">
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-faint)', marginRight: '4px' }}>
                  Category:
                </span>
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Header Count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Showing <strong>{filteredListings.length}</strong> {filteredListings.length === 1 ? 'resource' : 'resources'}
                {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              </div>

              {(searchQuery || selectedCategory !== 'All' || selectedType !== 'all') && (
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.76rem', padding: '3px 10px' }}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedType('all');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
              <div className="empty-state">
                <Layers size={40} className="empty-state-icon" />
                <h3>No resources match your search criteria</h3>
                <p>
                  Try adjusting your search terms or clearing your category filters to view other available listings.
                </p>
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedType('all');
                  }}
                >
                  Reset Marketplace Filters
                </button>
              </div>
            ) : (
              <div className="listings-grid">
                {filteredListings.map(item => (
                  <ListingCard 
                    key={item.id}
                    listing={item}
                    onFindMatches={handleFindMatches}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteListing}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            SECTION 3: AI SOLUTION LAB (Analyzer)
            ==================================================================== */}
        {activeTab === 'analyzer' && (
          <ProblemAnalyzer 
            onAddListingAsDraft={handleAddDraftFromAI}
            onOpenOllamaGuide={() => setIsOllamaGuideOpen(true)}
            backendStatus={backendStatus}
          />
        )}

        {/* ====================================================================
            SECTION 4: MATCHES (Smart Matchmaker)
            ==================================================================== */}
        {activeTab === 'matcher' && (
          <MatchExplorer 
            listings={listings}
            selectedListingId={selectedListingForMatch}
            onSelectListing={setSelectedListingForMatch}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* Resource Posting Form Modal */}
      <ListingFormModal 
        isOpen={isListingModalOpen}
        onClose={() => {
          setIsListingModalOpen(false);
          setPrefillDraft(null);
        }}
        onSave={handleSaveListing}
        prefillData={prefillDraft}
      />

      {/* Ollama Setup & Diagnostics Modal */}
      <OllamaGuideModal 
        isOpen={isOllamaGuideOpen}
        onClose={() => setIsOllamaGuideOpen(false)}
        backendStatus={backendStatus}
        onRefreshStatus={refreshHealth}
      />
    </div>
  );
}
