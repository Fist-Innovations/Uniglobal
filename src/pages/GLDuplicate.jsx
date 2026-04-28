import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  X, 
  ChevronRight, 
  FileWarning,
  Clock,
  User,
  ExternalLink,
  History
} from 'lucide-react';

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th: { padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left' },
  td: { padding: '16px 20px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc' },
  label: { display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }
};

const INITIAL_DUPLICATES = [
  { id: 1, vendor: 'Amazon Web Services', amt: '$1,240.50', ref: 'INV-2024-001', date: '2026-04-20', conf: 98, status: 'Flagged' },
  { id: 2, vendor: 'Starbucks Coffee', amt: '$25.40', ref: 'STB-9921', date: '2026-04-21', conf: 85, status: 'Review' },
  { id: 3, vendor: 'WeWork Management', amt: '$5,000.00', ref: 'WW-RENT-APR', date: '2026-04-22', conf: 99, status: 'Flagged' },
];

const GLDuplicate = () => {
  const [view, setView] = useState('list'); // 'list' or 'new'
  const [showWarning, setShowWarning] = useState(false);
  const [form, setForm] = useState({ vendor: '', amt: '', ref: '', date: '' });
  const [duplicates, setDuplicates] = useState(INITIAL_DUPLICATES);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate duplicate detection
    if (form.vendor.toLowerCase().includes('amazon') || form.amt === '1240.50') {
      setShowWarning(true);
    } else {
      alert('Journal Entry Created Successfully!');
      setView('list');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Duplicate Detection</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>AI-powered monitoring for journal entry redundancy</p>
        </div>
        <button 
          onClick={() => setView(view === 'list' ? 'new' : 'list')}
          style={{ 
            padding: '10px 20px', background: 'linear-gradient(to right, #1a56c4, #2563eb)', 
            border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, 
            color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}
        >
          {view === 'list' ? <Plus size={18} style={{ flexShrink: 0 }} /> : <History size={18} style={{ flexShrink: 0 }} />}
          {view === 'list' ? 'New Journal Entry' : 'Back to Reports'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'new' ? (
          <motion.div key="new" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', ...S.card, padding: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Create Journal Entry</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={S.label}>Vendor / Payee</label>
                    <input type="text" required placeholder="e.g. Amazon" value={form.vendor} onChange={e => setForm({...form, vendor: e.target.value})} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>Amount ($)</label>
                    <input type="number" step="0.01" required placeholder="0.00" value={form.amt} onChange={e => setForm({...form, amt: e.target.value})} style={S.input} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={S.label}>Reference Number</label>
                    <input type="text" required placeholder="INV-0000" value={form.ref} onChange={e => setForm({...form, ref: e.target.value})} style={S.input} />
                  </div>
                  <div>
                    <label style={S.label}>Entry Date</label>
                    <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={S.input} />
                  </div>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <button type="submit" style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                    Verify & Submit Entry
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
              {[
                { label: 'Total Duplicates', val: '124', icon: FileWarning, col: '#dc2626', bg: '#fef2f2' },
                { label: 'Potential Savings', val: '$14.2K', icon: CheckCircle2, col: '#059669', bg: '#ecfdf5' },
                { label: 'Average Confidence', val: '92%', icon: Clock, col: '#2563eb', bg: '#eff6ff' },
              ].map(s => (
                <div key={s.label} style={{ ...S.card, padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={20} color={s.col} />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</p>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{s.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...S.card, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" placeholder="Search report..." style={{ ...S.input, paddingLeft: '40px', fontSize: '13px' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '8px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Filter size={14} /> Filters
                  </button>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Vendor', 'Reference', 'Amount', 'Date', 'Confidence', 'Status', 'Actions'].map(h => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {duplicates.map((d, i) => (
                    <tr key={d.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={14} color="#94a3b8" />
                          <span style={{ fontWeight: 600 }}>{d.vendor}</span>
                        </div>
                      </td>
                      <td style={S.td}><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>{d.ref}</code></td>
                      <td style={{ ...S.td, fontWeight: 700 }}>{d.amt}</td>
                      <td style={S.td}>{d.date}</td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ flex: 1, height: '4px', background: '#e2e8f0', borderRadius: '2px', width: '40px' }}>
                            <div style={{ height: '100%', width: `${d.conf}%`, background: d.conf > 90 ? '#dc2626' : '#d97706', borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 700 }}>{d.conf}%</span>
                        </div>
                      </td>
                      <td style={S.td}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: d.status === 'Flagged' ? '#fef2f2' : '#fff7ed', color: d.status === 'Flagged' ? '#dc2626' : '#d97706' }}>
                          {d.status}
                        </span>
                      </td>
                      <td style={S.td}>
                        <button style={{ padding: '5px 10px', background: '#eff6ff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}>View Match</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duplicate Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '520px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <AlertTriangle size={32} color="#dc2626" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: '8px' }}>Potential Duplicate Detected</h3>
              <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>
                The AI has found a high-confidence match for this entry in the current ledger.
              </p>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>MATCHED RECORD</span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#dc2626' }}>98% MATCH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Vendor:</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Amazon Web Services</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Amount:</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>$1,240.50</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Reference:</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>INV-2024-001</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => setShowWarning(false)} style={{ width: '100%', padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                  Edit My Entry
                </button>
                <button onClick={() => { setShowWarning(false); setView('list'); }} style={{ width: '100%', padding: '12px', background: '#dc2626', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
                  Proceed Anyway (Flag for Audit)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GLDuplicate;
