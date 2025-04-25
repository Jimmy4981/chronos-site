import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ConfigPage from './pages/ConfigPage';
import BillingPage from './pages/BillingPage';

export default function App() {
  return (
    <Router basename="/admin">
      <nav className="p-4 bg-gray-100">
        <Link to="/" className="mr-4">Config</Link>
        <Link to="/billing">Billing</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ConfigPage />} />
        <Route path="/billing" element={<BillingPage />} />
      </Routes>
    </Router>
  );
}
