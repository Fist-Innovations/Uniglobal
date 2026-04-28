import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, CheckCircle2, Search, Bot, Loader2,
  AlertCircle, Filter, Check, X, Edit2, ArrowRight, Sparkles,
} from 'lucide-react';

const GL_ACCOUNTS = [
  '4100 · Service Revenue',
  '4200 · Product Revenue',
  '5100 · Cost of Goods Sold',
  '6100 · Software & Hosting',
  '6200 · Meals & Entertainment',
  '6300 · Rent & Lease',
  '6400 · Office Supplies',
  '6500 · Travel & Transport',
  '6600 · Professional Fees',
  '6700 · Utilities',
  '6800 · Salaries & Wages',
];

const INITIAL_TRANSACTIONS = [
  { id: 1,  date: '2026-04-20', desc: 'Amazon Web Services — Cloud Hosting',   amt: -1240.50, gl: '6100 · Software & Hosting',      conf: 98, status: 'Pending' },
  { id: 2,  date: '2026-04-21', desc: 'Starbucks — Client Meeting',             amt: -25.40,   gl: '6200 · Meals & Entertainment',    conf: 85, status: 'Pending' },
  { id: 3,  date: '2026-04-22', desc: 'Monthly Office Rent — April',            amt: -5000.00, gl: '6300 · Rent & Lease',             conf: 99, status: 'Pending' },
  { id: 4,  date: '2026-04-22', desc: 'Miscellaneous Office Supplies',          amt: -145.20,  gl: '6400 · Office Supplies',          conf: 62, status: 'Pending', warning: 'Low confidence — manual review advised' },
  { id: 5,  date: '2026-04-23', desc: 'Payment from Global Client X',           amt: 15000.00, gl: '4100 · Service Revenue',          conf: 95, status: 'Pending' },
  { id: 6,  date: '2026-04-24', desc: 'Uber — Transport for Sales Team',        amt: -85.00,   gl: '6500 · Travel & Transport',       conf: 88, status: 'Pending' },
  { id: 7,  date: '2026-04-24', desc: 'Adobe Creative Cloud Subscription',      amt: -82.99,   gl: '6100 · Software & Hosting',       conf: 99, status: 'Pending' },
  { id: 8,  date: '2026-04-25', desc: 'Consulting Fee — Tech Solutions Inc.',   amt: -2500.00, gl: '6600 · Professional Fees',        conf: 75, status: 'Pending', warning: 'Check vendor mapping' },
  { id: 9,  date: '2026-04-26', desc: 'Refund from Delta Airlines',             amt: 450.00,   gl: '6500 · Travel & Transport',       conf: 92, status: 'Pending' },
  { id: 10, date: '2026-04-27', desc: 'WeWork Office Expansion Deposit',        amt: -1200.00, gl: '6300 · Rent & Lease',             conf: 96, status: 'Pending' },
];

const fmtAmt = (n) => {
  const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
  return n >= 0 ? `+$${abs}` : `-$${abs}`;
};

const confColor = (c) => c >= 90 ? '#059669' : c >= 70 ? '#d97706' : '#dc2626';
const confBg    = (c) => c >= 90 ? '#ecfdf5' : c >= 70 ? '#fff7ed' : '#fef2f2';

const STATUS_STYLE = {
  Pending:   { bg: '#f0f9ff', color: '#0284c7',  border: '#bae6fd' },
  Approved:  { bg: '#ecfdf5', color: '#059669',  border: '#bbf7d0' },
  Corrected: { bg: '#fdf4ff', color: '#9333ea',  border: '#e9d5ff' },
};

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th:   { padding: '13px 18px', fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left', whiteSpace: 'nowrap' },
  td:   { padding: '15px 18px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' },
};

