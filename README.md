# PixStream — Streaming Application

A modern film streaming web app built with React, TypeScript, and Tailwind CSS for browsing, searching, and watching movies or series.

## Highlights
- Trending and latest content on the home page
- Fast search for movies and series
- Catalog browsing with pagination
- Watch page with video player, episode selection, and detailed info
- Responsive layout for desktop and mobile

## Tech Stack
- **Frontend**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation
1. Navigate to the project directory:
   ```bash
   cd film-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
This project uses an API for its data. Set `VITE_API_BASE_URL` in your `.env` file before running the app.

### Running Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### Building for Production
```bash
npm run build
```
The output will be in the `dist` folder.

## Project Structure
```
src/
├── components/   # Reusable UI components
├── pages/        # Page components (Home, Search, Watch, etc.)
├── services/     # API service functions
├── types/        # TypeScript interfaces
├── App.tsx       # Main application component
└── main.tsx      # Entry point
```
