import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, CheckCircle2, Search, Bot, Loader2,
  AlertCircle, Filter, Check, X, Edit2, ArrowRight, Sparkles, Download
} from 'lucide-react';
import * as XLSX from 'xlsx';

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

const confColor = (c) => c >= 90 ? '#10b981' : c >= 70 ? '#f59e0b' : '#ef4444';
const confBg    = (c) => c >= 90 ? 'rgba(16, 185, 129, 0.1)' : c >= 70 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)';

const STATUS_STYLE = {
  Pending:   { bg: 'rgba(2, 132, 199, 0.1)', color: '#0ea5e9',  border: 'rgba(14, 165, 233, 0.2)' },
  Approved:  { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981',  border: 'rgba(16, 185, 129, 0.2)' },
  Corrected: { bg: 'rgba(147, 51, 234, 0.1)', color: '#a855f7',  border: 'rgba(168, 85, 247, 0.2)' },
};

const S = {
  card: { background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', transition: 'background 0.3s, border-color 0.3s' },
  th:   { padding: '13px 18px', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', background: 'var(--bg-dark)', textAlign: 'left', whiteSpace: 'nowrap' },
  td:   { padding: '15px 18px', fontSize: '13px', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' },
};

export default function GLReview() {
  const navigate = useNavigate();
  const [txns, setTxns] = useState(INITIAL_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editGl, setEditGl] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const filtered = txns.filter(t => {
    const matchSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.gl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fmtAmt(t.amt).includes(searchTerm);
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Validated Transactions");
    XLSX.writeFile(wb, "GL_Review_Report.xlsx");
  };

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

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(t => t.id)));
    }
  };

  const handleBulkApprove = () => {
    setTxns(prev => prev.map(t => 
      (selectedIds.has(t.id) && t.status === 'Pending') ? { ...t, status: 'Approved' } : t
    ));
    setSelectedIds(new Set());
  };

  const canProceed = counts.pending === 0;

  const editingTxn = txns.find(t => t.id === editingId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={() => navigate('/gl/upload')} style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
            <ChevronLeft size={22} color="var(--text-main)" style={{ flexShrink: 0 }} />
          </button>
          <div>
            <h1 style={{ fontSize: '21px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>Transaction Processing</h1>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Review AI-suggested GL mappings · <strong style={{ color: '#f59e0b' }}>{counts.pending} pending</strong></p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleExport} style={{ padding: '9px 18px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Download size={15} /> Export Excel
          </button>
          <button onClick={handleBulkApprove} disabled={selectedIds.size === 0} style={{
            padding: '9px 18px', background: selectedIds.size === 0 ? 'var(--bg-dark)' : 'linear-gradient(to right,#1a56c4,#2563eb)',
            border: selectedIds.size === 0 ? '1px solid var(--border)' : 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
            color: selectedIds.size === 0 ? 'var(--text-muted)' : '#fff', cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s',
            boxShadow: selectedIds.size > 0 ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
          }}>
            <CheckCircle2 size={15} /> Approve Selected ({selectedIds.size})
          </button>
          <button onClick={() => navigate('/gl/confirm', { state: { txns } })} disabled={!canProceed} style={{
            padding: '9px 18px',
            background: canProceed ? 'linear-gradient(to right,#059669,#10b981)' : 'var(--bg-dark)',
            border: canProceed ? 'none' : '1px solid var(--border)', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
            color: canProceed ? '#fff' : 'var(--text-muted)', cursor: canProceed ? 'pointer' : 'not-allowed',
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
          { label: 'Total',     val: counts.total,     col: 'var(--primary)', bg: 'rgba(37, 99, 235, 0.1)' },
          { label: 'Pending',   val: counts.pending,   col: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
          { label: 'Approved',  val: counts.approved,  col: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
          { label: 'Corrected', val: counts.corrected, col: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
        ].map(s => (
          <div key={s.label} style={{ ...S.card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: s.col }}>{s.val}</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div style={{ ...S.card, overflow: 'hidden' }}>
        {/* toolbar */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search description, amount or GL account…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 38px', border: '1px solid var(--border)', borderRadius: '9px', fontSize: '13px', outline: 'none', background: 'var(--bg-dark)', color: 'var(--text-main)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Pending', 'Approved', 'Corrected'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '7px 14px', border: '1px solid', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                borderColor: statusFilter === s ? 'var(--primary)' : 'var(--border)',
                background: statusFilter === s ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-card)',
                color: statusFilter === s ? 'var(--primary)' : 'var(--text-muted)',
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...S.th, width: '40px', paddingRight: 0 }}>
                  <input 
                    type="checkbox" 
                    checked={filtered.length > 0 && selectedIds.size === filtered.length} 
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                  />
                </th>
                {['Date', 'Description', 'Amount', 'Suggested GL Account', 'Confidence', 'Status', 'Actions'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((t, i) => (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                    style={{ background: selectedIds.has(t.id) ? 'rgba(37, 99, 235, 0.05)' : i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-dark)' }}>

                    <td style={{ ...S.td, paddingRight: 0 }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(t.id)} 
                        onChange={() => toggleSelect(t.id)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                      />
                    </td>

                    <td style={{ ...S.td, whiteSpace: 'nowrap', color: 'var(--text-muted)', fontWeight: 500 }}>{t.date}</td>

                    <td style={{ ...S.td, maxWidth: '260px' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: t.warning ? '3px' : 0 }}>{t.desc}</p>
                      {t.warning && (
                        <p style={{ fontSize: '10.5px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <AlertCircle size={10} color="#ef4444" /> {t.warning}
                        </p>
                      )}
                    </td>

                    <td style={{ ...S.td, fontWeight: 700, whiteSpace: 'nowrap', color: t.amt >= 0 ? '#10b981' : 'var(--text-main)' }}>
                      {fmtAmt(t.amt)}
                    </td>

                    <td style={S.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Bot size={12} color="var(--primary)" />
                        </div>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--primary)' }}>{t.gl}</span>
                      </div>
                    </td>

                    <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '64px', height: '5px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' }}>
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
                            style={{ width: '30px', height: '30px', borderRadius: '7px', border: 'none', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                            <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
                          </button>
                        )}
                        <button onClick={() => openEdit(t)} title="Edit GL manually"
                          style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                          <Edit2 size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        </button>
                        {t.status !== 'Pending' && (
                          <button onClick={() => setStatus(t.id, 'Pending')} title="Reset to Pending"
                            style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                            <X size={16} color="#ef4444" style={{ flexShrink: 0 }} />
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
                    <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>No transactions match</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Try a different filter or search term.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Proceed Banner ── */}
      {!canProceed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px' }}>
          <AlertCircle size={18} color="#f59e0b" />
          <p style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 500 }}>
            <strong>{counts.pending} transaction{counts.pending !== 1 ? 's' : ''} still pending.</strong> Accept or correct all transactions to proceed to Review &amp; Confirmation.
          </p>
        </div>
      )}

      {/* ── Edit GL Modal ── */}
      <AnimatePresence>
        {editingId && editingTxn && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'var(--bg-card)', borderRadius: '18px', padding: '28px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.18)', border: '1px solid var(--border)' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Edit2 size={16} color="var(--primary)" />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)' }}>Edit GL Mapping</h3>
                </div>
                <button onClick={() => setEditingId(null)} style={{ background: 'var(--bg-dark)', border: 'none', cursor: 'pointer', padding: '7px', borderRadius: '50%', display: 'flex' }}>
                  <X size={16} color="var(--text-muted)" />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Description', val: editingTxn.desc },
                  { label: 'Amount',      val: fmtAmt(editingTxn.amt) },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>{f.label}</label>
                    <input readOnly value={f.val} style={{ width: '100%', padding: '10px 14px', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'var(--text-muted)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    GL Account <span style={{ color: 'var(--primary)' }}>(Editable)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Sparkles size={14} color="var(--primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select value={editGl} onChange={e => setEditGl(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px 11px 36px', borderRadius: '9px', border: '2px solid var(--primary)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '13px', outline: 'none', fontWeight: 600, boxShadow: '0 0 0 3px rgba(37,99,235,0.1)', cursor: 'pointer', boxSizing: 'border-box' }}>
                      {GL_ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  {editingTxn.warning && (
                    <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={11} color="#ef4444" /> {editingTxn.warning}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button onClick={() => setEditingId(null)} style={{ padding: '10px 18px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '9px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
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
