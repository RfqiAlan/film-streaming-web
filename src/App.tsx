import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Search from './pages/Search';
import Watch from './pages/Watch';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Catalog type="movies" />} />
        <Route path="/series" element={<Catalog type="series" />} />
        <Route path="/search" element={<Search />} />
        <Route path="/watch/:slug" element={<Watch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
