import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  ChevronDown,
  BarChart3,
  UploadCloud,
  ClipboardCheck,
  ListChecks,
  SendHorizonal,
} from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/' },
  { icon: FileText,        label: 'General Ledger', path: '/gl/upload', hasSubnav: true },
  { icon: Bot,             label: 'GL AI Bot',      path: '/gl/chat' },
  { icon: Ship,            label: 'Shipping',       path: '/shipping/comparison' },
  { icon: GraduationCap,   label: 'Training',       path: '/training' },
  { icon: BarChart3,       label: 'Reports',        path: '/reports' },
  { icon: Bell,            label: 'Notifications',  path: '/notifications' },
  { icon: Settings,        label: 'Settings',       path: '/settings' },
];

const GL_STEPS = [
  { icon: UploadCloud,    label: '1. Upload',      path: '/gl/upload' },
  { icon: ListChecks,     label: '2. Process',     path: '/gl/review' },
  { icon: ClipboardCheck, label: '3. Review',      path: '/gl/confirm' },
  { icon: SendHorizonal,  label: '4. Post to ERP', path: '/gl/post' },
];

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
  <Link to={path} style={{ textDecoration: 'none' }}>
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: collapsed ? 0 : '12px',
      justifyContent: collapsed ? 'center' : 'flex-start',
      padding: collapsed ? '12px' : '11px 14px',
      borderRadius: '10px',
      marginBottom: '2px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: active ? 'linear-gradient(to right, #1a56c4, #2563eb)' : 'transparent',
      color: active ? '#ffffff' : '#64748b',
      boxShadow: active ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
      fontWeight: active ? 600 : 500,
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}}
    >
      <Icon size={18} style={{ flexShrink: 0 }} />
      {!collapsed && <span style={{ fontSize: '13.5px', whiteSpace: 'nowrap' }}>{label}</span>}
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
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isGlRoute = location.pathname.startsWith('/gl');
  const [glOpen, setGlOpen] = useState(isGlRoute);

  const pageName = PAGE_NAMES[location.pathname] || 'Page';

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f1f5f9', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? '72px' : '240px',
        minWidth: collapsed ? '72px' : '240px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '20px 0' : '20px 20px',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid #f1f5f9',
          minHeight: '64px',
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px', height: '34px',
                background: 'linear-gradient(135deg, #1a56c4, #2563eb)',
                borderRadius: '9px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '15px', fontWeight: 800, color: 'white',
                boxShadow: '0 4px 10px rgba(37,99,235,0.3)',
              }}>U</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>UNIGLOBAL</div>
                <div style={{ fontSize: '9px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>AI ERP System</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{
              width: '34px', height: '34px',
              background: 'linear-gradient(135deg, #1a56c4, #2563eb)',
              borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', fontWeight: 800, color: 'white',
            }}>U</div>
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94a3b8', padding: '4px', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {!collapsed && (
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 6px 6px', marginBottom: '4px' }}>
              MAIN MENU
            </div>
          )}
          {NAV.slice(0, 6).map(item => (
            <div key={item.path}>
              {item.hasSubnav && !collapsed ? (
                <>
                  {/* GL parent row */}
                  <div
                    onClick={() => setGlOpen(o => !o)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '11px 14px', borderRadius: '10px', marginBottom: '2px',
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: isGlRoute ? 'linear-gradient(to right,#1a56c4,#2563eb)' : 'transparent',
                      color: isGlRoute ? '#fff' : '#64748b',
                      boxShadow: isGlRoute ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
                      fontWeight: isGlRoute ? 600 : 500,
                      userSelect: 'none',
                    }}
                    onMouseEnter={e => { if (!isGlRoute) { e.currentTarget.style.background='#f1f5f9'; e.currentTarget.style.color='#0f172a'; }}}
                    onMouseLeave={e => { if (!isGlRoute) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#64748b'; }}}
                  >
                    <item.icon size={18} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '13.5px', flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>
                    <ChevronDown size={14} style={{ flexShrink: 0, transition: 'transform 0.2s', transform: glOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>

                  {/* GL sub-steps */}
                  {glOpen && (
                    <div style={{ marginLeft: '14px', paddingLeft: '14px', borderLeft: '2px solid #e2e8f0', marginBottom: '4px' }}>
                      {GL_STEPS.map(step => {
                        const active = location.pathname === step.path;
                        return (
                          <Link key={step.path} to={step.path} style={{ textDecoration: 'none' }}>
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '9px',
                              padding: '8px 10px', borderRadius: '8px', marginBottom: '2px',
                              cursor: 'pointer', transition: 'all 0.15s',
                              background: active ? '#eff6ff' : 'transparent',
                              color: active ? '#2563eb' : '#94a3b8',
                              fontWeight: active ? 700 : 500,
                            }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.color='#475569'; }}}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#94a3b8'; }}}
                            >
                              <step.icon size={14} style={{ flexShrink: 0 }} />
                              <span style={{ fontSize: '12.5px', whiteSpace: 'nowrap' }}>{step.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <SidebarItem {...item} active={location.pathname === item.path} collapsed={collapsed} />
              )}
            </div>
          ))}
          {!collapsed && (
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '16px 6px 6px', marginBottom: '4px' }}>
              SYSTEM
            </div>
          )}
          {NAV.slice(6).map(item => (
            <SidebarItem key={item.path} {...item} active={location.pathname === item.path} collapsed={collapsed} />
          ))}
        </nav>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div style={{ padding: '12px', borderTop: '1px solid #f1f5f9' }}>
            <button onClick={() => setCollapsed(false)} style={{
              width: '100%', padding: '10px', background: 'none', border: 'none',
              cursor: 'pointer', color: '#94a3b8', display: 'flex', justifyContent: 'center',
              borderRadius: '8px',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <Menu size={18} />
            </button>
          </div>
        )}

        {/* Logout */}
        {!collapsed && (
          <div style={{ padding: '12px 10px', borderTop: '1px solid #f1f5f9' }}>
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
          </div>
        )}
      </aside>

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
