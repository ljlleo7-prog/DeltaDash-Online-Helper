git subtree push --prefix public origin gh-pages
# Delta Dash Online Assistant

Produced by Geeks Production Studio — Version 1.0 Alpha

Delta Dash Online Assistant is a web-based companion for the F1-themed motorsports boardgame "Delta Dash". This site helps players:

- Get information about the boardgame
- Calculate race strategy (pit stops, tyre choices, lap management)
- Send feedback directly to Geeks Production Studio

This project is a static frontend application built with HTML, CSS, and JavaScript and is ready for hosting on GitHub Pages.

## Features

- Motorsport-styled UI tailored for the Delta Dash boardgame
- Interactive chat assistant with race-related guidance
- Strategy calculator for in-game decision support
- Feedback form with local and web-mail submission paths

## Project Structure

```
DeltaDash-Online-Helper/
├── public/
│   ├── index.html      # Main HTML interface
│   ├── styles.css      # Styling and animations
│   └── script.js       # Client-side JavaScript logic
├── package.json        # Project metadata
├── README.md           # This file
└── LICENSE             # Project license
```

## Getting Started

### Local Preview

1. Open `public/index.html` directly in your browser, or serve it locally:
   ```bash
   # From project root
   python3 -m http.server 8000
   # then open http://localhost:8000/public/ in your browser
   ```

### Deployment to GitHub Pages

1. Push your repository to GitHub
2. Go to repository Settings → Pages
3. Choose `main` branch and `/root` (or `gh-pages` branch if you prefer)
4. The site will become available at `https://<yourusername>.github.io/DeltaDash-Online-Helper/`

## Usage

Use the Chat tab for natural-language questions about the game, the Strategy tab to run calculations for current race scenarios, the Version tab for release info, and the Feedback tab to contact Geeks Production Studio.

## Customization

Add or edit assistant responses in `public/script.js` or tune visual styles in `public/styles.css`.

## Version

This release is **v1.0 Alpha**.

## License

See `LICENSE` for license details.

## Contact

Geeks Production Studio — email: `ljl.leo7@gmail.com`

---

Good luck on the track — and may your pit strategy always be on point!
