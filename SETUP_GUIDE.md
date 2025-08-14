# Static Buffet Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other settings
   ```

3. **Database Setup**
   ```bash
   # Generate and run migrations
   npm run db:generate
   npm run db:migrate
   
   # Or push schema directly (development)
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## New Features Added

### 🎯 Command Palette
- **Shortcut**: `Cmd/Ctrl + K`
- **Features**: Quick search actions, queue management, theme switching, export tools
- **Usage**: Press the shortcut anywhere in the app to access all major functions

### 🗄️ Database Caching
- **Metadata Caching**: Video metadata cached for 48 hours
- **Search Caching**: Search results cached for 6 hours  
- **Benefits**: Faster load times, reduced API calls to Archive.org

### 📊 Performance Monitoring
- **Endpoint**: `/api/cache-stats`
- **Command Palette**: "View Cache Statistics"
- **Automatic Cleanup**: Expired cache entries cleaned every 2 hours

## Database Schema

The app now includes these new tables:
- `metadata_cache` - Caches Archive.org video metadata
- `search_cache` - Caches search results with query hashing
- `edl_sessions` - Edit Decision List sessions for VJ sets
- `edl_events` - Individual events/actions within sessions

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string

### Optional  
- `PORT` - Server port (default: 5000)
- `VIDEO_CACHE_DIR` - Video cache directory (default: ./video-cache)
- `NODE_ENV` - Environment mode (development/production)

## Development Commands

```bash
# Database
npm run db:generate    # Generate migration files
npm run db:migrate     # Run migrations  
npm run db:push        # Push schema directly (dev)
npm run db:studio      # Open Drizzle Studio

# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run check         # TypeScript check
```

## Performance Optimizations

1. **Smart Caching**: Two-tier memory + database caching
2. **Query Optimization**: Search result hashing prevents duplicate API calls
3. **Background Cleanup**: Automatic expired cache removal
4. **Rate Limiting**: Prevents Archive.org API abuse

## Keyboard Shortcuts

- `Cmd/Ctrl + K` - Command Palette
- `/` - Focus Search Bar  
- `Esc` - Close modals/panels

## Cache Statistics

Monitor cache performance:
- Memory cache hit rates
- Database cache statistics  
- Total cached files and searches
- Automatic cleanup logs

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check DATABASE_URL format: `postgresql://user:pass@host:port/db`
3. Run `npm run db:push` to create tables

### Cache Performance
1. Check `/api/cache-stats` for hit rates
2. Monitor server logs for cache operations
3. Verify disk space for video cache directory

### Command Palette Not Working
1. Check for JavaScript errors in browser console
2. Ensure all dependencies are installed
3. Try hard refresh (Cmd/Ctrl + Shift + R)

## Production Deployment

1. Set production environment variables
2. Run database migrations: `npm run db:migrate`
3. Build the application: `npm run build`
4. Start with: `npm run start`

The app is now production-ready with comprehensive caching, monitoring, and user experience enhancements!