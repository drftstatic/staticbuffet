# Static Buffet - Trash Team × Nulltone.TV
**Version:** 0.1.0-alpha (Pre-release)
**Release Date:** January 11, 2025

## Overview
Static Buffet is a professional VJ-focused web application designed for searching, previewing, and queuing free-to-use video content from Archive.org. It enables real-time video mixing with public domain and Creative Commons licensed footage. The application features ten complete visual themes, enhanced drag-and-drop functionality, comprehensive keyboard shortcuts, audio-reactive capabilities, and professional EDL recording. Built as a full-stack TypeScript application, it serves as a "video chaos buffet" for VJs and content creators needing immediate access to royalty-free footage with proper licensing compliance, embodying the vision of turning discarded culture into something new and providing alternative programming.

## Recent Changes (v0.1.0-alpha)
- ✅ Enhanced license badges with detailed tooltips and external Creative Commons/Public Domain links
- ✅ Implemented comprehensive drag-and-drop system from search results to queue
- ✅ Added hover information overlays on video cards with license and duration details
- ✅ Created smart queue drop zone for empty states with theme-aware styling
- ✅ Integrated saved searches functionality with persistent storage
- ✅ Built complete keyboard shortcuts system with "?" overlay and Command-K palette
- ✅ Enhanced video preloading with LRU cache for zero-hitch transitions
- ✅ Added cancellable requests and intelligent thumbnail retry logic
- ✅ Implemented sessionStorage metadata caching with 15-minute TTL
- ✅ Created skeleton loaders for all content types with theme integration
- ✅ Completed first-run guided tour covering essential VJ workflow
- ✅ **NEW**: Responsive Layout Hint Animations - Interactive UI that shows layout adaptations across mobile/tablet/desktop with smooth transitions and visual cues

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript, using Vite.
- **State Management**: Zustand for global state.
- **UI Components**: Shadcn/ui (built on Radix UI primitives) with Tailwind CSS.
- **Routing**: Wouter.
- **Data Fetching**: TanStack Query (React Query).
- **Video Playback**: Native HTML5 video elements with custom controls, Web Audio API integration, and intelligent preloading system.
- **Drag & Drop**: @hello-pangea/dnd for queue management.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Database**: PostgreSQL with Drizzle ORM.
- **Database Provider**: Neon Database (@neondatabase/serverless).
- **API Proxy**: Express routes for Archive.org APIs with rate limiting.
- **Session Management**: Connect-pg-simple for PostgreSQL session storage.
- **Rate Limiting**: Express-rate-limit.

### Data Flow and State Management
- **Search State**: Centralized in Zustand store with filters for year range, duration, and license types.
- **Queue Management**: In-memory queue with drag-and-drop, trim points, and loop settings.
- **Video Metadata**: Cached using React Query with Archive.org API responses.
- **Audio Reactive**: Web Audio API with real-time frequency analysis.
- **EDL Recording**: Professional Edit Decision List system for capturing every cut, effect, and timing during live sets.
- **First-Run Tour**: 4-step guided workflow tour for new users covering Search → Preview/Trim → Add to Queue → Emergency Mix.

### Theme System (v0.1.0-alpha Complete)
- **Ten Complete Visual Themes**: Test Card (Default), Waffle House, EBN Hijack, Heavy Metal, NWO Hollywood, D-Generation X, Max Headroom, Mario Plumber, Dodge Dakota, and Blondie. Each theme has distinct visual effects, gradients, and animations.
- **Universal Theme Integration**: All 10 themes fully integrated across every component including new license badges, drag-and-drop overlays, queue drop zones, saved searches UI, and keyboard shortcut overlays.
- **Theme Consistency**: Complete visual treatment across all pages (Home, About) with comprehensive styling for headers, panels, text, icons, interactive elements, tooltips, and modal overlays.
- **Theme Access**: Dakota and Blondie themes accessible via dropdown theme selector for cleaner interface, all other themes via dedicated buttons.
- **Interactive Easter Eggs**: Triple-click activations for theme-specific soundboards and visual transformations with complete audio feedback.
- **Complete Soundboard System**: Seven themes feature fully implemented soundboards with 8 sounds each, using toast notification feedback and triple-click activation pattern.
- **Enhanced UI Components**: All new components (license badges, drag overlays, drop zones) inherit theme styling automatically through CSS variables and theme functions.
- **Styling Architecture**: CSS Variables for theming, Inter and JetBrains Mono fonts, theme-specific CSS overlays, and comprehensive theme function for consistent styling across components.
- **Professional Layout**: Panel-based layout inspired by professional media workstations (Adobe Premiere, Resolume), distinct work zones (Search/Results, Preview/Player, Queue/Timeline, Effects/Mix), professional player interface with LIVE indicator and timecode, and timeline-based queue.

