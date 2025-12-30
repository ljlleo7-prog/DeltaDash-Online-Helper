# Delta Dash Online Assistant

Produced by Geeks Production Studio — Version 1.0.0

Delta Dash Online Assistant is a comprehensive web-based companion application for the F1-themed motorsports strategy board game "Delta Dash". This React-based application provides players with advanced tools for race strategy calculation, tire management, and game assistance.

## Features

### 🏎️ Strategy Simulation
- **Circuit-based Strategy Calculator**: Simulate race strategies for different F1 circuits
- **Tire Degradation Modeling**: Realistic tire wear simulation based on circuit characteristics
- **Multi-Stint Planning**: Plan multiple pit stops with different tire compounds
- **Push/Conserve Options**: Adjust driving style for optimal race strategy
- **Visual Analytics**: Interactive charts showing lap time deltas and cumulative race time

### 🎲 Driver Roll System
- **Driver Performance Simulation**: Random driver performance rolls with realistic distributions
- **Visual Roll Display**: Animated dice roll interface with F1-themed styling
- **Performance Analysis**: Track driver performance across different race scenarios

### 🌐 Multi-Language Support
- **Bilingual Interface**: Full support for English and Chinese (中文)
- **Dynamic Content**: All text content adapts to selected language
- **Localized Data**: Game information and strategy content available in both languages

### 📰 News & Information
- **Latest Updates**: News feed with game updates and announcements
- **About Section**: Information about Geeks Production Studio and the development team
- **Contact Information**: Direct communication channels for feedback and support

## Technology Stack

- **Frontend**: React 18.3.1 with modern hooks and context API
- **Charts**: Chart.js with React Chart.js 2 for data visualization
- **Data Processing**: Papa Parse for CSV data handling
- **Styling**: Custom CSS with F1-inspired design
- **Deployment**: GitHub Pages with automated build process

## Project Structure

```
DeltaDash-Online-Helper/
├── public/                          # Static assets and build output
│   ├── assets/                      # Images and media files
│   ├── translations/                # Language files (en.json, zh.json)
│   ├── boardgame_data.json          # Game information and content
│   ├── tire_degradation_data.csv    # Circuit and tire performance data
│   └── index.html                   # Main HTML template
├── src/                             # React source code
│   ├── components/                  # React components
│   │   ├── Homepage.js              # Main landing page with news
│   │   ├── StrategyPage.js          # Strategy simulation interface
│   │   ├── DriverRollPage.js        # Driver roll functionality
│   │   ├── AboutPage.js             # About section
│   │   ├── VersionPage.js           # Version information
│   │   ├── FeedbackPage.js          # Contact and feedback form
│   │   ├── Header.js                # Application header
│   │   ├── Navigation.js            # Navigation menu
│   │   └── Footer.js                # Application footer
│   ├── contexts/                    # React contexts
│   │   └── LanguageContext.js       # Language switching functionality
│   └── utils/                       # Utility functions
│       ├── helpers.js               # Helper functions
│       └── frontBackground.js       # Background animation effects
├── build/                           # Production build output
├── generated/                       # GitHub Pages deployment files
├── package.json                     # Project dependencies and scripts
├── server.js                        # Express server for development
└── README.md                        # This file
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone or download the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm start
```
The application will be available at `http://localhost:3005`

### Production Build

Create a production build:
```bash
npm run build
```

### Deployment to GitHub Pages

Deploy to GitHub Pages:
```bash
npm run deploy
```

This will automatically build the project and deploy it to the `gh-pages` branch.

## Usage

### Strategy Simulation
1. Select a circuit from the dropdown menu
2. Add stints for your race strategy
3. Choose tire types and adjust push/conserve settings
4. Set pit stop lap numbers
5. Click "Calculate Strategy" to see the results

### Driver Roll System
1. Navigate to the Driver Roll section
2. Configure roll parameters (number of dice, modifiers)
3. Click "Roll Dice" to simulate driver performance
4. Analyze the results and adjust strategy accordingly

### Language Switching
- Use the language switcher in the header to toggle between English and Chinese
- All interface text and content will update automatically

## Data Files

The application uses several data files for functionality:

- `tire_degradation_data.csv`: Contains circuit-specific tire degradation data
- `boardgame_data.json`: Game information and content in multiple languages
- `news.json`: Latest news and updates
- `about_us.json`: Information about the development team

## Customization

### Adding New Circuits
Edit `public/tire_degradation_data.csv` to add new circuits with their specific tire degradation characteristics.

### Modifying Game Content
Update `public/boardgame_data.json` to modify game information, components, and descriptions.

### Adding Languages
Create new translation files in `public/translations/` following the existing JSON structure.

## Dependencies

### Core Dependencies
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `chart.js`: ^4.5.1
- `react-chartjs-2`: ^5.3.1
- `papaparse`: ^5.5.3

### Development Dependencies
- `react-scripts`: 5.0.1
- `gh-pages`: ^6.3.0

## Browser Support

This application supports all modern browsers including:
- Chrome (last 1 version)
- Firefox (last 1 version)
- Safari (last 1 version)
- Edge (last 1 version)

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Geeks Production Studio
- Email: ljl.leo7@gmail.com
- Bilibili: [Geeks Production Studio](https://space.bilibili.com/)

## Version History

- **v1.0.0**: Initial release with strategy simulation, driver roll system, and multi-language support
- **v1.0 Alpha**: Previous version with basic functionality

---

Good luck on the track — and may your pit strategy always be on point!

*Developed with passion for motorsports and board game enthusiasts.*