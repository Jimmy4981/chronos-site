// admin/src/components/Layout.jsx
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-indigo-50 text-slate-800 font-sans antialiased">
      {/* Header */}
      <header className="bg-indigo-900 text-white">
        <div className="max-w-6xl mx-auto flex items-center px-6 py-4">
          <img
            src="/chronos_icon_color.png"
            alt="Chronos logo"
            className="w-8 h-8 mr-3"
          />
          <h1 className="text-2xl font-extrabold tracking-tight">
            Chronos&nbsp;<span className="text-amber-400">Admin</span>
          </h1>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-indigo-800">
        <div className="max-w-6xl mx-auto flex space-x-6 px-6 py-2">
          <a
            href="/admin"
            className="text-indigo-200 hover:text-white font-medium"
          >
            Configuration
          </a>
          <a
            href="/admin/billing"
            className="text-indigo-200 hover:text-white font-medium"
          >
            Billing
          </a>
          <a href="/admin/users"   className="text-indigo-200 hover:text-white font-medium">
           Users
         </a>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
