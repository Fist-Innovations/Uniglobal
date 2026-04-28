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
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>General Ledger</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>AI-powered bank statement processing & journal entry workflow</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
          {TABS.map((t, i) => (
            <span key={t.path} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, background: i < activeIdx ? '#ecfdf5' : i === activeIdx ? 'linear-gradient(to right,#1a56c4,#2563eb)' : '#f1f5f9', color: i < activeIdx ? '#059669' : i === activeIdx ? '#fff' : '#94a3b8' }}>
                {i < activeIdx ? <Check size={10} /> : i + 1}
              </span>
              {i < TABS.length - 1 && <span style={{ width: '20px', height: '2px', background: i < activeIdx ? '#059669' : '#e2e8f0', borderRadius: '2px' }} />}
            </span>
          ))}
        </div>
      </div>

      {/* Top Tab Bar */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '8px', display: 'flex', gap: '4px' }}>
        {TABS.map((t, i) => {
          const active = location.pathname === t.path;
          const done = i < activeIdx;
          return (
            <button key={t.path} onClick={() => navigate(t.path)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              transition: 'all 0.2s',
              background: active ? 'linear-gradient(to right,#1a56c4,#2563eb)' : done ? '#f0fdf4' : '#f8fafc',
              color: active ? '#fff' : done ? '#059669' : '#94a3b8',
              boxShadow: active ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
            }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: active ? 'rgba(255,255,255,0.2)' : done ? '#dcfce7' : '#fff', border: active ? 'none' : '1px solid #e2e8f0' }}>
                {done ? <Check size={14} color="#059669" style={{ flexShrink: 0 }} /> : <t.icon size={15} color={active ? '#fff' : '#94a3b8'} style={{ flexShrink: 0 }} />}
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
