import re

def shift_search(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()

        # Find search bar block
        search_block_match = re.search(r'\{/\* Top Search Bar \*/\}.*?</button>\s*</div>', text, re.DOTALL)
        if search_block_match and "max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8" in text:
            search_block = search_block_match.group(0)
            
            # Remove from original location
            text = text.replace(search_block, "")
            
            # Place it above the flex split
            text = text.replace(
                '<main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">',
                '<main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">\n        <div className="w-full mb-6 z-30">\n          ' + search_block + '\n        </div>\n        <div className="flex gap-8">'
            )
            text = text.replace('</main>', '</div>\n      </main>')
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(text)
    except FileNotFoundError:
        pass

shift_search('src/app/jobs/page.tsx')
shift_search('src/app/teachers/page.tsx')
print("Shifted search bar.")
