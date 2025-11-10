# 🎨 Digital Art Gallery Screensaver

A minimalist, fullscreen digital art gallery that cycles through beautiful paintings from The Metropolitan Museum of Art. Features adjustable refresh intervals, multiple canvas sizes, and enriched Wikipedia context for each artwork.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23-ff6f9c?style=for-the-badge)

## ✨ Features

- **Customizable Refresh Rate**: Choose from 10 refresh intervals (5 seconds to 60 minutes)
- **Multiple Canvas Sizes**: 4 display sizes from small (400×300) to extra large (1000×750)
- **Highlighted Artworks Mode**: Filter to show only museum-selected highlights
- **Enriched Context**: Click any artwork to view detailed information with artist biographies and artwork descriptions fetched from Wikipedia
- **Wikidata Integration**: Enhanced accuracy using Wikidata IDs to retrieve the most relevant Wikipedia information for both artworks and artists
- **Light/Dark Theme**: Toggle between museum lighting modes
- **Advanced Caching**: Intelligent API caching for smooth, fast artwork transitions
- **Responsive Design**: Optimized for all screen sizes and devices
- **No Backend Required**: All data fetched directly from public APIs
- **Fullscreen Support**: Perfect for use as a digital screensaver

## 🚀 Live Demo

Visit the live gallery: [https://mck-art-gallery.vercel.app](https://mck-art-gallery.vercel.app)

## 🏛️ Data Sources

### Primary API
1. **The Metropolitan Museum of Art API** (No API key required)
   - 400,000+ artworks
   - High-quality images with thumbnails
   - Rich metadata including dimensions, culture, period, classification
   - Wikidata URLs for artworks and artists
   - Always available

### Enrichment APIs
2. **Wikidata API** (No API key required)
   - Cross-reference artwork and artist entities
   - Ensures accurate Wikipedia article linking
   - Resolves Wikipedia page titles from Wikidata IDs

3. **Wikipedia REST API** (No API key required)
   - Artist biographies and historical context
   - Artwork descriptions and significance
   - Additional historical and cultural information

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 (latest)
- **Animations**: Framer Motion 12.23
- **APIs**: The Met Museum, Wikidata, Wikipedia
- **Deployment**: Vercel (free tier)
- **React**: 19.2.0

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/art-gallery.git
   cd art-gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/art-gallery.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and build your project
   - No environment variables required!

## 🎨 Customization

### Adjust Settings (in-app)
The gallery includes a settings panel accessible via the settings cog icon:
- **Refresh Frequency**: Choose from 5 seconds to 60 minutes
- **Canvas Size**: Select from 4 different display sizes
- **Theme**: Toggle between light and dark modes
- **Highlighted Only**: Filter to show only museum-curated highlights
- **Auto-show Details**: Automatically display metadata without clicking

### Update Default Settings
Edit `types/settings.ts`:
```typescript
export const defaultSettings: Settings = {
  refreshFrequency: 15000, // 15 seconds
  showDetailsBeforeClick: false,
  theme: 'light',
  canvasSize: 'extra-large',
  onlyHighlighted: false,
};
```

### Modify Colors
Update CSS custom properties in `app/globals.css`:
```css
:root {
  --background: #0f0f0f;        /* Gallery background */
  --foreground: #ededed;        /* Text color */
  --frame-color: #8b7355;       /* Frame color */
  --matte-color: #f8f6f3;       /* Matte color */
}
```

## 📁 Project Structure

```
art-gallery/
├── app/
│   ├── globals.css          # Global styles, frame CSS, and theming
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── Gallery.tsx          # Main gallery component with auto-refresh
│   ├── ArtDisplay.tsx       # Artwork display with frame
│   ├── MetadataLabel.tsx    # Museum-style metadata label
│   ├── ExpandedInfo.tsx     # Expanded details panel with Wikipedia content
│   ├── SettingsPanel.tsx    # Settings configuration panel
│   └── SettingsCog.tsx      # Settings toggle button
├── hooks/
│   └── useFrameSelector.ts  # Random frame selection
├── lib/
│   └── apis/
│       ├── index.ts         # Unified API service with enrichment
│       └── met.ts           # The Met Museum, Wikidata & Wikipedia APIs
├── types/
│   ├── art.ts               # ArtPiece and API response types
│   └── settings.ts          # Settings and configuration types
└── public/                  # Static assets
```

## 🎯 Performance Optimizations

- ✅ Object ID caching: Pre-fetches and caches artwork object IDs to avoid repeated API calls
- ✅ Automatic loading state management: Prevents duplicate API requests
- ✅ Smart retry logic: Tries up to 100 different artworks to find one with a valid image
- ✅ Image preloading for smooth transitions
- ✅ Optimized bundle size with code splitting
- ✅ Lazy loading of images
- ✅ Efficient re-rendering with React hooks
- ✅ Throttled refresh intervals with user customization

## 🐛 Troubleshooting

### No artworks loading
- Check your internet connection
- The Met Museum API is sometimes slow - wait a moment
- Enable "Highlighted Only" mode to filter to museum-curated pieces
- Check browser console for errors

### Build errors
- Clear Next.js cache: `rm -rf .next`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure you're using Node.js 18 or higher

### Settings not persisting
- Settings are stored in localStorage and should persist across sessions
- Check that localStorage is not disabled in your browser
- Clear browser cache if settings appear to be stuck

## 📝 API Reference

### ArtPiece Interface
```typescript
interface ArtPiece {
  title: string;              // Artwork title
  artist: string;             // Artist name
  year: string;               // Year created
  medium: string;             // Art medium
  imageUrl: string;           // Image URL
  museum: string;             // Museum name
  description?: string;       // Enriched description from Wikipedia
  objectId?: string;          // Met Museum object ID
  wikiUrl?: string;           // Wikipedia page URL
  objectUrl?: string;         // Met Museum object page URL
  dimensions?: string;        // Artwork dimensions
  culture?: string;           // Culture/region
  period?: string;            // Historical period
  classification?: string;    // Object classification
  creditLine?: string;        // Museum credit information
  department?: string;        // Museum department
  primaryImageSmall?: string; // Thumbnail image URL
  isHighlight?: boolean;      // Whether it's a museum highlight
  objectWikidataUrl?: string; // Wikidata entity URL for artwork
  artistWikidataUrl?: string; // Wikidata entity URL for artist
}
```

### Settings Interface
```typescript
interface Settings {
  refreshFrequency: RefreshFrequency;  // 5s to 60min
  showDetailsBeforeClick: boolean;     // Auto-show metadata
  theme: Theme;                         // 'light' | 'dark'
  canvasSize: CanvasSize;               // 'small' | 'medium' | 'large' | 'extra-large'
  onlyHighlighted: boolean;             // Show only highlights
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to contribute:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [The Metropolitan Museum of Art](https://www.metmuseum.org/) for their open access collection and API
- [Wikidata](https://www.wikidata.org/) for entity linking and cross-referencing
- [Wikipedia](https://www.wikipedia.org/) for enriched context and biographies
- [Vercel](https://vercel.com/) for hosting and deployment

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [troubleshooting section](#-troubleshooting)

---

**Enjoy exploring art from The Met's collection! 🎨**
