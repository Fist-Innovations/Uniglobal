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
      background: active ? 'linear-gradient(to right, #1a56c4, #2563eb)' : 'transparent',
      color: active ? '#ffffff' : '#64748b',
      boxShadow: active ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
      fontWeight: active ? 600 : 500,
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}}
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
  const location = useLocation();
  const navigate = useNavigate();
  
  const collapsed = isManualCollapsed && !isHovered;
  const pageName = PAGE_NAMES[location.pathname] || 'Page';

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f1f5f9', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <motion.aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
        style={{
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
          zIndex: 10,
        }}
      >
        {/* Logo & Toggle */}
        <div style={{
          padding: '0 20px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
          minHeight: '64px',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '180px' }}>
            <div style={{
              width: '34px', height: '34px',
              background: 'linear-gradient(135deg, #1a56c4, #2563eb)',
              borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', fontWeight: 800, color: 'white',
              boxShadow: '0 4px 10px rgba(37,99,235,0.3)',
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
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>UNIGLOBAL</div>
                  <div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>AI ERP System</div>
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
                  color: '#94a3b8', padding: '6px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
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
                style={{ fontSize: '10px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 6px 6px', marginBottom: '4px' }}
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
                style={{ fontSize: '10px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '16px 6px 6px', marginBottom: '4px' }}
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
            style={{ padding: '12px 10px', borderTop: '1px solid #f1f5f9' }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px', borderRadius: '10px',
              cursor: 'pointer', color: '#64748b', transition: 'all 0.2s',
              fontSize: '13.5px', fontWeight: 500,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
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
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          zIndex: 5, flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{pageName}</h2>
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>UNIGLOBAL AI ERP Platform</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  paddingLeft: '36px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px',
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
                  fontSize: '12.5px', color: '#0f172a', outline: 'none', width: '220px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Bell */}
            <button style={{
              position: 'relative', background: 'none', border: 'none',
              cursor: 'pointer', color: '#64748b', padding: '6px',
              borderRadius: '8px', display: 'flex',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; }}
            >
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: '4px', right: '4px',
                width: '7px', height: '7px',
                background: '#ef4444', borderRadius: '50%',
                border: '2px solid white',
              }} />
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }} />

            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #1a56c4, #2563eb)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700, color: 'white',
              }}>AA</div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>Adarsh Admin</p>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>Finance Manager</p>
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