### Licensing and Compliance
- **License Filtering**: Filters for Public Domain, CC0, and CC-BY content.
- **Attribution Tracking**: Automatic attribution data extraction for exports.
- **Export Formats**: JSON and M3U playlists with licensing metadata.

### Professional VJ Features (v0.1.0-alpha)
- **Enhanced Drag-and-Drop Workflow**: Direct drag from search results to queue with visual feedback and theme-aware drop zones.
- **Intelligent License Management**: Enhanced license badges with tooltips, external links, and clear Creative Commons/Public Domain identification.
- **Saved Search Patterns**: Persistent storage of common search filters and terms for efficient workflow.
- **Comprehensive Keyboard Shortcuts**: Professional keyboard navigation with "?" help overlay and Command-K palette for quick actions.
- **EDL Recording System**: Complete session recording with event logging for professional set documentation and reconstruction.
- **First-Run Tour**: Guided 4-step onboarding covering essential VJ workflow (Search → Preview/Trim → Queue → Emergency Mix).
- **Session Management**: Persistent storage of recording sessions with venue info, statistics, and export capabilities.
- **Zero-Hitch Video Transitions**: Intelligent preloading system ensures smooth transitions between queue items.
- **Responsive Layout Hints**: Interactive animations show how the interface adapts to different screen sizes with breakpoint indicators and layout previews.

### Performance Optimizations (v0.1.0-alpha Complete)
- **Advanced Video Preloading**: LRU cache system with intelligent queue preloading for zero-hitch transitions.
- **Smart Request Management**: AbortController-based cancellable requests with proper cleanup for responsive UX.
- **Enhanced Caching**: SessionStorage-based metadata caching with 15-minute TTL for instant navigation.
- **Robust Thumbnail System**: Smart retry logic with exponential backoff for reliable thumbnail loading.
- **Theme-Aware Skeleton Loaders**: Complete loading states for all content types (videos, thumbnails, search results) with theme integration.
- **Debounced Search**: Optimized API calls with proper request cancellation.
- **Infinite Scroll**: Lazy loading with intersection observer for smooth browsing.
- **Image Optimization**: Archive.org thumbnail service integration with fallback handling.
- **React Query Caching**: Comprehensive caching for API responses with intelligent invalidation.
- **Drag Performance**: Optimized drag-and-drop with smooth animations and visual feedback.

## External Dependencies

### Core API Integration
- **Archive.org Search API**: Video content discovery.
- **Archive.org Metadata API**: Detailed video information.
- **Archive.org Thumbnail Service**: Thumbnail generation.

### Development and Build Tools
- **Vite**: Frontend build tool.
- **TypeScript**: Type safety.
- **ESBuild**: Backend bundling.
- **PostCSS**: CSS processing.

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework.
- **Radix UI**: Unstyled, accessible component primitives.
- **Lucide React**: Icon library.

### Data and State
- **Zod**: Runtime type validation.
- **Date-fns**: Date manipulation.
- **CLSX/Tailwind Merge**: Dynamic class name composition.

### Browser APIs
- **Web Audio API**: Real-time audio analysis.
- **Media Devices API**: Microphone access.
- **Intersection Observer**: Infinite scroll.
- **File System Access**: Client-side playlist export.