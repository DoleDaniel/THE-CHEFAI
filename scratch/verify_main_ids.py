import urllib.request
import json
import sys

main_vids = {
  "ng-jollof": "lMviiY8CoaQ",
  "ng-egusi": "xVQ0dDDUil4",
  "ng-akara": "UmRpVzo58x8",
  "ng-moinmoin": "S8GxrbqpoO8",
  "ng-yam-porridge": "sEttP7leV78",
  "ng-suya-chicken": "xQ-Ulm5wOUQ",
  "mx-tacos": "SYOnZPWTOuk",
  "mx-quesadilla": "hFLFBVnImU4",
  "mx-burrito": "VyEJTODAd2M",
  "mx-enchiladas": "ptp4NcWxfNE",
  "mx-guacamole": "a6yCQdx3Pkg",
  "br-feijoada": "_EsP0oDXA3g",
  "br-coxinha": "RMtQhqDHD-M",
  "br-paodequeijo": "nWuO3NfXkEg",
  "br-moqueca": "MOv5_fUiar8",
  "it-pasta-beans": "HS1Ox1miZYw",
  "it-risotto": "GJ_lGFVyecM",
  "it-bruschetta": "Q3xg35pcLyo",
  "it-pizza": "vcfNpDtVqOw",
  "as-fried-rice": "vxltEx-6IkA",
  "as-baobuns": "Ui_rOkM0bAk",
  "as-noodles": "4tTYIU-hRX0"
}

sys.stdout.reconfigure(encoding='utf-8')

for name, vid in main_vids.items():
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            print(f"{name} ({vid}) -> VALID: {data.get('title')}")
    except Exception as e:
        print(f"{name} ({vid}) -> INVALID: {e}")
