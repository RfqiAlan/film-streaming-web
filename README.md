# FilmWeb - Streaming Application

A modern film streaming web application built with React, TypeScript, and Tailwind CSS.

## Features
- **Home Page**: Trending movies and latest updates.
- **Search**: Real-time search functionality for movies and series.
- **Catalog**: Browse movies and series with pagination.
- **Watch Page**:
  - Integrated video player.
  - Episode selection for TV series.
  - Detailed information (synopsis, cast, rating, etc.).
- **Responsive Design**: Optimized for desktop and mobile devices.

## Tech Stack
- **Frontend**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
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
The application uses an environment variable for the API URL.
Check `.env` file:
```env
VITE_API_BASE_URL=https://zeldvorik.ru/rebahin21/api.php
```

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
