import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000"

def test_endpoints():
    print("[1] Testing /api/health...")
    try:
        r = requests.get(f"{BASE_URL}/api/health", timeout=5)
        print(f"Status: {r.status_code}")
        print(json.dumps(r.json(), indent=2))
        assert r.status_code == 200
        health_data = r.json()
        assert health_data.get("ollama_available") is True
        print("[OK] Health check PASSED\n")
    except Exception as e:
        print(f"[FAIL] Health check FAILED: {e}")
        return False

    print("[2] Testing /api/analyze with real local Ollama (qwen2.5:3b)...")
    payload = {
        "title": "15 Working ThinkPad Laptops",
        "description": "Company decommissioned 15 working laptops with Intel Core i5 and chargers. Looking to reuse safely.",
        "type": "offer",
        "model": "qwen2.5:3b"
    }
    t0 = time.time()
    try:
        r = requests.post(f"{BASE_URL}/api/analyze", json=payload, timeout=60)
        dur = round(time.time() - t0, 2)
        print(f"Status: {r.status_code} in {dur}s")
        data = r.json()
        print("Analysis Keys:", list(data.get("analysis", {}).keys()))
        print("Category:", data.get("analysis", {}).get("category"))
        print("Solutions Count:", len(data.get("analysis", {}).get("practical_solutions", [])))
        print("Safety Warnings:", data.get("analysis", {}).get("safety_warnings"))
        assert r.status_code == 200
        assert "analysis" in data
        assert len(data["analysis"].get("practical_solutions", [])) > 0
        assert len(data["analysis"].get("safety_warnings", [])) > 0
        print("[OK] AI Analysis PASSED with real Ollama qwen2.5:3b!\n")
    except Exception as e:
        print(f"[FAIL] AI Analysis FAILED: {e}")
        return False

    print("[3] Testing /api/match...")
    match_payload = {
        "source_item": {
            "id": "item-1",
            "title": "12 Working ThinkPad Laptops",
            "type": "offer",
            "category": "Reusable Electronics",
            "description": "Functional laptops with chargers for school",
            "tags": ["laptops", "education", "cables"],
            "location": "Downtown"
        },
        "candidates": [
            {
                "id": "cand-1",
                "title": "High School STEM Club Needs Laptops",
                "type": "request",
                "category": "Reusable Electronics",
                "description": "Seeking laptops for coding students",
                "tags": ["laptops", "education"],
                "location": "Downtown"
            },
            {
                "id": "cand-2",
                "title": "Community Garden Needs Water Tanks",
                "type": "request",
                "category": "Water Conservation",
                "description": "Rainwater collection barrels",
                "tags": ["rainwater", "water"],
                "location": "North"
            }
        ]
    }
    try:
        r = requests.post(f"{BASE_URL}/api/match", json=match_payload, timeout=5)
        assert r.status_code == 200
        data = r.json()
        matches = data.get("matches", [])
        cross_collabs = data.get("cross_category_collaborations", [])
        print(f"Direct matches count: {len(matches)}")
        print(f"Cross-category count: {len(cross_collabs)}")
        
        # VERIFY STRICT CATEGORY CONSTRAINT:
        # Laptops MUST match STEM Laptops, but MUST NEVER match Water Tanks as a direct match
        assert len(matches) == 1, f"Expected exactly 1 direct category match, got {len(matches)}"
        assert matches[0]["target_item"]["id"] == "cand-1", "Direct match must be the STEM Club Laptops"
        assert matches[0]["is_direct_match"] is True
        assert matches[0]["category_verified"] is True
        assert matches[0]["match_score"] >= 80

        # Verify cross-category segregation:
        assert len(cross_collabs) == 1
        assert cross_collabs[0]["target_item"]["id"] == "cand-2"
        assert cross_collabs[0]["is_direct_match"] is False
        assert cross_collabs[0]["match_score"] <= 20
        
        print(f"Top direct match: {matches[0]['match_score']}% for '{matches[0]['target_item']['title']}'")
        print(f"Direct match reasons: {matches[0]['reasons']}")
        print(f"Cross-category segregated item: '{cross_collabs[0]['target_item']['title']}' (Score: {cross_collabs[0]['match_score']}%)")
        print("[OK] Strict category constraint verified! Water tank correctly excluded from direct matches.\n")
    except Exception as e:
        print(f"[FAIL] Match endpoint FAILED: {e}")
        return False

    print("ALL TESTS PASSED SUCCESSFULLY!")
    return True

if __name__ == "__main__":
    test_endpoints()
