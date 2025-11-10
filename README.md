# 🎨 Digital Art Gallery Screensaver

A minimalist, fullscreen digital art gallery that cycles through beautiful paintings from world-renowned museums. Displaying each artwork for 30-60 seconds with elegant museum-style metadata labels.

![Digital Art Gallery](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **Auto-Rotating Paintings**: Displays a random painting every 45 seconds with smooth fade transitions
- **Museum-Style Labels**: Elegant metadata display showing artist, title, year, medium, and museum
- **Dynamic Frame Styles**: Randomly selected frames (classic, thin black, gold, ornate, modern) for each artwork
- **Rich Context**: Click any artwork to expand detailed information and artist biographies (via Wikipedia)
- **Single API Source**: Fetches from The Metropolitan Museum of Art API
- **Responsive Design**: Optimized for desktop, tablet, mobile, and smart TVs
- **No Backend Required**: All data fetched directly from public APIs
- **Fullscreen Support**: Perfect for use as a digital screensaver

## 🚀 Live Demo

Visit the live gallery: [https://your-gallery.vercel.app](https://your-gallery.vercel.app)

## 🏛️ Data Sources

### Primary API
1. **The Metropolitan Museum of Art API** (No API key required)
   - 400,000+ artworks
   - High-quality images
   - Rich metadata
   - Always available

### Secondary API
2. **Wikipedia REST API** (No API key required)
   - Artist biographies
   - Artwork context and stories
   - Additional historical information

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Animations**: Framer Motion
- **APIs**: The Met Museum, Wikipedia
- **Deployment**: Vercel (free tier)

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

### Change Rotation Interval
Edit `components/Gallery.tsx`:
```typescript
const ROTATION_INTERVAL = 45000; // 45 seconds (default)
```

### Modify Frame Styles
Edit `app/globals.css` and look for `.frame-*` classes:
```css
.frame-classic { /* Your custom frame */ }
.frame-thin-black { /* Your custom frame */ }
```

### Update Colors
Modify CSS custom properties in `app/globals.css`:
```css
:root {
  --background: #0f0f0f;        /* Gallery background */
  --foreground: #ededed;        /* Text color */
  --frame-color: #8b7355;       /* Frame color */
  --matte-color: #f8f6f3;       /* Matte color */
}
```

### Add New Museums
Create a new API file in `lib/apis/`:
```typescript
// lib/apis/newmuseum.ts
export async function getRandomNewMuseumPainting(): Promise<ArtPiece | null> {
  // Your API implementation
}
```

Then update `lib/apis/index.ts` to include your new source.

## 📁 Project Structure

```
art-gallery/
├── app/
│   ├── globals.css          # Global styles and frame CSS
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── Gallery.tsx          # Main gallery component
│   ├── ArtDisplay.tsx       # Artwork display with frame
│   ├── MetadataLabel.tsx    # Museum-style label
│   └── ExpandedInfo.tsx     # Expanded details panel
├── hooks/
│   └── useFrameSelector.ts  # Random frame selection
├── lib/
│   └── apis/
│       ├── index.ts         # Unified API service
│       └── met.ts           # The Met Museum API
└── types/
    └── art.ts               # TypeScript definitions
```

## 🎯 Performance Optimizations

- ✅ Image preloading for smooth transitions
- ✅ Client-side caching of API responses
- ✅ Optimized bundle size with code splitting
- ✅ Lazy loading of images
- ✅ Static generation where possible
- ✅ Efficient re-rendering with React hooks

## 🐛 Troubleshooting

### No artworks loading
- Check your internet connection
- The Met Museum API is sometimes slow - wait a moment
- Check browser console for errors

### Build errors
- Clear Next.js cache: `rm -rf .next`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure you're using Node.js 16 or higher

## 📝 API Reference

### ArtPiece Interface
```typescript
interface ArtPiece {
  title: string;           // Artwork title
  artist: string;          // Artist name
  year: string;            // Year created
  medium: string;          // Art medium
  imageUrl: string;        // Image URL
  museum: string;          // Museum name
  description?: string;    // Optional description
  objectId?: string;       // Optional object ID
  wikiUrl?: string;        // Optional Wikipedia link
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

- [The Metropolitan Museum of Art](https://www.metmuseum.org/) for their open access collection
- [Wikipedia](https://www.wikipedia.org/) for additional context and biographies
- [Vercel](https://vercel.com/) for hosting and deployment

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [troubleshooting section](#-troubleshooting)

---

**Enjoy your art gallery! 🎨**
