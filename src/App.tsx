import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ListingPage } from './pages/ListingPage';
import { DetailPage } from './pages/DetailPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ListingPage />} />
          <Route path="/listing/:id" element={<DetailPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;