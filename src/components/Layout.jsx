import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Ship,
  GraduationCap,
  Bell,
  Settings,
  Menu,
  Search,
  LogOut,
  Bot,
  ChevronLeft,
  BarChart3,
  Sun,
  Moon,
} from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/' },
  { icon: FileText,        label: 'General Ledger', path: '/gl/upload' },
  { icon: Bot,             label: 'GL AI Bot',      path: '/gl/chat' },
  { icon: Ship,            label: 'Shipping',       path: '/shipping/comparison' },
  { icon: GraduationCap,   label: 'Training',       path: '/training' },
  { icon: BarChart3,       label: 'Reports',        path: '/reports' },
  { icon: Bell,            label: 'Notifications',  path: '/notifications' },
  { icon: Settings,        label: 'Settings',       path: '/settings' },
];

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
  <Link to={path} style={{ textDecoration: 'none' }}>
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: '12px',
      padding: '11px 14px',
      borderRadius: '10px',
      marginBottom: '2px',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      background: active ? 'var(--primary)' : 'transparent',
      color: active ? '#ffffff' : 'var(--text-muted)',
      boxShadow: active ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
      fontWeight: active ? 600 : 500,
      position: 'relative',
      overflow: 'hidden'
    }}
    className="sidebar-item"
    >
      <Icon size={18} style={{ flexShrink: 0, minWidth: '18px' }} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ fontSize: '13.5px', whiteSpace: 'nowrap' }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
    <style>{`
      .sidebar-item:hover {
        background: var(--bg-dark) !important;
        color: var(--text-main) !important;
      }
    `}</style>
  </Link>
);

const PAGE_NAMES = {
  '/':             'Dashboard',
  '/gl/upload':    'GL · Upload',
  '/gl/review':    'GL · Transaction Processing',
  '/gl/confirm':   'GL · Review & Confirmation',
  '/gl/post':      'GL · Post to ERP',
  '/gl/chat':      'GL AI Bot',
  '/gl/duplicate': 'GL · Duplicates',
  '/shipping/comparison': 'Shipping',
  '/training':     'Training',
  '/reports':      'Reports',
  '/notifications':'Notifications',
  '/settings':     'Settings',
};

const Layout = ({ children }) => {
  const [isManualCollapsed, setIsManualCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const location = useLocation();
  const navigate = useNavigate();

  const collapsed = isManualCollapsed && !isHovered;
  const pageName = PAGE_NAMES[location.pathname] || 'Page';

  useState(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.body.classList.toggle('dark', newMode);
  };

  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    { id: 1, title: 'Budget Mismatch Detected', desc: 'Variance > 15% in Shipping Dept regional data.', time: '2 mins ago', type: 'error', color: '#ef4444' },
    { id: 2, title: 'AI Processing Complete', desc: '148 transactions from April_2026.xlsx mapped.', time: '15 mins ago', type: 'success', color: '#10b981' },
    { id: 3, title: 'Security Alert: New Login', desc: 'Unrecognized login detected from Dubai, UAE.', time: '1 hour ago', type: 'warning', color: '#f59e0b' },
    { id: 4, title: 'Duplicate Invoice Flagged', desc: 'Invoice #INV-9901 matches an existing record.', time: '3 hours ago', type: 'warning', color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-dark)', fontFamily: "'Inter', sans-serif", overflow: 'hidden', transition: 'background 0.3s' }}>
      
      {/* ── Notification Modal ── */}
      <AnimatePresence>
        {showNotifications && (
          <div 
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
            onClick={() => setShowNotifications(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '440px', background: 'var(--bg-card)', borderRadius: '20px',
                border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>Notifications</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>You have {mockNotifications.length} unread alerts</p>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', color: 'var(--text-muted)', display: 'flex' }}
                >
                  <ChevronLeft size={16} style={{ transform: 'rotate(-90deg)' }} />
                </button>
              </div>

              <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '12px' }} className="custom-scrollbar">
                {mockNotifications.map((n) => (
                  <div key={n.id} style={{
                    padding: '16px', borderRadius: '12px', marginBottom: '8px',
                    background: 'var(--bg-dark)', border: '1px solid var(--border)',
                    display: 'flex', gap: '14px', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = n.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: n.color, marginTop: '5px', flexShrink: 0, boxShadow: `0 0 8px ${n.color}` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>{n.title}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px', borderTop: '1px solid var(--border)', background: 'var(--bg-dark)', textAlign: 'center' }}>
                <button 
                  onClick={() => setShowNotifications(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Mark all as read
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <motion.aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
        style={{
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--sidebar-border)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
          zIndex: 10,
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        {/* Logo & Toggle */}
        <div style={{
          padding: '0 20px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          minHeight: '64px',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '180px' }}>
            <div style={{
              width: '34px', height: '34px',
              background: 'var(--primary)',
              borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', fontWeight: 800, color: 'white',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              flexShrink: 0
            }}>U</div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>UNIGLOBAL</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>AI ERP System</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {!collapsed && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsManualCollapsed(!isManualCollapsed);
                }} 
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: '6px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-dark)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <ChevronLeft size={18} style={{ transform: isManualCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto', overflowX: 'hidden' }}>
          <AnimatePresence>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', opacity: 0.6, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 6px 6px', marginBottom: '4px' }}
              >
                MAIN MENU
              </motion.div>
            )}
          </AnimatePresence>
          {NAV.slice(0, 6).map(item => (
            <div key={item.path}>
              <SidebarItem 
                {...item} 
                active={
                  item.path === '/gl/upload' 
                    ? (location.pathname.startsWith('/gl') && !['/gl/chat', '/gl/duplicate'].includes(location.pathname))
                    : location.pathname === item.path
                } 
                collapsed={collapsed} 
              />
            </div>
          ))}
          <AnimatePresence>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', opacity: 0.6, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '16px 6px 6px', marginBottom: '4px' }}
              >
                SYSTEM
              </motion.div>
            )}
          </AnimatePresence>
          {NAV.slice(6).map(item => (
            <SidebarItem key={item.path} {...item} active={location.pathname === item.path} collapsed={collapsed} />
          ))}
        </nav>

        {/* Logout */}
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px', borderRadius: '10px',
              cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s',
              fontSize: '13.5px', fontWeight: 500,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            onClick={() => navigate('/login')}
            >
              <LogOut size={18} style={{ flexShrink: 0 }} />
              <span>Logout</span>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <header style={{
          height: '64px',
          background: 'var(--bg-header)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          zIndex: 5, flexShrink: 0,
          transition: 'background 0.3s, border-color 0.3s',
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{pageName}</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>UNIGLOBAL AI ERP Platform</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  paddingLeft: '36px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px',
                  background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: '8px',
                  fontSize: '12.5px', color: 'var(--text-main)', outline: 'none', width: '220px',
                  fontFamily: 'inherit',
                  transition: 'background 0.3s, border-color 0.3s, color 0.3s',
                }}
              />
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              style={{
                background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-muted)', padding: '6px',
                borderRadius: '8px', display: 'flex', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-dark)'; e.currentTarget.style.color = 'var(--text-main)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Bell */}
            <button 
              onClick={() => setShowNotifications(true)}
              style={{
                position: 'relative', background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--text-muted)', padding: '6px',
                borderRadius: '8px', display: 'flex', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-dark)'; e.currentTarget.style.color = 'var(--text-main)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: '4px', right: '4px',
                width: '7px', height: '7px',
                background: '#ef4444', borderRadius: '50%',
                border: '1px solid var(--bg-header)',
              }} />
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '32px', background: 'var(--border)' }} />

            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700, color: 'white',
              }}>A</div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>Admin</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Finance Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
