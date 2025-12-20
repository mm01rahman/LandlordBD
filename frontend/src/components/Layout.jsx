import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: '⏱️' },
  { to: '/buildings', label: 'Buildings', icon: '🏢' },
  { to: '/tenants', label: 'Tenants', icon: '👥' },
  { to: '/agreements', label: 'Agreements', icon: '📑' },
  { to: '/payments', label: 'Payments', icon: '💸' },
  { to: '/outstanding', label: 'Outstanding', icon: '⚡' },
  { to: '/profile', label: 'Profile', icon: '🧑‍💼' },
];

const SidebarLink = ({ to, label, icon, onClick, active }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors border ${
      active
        ? 'bg-white/5 text-white border-primary-500/40 shadow-brand'
        : 'text-slate-200 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="font-semibold">{label}</span>
  </Link>
);

const Layout = ({ children }) => {
  const { user, logout, actionState, sessionError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [navError, setNavError] = useState('');
  const closeButtonRef = useRef(null);
  const openButtonRef = useRef(null);

  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [open]);

  const handleLogout = async () => {
    setNavError('');
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setNavError('Could not log out. Please try again.');
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-slate-50 flex" aria-live="polite">
      <aside
        id="app-sidebar"
        role="navigation"
        aria-label="Primary"
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-white/10 bg-[rgba(15,22,40,0.95)] backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Smart Rental</p>
            <h1 className="text-xl font-semibold text-white">Income Console</h1>
          </div>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            ✕
          </Button>
        </div>
        <div className="px-4 py-5 space-y-1">
          {navLinks.map((link) => (
            <SidebarLink
              key={link.to}
              {...link}
              active={location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>
      </aside>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="flex-1 md:ml-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(11,18,32,0.9)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <Button
                ref={openButtonRef}
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="app-sidebar"
                aria-label="Open navigation"
              >
                ☰
              </Button>
              <div className="space-y-0.5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Control center</p>
                <p className="text-xl font-semibold text-white leading-tight">Smart Rental Property OS</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="h-9 w-9 rounded-full bg-primary-600/30 grid place-items-center text-sm font-semibold text-white">
                  {user?.name?.slice(0, 2) || 'SR'}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white leading-tight">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={actionState.pending && actionState.type === 'logout'}
              >
                {actionState.pending && actionState.type === 'logout' ? 'Signing out…' : 'Logout'}
              </Button>
            </div>
          </div>
          {navError && (
            <div className="px-4 pb-3 text-sm text-amber-200" role="status">
              {navError}
            </div>
          )}
          {sessionError && (
            <div className="px-4 pb-3 text-sm text-amber-200" role="alert">
              {sessionError}
            </div>
          )}
        </header>
        <main className="px-4 py-6 md:px-8 md:py-10 space-y-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
