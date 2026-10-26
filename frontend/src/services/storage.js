// LocalStorage Service for Resource Rescue AI
// Preloads sample listings for reusable electronics, surplus packaged food, and water conservation.
// All initial seeded listings are explicitly marked with `isDemoData: true` for transparency.

const STORAGE_KEY = 'resource_rescue_ai_listings_v2';

export const INITIAL_SAMPLE_LISTINGS = [
  // --- REUSABLE ELECTRONICS ---
  {
    id: 'demo-elec-001',
    isDemoData: true,
    title: '12 Working Lenovo ThinkPad T480 Laptops with Power Supplies',
    description: 'Decommissioned during company fleet refresh. Tested, storage sanitized with DoD-standard data wipe, Intel Core i5, 16GB RAM. Fully functional for educational or community center labs.',
    category: 'Reusable Electronics',
    type: 'offer',
    quantity: '12 units',
    condition: 'Refurbished / Good',
    location: 'Downtown Tech Hub (Logistics dock available)',
    contact: 'tech-surplus@ecocorp.org',
    organization: 'EcoCorp IT Solutions',
    status: 'available',
    tags: ['laptops', 'computers', 'education', 'chargers', 'e-waste'],
    estimatedImpactNote: 'Estimated potential diversion: ~360kg e-waste & 3,800kg CO2e lifecycle avoidance.',
    createdAt: '2026-10-24T09:30:00Z',
    safetyNotes: 'Hard drives sanitized to NIST 800-88 / DBAN standards. Battery packs tested with zero swelling.'
  },
  {
    id: 'demo-elec-002',
    isDemoData: true,
    title: 'Youth STEM Lab Needs 10+ Functional Laptops for High School Python Workshops',
    description: 'We run structured weekend coding workshops for 30 neighborhood students. In need of 10-15 working laptops with AC adapters to replace non-functional 10-year-old hardware.',
    category: 'Reusable Electronics',
    type: 'request',
    quantity: '10 to 15 laptops',
    condition: 'Functional with charger',
    location: 'North Community Center (Local pickup available)',
    contact: 'sarah.m@stemyouth.org',
    organization: 'Youth Forward STEM Foundation',
    status: 'available',
    tags: ['laptops', 'computers', 'education', 'youth', 'programming'],
    estimatedImpactNote: 'Estimated community benefit: Direct classroom hardware for 30 students per semester.',
    createdAt: '2026-10-25T11:15:00Z',
    safetyNotes: 'Standard intake verification: electrical cords inspected and operating system re-imaged on arrival.'
  },
  {
    id: 'demo-elec-003',
    isDemoData: true,
    title: '20 Dell 24" 1080p IPS Displays with DisplayPort & HDMI Cables',
    description: 'Surplus displays from design office relocation. Uniform model, no dead pixels, adjustable stands included with tested power and video cables.',
    category: 'Reusable Electronics',
    type: 'offer',
    quantity: '20 monitors',
    condition: 'Excellent',
    location: 'Westside Creative District',
    contact: 'studio@pixelsmith.design',
    organization: 'PixelSmith Digital',
    status: 'available',
    tags: ['monitors', 'displays', 'hdmi', 'cables', 'hardware'],
    estimatedImpactNote: 'Estimated potential diversion: ~180kg hardware landfill diversion.',
    createdAt: '2026-10-25T14:00:00Z',
    safetyNotes: 'Tested for insulation resistance and grounded power cords.'
  },

  // --- SURPLUS PACKAGED FOOD ---
  {
    id: 'demo-food-001',
    isDemoData: true,
    title: '50 Boxes of Factory-Sealed Organic Oats & Honey Granola Bars',
    description: 'Packaged shelf-stable breakfast bars from commercial distributor inventory rebalancing. 24 bars per sealed box (1,200 bars total). Ambient warehouse storage.',
    category: 'Surplus Packaged Food',
    type: 'offer',
    quantity: '50 master cartons (1,200 bars)',
    condition: 'Factory Sealed / Unopened',
    location: 'Central Food Logistics Terminal (Loading Bay 4)',
    contact: 'logistics@pureharvestdist.com',
    organization: 'PureHarvest Organics',
    status: 'available',
    tags: ['granola', 'energy bars', 'shelf-stable', 'nutrition', 'snacks'],
    estimatedImpactNote: 'Estimated food rescue: 1,200 nutritious servings (~450kg organic waste averted).',
    createdAt: '2026-10-25T08:00:00Z',
    safetyNotes: 'Best-by date is 7 months out. Stored in climate-controlled warehouse (20°C). Allergen label: contains oats and almonds.'
  },
  {
    id: 'demo-food-002',
    isDemoData: true,
    title: 'Neighborhood Food Pantry Seeking Sealed Shelf-Stable Breakfast Items & Canned Staples',
    description: 'Weekly food distribution network serving 150 local households. Seeking donations of unopened shelf-stable cereals, canned legumes, and packaged snacks.',
    category: 'Surplus Packaged Food',
    type: 'request',
    quantity: 'Bulk non-perishable lots',
    condition: 'Commercial sealed packaging',
    location: 'Hope Community Kitchen, 5th Avenue',
    contact: 'coord@hopepantry.org',
    organization: 'Hope Community Food Network',
    status: 'available',
    tags: ['granola', 'cereal', 'shelf-stable', 'pantry', 'food-bank'],
    estimatedImpactNote: 'Estimated community benefit: Direct supplemental nutrition for 150 families weekly.',
    createdAt: '2026-10-25T16:20:00Z',
    safetyNotes: 'Intake compliance: Visual seal integrity inspection and strict adherence to shelf-life guidelines.'
  },
  {
    id: 'demo-food-003',
    isDemoData: true,
    title: '80 Commercial Sealed Cans of Organic Black Beans and Crushed Tomatoes',
    description: 'Excess unopened catering pantry inventory from cancelled corporate convention. Commercial 800g airtight tins, pristine condition with zero dents.',
    category: 'Surplus Packaged Food',
    type: 'offer',
    quantity: '80 cans (64kg)',
    condition: 'Factory Sealed Tins',
    location: 'Convention Center Commissary',
    contact: 'chef.antonio@metroevents.com',
    organization: 'Metro Banquet Services',
    status: 'available',
    tags: ['canned', 'legumes', 'tomatoes', 'non-perishable', 'food-rescue'],
    estimatedImpactNote: 'Estimated food rescue: 64kg shelf-stable pantry staple.',
    createdAt: '2026-10-26T07:45:00Z',
    safetyNotes: 'Hermetic seals verified. No rust, bulging, or can seam defects.'
  },

  // --- WATER CONSERVATION ---
  {
    id: 'demo-water-001',
    isDemoData: true,
    title: '1,000L Food-Grade IBC Rainwater Harvesting Tank (High-Pressure Sanitized)',
    description: 'Industrial bulk tote container with steel cage reinforcement and 2-inch bottom discharge valve. Previously contained food-grade vegetable oils; steam sanitized and ready for non-potable rainwater capture.',
    category: 'Water Conservation',
    type: 'offer',
    quantity: '1 Tank (1,000L capacity)',
    condition: 'Steam Sanitized / Food-Grade Safe',
    location: 'Valley Microbrewery Depot',
    contact: 'brewhouse@valleyhops.com',
    organization: 'Valley Craft Brewery',
    status: 'available',
    tags: ['rainwater', 'tote', 'ibc', 'tank', 'irrigation', 'water-saving'],
    estimatedImpactNote: 'Estimated water offset: Captures ~15,000L rainwater per annual rainfall season.',
    createdAt: '2026-10-24T14:30:00Z',
    safetyNotes: 'Food-grade polyethylene. Certified for non-potable irrigation or landscape reuse only. Requires gutter leaf-filter.'
  },
  {
    id: 'demo-water-002',
    isDemoData: true,
    title: 'Community Cooperative Farm Seeking 1,000L Storage Tank & Drip Irrigation Hose',
    description: 'Volunteer-managed 2-acre urban farm growing fresh vegetables for local seniors. Seeking bulk water collection totes and micro-drip emitters to transition off municipal tap water.',
    category: 'Water Conservation',
    type: 'request',
    quantity: '1-2 Large Tanks + Drip Hose',
    condition: 'Clean, safe for agricultural water',
    location: 'Southside Community Garden, Plot 4',
    contact: 'greenthumb@southsidegarden.org',
    organization: 'Southside Permaculture Collective',
    status: 'available',
    tags: ['rainwater', 'tank', 'ibc', 'irrigation', 'garden', 'drip-system'],
    estimatedImpactNote: 'Estimated water offset: Projected 20,000L municipal potable water saved per growing season.',
    createdAt: '2026-10-25T13:40:00Z',
    safetyNotes: 'Agricultural irrigation only; storage unit will be shaded to prevent algae growth.'
  },
  {
    id: 'demo-water-003',
    isDemoData: true,
    title: '200 Meters Commercial Heavy-Duty UV-Resistant Drip Irrigation Line',
    description: 'New surplus roll of 1/2-inch polyethylene irrigation tubing with integrated pressure-compensating drippers every 30cm (0.5 GPH). Ideal for low-water vegetable rows.',
    category: 'Water Conservation',
    type: 'offer',
    quantity: '200 meters (1 spool)',
    condition: 'New on Spool',
    location: 'East County AgroSupply Depot',
    contact: 'sales@agrosupplydepot.com',
    organization: 'AgroSupply Sustainability Team',
    status: 'available',
    tags: ['irrigation', 'drip-line', 'water-saving', 'farming', 'garden'],
    estimatedImpactNote: 'Estimated water efficiency: Reduces irrigation evaporation loss by ~50% compared to sprinkler heads.',
    createdAt: '2026-10-26T06:15:00Z',
    safetyNotes: 'Requires 15-25 PSI inline pressure regulator to prevent emitter detachment.'
  }
];

export function getStoredListings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LISTINGS));
      return INITIAL_SAMPLE_LISTINGS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LISTINGS));
      return INITIAL_SAMPLE_LISTINGS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read listings from localStorage:', err);
    return INITIAL_SAMPLE_LISTINGS;
  }
}

export function saveListing(newListing) {
  const listings = getStoredListings();
  const listingWithId = {
    ...newListing,
    id: newListing.id || `listing-${Date.now()}`,
    isDemoData: false, // User created items are verified local submissions
    createdAt: newListing.createdAt || new Date().toISOString(),
    status: newListing.status || 'available'
  };
  const updated = [listingWithId, ...listings];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return listingWithId;
}

export function updateListingStatus(id, newStatus) {
  const listings = getStoredListings();
  const updated = listings.map(item => item.id === id ? { ...item, status: newStatus } : item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteListing(id) {
  const listings = getStoredListings();
  const updated = listings.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetToSampleListings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LISTINGS));
  return INITIAL_SAMPLE_LISTINGS;
}
