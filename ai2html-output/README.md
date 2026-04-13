# AI2HTML Output Folder

This folder stores the exported ai2html files from Adobe Illustrator.

## Contents

After exporting each chart using Illustrator's ai2html script, you'll have:

### Chart 1: Divergence
- `chart_01_divergence.html` ← Extract ai2html content from this
- `chart_01_divergence-Artboard_1.png` ← Copy to root folder

### Chart 2: Composition
- `chart_02_composition.html` ← Extract ai2html content from this
- `chart_02_composition-Artboard_1.png` ← Copy to root folder

### Chart 3: Sunburst
- `sunburst_chart.html` ← Extract ai2html content from this
- `sunburst_chart-Artboard_1.png` ← Copy to root folder

## Workflow

1. **Export from Illustrator**: File → Scripts → ai2html
2. **Save to**: `wiretap-story/ai2html-output/`
3. **Extract content**: Copy the ai2html HTML/SVG from each `.html` file
4. **Insert into template**: Paste into corresponding placeholder in `../index-ai2html.html`
5. **Copy PNG files**: `cp *.png ../` (to parent directory)

## See Also

- `../EXPORT_CHECKLIST.md` — Step-by-step export instructions
- `../AI2HTML_INTEGRATION_GUIDE.md` — Detailed integration guide
- `../index-ai2html.html` — Main template file with placeholders
