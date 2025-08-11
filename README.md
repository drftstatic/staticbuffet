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
   git clone <repository-url>
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
   http://localhost:5000
   ```

### Production Build

```bash
npm run build
npm start
