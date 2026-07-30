import urllib.request
import re

urls = {
    "moin-moin-1": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE_FMcCic-HQHHgfFw_2Cupau6SCqsNNVDo5E2_50v4KZeCEcGjZ0iw11F_ZkDjQ8omQfgdIqGLEVpDmflUu3qs4zRMq8Zgy49uf_WdDeDCmBeFwiU6QR98Ij41hNM_HuZY",
    "enchiladas-1": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEHMi23O6YkWnbykGmNbrWFo2erufzaA5Dehifz3dF16zJYH3J0w9QOh4A7ESlnwqfkt6QYbAf4sD1bXaLAAthDKfHHfdwO4xpsf0SFBq3C7XN4JLl6wc6_A0n1dqmVCBVI",
    "guacamole-1": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGl8G-Y74LXFbZ8mTc4cDN7rNHlhbIevqcx6mfRtguf9mfDTBd6Wd-UCZF673OGv0BHB9C5904HLl-stYtE3KSNaj5LBE4-zrxbIllAAaccsnhXcH48Q6RgE_tJMK5qgSvV",
    "pizza-1": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF38zMvsbOlhmo-aR7pCZNAndcB3iu5z1REmLj573lGr0XNUthz3eaLkTQfJTUcfH-4inLl71ifLaaNaDU01QSw7EfmbEIeC82sTJwlzE1IfAyN0ywwMeiQZ6fqAiy7X-xQ",
    "risotto-1": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEOMgLFfoHVCv7DQLoPnPq5xj5G6ZzPRcz4KeX2LZ3cQx7DHvv5TYPygxD-6fFgXb1hU8bkMkLSGvnVR8MKJBNRIhsg0_pzrSPm3VjboaltH8fKBu_Qm8Tg6k9ILFTEe9FF",
    "fried-rice-1": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEtBsTu1HfH1bD5tTS5MBg8NL0hIYU4a6ANR34ZOrIvNs38S3m5IR0ncZ0Rk4UIEY1RRDG1WyJqSPRCeMQ0Bxq_EhngsAv64_HF9CWI9W1ziAs-TtUJAX9neqT-h1ahFddA",
    "bao-buns-1": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF_oJfsqCFML-G76FVHs2znojE9AFq8EDp3GVgCgPgoaaL7YKvhBf63USrdMffDnDbWZuuMjnL636_bZsmFE039QmaabQvj0lJjcQQXknyGe6jUjBz1Edi2ZLKxNQGGqeQr",
    "noodles-1": "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGDboqa_eW3QS9x76SOIQV4QxnE2jvuzV_uWged4HU9OC-TcNQJ4mXwldF9UyhS2Xd8uCLrigSfNQroUzWkFTU1_l3qXdtlK8cW3nW-Y4yk6mCQwmGCpy4nbeoZvz_ni7N7"
}

opener = urllib.request.build_opener(urllib.request.HTTPRedirectHandler)
urllib.request.install_opener(opener)

for name, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            final_url = response.geturl()
            # Extract video ID from youtube URL
            vid_match = re.search(r'v=([^&]+)', final_url)
            if vid_match:
                print(f"{name} -> {vid_match.group(1)} (URL: {final_url})")
            else:
                print(f"{name} -> No video ID in: {final_url}")
    except Exception as e:
        print(f"Error on {name}: {e}")
