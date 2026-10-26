// In development, defaults to '/api' (proxied by Vite to http://127.0.0.1:5000).
// In production deployment (e.g. Vercel), can be overridden via VITE_API_BASE_URL.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      ollama_available: false,
      error_message: err.message || 'Cannot connect to backend server. Make sure Flask is running on port 5000.',
      setup_instructions: {
        if_not_installed: 'Download and install Ollama from https://ollama.com',
        if_not_running: "Run 'ollama serve' in your terminal or start Ollama desktop",
        pull_model_command: 'ollama pull qwen2.5:3b'
      }
    };
  }
}

export async function analyzeResource({ title, description, type, model = 'qwen2.5:3b', allow_fallback = true }) {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        type,
        model,
        allow_fallback
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || `HTTP error ${res.status}`);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export async function findMatches(sourceItem, candidateListings) {
  try {
    const res = await fetch(`${API_BASE}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        source_item: sourceItem,
        candidates: candidateListings
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // If backend match endpoint fails, perform client-side fallback matching
    console.warn('Backend match failed, falling back to client-side heuristics:', err);
    return computeClientMatches(sourceItem, candidateListings);
  }
}

// Normalize category for strict category matching
function normalizeCat(cat) {
  if (!cat) return '';
  const c = cat.toLowerCase();
  if (c.includes('electronic') || c.includes('tech') || c.includes('computer') || c.includes('laptop')) return 'electronics';
  if (c.includes('food') || c.includes('bakery') || c.includes('produce') || c.includes('meal')) return 'food';
  if (c.includes('water') || c.includes('rain') || c.includes('tank') || c.includes('irrigation')) return 'water';
  if (c.includes('upcycling') || c.includes('material')) return 'materials';
  if (c.includes('tool') || c.includes('equipment')) return 'tools';
  return c;
}

// Resilient client-side fallback matching
function computeClientMatches(source, candidates) {
  if (!source || !candidates) return { matches: [], direct_matches: [], cross_category_collaborations: [] };
  const sourceWords = (source.title + ' ' + source.description).toLowerCase().split(/\W+/);
  const sourceCatNorm = normalizeCat(source.category);

  const direct_matches = [];
  const cross_category_collaborations = [];

  candidates
    .filter(c => c.id !== source.id)
    .forEach(target => {
      const targetCatNorm = normalizeCat(target.category);
      const isSameCategory = Boolean(sourceCatNorm && targetCatNorm && sourceCatNorm === targetCatNorm);
      const isComplementary = (source.type === 'offer' && target.type === 'request') || 
                              (source.type === 'request' && target.type === 'offer') ||
                              (source.type === 'problem' && target.type === 'offer');

      const targetWords = (target.title + ' ' + target.description).toLowerCase().split(/\W+/);
      const common = sourceWords.filter(w => w.length > 3 && targetWords.includes(w));

      if (isSameCategory && isComplementary) {
        let score = 80;
        const reasons = [
          `Verified Category Match: ${source.category}`,
          `Direct Exchange: ${source.type.toUpperCase()} matches ${target.type.toUpperCase()}`
        ];

        if (common.length > 0) {
          score += Math.min(15, common.length * 5);
          reasons.push(`Matching specifications: ${[...new Set(common)].slice(0, 3).join(', ')}`);
        }

        direct_matches.push({
          target_item: target,
          match_score: Math.min(98, score),
          reasons,
          exchange_type: 'Direct Rescue Match',
          is_direct_match: true,
          category_verified: true
        });
      } else if (isSameCategory && !isComplementary) {
        cross_category_collaborations.push({
          target_item: target,
          match_score: 45,
          reasons: [
            `Same Category (${source.category}), but both are ${source.type}s`,
            'Potential for coalition pooling or logistics consolidation'
          ],
          exchange_type: 'Same-Category Coalition (Not a Direct Match)',
          is_direct_match: false,
          category_verified: true
        });
      } else {
        cross_category_collaborations.push({
          target_item: target,
          match_score: 10,
          reasons: [
            `Incompatible Categories (${source.category} vs ${target.category})`,
            'Cross-sector resource; requires separate handling'
          ],
          exchange_type: 'Cross-Sector Collaborative Opportunity',
          is_direct_match: false,
          category_verified: false
        });
      }
    });

  direct_matches.sort((a, b) => b.match_score - a.match_score);
  cross_category_collaborations.sort((a, b) => b.match_score - a.match_score);

  return {
    source_id: source.id,
    matches: direct_matches,
    direct_matches,
    cross_category_collaborations
  };
}
