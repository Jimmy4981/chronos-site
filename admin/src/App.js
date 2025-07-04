// admin/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConfigPage from './pages/ConfigPage';
import BillingPage from './pages/BillingPage';
import UsersPage   from './pages/UsersPage';

export default function App() {
  return (
    <Router basename="/admin">
      <Routes>
        <Route path="/" element={<ConfigPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/users"   element={<UsersPage   />} />
      </Routes>
    </Router>
  );
}
