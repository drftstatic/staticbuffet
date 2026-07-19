# Static Buffet - Trash Team × Nulltone.TV

> All-you-can-eat video chaos, straight from the public domain.

A VJ-focused web application for instantly searching, previewing, and queuing free-to-use footage from Archive.org, with audio-reactive features and dual brand themes.

## 🎯 Features

### Core Functionality
- **Archive.org Search**: Search public domain and Creative Commons videos with advanced filters
- **Smart Licensing**: Only displays Public Domain, CC0, and CC-BY content (excludes NC/ND by default)
- **Queue Management**: Drag-and-drop reordering with trim points, loops, and crossfades
- **Video Preview**: Integrated video player with metadata and attribution display
- **Export Options**: Generate JSON playlists and M3U files with full attribution

### Advanced Features
- **Emergency Mix**: Auto-generate 2-3 minute cuts from search results with beat-length segments
- **Audio-Reactive Mode**: Beat-detected jump cuts using Web Audio API
- **Dual Brand Themes**: 
  - **Diner Mode**: Off-white, ketchup red accents, menu-card aesthetic
  - **EBN Hijack Mode**: Dark charcoal, lime LEDs, scanlines, live broadcast aesthetic

### Technical Features
- **Real-time Search**: Debounced search with infinite scroll
- **Responsive Design**: Optimized for desktop VJ setups
- **Offline Export**: Generate playlists without server dependencies
- **Rate Limited**: Respects Archive.org API limits (10 req/s)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/trashteam/static-buffet.git
   cd static-buffet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5001
   ```

## 🎥 What's New in v1.0.0

### ✅ Fully Operational Video Playback
- Fixed all video streaming issues with Archive.org integration
- Enhanced video player with proper preload and CORS settings
- Robust error handling with user feedback via toast notifications
- Pop-out player window with full theme support and synchronization

### 🎨 Complete Theme System
10 professionally designed themes with consistent styling across all components, each offering a unique aesthetic for different VJ styles and preferences.

### 🔍 Advanced Search & Queue
- Real-time Archive.org search with licensing filters
- Drag-and-drop queue management with reordering
- Professional timeline with crossfades and trim points
- Export capabilities for playlist sharing and backup

### 📋 Version 1.0 Status
This is the first stable release of Static Buffet. All previous versions (0.1.0-alpha through 0.7.2) were pre-release development versions with inconsistent numbering. Version 1.0.0 represents a fully functional, production-ready VJ application.

### Production Build (self-hosted)

Runs the full Express server, including the disk-backed video cache and transcoding:

```bash
npm run build
npm start
```

## \ud83d\ude80 Deploying to Vercel

The app deploys to Vercel as a static frontend plus a serverless function:

- **Frontend**: `npm run build:vercel` (`vite build`) outputs to `dist/`, served by Vercel's CDN.
- **API**: the Express app is mounted as a single serverless function at [`api/index.ts`](api/index.ts); `vercel.json` rewrites `/api/*` to it.

Configure environment variables (e.g. `DATABASE_URL`) in the Vercel dashboard rather than `.env`. Import the repo into Vercel and it builds with no extra settings.

**Serverless limitations** \u2014 because Vercel functions are stateless and short-lived:

- **Search and video proxying work.** Video plays through `/api/video/...`, which streams directly from Archive.org without touching disk. Very long videos may hit the function's max duration; short-to-medium clips are fine.
- **The disk video cache, transcoding, and HLS routes do not work** (no persistent filesystem). They are opt-in extras, not on the default playback path. For those features, self-host the server instead (`npm run build && npm start`).

## \ud83c\udfb5 Audio-Reactive Features

Static Buffet includes Web Audio API integration for beat-detected mixing:
- Auto-detect beats and musical phrases
- Jump cuts synchronized to audio rhythm
- Real-time audio analysis for responsive VJ performances

## \ud83c\udfa8 Theme Showcase

Choose from 10 professionally designed themes, each with unique visual identity:
- Consistent styling across all interface elements
- Theme-specific soundboards and effects
- Customizable for different performance environments
- Easy switching during live performances

## \ud83d\udce6 Export & Sharing

- **JSON Playlists**: Full metadata with attribution and licensing
- **M3U Files**: Standard playlist format for external players
- **EDL Recording**: Professional edit decision lists for documentation
- **Attribution Compliance**: Automatic licensing and creator attribution

## \ud83d\udd27 Technical Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **UI Components**: Shadcn/ui with Radix UI primitives
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query with caching
- **Backend**: Express.js with video streaming proxy
- **API Integration**: Archive.org search and metadata
- **Development**: Hot Module Replacement, TypeScript checking

## \ud83c\udfaf Contributing

Static Buffet is a collaborative project between Trash Team and Nulltone.TV. For bug reports, feature requests, or contributions, please contact the development team.

## \ud83d\udcdc License

MIT License - See LICENSE file for details.

---

**Static Buffet v1.0.0** - Professional VJ software for the digital age.  
*Trash Team \u00d7 Nulltone.TV* - Bringing chaos to order, one video at a time.
