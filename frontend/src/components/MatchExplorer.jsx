import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Zap, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  ShieldAlert, 
  Layers, 
  Info,
  Check,
  AlertCircle
} from 'lucide-react';
import { findMatches } from '../services/api';

export default function MatchExplorer({ 
  listings = [], 
  selectedListingId, 
  onSelectListing, 
  onStatusChange 
}) {
  const [sourceId, setSourceId] = useState(selectedListingId || (listings[0]?.id || ''));
  const [directMatches, setDirectMatches] = useState([]);
  const [crossCollaborations, setCrossCollaborations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reservedPairs, setReservedPairs] = useState(new Set());
  const [confirmationNotice, setConfirmationNotice] = useState(null);

  // Sync if selectedListingId changes from parent
  useEffect(() => {
    if (selectedListingId) {
      setSourceId(selectedListingId);
    }
  }, [selectedListingId]);

  // Fetch matches
  useEffect(() => {
    if (!sourceId || listings.length === 0) return;
    
    const source = listings.find(l => l.id === sourceId);
    if (!source) return;

    setLoading(true);
    findMatches(source, listings)
      .then(res => {
        setDirectMatches(res.direct_matches || res.matches || []);
        setCrossCollaborations(res.cross_category_collaborations || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Match evaluation error:', err);
        setLoading(false);
      });
  }, [sourceId, listings]);

  const sourceItem = listings.find(l => l.id === sourceId) || listings[0];

  const handleInitiateMatch = (targetItem) => {
    onStatusChange(sourceItem.id, 'matched');
    onStatusChange(targetItem.id, 'matched');
    setReservedPairs(prev => new Set([...prev, targetItem.id]));
    
    setConfirmationNotice(`Match initiated! "${sourceItem.title}" and "${targetItem.title}" have been reserved and marked as Matched.`);
    setTimeout(() => setConfirmationNotice(null), 5000);
  };

  return (
    <div className="matchmaker-container">
      {/* Top Source Item Selector Banner */}
      <section className="match-source-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--forest-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeftRight size={22} color="var(--forest-700)" />
              <span>Smart Matchmaker</span>
            </h2>
            <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>
              Select a resource to find verified, category-compatible exchange opportunities. Direct matches strictly enforce category compatibility.
            </p>
          </div>

          <div style={{ minWidth: '320px' }}>
            <label className="form-label" htmlFor="match-source-select" style={{ fontSize: '0.8rem' }}>
              Active Resource to Pair:
            </label>
            <select
              id="match-source-select"
              className="form-select"
              value={sourceId}
              onChange={(e) => {
                setSourceId(e.target.value);
                if (onSelectListing) onSelectListing(e.target.value);
              }}
              style={{ fontWeight: 600, fontSize: '0.88rem' }}
            >
              {listings.map(item => (
                <option key={item.id} value={item.id}>
                  {item.type === 'offer' ? '🎁 [OFFER]' : '🎯 [NEED]'} ({item.category}) - {item.title.slice(0, 42)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Source Item Card Preview */}
        {sourceItem && (
          <div style={{ 
            backgroundColor: 'var(--bg-subtle)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 'var(--radius-sm)',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className={`badge ${sourceItem.type === 'offer' ? 'badge-offer' : 'badge-request'}`}>
                Active {sourceItem.type === 'offer' ? 'Offer' : 'Need'}
              </span>
              <span className="badge badge-category">{sourceItem.category}</span>
              {sourceItem.isDemoData && <span className="badge badge-demo">Demo</span>}
              <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', marginLeft: 'auto' }}>
                Status: <strong>{sourceItem.status?.toUpperCase()}</strong>
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-900)', marginBottom: '6px' }}>{sourceItem.title}</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              {sourceItem.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-faint)', flexWrap: 'wrap' }}>
              {sourceItem.quantity && <span>📦 <strong>Quantity:</strong> {sourceItem.quantity}</span>}
              {sourceItem.location && <span>📍 <strong>Location:</strong> {sourceItem.location}</span>}
              {sourceItem.organization && <span>🏢 <strong>Posted by:</strong> {sourceItem.organization}</span>}
            </div>
          </div>
        )}
      </section>

      {/* Confirmation Success Toast */}
      {confirmationNotice && (
        <div className="alert-banner info" style={{ marginBottom: '24px' }}>
          <CheckCircle2 size={18} color="var(--forest-800)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>{confirmationNotice}</div>
        </div>
      )}

      {/* Section 1: Strict Direct Category Matches */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="var(--forest-700)" />
            <span>Verified Direct Category Matches ({directMatches.length})</span>
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Strictly constrained to <strong>{sourceItem?.category}</strong>. Only complementary {sourceItem?.type === 'offer' ? 'Needs' : 'Offers'} qualify as direct matches.
          </p>
        </div>

        {loading && <div className="spinner-dark"></div>}
      </div>

      {directMatches.length === 0 && !loading && (
        <div className="empty-state" style={{ marginBottom: '32px' }}>
          <Layers size={40} className="empty-state-icon" />
          <h3>No direct category matches available yet</h3>
          <p>
            There are currently no complementary {sourceItem?.type === 'offer' ? 'requests' : 'offers'} in the <strong>{sourceItem?.category}</strong> category. Post a matching item to create a direct pairing!
          </p>
        </div>
      )}

      {directMatches.map(({ target_item, match_score, reasons, exchange_type }) => {
        const isReserved = reservedPairs.has(target_item.id) || target_item.status === 'matched';

        return (
          <div key={target_item.id} className="match-pair-row">
            {/* Left Column: Source Resource */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '4px' }}>
                Your {sourceItem.type === 'offer' ? 'Offer' : 'Need'}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--forest-900)', marginBottom: '4px' }}>
                {sourceItem.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
                📍 {sourceItem.location}
              </div>
            </div>

            {/* Center: Match Percentage Circle */}
            <div className="match-score-badge">
              <div className="match-percentage-circle">
                <span>{match_score}%</span>
              </div>
              <span className="match-type-pill">{exchange_type}</span>
            </div>

            {/* Right Column: Matched Counterpart */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span className={`badge ${target_item.type === 'offer' ? 'badge-offer' : 'badge-request'}`}>
                  {target_item.type === 'offer' ? 'Offer' : 'Need'}
                </span>
                <span className="badge badge-category">{target_item.category}</span>
                {target_item.isDemoData && <span className="badge badge-demo">Demo</span>}
              </div>

              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--forest-900)', marginBottom: '6px' }}>
                {target_item.title}
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                {target_item.description}
              </p>

              {/* Match Verification Reasons */}
              <div style={{ marginBottom: '14px', backgroundColor: 'var(--forest-50)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--forest-100)' }}>
                {reasons.map((r, i) => (
                  <div key={i} style={{ 
                    fontSize: '0.78rem', 
                    color: 'var(--forest-800)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    marginBottom: '2px'
                  }}>
                    <Check size={12} color="var(--forest-700)" strokeWidth={2.5} />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                  🏢 {target_item.organization || 'Community Partner'}
                </span>

                <button 
                  type="button"
                  className={`btn btn-sm ${isReserved ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => handleInitiateMatch(target_item)}
                  disabled={isReserved}
                >
                  <CheckCircle2 size={14} />
                  <span>{isReserved ? 'Match Reserved' : 'Initiate Match & Reserve'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Section 2: Segregated Cross-Sector Ecosystem Items (NEVER implied as direct matches) */}
      {crossCollaborations.length > 0 && (
        <section className="cross-category-section">
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ fontSize: '0.98rem', color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} color="var(--text-muted)" />
              <span>Cross-Sector Collaborative Opportunities (Segregated)</span>
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
              These items belong to different resource categories (e.g. food vs water) and are <strong>never</strong> counted as direct rescue matches. They are listed for multi-stakeholder coalition or logistical bundling only.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {crossCollaborations.slice(0, 3).map(({ target_item, match_score, reasons, exchange_type }) => (
              <div 
                key={target_item.id} 
                style={{ 
                  backgroundColor: 'var(--bg-subtle)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '14px' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span className={`badge ${target_item.type === 'offer' ? 'badge-offer' : 'badge-request'}`}>
                    {target_item.type}
                  </span>
                  <span className="badge badge-category">{target_item.category}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginLeft: 'auto' }}>
                    Score: {match_score}%
                  </span>
                </div>

                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-title)', marginBottom: '4px' }}>
                  {target_item.title}
                </div>

                <div style={{ fontSize: '0.76rem', color: 'var(--amber-800)', marginTop: '4px' }}>
                  {exchange_type}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
