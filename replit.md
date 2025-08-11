# Static Buffet - Trash Team × Nulltone.TV

## Overview

Static Buffet is a VJ-focused web application designed for searching, previewing, and queuing free-to-use video content from Archive.org. The application enables real-time video mixing with public domain and Creative Commons licensed footage, featuring dual brand themes (Diner mode and EBN Hijack mode), audio-reactive capabilities, and playlist export functionality. Built as a full-stack TypeScript application, it serves as a "video chaos buffet" for VJs and content creators who need immediate access to royalty-free footage with proper licensing compliance.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- Updated header with bold typography inspired by official Static Buffet logo design
- Added glass morphism effects and modern gradient backgrounds for professional appearance
- Enhanced card designs with hover animations and backdrop blur effects
- Improved brand hierarchy with proper Trash Team × Nulltone.TV attribution
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
- **Dual Brand Themes**: 
  - Diner Mode: Off-white backgrounds with ketchup red accents and menu-card aesthetics
  - EBN Hijack Mode: Dark charcoal with lime LEDs, scanlines, and live broadcast styling
- **CSS Variables**: Theme-aware color system using CSS custom properties
- **Typography**: Inter font for UI text and JetBrains Mono for technical elements

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