import json
import re

invalid_vids = {
    "2bM1H4P9p9W", "3bM1H4P9p9W", "3dE99aM5pQ8", "4g91f3B5WlI", "5H3Qn3i7H8M",
    "7p1H4K9p8T4", "8aFhX3M3p5Q", "9K53Qn3i7H8", "LgC2G_kL3Gk", "T8Hn5-vP5Hw",
    "WbBv70V1S6c", "_N0k0P8w8vU", "a8R4K4w9a8Q", "b9P1O4K9p8T", "d9P4H4G9p9Q",
    "f1v43Z2yMhU", "fJ6c2h5p5rA", "j9fO4x6q5Ww", "m2gL8P6FvEE", "m5R4K4w9a8Q",
    "o4P1H2L9p8T", "o4P1H3L9w8R", "o4P2H4M9w8R", "q9D4H4G9p9Q", "r9P2K2G9p9Q",
    "t7P2G1J9p9L", "t9P2H2G9p9Q", "tS9P4H4G9p9", "uP8w1nK99aM", "z9P1H3M3p5Q"
}

# Scan recipesData.json
with open("recipesData.json", "r", encoding="utf-8") as f:
    recipes = json.load(f)
    print("--- Scan of recipesData.json ---")
    for r in recipes:
        bad = []
        if 'youtubeVideoId' in r and r['youtubeVideoId'] in invalid_vids:
            bad.append(r['youtubeVideoId'])
        if 'youtubeVideoIds' in r:
            for vid in r['youtubeVideoIds']:
                if vid in invalid_vids:
                    bad.append(vid)
        if bad:
            print(f"Recipe: {r['id']} ({r['title']}) uses invalid: {bad}")
