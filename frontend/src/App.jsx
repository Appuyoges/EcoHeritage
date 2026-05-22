import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import TripPlannerPage from './pages/TripPlannerPage';
import CarbonDashboardPage from './pages/CarbonDashboardPage';
import ExplorePage from './pages/ExplorePage';
import ChatbotPage from './pages/ChatbotPage';
import ProfilePage from './pages/ProfilePage';
import SiteDetailsPage from './pages/SiteDetailsPage';
import WorldMapPage from './pages/WorldMapPage';
import CommunityPage from './pages/CommunityPage';
import EcoAgent from './components/common/EcoAgent';
import AgenticAiPage from './pages/AgenticAiPage';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-[#0a0f0d]">
          <Navbar />
          <EcoAgent />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/plan" element={<TripPlannerPage />} />
            <Route path="/carbon" element={<CarbonDashboardPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/explore/:id" element={<SiteDetailsPage />} />
            <Route path="/map" element={<WorldMapPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/agents" element={<AgenticAiPage />} />
            <Route path="/chat" element={<ChatbotPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
