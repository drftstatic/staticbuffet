# Static Buffet - Trash Team × Nulltone.TV
**Version: 0.3.0**

## Overview

Static Buffet is a VJ-focused web application designed for searching, previewing, and queuing free-to-use video content from Archive.org. The application enables real-time video mixing with public domain and Creative Commons licensed footage, featuring dual brand themes (Diner mode and EBN Hijack mode), audio-reactive capabilities, and playlist export functionality. Built as a full-stack TypeScript application, it serves as a "video chaos buffet" for VJs and content creators who need immediate access to royalty-free footage with proper licensing compliance.

## User Preferences

Preferred communication style: Simple, everyday language.

Project description: Trash Team × Nulltone.TV present Static Buffet — all-you-can-eat video chaos, straight from the public domain. Trash Team is an audio/visual collaboration dedicated to turning discarded culture into something worth watching again. Nulltone.TV is the broadcast arm of the resistance — a streaming experiment for alternative programming, glitch aesthetics, and strange transmissions. Built by Fladry Creative (fladrycreative.co).

## Recent Changes

### Version 5.0 Release (August 11, 2025)
- **New Wrestling Themes & Easter Eggs**: Extended theme system with D-Generation X and Max Headroom
  - **D-Generation X Theme (🤘)**: WWE attitude-era styling with blue/pink gradients and DX Mode easter egg
  - **Max Headroom Theme (📺)**: Retro-futuristic green matrix aesthetic with cyberpunk elements
  - **DX Easter Egg**: Triple-click DX button for authentic "Suck It" soundboard with classic quotes
  - **ASCII Mode**: Ultimate retro computing easter egg experience
  - **Live Webcam Integration**: Real-time video mixing capabilities for performance VJs
- **Comprehensive Soundboard System**: Triple-click easter eggs for all six themes
  - **All Themes**: WH (Waffle), OZ (Ozzy), EB (EBN), MX (Max), HH (Hogan), DX buttons with 8-quote soundboards
  - **Theme-Specific Audio**: Authentic quotes and catchphrases for each visual theme
  - **Consistent UX**: Unified triple-click activation pattern across all themes
- **Changelog Modal**: Pop-up changelog accessible from About page without taking permanent UI space
- **Complete Six-Theme System**: Professional VJ toolkit with distinct visual experiences and audio identity

### Version 4.0 Release (August 11, 2025)
- **Expanded Theme System**: Added two new complete visual themes with unique styling
  - **Heavy Metal Theme (🦇)**: Dark Ozzy Osbourne-inspired aesthetic with red accents, metallic textures, and industrial brutality
  - **NWO Hollywood Theme (💪)**: Hulk Hogan wrestling era with red/black/gold colors and NWO stripes
- **Hulkster Easter Egg System**: Interactive HH button with triple-click activation
  - Unlocks "HULKSTER mode" with golden pulsing borders and title transformation
  - Features 8-button soundboard with classic Hogan quotes and NWO phrases
  - Only appears when NWO Hollywood theme is active
- **Customizable Workspace Layout Saver**: Professional layout management system
  - Save/load/edit/delete custom panel configurations with names and descriptions
  - LocalStorage persistence across sessions
  - Three default layouts: Full Interface, Performance Mode, Preparation Mode
  - Icon-only save/load controls integrated into header
- **Theme-Specific Visual Effects**: Enhanced immersion with CSS animations
  - EBN Hijack: Animated scanlines overlay
  - Heavy Metal: Metallic diagonal texture pattern
  - NWO Hollywood: Red wrestling stripes with optional HULKSTER pulsing
- **Complete UI Theme Integration**: All components support all four themes
  - Updated About page with comprehensive theme descriptions
  - Consistent color schemes across all interface elements
  - Professional glass morphism effects for each theme

### Version 0.3.0 Release (August 11, 2025)
- **UI Polish and Professional Interface**: Major cleanup of control buttons for cleaner VJ interface
  - Converted Emergency Mix and Audio Reactive buttons to icon-only controls with tooltips
  - Created GroupedControls component to visually pair action buttons
  - Improved header layout efficiency with compact button design
  - Enhanced professional media workstation aesthetic
- **Theme Switcher Refinement**: Cleaned up dropdown options by removing redundant "Mode" text
  - "🧇 Waffle House Mode" → "🧇 Waffle House"
  - "📺 EBN Hijack Mode" → "📺 EBN Hijack"
- **Button Accessibility**: Maintained functionality while improving visual consistency
  - Added proper tooltips for icon-only buttons
  - Consistent padding and styling across grouped controls
- **Footer System Updates**: Updated build information with stylized tech references
  - Version updated to v0.3.0 with build date 2025.08.11
  - Engine renamed to "FS9000" for retro-futuristic aesthetic
  - Audio system: "web.A.ap1" (Web Audio API stylized)
  - Video system: "htmlcsskewl.run" (HTML5 + CSS Filters stylized)

### Version 0.1.6 Release (January 11, 2025)
- **Critical Video Playback Fix**: Resolved complete video playback failure that was blocking all functionality
  - Root cause: Browser compatibility issues with Archive.org video formats and CORS restrictions
  - Solution: Implemented server-side video proxy with strict browser-compatible format filtering
  - Technical details: HTML5 video elements cannot handle AVI files or follow Archive.org redirects
