import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { AnimeDetails } from '@/pages/AnimeDetails';
import { MyList } from '@/pages/MyList';
import { Search } from '@/pages/Search';
import { Navigation } from '@/components/Navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/my-list" element={<MyList />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;