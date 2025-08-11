# Static Buffet Layout Mockups - Maximized Player

## Current Layout (Reference)
```
┌─────────────────────────────────────────────────┐
│ Header: Search + Controls                       │
├───────────────┬─────────────────────────────────┤
│ Search/Results│ Preview/Player (8/12 cols)     │
│ (4/12 cols)   │                                 │
│               │                                 │
│               │                                 │
│               │                                 │
│               │                                 │
│               │                                 │
│               │                                 │
├───────────────┼─────────────────────────────────┤
│ Queue/Timeline│ Effects/Mix                     │
│ (4/12 cols)   │ (8/12 cols)                     │
├───────────────┴─────────────────────────────────┤
│ Footer: System Info                             │
└─────────────────────────────────────────────────┘
```

## Option 1: Full-Width Player (Recommended)
```
┌─────────────────────────────────────────────────┐
│ Header: Search + Controls                       │
├─────────────────────────────────────────────────┤
│ Preview/Player (12/12 cols - FULL WIDTH)       │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
├───────────────┬─────────────────────────────────┤
│ Search/Results│ Queue + Effects (Combined)      │
│ (4/12 cols)   │ (8/12 cols)                     │
└───────────────┴─────────────────────────────────┘
```

## Option 2: Dominant Player with Sidebar
```
┌─────────────────────────────────────────────────┐
│ Header: Search + Controls                       │
├─────────────────────────────────┬───────────────┤
│ Preview/Player                  │ Search/Results│
│ (9/12 cols - LARGE)             │ (3/12 cols)   │
│                                 │               │
│                                 │               │
│                                 │               │
│                                 ├───────────────┤
│                                 │ Queue/Timeline│
│                                 │               │
├─────────────────────────────────┼───────────────┤
│ Effects/Mix (9/12 cols)         │ (3/12 cols)   │
└─────────────────────────────────┴───────────────┘
```

## Option 3: Cinema Mode with Collapsible Panels
```
┌─────────────────────────────────────────────────┐
│ Header: Search + Controls + [CINEMA MODE] btn   │
├─────────────────────────────────────────────────┤
│ Preview/Player (12/12 cols - CINEMATIC)        │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│ ▼ Search  ▼ Queue  ▼ Effects (Collapsible)     │
└─────────────────────────────────────────────────┘
```

## Option 4: Split-Screen VJ Mode
```
┌─────────────────────────────────────────────────┐
│ Header: Search + Controls                       │
├─────────────────────┬───────────────────────────┤
│ Preview/Player A    │ Preview/Player B          │
│ (6/12 cols)         │ (6/12 cols)               │
│                     │                           │
│                     │                           │
│                     │                           │
│                     │                           │
│                     │                           │
├─────────────────────┴───────────────────────────┤
│ Search/Queue/Effects (Combined Bottom Strip)    │
└─────────────────────────────────────────────────┘
```

## Option 5: Floating Player Mode
```
┌─────────────────────────────────────────────────┐
│ Header: Search + Controls + [FLOAT] btn         │
├───────────────┬─────────────────────────────────┤
│ Search/Results│ ┌─────────────────────────────┐ │
│ (4/12 cols)   │ │ Floating Player             │ │
│               │ │ (Resizable/Draggable)       │ │
│               │ │                             │ │
├───────────────┤ │                             │ │
│ Queue/Timeline│ │                             │ │
│               │ └─────────────────────────────┘ │
├───────────────┤ Effects/Mix (Background)        │
│ Effects/Mix   │                                 │
└───────────────┴─────────────────────────────────┘
```

## Pros & Cons Analysis

### Option 1: Full-Width Player ⭐ RECOMMENDED
**Pros:**
- Maximum video real estate
- Maintains familiar VJ workflow
- Clean, professional look
- Easy to implement

**Cons:**
- Search results smaller
- Less simultaneous panel visibility

### Option 2: Dominant Player with Sidebar
**Pros:**
- Large player while keeping search visible
- Compact but functional
- Good for active searching while mixing

**Cons:**
- Narrow sidebar might feel cramped
- Queue space reduced

### Option 3: Cinema Mode
**Pros:**
- True full-screen experience
- Collapsible panels save space
- Great for performance mode

**Cons:**
- Requires new collapse system
- Less immediate access to controls

### Option 4: Split-Screen VJ Mode
**Pros:**
- True dual-deck VJ experience
- Professional DJ/VJ workflow
- Advanced mixing capabilities

**Cons:**
- Complex to implement
- Smaller individual players

### Option 5: Floating Player
**Pros:**
- Ultimate flexibility
- User can customize layout
- Unique feature

**Cons:**
- Complex implementation
- Might feel gimmicky
- Overlay management issues

## Recommendation: Option 1 (Full-Width Player)
This provides the best balance of maximized video space while maintaining the professional workstation feel. It keeps the familiar workflow but gives much more prominence to the video content.