- **Browser-Compatible Format Selection**: Server now filters to only MP4, WebM, and compatible MOV files
- **Video Proxy System**: Express server streams Archive.org videos through `/api/video/:identifier/:filename` endpoint
- **Enhanced Error Logging**: Added comprehensive video error debugging with error codes and network states
- **Confirmed Working**: Videos now load and play successfully with proper duration, dimensions, and playback controls

### Version 0.1.5 Release (January 11, 2025)
- **Efficient Header Layout**: Redesigned header with three-row structure for optimal space usage
  - Row 1: Compact brand logo + controls on right
  - Row 2: Full-width search bar for maximum usability  
  - Row 3: Filters row
- **Extended Search Range**: Updated year filters to include 2025 in search parameters
- **Fixed Video Playback Issues**: Resolved critical video streaming problems
  - Corrected incomplete video URL construction (was missing filenames)
  - Added smart quality selection prioritizing original files over compressed versions
  - Fixed duplicate function declarations causing TypeScript errors
- **Improved Panel Minimization**: True panel collapse system using CSS Grid for better screen space management
- **Enhanced Video File Selection**: Server now intelligently selects best available video format from Archive.org

### Version 0.1.0 Release (January 11, 2025)
- **Professional Media Workstation Layout**: Transformed interface to panel-based layout inspired by Adobe Premiere and Resolume
- **Distinct Work Zones**: Clear panels for Search/Results, Preview/Player, Queue/Timeline, and Effects/Mix
- **Professional Player Interface**: Added LIVE indicator, timecode display, and professional media deck controls
- **Timeline-Based Queue**: Replaced simple list with horizontal timeline segments for better VJ workflow
- **Panel Headers**: Added professional header styling with monospace typography and status indicators
- Created comprehensive About page explaining Static Buffet's purpose and features
- Added navigation between main app and about section with proper routing
- Detailed information about VJ tools, licensing, and creator collaboration
- Transformed "Diner Mode" to "WAFFLE HOUSE MODE" with authentic diner color scheme
- Updated EBN theme with cyberpunk color scheme: deep purple, neon yellow, electric green
- Enhanced About page with detailed theme explanations and visual descriptions
- Complete professional VJ controls with real-time audio and video processing
- Added keyboard shortcuts for effect presets (1-4 keys for instant switching)
- Implemented fullscreen mode with auto-hiding controls and keyboard shortcuts

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript using Vite as the build tool
- **State Management**: Zustand for global state management with a centralized store pattern
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management and caching
- **Video Playback**: Native HTML5 video elements with custom controls and Web Audio API integration for audio-reactive features
- **Drag & Drop**: @hello-pangea/dnd for queue management and reordering functionality

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API Proxy**: Express routes that proxy requests to Archive.org APIs with rate limiting (10 req/s)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Rate Limiting**: Express-rate-limit middleware to respect Archive.org API constraints

### Data Flow and State Management
- **Search State**: Centralized in Zustand store with filters for year range, duration, and license types
- **Queue Management**: In-memory queue with drag-and-drop reordering, trim points, and loop settings
- **Video Metadata**: Cached using React Query with Archive.org API responses
- **Audio Reactive**: Web Audio API with real-time frequency analysis for beat detection

### Theme System
- **Four Complete Visual Themes**: 
  - **Waffle House**: Off-white backgrounds with ketchup red accents and menu-card aesthetics
  - **EBN Hijack**: Dark charcoal with lime LEDs, animated scanlines, and live broadcast styling
  - **Heavy Metal**: Black/red Ozzy-inspired theme with metallic textures and industrial elements
  - **NWO Hollywood**: Wrestling-inspired red/black/gold with NWO stripes and HULKSTER Easter egg
- **Interactive Easter Eggs**: HH button system with triple-click activation for HULKSTER mode
- **CSS Variables**: Theme-aware color system using CSS custom properties
- **Typography**: Inter font for UI text and JetBrains Mono for technical elements
- **Visual Effects**: Theme-specific overlays (scanlines, metal textures, wrestling stripes)

### Licensing and Compliance
- **License Filtering**: Built-in filtering to show only Public Domain, CC0, and CC-BY content
- **Attribution Tracking**: Automatic attribution data extraction and preservation in exports
- **Export Formats**: JSON playlists and M3U files with full licensing metadata

### Performance Optimizations
- **Debounced Search**: Search input debouncing to reduce API calls
- **Infinite Scroll**: Lazy loading of search results with intersection observer
- **Image Optimization**: Archive.org thumbnail service integration with fallback handling
- **Caching Strategy**: React Query caching for API responses with appropriate stale times

## External Dependencies

### Core API Integration
- **Archive.org Search API**: Primary data source for video content discovery with advanced search capabilities
- **Archive.org Metadata API**: Detailed video information and file listing retrieval
- **Archive.org Thumbnail Service**: Automatic thumbnail generation for video previews

### Development and Build Tools
- **Vite**: Frontend build tool with HMR and development server
- **TypeScript**: Type safety across frontend, backend, and shared schemas
- **ESBuild**: Backend bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Icon library for consistent iconography
- **CSS Variables**: Theme system implementation

### Data and State
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation and formatting utilities
- **CLSX/Tailwind Merge**: Dynamic class name composition

### Browser APIs
- **Web Audio API**: Real-time audio analysis for beat detection
- **Media Devices API**: Microphone access for audio-reactive features
- **Intersection Observer**: Infinite scroll implementation
- **File System Access**: Client-side playlist export functionality