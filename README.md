# World Countries Explorer

A web application that provides comprehensive geopolitical, demographic, and territorial data on nations and territories across the globe. Built with React 19, Tailwind CSS v4, and the REST Countries API, featuring a minimal editorial design, dynamic routing, and persistent theming.

## Live Demo

You can view the live version of this project here: [Try Now](https://omarlokma.github.io/Rest-Countries-Explorer/)

## Key Features

- API-Driven Data: Integrates with the REST Countries API (v5) with built-in client caching and automatic fallback support for 100% uptime.
- Theme Persistence: Native Light and Dark mode toggle with zero-flash initial loading via localStorage and system color scheme detection.
- Search and Filtering: Real-time search across common names, official names, capitals, and ISO 3166 codes, paired with region-based filtering.
- Detailed Country Dossiers: Dedicated page for every country showcasing demographics, capital cities, surface landmass, currencies, official languages, top-level domains, and neighboring border nations.
- Seamless Navigation: Route-aware automatic scroll reset on page transitions and interactive links between bordering countries.
- Responsive Layout: Built with an analytical 12-column grid and mobile-first architecture for an optimal experience across all device sizes.

## Tech Stack

- Core: React 19
- Build Tool: Vite
- Styling: Tailwind CSS v4
- Routing: React Router DOM (v7)
- State Management: React Context API

## Getting Started

### Prerequisites

Node.js (version 18 or higher recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/omarlokma/Rest-Countries-Explorer.git
cd Rest-Countries-Explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```
