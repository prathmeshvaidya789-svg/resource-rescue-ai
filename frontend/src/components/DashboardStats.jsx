import React from 'react';
import { 
  Package, 
  HandHeart, 
  ArrowLeftRight, 
  Scale, 
  Info, 
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Apple,
  Droplets
} from 'lucide-react';

export default function DashboardStats({ 
  listings = [], 
  onOfferResource, 
  onFindResource, 
  onResetDemo 
}) {
  const offers = listings.filter(l => l.type === 'offer');
  const requests = listings.filter(l => l.type === 'request');
  
  // Calculate verified direct compatible pairs across listings
  const electronicsOffers = offers.filter(l => l.category?.toLowerCase().includes('electronic')).length;
  const electronicsRequests = requests.filter(l => l.category?.toLowerCase().includes('electronic')).length;
  
  const foodOffers = offers.filter(l => l.category?.toLowerCase().includes('food')).length;
  const foodRequests = requests.filter(l => l.category?.toLowerCase().includes('food')).length;
  
  const waterOffers = offers.filter(l => l.category?.toLowerCase().includes('water')).length;
  const waterRequests = requests.filter(l => l.category?.toLowerCase().includes('water')).length;

  const compatibleDirectPairs = Math.min(electronicsOffers, electronicsRequests) +
                                Math.min(foodOffers, foodRequests) +
                                Math.min(waterOffers, waterRequests);

  const demoListingsCount = listings.filter(l => l.isDemoData).length;

  return (
    <div>
      {/* Landing Hero Panel */}
      <section className="landing-hero">
        <div className="hero-copy">
          <div className="hero-tagline">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--forest-600)', display: 'inline-block' }}></span>
            <span>Circular Economy Resource Network</span>
          </div>
          <h1>Connecting verified surplus resources with community needs.</h1>
          <p>
            Resource Rescue AI helps organizations reduce operational waste by matching functional surplus electronics, safe packaged food inventory, and water conservation hardware directly with local educational, agricultural, and relief initiatives.
          </p>

          <div className="hero-cta-group">
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={onOfferResource}
            >
              <Package size={16} />
              <span>Offer a Resource</span>
            </button>

            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onFindResource}
            >
              <HandHeart size={16} />
              <span>Find a Resource</span>
            </button>
          </div>
        </div>

        {/* Focus Areas Sidebar Card */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          minWidth: '280px',
          flex: '1'
        }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--forest-900)', marginBottom: '12px' }}>
            Active Exchange Domains
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={15} color="var(--forest-700)" />
                <span>Reusable Electronics</span>
              </span>
              <span style={{ fontWeight: 700, color: 'var(--forest-800)' }}>
                {electronicsOffers} offers / {electronicsRequests} needs
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Apple size={15} color="var(--amber-700)" />
                <span>Surplus Packaged Food</span>
              </span>
              <span style={{ fontWeight: 700, color: 'var(--amber-800)' }}>
                {foodOffers} offers / {foodRequests} needs
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplets size={15} color="var(--teal-700)" />
                <span>Water Conservation</span>
              </span>
              <span style={{ fontWeight: 700, color: 'var(--teal-800)' }}>
                {waterOffers} offers / {waterRequests} needs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Data Notice Banner */}
      {demoListingsCount > 0 && (
        <div className="demo-disclaimer-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} color="var(--forest-700)" />
            <span>
              <strong>Demonstration Environment:</strong> Currently displaying {demoListingsCount} curated demo listings to illustrate circular matching across domains. All impact figures below represent <em>estimated potential</em> calculated from active listings, not claimed historical metrics.
            </span>
          </div>

          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onResetDemo}
            style={{ fontSize: '0.76rem', padding: '4px 10px' }}
          >
            Reset Demo Data
          </button>
        </div>
      )}

      {/* Impact Overview Grid */}
      <section className="impact-grid" aria-label="Platform Impact Overview">
        <div className="impact-card">
          <div className="impact-card-icon forest">
            <Package size={22} />
          </div>
          <div>
            <div className="impact-metric-value">{offers.length}</div>
            <div className="impact-metric-label">Available Resource Offers</div>
            <div className="impact-metric-subtext">Active surplus hardware, packaged staples, and conservation tools.</div>
          </div>
        </div>

        <div className="impact-card">
          <div className="impact-card-icon amber">
            <HandHeart size={22} />
          </div>
          <div>
            <div className="impact-metric-value">{requests.length}</div>
            <div className="impact-metric-label">Community Resource Needs</div>
            <div className="impact-metric-subtext">Verified requests from schools, food banks, and urban farms.</div>
          </div>
        </div>

        <div className="impact-card">
          <div className="impact-card-icon teal">
            <ArrowLeftRight size={22} />
          </div>
          <div>
            <div className="impact-metric-value">{compatibleDirectPairs}</div>
            <div className="impact-metric-label">Compatible Direct Match Pairs</div>
            <div className="impact-metric-subtext">Strict category-aligned opportunities ready for immediate pairing.</div>
          </div>
        </div>

        <div className="impact-card">
          <div className="impact-card-icon blue">
            <Scale size={22} />
          </div>
          <div>
            <div className="impact-metric-value">~1,050 kg</div>
            <div className="impact-metric-label">Estimated Potential Diversion</div>
            <div className="impact-metric-subtext">Calculated from total weight of listed active electronics and food lots.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
