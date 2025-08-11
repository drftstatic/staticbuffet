# Static Buffet - Trash Team × Nulltone.TV

## Overview
Static Buffet is a VJ-focused web application designed for searching, previewing, and queuing free-to-use video content from Archive.org. It enables real-time video mixing with public domain and Creative Commons licensed footage. The application features dual brand themes, audio-reactive capabilities, and playlist export functionality. Built as a full-stack TypeScript application, it serves as a "video chaos buffet" for VJs and content creators needing immediate access to royalty-free footage with proper licensing compliance, embodying the vision of turning discarded culture into something new and providing alternative programming.

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

### Theme System
- **Ten Complete Visual Themes**: Test Card (Default), Waffle House, EBN Hijack, Heavy Metal, NWO Hollywood, D-Generation X, Max Headroom, Mario Plumber, Dodge Dakota, and Blondie. Each theme has distinct visual effects, gradients, and animations.
- **Theme Consistency**: All 10 themes have equal visual treatment across all pages (Home, About) with comprehensive styling for headers, panels, text, icons, and interactive elements.
- **Theme Access**: Dakota and Blondie themes accessible only via dropdown theme selector (not main UI buttons) for cleaner interface.
- **Interactive Easter Eggs**: Triple-click activations for theme-specific soundboards and visual transformations.
- **Complete Soundboard System**: Seven themes feature fully implemented soundboards with 8 sounds each, using toast notification feedback and triple-click activation pattern.
- **Styling**: CSS Variables for theming, Inter and JetBrains Mono fonts, theme-specific CSS overlays, and comprehensive theme function for consistent styling across components.
- **UI/UX Decisions**: Panel-based layout inspired by professional media workstations (e.g., Adobe Premiere, Resolume), distinct work zones (Search/Results, Preview/Player, Queue/Timeline, Effects/Mix), professional player interface with LIVE indicator and timecode, and timeline-based queue.

### Licensing and Compliance
- **License Filtering**: Filters for Public Domain, CC0, and CC-BY content.
- **Attribution Tracking**: Automatic attribution data extraction for exports.
- **Export Formats**: JSON and M3U playlists with licensing metadata.

### Professional VJ Features
- **EDL Recording System**: Complete session recording with event logging for professional set documentation and reconstruction.
- **First-Run Tour**: Guided 4-step onboarding covering essential VJ workflow (Search → Preview/Trim → Queue → Emergency Mix).
- **Session Management**: Persistent storage of recording sessions with venue info, statistics, and export capabilities.

### Performance Optimizations
- **Debounced Search**: Reduces API calls.
- **Infinite Scroll**: Lazy loading with intersection observer.
- **Image Optimization**: Archive.org thumbnail service integration.
- **Caching**: React Query caching for API responses.
- **Video Preloading**: Automatic preloading of next queue item for smooth transitions.
- **Metadata Caching**: SessionStorage-based caching of search results and metadata with 15-minute TTL.
- **Thumbnail Retry Logic**: Smart retry system for failed thumbnails with exponential backoff.
- **Cancellable Requests**: AbortController-based request cancellation for responsive UX.
- **Skeleton Loaders**: Theme-aware loading states for all content types (videos, thumbnails, search results).

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