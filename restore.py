import re

with open('app_old.js', 'r', encoding='utf-16-le') as f:
    old_content = f.read()

with open('app.js', 'r', encoding='utf-8') as f:
    new_content = f.read()

# Find the block between setupEventListeners and setupCountryDropdown
match = re.search(r'(function setupEventListeners\(\) \{.*?\n\})\s*function setupCountryDropdown', old_content, re.DOTALL)
if match:
    func_block = match.group(1)
    
    # Insert before setupCountryDropdown in app.js
    if 'function setupCountryDropdown' in new_content:
        updated = new_content.replace('function setupCountryDropdown', func_block + '\n\nfunction setupCountryDropdown')
        with open('app.js', 'w', encoding='utf-8') as f:
            f.write(updated)
        print("Successfully restored setupEventListeners and setupYoutubeApiKeyModal.")
    else:
        print("Could not find setupCountryDropdown in app.js.")
else:
    print("Could not extract functions from app_old.js.")
