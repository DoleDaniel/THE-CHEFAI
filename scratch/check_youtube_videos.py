import json
import re
import urllib.request
import urllib.error

def check_video(vid):
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            return True, data.get('title', 'Unknown Title')
    except urllib.error.HTTPError as e:
        return False, f"HTTP Error {e.code}"
    except Exception as e:
        return False, f"Error: {e}"

# 1. Parse video IDs from recipes.js
js_vids = set()
with open("recipes.js", "r", encoding="utf-8") as f:
    content = f.read()
    # Find all occurrences of youtubeVideoId: "..."
    matches = re.findall(r'youtubeVideoId:\s*["\']([^"\']+)["\']', content)
    js_vids.update(matches)

# 2. Parse video IDs from recipesData.json
json_vids = set()
with open("recipesData.json", "r", encoding="utf-8") as f:
    data = json.load(f)
    for r in data:
        if 'youtubeVideoId' in r:
            json_vids.add(r['youtubeVideoId'])
        if 'youtubeVideoIds' in r:
            for vid in r['youtubeVideoIds']:
                json_vids.add(vid)

all_vids = js_vids.union(json_vids)
print(f"Found {len(all_vids)} unique video IDs to test.")

results = {}
for vid in sorted(all_vids):
    is_valid, info = check_video(vid)
    results[vid] = (is_valid, info)
    status = "VALID" if is_valid else "INVALID"
    print(f"{vid} -> {status} ({info})")

invalid_vids = [v for v, r in results.items() if not r[0]]
print("\n--- Summary of Invalid Video IDs ---")
print(f"Total invalid: {len(invalid_vids)}")
for v in invalid_vids:
    print(f"- {v}: {results[v][1]}")
