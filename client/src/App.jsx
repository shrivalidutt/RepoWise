import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      {/* Toaster shows popup notifications (success, error, etc.) */}
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/:repoId" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
