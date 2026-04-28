import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GLUpload from './pages/GLUpload';
import GLReview from './pages/GLReview';
import GLConfirm from './pages/GLConfirm';
import GLPost from './pages/GLPost';
import GLChat from './pages/GLChat';
import GeneralLedger from './pages/GeneralLedger';
import ShippingComparison from './pages/ShippingComparison';
import TrainingManagement from './pages/TrainingManagement';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import GLDuplicate from './pages/GLDuplicate';

function App() {
  // Persist authentication state in localStorage to survive page refreshes
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('uniglobal_auth') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('uniglobal_auth', 'true');
  };

  // Simple wrapper to handle layout
  const AppContent = () => (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      
      {isAuthenticated ? (
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/gl" element={<GeneralLedger />}>
                <Route path="upload" element={<GLUpload />} />
                <Route path="review" element={<GLReview />} />
                <Route path="confirm" element={<GLConfirm />} />
                <Route path="post" element={<GLPost />} />
              </Route>
              <Route path="/gl/duplicate" element={<GLDuplicate />} />
              <Route path="/gl/chat" element={<GLChat />} />
              <Route path="/shipping/comparison" element={<ShippingComparison />} />
              <Route path="/training" element={<TrainingManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } />
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
