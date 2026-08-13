import re

with open('src/app/globals.css', 'r', encoding='utf-8') as f:
    text = f.read()

# Make Instrument Serif a bit bolder via stroke
if '-webkit-text-stroke' not in text:
    text = text.replace(
        "@utility font-serif {\n  font-family: 'Instrument Serif', serif !important;\n}",
        "@utility font-serif {\n  font-family: 'Instrument Serif', serif !important;\n  -webkit-text-stroke: 0.5px currentColor;\n}"
    )
    with open('src/app/globals.css', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated font-serif in globals.css")
