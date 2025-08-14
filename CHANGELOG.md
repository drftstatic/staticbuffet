# Changelog

All notable changes to Static Buffet will be documented in this file.

## [1.0.0] - 2025-08-14

### 🎉 First Stable Release
Static Buffet v1.0.0 marks the first stable release with comprehensive video playback functionality and all core VJ features.

### ✅ Video Playback System - Fully Operational
- **Fixed Default Video**: Changed from broken Atari video to working Archive.org video (At the End of the Rainbow Part II)
- **Enhanced Video Player**: Improved preload settings (auto instead of metadata) with crossOrigin support
- **Robust Error Handling**: Comprehensive error catching with user feedback via toast notifications
- **Metadata Service**: Expanded video format detection for MP4, WebM, OGV, AVI, MOV, M4V, MKV, MPEG2, Cinepack
- **URL Resolution**: All videos now use proxy URLs (/api/video/) instead of direct Archive.org URLs
- **Pop-out Player**: Fully functional with proper video data synchronization and theme support
- **Easter Egg**: Fixed easter egg video URL for Marilyn Manson - Get Your Gunn

### 🔧 Technical Improvements
- **Server Streaming**: Express proxy with range request support (HTTP 206) for smooth video streaming
- **HMR Integration**: Seamless Hot Module Replacement with Vite for development
- **Archive.org API**: Reliable metadata fetching with fallback error handling
- **Queue Management**: Drag-and-drop video adding with metadata validation
- **Cross-Platform**: Full compatibility across desktop and mobile browsers

### 🎨 User Experience
- **10 Complete Themes**: Test Card, Waffle House, EBN Hijack, Heavy Metal, NWO Hollywood, D-Generation X, Max Headroom, Mario, Dakota, Blondie
- **Responsive Design**: Professional VJ workstation interface with floating panels
- **Real-time Search**: Archive.org search with advanced filters and licensing options
- **Professional Features**: Queue management, crossfades, trim points, export capabilities

### 📋 Previous Development (Pre-v1.0)
All previous versions (0.1.0-alpha through 0.7.2) were pre-release development versions with inconsistent numbering. This release consolidates all functionality into the first stable version.

## [0.7.2] - 2025-01-11

### Fixed
- **UI Organization**: Resolved duplicate SearchBar components that were causing multiple Lucky Dip buttons to appear
- **Component Cleanup**: Removed duplicate SearchBars from ResizablePanels.tsx and FloatingPanelsManager.tsx
- **Button Functionality**: Both Lucky Dip and Emergency Mix buttons are now fully functional with proper error handling

### Improved
- **Lucky Dip Button**: Changed to icon-only design (dice icon) for more compact header layout
- **Emergency Mix Integration**: Implemented full functionality in Effects Panel header with queue generation
- **User Feedback**: Added comprehensive toast notifications for button actions and error states
- **Performance**: Cleaner component structure with no unused imports or duplicate code

### Technical
- Lucky Dip performs random searches on public domain vintage content from Prelinger/FedFlix archives
- Emergency Mix generates 10 clips with 2-5 second segments, totaling 2.5 minutes with crossfades
- Both buttons integrate with global store state and provide visual feedback during operations

## [0.1.0-alpha] - 2025-01-11

### Added
- Enhanced license badges with detailed tooltips and external links to Creative Commons and Public Domain licenses
- Drag-and-drop functionality from search results directly to queue
- Hover information overlay on video cards showing license type and duration
- Queue drop zone for empty queue state with visual feedback
- Saved searches functionality integrated into search bar
- Comprehensive keyboard shortcuts system with "?" overlay and Command-K palette
- Persistent filters and search preferences with localStorage integration
- Complete video preloading system with LRU cache for zero-hitch transitions
- Cancellable fetch requests with AbortController for responsive UX
- SessionStorage metadata caching with 15-minute TTL
- Thumbnail retry logic with exponential backoff
- Skeleton loaders for all content types with theme-aware styling
- First-run guided tour covering essential VJ workflow
- Complete soundboard system for seven themes with 8 sounds each
- Ten distinct visual themes: Test Card, Waffle House, EBN Hijack, Heavy Metal, NWO Hollywood, D-Generation X, Max Headroom, Mario Plumber, Dodge Dakota, and Blondie
- Professional media workstation layout with resizable panels
- Audio-reactive capabilities with Web Audio API integration
- Lucky Dip functionality with improved Archive.org search logic
- EDL recording system for professional set documentation
- Comprehensive theme integration across all components and pages

### Technical
- React 18+ with TypeScript and Vite build system
- Zustand for global state management
- Shadcn/ui component library with Radix UI primitives
- TanStack Query for data fetching and caching
- @hello-pangea/dnd for drag-and-drop functionality
- Wouter for lightweight routing
- PostgreSQL with Drizzle ORM (database ready but using in-memory storage)
- Express.js backend with rate limiting
- Archive.org API integration with proper error handling

### Performance
- Intelligent video preloading with smart queue management
- Debounced search with proper request cancellation
- Infinite scroll with intersection observer
- Theme-aware skeleton loading states
- SessionStorage caching for instant navigation
- Optimized thumbnail loading with retry mechanisms

### UI/UX
- Professional VJ workstation interface design
- Complete theme consistency across all 10 visual styles
- Responsive design for desktop and mobile
- Accessible components with proper ARIA labels
- Comprehensive keyboard navigation support
- Professional timeline-based queue management
- Live recording indicators and status displays

## Version History

This is the initial alpha release of Static Buffet v0.1.0-alpha, representing the foundational VJ application with core functionality for video search, preview, queue management, and real-time mixing capabilities.