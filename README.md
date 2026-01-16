# Running Calculator Suite

A comprehensive web-based calculator suite for runners, featuring 7 professional tools for training and race planning.

## Features

- **VO2 Max Calculator** - Estimate aerobic capacity using VDOT, FMR, or Cooper test methods
- **Pace Calculator** - Calculate running pace, speed, and splits for any distance
- **Race Time Predictor** - Ultra-accurate predictions from 5K to 100 miles with personalized calibration
- **Age Grading Calculator** - Compare performances across ages using WMA 2023 standards
- **Elevation Adjustment** - Adjust race predictions for elevation gain using Naismith's Rule
- **Training Zones** - Calculate heart rate and pace zones for optimal training
- **Nutrition Calculator** - Plan calories, carbs, hydration, and sodium needs for races

## Setup

### Option 1: Direct Use

Simply open `index.html` in any modern web browser. No installation required.

```bash
# Clone the repository
git clone https://github.com/StephenCousins/Running-Calculator.git

# Open in browser
open index.html
# or on Windows:
start index.html
# or on Linux:
xdg-open index.html
```

### Option 2: Local Server

For development or if you encounter CORS issues with the age grading data:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Option 3: GitHub Pages

The calculator is designed to work on GitHub Pages. Simply enable GitHub Pages in your repository settings pointing to the `main` branch.

## Files

| File | Description |
|------|-------------|
| `index.html` | Main application (HTML, CSS, and JavaScript) |
| `agegradingfactors.json` | WMA 2023 age grading data |
| `CODE_ANALYSIS.md` | Technical analysis and documentation |

## Browser Support

Works in all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technical Details

- **No dependencies** - Pure HTML, CSS, and JavaScript
- **No build process** - Works directly in the browser
- **Responsive design** - Works on desktop and mobile
- **Offline capable** - Only requires internet for initial age grading data load

## Data Sources

- **Age Grading**: World Masters Athletics (WMA) 2023 standards
- **Race Prediction**: Riegel formula with personalized fatigue exponents
- **Training Zones**: Karvonen heart rate reserve method
- **Elevation**: Modified Naismith's Rule

## License

MIT License - Feel free to use and modify for your own purposes.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
