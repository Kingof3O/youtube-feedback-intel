import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Radio, MessageSquare, ShieldCheck, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import './Layout.css';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={clsx('sidebar glass-panel', isMobileMenuOpen && 'open')}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">Intel</div>
            <span className="logo-text">Feedback</span>
          </div>
          <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/sync" className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
            <Radio size={20} />
            <span>Sync</span>
          </NavLink>
          <NavLink to="/explorer" className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
            <MessageSquare size={20} />
            <span>Explorer</span>
          </NavLink>
          <NavLink to="/rules" className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
            <ShieldCheck size={20} />
            <span>Rules</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="page-title">Dashboard</h1>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
