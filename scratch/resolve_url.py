import urllib.request
import re

url = "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHPH8eyRNoAZHE3g5kijTwieG6b556hdXCtoblrTYTVhv4Wz-Ny6ljUREXyUNd0rd0tawTiepCGnmhSFjru1itWNXlg1272XgR1Mhs53tKXrkCGotkB4xtvbjCIHo63pdk="
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8', errors='ignore')
        # Look for youtube watch links in the response HTML
        links = re.findall(r'https?://(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]+)', html)
        if links:
            print("Found video IDs in HTML:", list(set(links)))
        else:
            final_url = response.geturl()
            print("Final redirected URL:", final_url)
            vid_match = re.search(r'v=([^&]+)', final_url)
            if vid_match:
                print("Video ID from URL:", vid_match.group(1))
except Exception as e:
    print("Failed to resolve:", e)
