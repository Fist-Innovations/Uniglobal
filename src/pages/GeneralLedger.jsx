import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { UploadCloud, ListChecks, ClipboardCheck, SendHorizonal, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const TABS = [
  { path: '/gl/upload',  label: '1. Upload',      icon: UploadCloud,   sub: 'Bank statement import' },
  { path: '/gl/review',  label: '2. Process',     icon: ListChecks,    sub: 'AI transaction mapping' },
  { path: '/gl/confirm', label: '3. Review',      icon: ClipboardCheck, sub: 'Verify & confirm' },
  { path: '/gl/post',    label: '4. Post to ERP', icon: SendHorizonal, sub: 'Push to ledger' },
];

export default function GeneralLedger() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeIdx = TABS.findIndex(t => location.pathname === t.path);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>General Ledger</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>AI-powered bank statement processing & journal entry workflow</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
          {TABS.map((t, i) => (
            <span key={t.path} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, background: i < activeIdx ? 'rgba(16, 185, 129, 0.1)' : i === activeIdx ? 'var(--primary)' : 'var(--bg-dark)', color: i < activeIdx ? '#10b981' : i === activeIdx ? '#fff' : 'var(--text-muted)', border: i > activeIdx ? '1px solid var(--border)' : 'none' }}>
                {i < activeIdx ? <Check size={10} /> : i + 1}
              </span>
              {i < TABS.length - 1 && <span style={{ width: '20px', height: '2px', background: i < activeIdx ? '#10b981' : 'var(--border)', borderRadius: '2px' }} />}
            </span>
          ))}
        </div>
      </div>

      {/* Top Tab Bar */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: '8px', display: 'flex', gap: '4px', transition: 'background 0.3s, border-color 0.3s' }}>
        {TABS.map((t, i) => {
          const active = location.pathname === t.path;
          const done = i < activeIdx;
          return (
            <button key={t.path} onClick={() => navigate(t.path)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              transition: 'all 0.2s',
              background: active ? 'var(--primary)' : done ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-dark)',
              color: active ? '#fff' : done ? '#10b981' : 'var(--text-muted)',
              boxShadow: active ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
            }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: active ? 'rgba(255,255,255,0.2)' : done ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)', border: active ? 'none' : '1px solid var(--border)' }}>
                {done ? <Check size={14} color="#10b981" style={{ flexShrink: 0 }} /> : <t.icon size={15} color={active ? '#fff' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>{t.label}</div>
                <div style={{ fontSize: '11px', opacity: 0.75 }}>{t.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Page Content */}
      <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <Outlet />
      </motion.div>
    </div>
  );
}
