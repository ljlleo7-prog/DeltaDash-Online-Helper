# Delta Dash Online Assistant

A sleek, modern web-based assistant application built with pure HTML, CSS, and JavaScript. Perfect for deployment on GitHub Pages!

## Features

✨ **Stylized Interface** - Beautiful gradient design with smooth animations
🚀 **Lightweight** - No backend dependencies, pure frontend solution
📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
💬 **Interactive Chat** - Real-time message responses with built-in assistant logic
⚡ **GitHub Pages Ready** - Deploy directly to GitHub Pages with zero configuration

## Project Structure

```
DeltaDash-Online-Helper/
├── public/
│   ├── index.html      # Main HTML interface
│   ├── styles.css      # Styling and animations
│   └── script.js       # Client-side JavaScript logic
├── package.json        # Project metadata
├── README.md          # This file
└── LICENSE            # MIT License
```

## Getting Started

### Local Development

1. Navigate to the project directory:
   ```bash
   cd DeltaDash-Online-Helper
   ```

2. Open `public/index.html` directly in your browser, or use a local server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (with http-server package)
   npx http-server public -p 8000
   ```

3. Visit `http://localhost:8000` in your browser

### Deployment to GitHub Pages

1. Push your repository to GitHub
2. Go to your repository settings
3. Scroll to "GitHub Pages" section
4. Select `main` branch and `/root` folder as source
5. Your site will be live at `https://yourusername.github.io/DeltaDash-Online-Helper/`

**Alternative: If using a `gh-pages` branch:**
```bash
# Push the public folder to gh-pages branch
git subtree push --prefix public origin gh-pages
```

## Usage

Simply type your message in the input field and press Enter or click the Send button. The assistant will respond with contextual responses based on your input.

### Available Commands

- **hello/hi** - Greeting response
- **help** - Get assistance information
- **time** - Display current time
- **date** - Display today's date
- **thanks/thank you** - Acknowledgment
- **bye/goodbye** - Farewell message

## Customization

### Add More Assistant Responses

Edit the `assistantResponses` object in `public/script.js`:

```javascript
const assistantResponses = {
  'your-keyword': 'Your custom response',
  'another-keyword': 'Another response'
};
```

### Customize Colors

Modify the color values in `public/styles.css`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

MIT License - See LICENSE file for details

## Author

Created for the Delta Dash Online Assistant project

---

**Ready to deploy?** Push to GitHub and enable GitHub Pages in your repository settings!