export default function GLReview() {
  const navigate = useNavigate();
  const [txns, setTxns] = useState(INITIAL_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editGl, setEditGl] = useState('');

  const filtered = txns.filter(t => {
    const matchSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.gl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fmtAmt(t.amt).includes(searchTerm);
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: txns.length,
    pending: txns.filter(t => t.status === 'Pending').length,
    approved: txns.filter(t => t.status === 'Approved').length,
    corrected: txns.filter(t => t.status === 'Corrected').length,
  };

  const setStatus = (id, status) =>
    setTxns(prev => prev.map(t => t.id === id ? { ...t, status } : t));

  const openEdit = (t) => { setEditingId(t.id); setEditGl(t.gl); };
  const saveEdit = () => {
    setTxns(prev => prev.map(t => t.id === editingId ? { ...t, gl: editGl, status: 'Corrected' } : t));
    setEditingId(null);
  };

  const handleBulkApprove = () =>
    setTxns(prev => prev.map(t => t.status === 'Pending' ? { ...t, status: 'Approved' } : t));

  const canProceed = counts.pending === 0;

  const editingTxn = txns.find(t => t.id === editingId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={() => navigate('/gl/upload')} style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
            <ChevronLeft size={22} color="#374151" style={{ flexShrink: 0 }} />
          </button>
          <div>
            <h1 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Transaction Processing</h1>
            <p style={{ fontSize: '12.5px', color: '#94a3b8' }}>Review AI-suggested GL mappings · <strong style={{ color: '#d97706' }}>{counts.pending} pending</strong></p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleBulkApprove} disabled={counts.pending === 0} style={{
            padding: '9px 18px', background: counts.pending === 0 ? '#f1f5f9' : 'linear-gradient(to right,#1a56c4,#2563eb)',
            border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
            color: counts.pending === 0 ? '#94a3b8' : '#fff', cursor: counts.pending === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s',
            boxShadow: counts.pending > 0 ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
          }}>
            <CheckCircle2 size={15} /> Bulk Approve All
          </button>
          <button onClick={() => navigate('/gl/confirm', { state: { txns } })} disabled={!canProceed} style={{
            padding: '9px 18px',
            background: canProceed ? 'linear-gradient(to right,#059669,#10b981)' : '#f1f5f9',
            border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
            color: canProceed ? '#fff' : '#94a3b8', cursor: canProceed ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s',
            boxShadow: canProceed ? '0 4px 12px rgba(5,150,105,0.3)' : 'none',
          }}>
            Proceed to Review <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total',     val: counts.total,     col: '#2563eb', bg: '#eff6ff' },
          { label: 'Pending',   val: counts.pending,   col: '#d97706', bg: '#fff7ed' },
          { label: 'Approved',  val: counts.approved,  col: '#059669', bg: '#ecfdf5' },
          { label: 'Corrected', val: counts.corrected, col: '#9333ea', bg: '#fdf4ff' },
        ].map(s => (
          <div key={s.label} style={{ ...S.card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: s.col }}>{s.val}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div style={{ ...S.card, overflow: 'hidden' }}>
        {/* toolbar */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search description, amount or GL account…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 38px', border: '1px solid #e2e8f0', borderRadius: '9px', fontSize: '13px', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Pending', 'Approved', 'Corrected'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '7px 14px', border: '1px solid', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                borderColor: statusFilter === s ? '#2563eb' : '#e2e8f0',
                background: statusFilter === s ? '#eff6ff' : '#fff',
                color: statusFilter === s ? '#2563eb' : '#64748b',
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Date', 'Description', 'Amount', 'Suggested GL Account', 'Confidence', 'Status', 'Actions'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((t, i) => (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                    style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>

                    <td style={{ ...S.td, whiteSpace: 'nowrap', color: '#64748b', fontWeight: 500 }}>{t.date}</td>

                    <td style={{ ...S.td, maxWidth: '260px' }}>
                      <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: t.warning ? '3px' : 0 }}>{t.desc}</p>
                      {t.warning && (
                        <p style={{ fontSize: '10.5px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <AlertCircle size={10} color="#dc2626" /> {t.warning}
                        </p>
                      )}
                    </td>

                    <td style={{ ...S.td, fontWeight: 700, whiteSpace: 'nowrap', color: t.amt >= 0 ? '#059669' : '#0f172a' }}>
                      {fmtAmt(t.amt)}
                    </td>

                    <td style={S.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Bot size={12} color="#2563eb" />
                        </div>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1e40af' }}>{t.gl}</span>
                      </div>
                    </td>

                    <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '64px', height: '5px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${t.conf}%`, background: confColor(t.conf), borderRadius: '4px', transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: confColor(t.conf), background: confBg(t.conf), padding: '2px 7px', borderRadius: '10px' }}>
                          {t.conf}%
                        </span>
                      </div>
                    </td>

                    <td style={S.td}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '4px 11px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                        background: STATUS_STYLE[t.status].bg,
                        color: STATUS_STYLE[t.status].color,
                        border: `1px solid ${STATUS_STYLE[t.status].border}`,
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_STYLE[t.status].color }} />
                        {t.status}
                      </span>
                    </td>

                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {t.status === 'Pending' && (
                          <button onClick={() => setStatus(t.id, 'Approved')} title="Accept suggestion"
                            style={{ width: '30px', height: '30px', borderRadius: '7px', border: 'none', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                            <Check size={16} color="#059669" style={{ flexShrink: 0 }} />
                          </button>
                        )}
                        <button onClick={() => openEdit(t)} title="Edit GL manually"
                          style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                          <Edit2 size={16} color="#64748b" style={{ flexShrink: 0 }} />
                        </button>
                        {t.status !== 'Pending' && (
                          <button onClick={() => setStatus(t.id, 'Pending')} title="Reset to Pending"
                            style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid #fecaca', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                            <X size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '60px', textAlign: 'center' }}>
                    <Search size={28} color="#cbd5e1" style={{ margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>No transactions match</p>
                    <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Try a different filter or search term.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Proceed Banner ── */}
      {!canProceed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px' }}>
          <AlertCircle size={18} color="#d97706" />
          <p style={{ fontSize: '13px', color: '#92400e', fontWeight: 500 }}>
            <strong>{counts.pending} transaction{counts.pending !== 1 ? 's' : ''} still pending.</strong> Accept or correct all transactions to proceed to Review &amp; Confirmation.
          </p>
        </div>
      )}

      {/* ── Edit GL Modal ── */}
      <AnimatePresence>
        {editingId && editingTxn && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.18)' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Edit2 size={16} color="#2563eb" />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>Edit GL Mapping</h3>
                </div>
                <button onClick={() => setEditingId(null)} style={{ background: '#f8fafc', border: 'none', cursor: 'pointer', padding: '7px', borderRadius: '50%', display: 'flex' }}>
                  <X size={16} color="#94a3b8" />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Description', val: editingTxn.desc },
                  { label: 'Amount',      val: fmtAmt(editingTxn.amt) },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>{f.label}</label>
                    <input readOnly value={f.val} style={{ width: '100%', padding: '10px 14px', borderRadius: '9px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    GL Account <span style={{ color: '#2563eb' }}>(Editable)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Sparkles size={14} color="#2563eb" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select value={editGl} onChange={e => setEditGl(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px 11px 36px', borderRadius: '9px', border: '2px solid #2563eb', background: '#fff', color: '#0f172a', fontSize: '13px', outline: 'none', fontWeight: 600, boxShadow: '0 0 0 3px rgba(37,99,235,0.1)', cursor: 'pointer', boxSizing: 'border-box' }}>
                      {GL_ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  {editingTxn.warning && (
                    <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={11} color="#dc2626" /> {editingTxn.warning}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button onClick={() => setEditingId(null)} style={{ padding: '10px 18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '9px', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Cancel</button>
                <button onClick={saveEdit} style={{ padding: '10px 22px', background: 'linear-gradient(to right,#1a56c4,#2563eb)', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.25)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Check size={14} /> Save &amp; Mark Corrected
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
