# Features Documentation

## Overview

The Filipino Profanity API provides a comprehensive platform for managing and detecting profanity words in Filipino and regional dialects.

## Core Features

### 1. API Endpoints

#### Profanity Fetching (`GET /api/profanity`)
- Filter by language type (Filipino, Regional, All)
- Search for specific words
- Returns structured JSON response

#### Profanity Detection (`POST /api/check`)
- Real-time text analysis
- Identifies profanity matches
- Returns found words with metadata

### 2. User Interface Components

#### Dashboard Stats
- Total word count display
- Language distribution breakdown
- Visual severity distribution chart (using Recharts)

#### API Tester
- Interactive API testing panel
- Type selection dropdown
- Word search functionality
- Real-time response viewer
- JSON syntax highlighting

#### JSON Viewer
- VS Code-style syntax highlighting
- Copy to clipboard functionality
- Collapsible/expandable sections
- Color-coded output:
  - Keys: Blue
  - Strings: Green
  - Numbers: Orange
  - Null: Yellow

#### GitHub Integration Card
- Repository link
- Star and fork counts
- Quick access to source code

### 3. Design System

#### Dark Mode Default
- Full dark theme for reduced eye strain
- Consistent color palette across all components

#### Glassmorphism UI
- Frosted glass effect on cards
- Subtle backdrop blur
- Layered depth with borders

#### Animations (Framer Motion)
- Smooth page transitions
- Staggered element reveals
- Loading states with spinners
- Hover effects on interactive elements

#### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interactions

### 4. Extra Features

#### Search Input
- Filter profanity words in real-time
- Case-insensitive matching

#### Severity Filter
- Categorize words by severity level
- Low, Medium, High classifications

#### Copy JSON Button
- One-click clipboard copy
- Visual feedback on copy success

#### Loading Animation
- Spinner during API calls
- Disabled states on buttons during loading

#### Error Handling
- User-friendly error messages
- Graceful degradation

## Technology Stack

| Component        | Technology                        |
|------------------|-----------------------------------|
| Framework        | Next.js 16+                       |
| Styling          | Tailwind CSS                      |
| Animations       | Framer Motion                     |
| Charts           | Recharts                          |
| Icons            | Lucide React                      |
| Database         | Turso (libSQL)                    |
| API              | Next.js Route Handlers            |

## Performance Optimizations

- Server-side rendering where applicable
- Client-side state management with React hooks
- Debounced search inputs
- Optimized bundle size

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
