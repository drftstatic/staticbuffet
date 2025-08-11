# Changelog

All notable changes to Static Buffet will be documented in this file.

## [Unreleased]

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