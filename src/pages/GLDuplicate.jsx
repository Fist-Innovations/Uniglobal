import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertTriangle, CheckCircle2, Search, Filter, X, FileWarning, Clock, History, Edit2, Check, Calendar, User, DollarSign, Hash, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th: { padding: '13px 18px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left' },
  td: { padding: '14px 18px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc' },
  label: { display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff', transition: 'border-color 0.2s' },
  badge: (c) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: c + '18', color: c }),
};

const ALL_DUPLICATES = [
  { id: 1, vendor: 'Amazon Web Services', amt: '$1,240.50', ref: 'INV-2024-001', date: '2026-04-20', conf: 98, status: 'Flagged',   match: 'INV-2024-001 · 2026-03-20 · $1,240.50' },
  { id: 2, vendor: 'Starbucks Coffee',    amt: '$25.40',    ref: 'STB-9921',     date: '2026-04-21', conf: 85, status: 'Review',    match: 'STB-9921 · 2026-04-14 · $25.40' },
  { id: 3, vendor: 'WeWork Management',   amt: '$5,000.00', ref: 'WW-RENT-APR',  date: '2026-04-22', conf: 99, status: 'Flagged',   match: 'WW-RENT-APR · 2026-04-01 · $5,000.00' },
  { id: 4, vendor: 'Adobe Systems',       amt: '$82.99',    ref: 'ADO-CC-APR',   date: '2026-04-24', conf: 91, status: 'Resolved',  match: 'ADO-CC-APR · 2026-03-24 · $82.99' },
  { id: 5, vendor: 'Tech Solutions Inc.', amt: '$2,500.00', ref: 'TS-2025-88',   date: '2026-04-25', conf: 74, status: 'Review',    match: 'TS-2025-88 · 2026-04-10 · $2,500.00' },
];

const VIEWS = [
  { id: 'form',   label: '1. New Entry',   icon: Plus },
  { id: 'report', label: '2. Report',      icon: FileWarning },
];

const confColor = (c) => c >= 90 ? '#dc2626' : c >= 70 ? '#f59e0b' : '#2563eb';
const statusColor = { Flagged: '#dc2626', Review: '#f59e0b', Resolved: '#059669' };

export default function GLDuplicate() {
  const [view, setView]             = useState('form');
  const [form, setForm]             = useState({ vendor: '', amt: '', ref: '', date: '' });
  const [warning, setWarning]       = useState(null);
  const [duplicates, setDuplicates] = useState(ALL_DUPLICATES);
  const [search, setSearch]         = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const match = duplicates.find(d =>
      d.vendor.toLowerCase().includes(form.vendor.toLowerCase()) ||
      d.ref.toLowerCase() === form.ref.toLowerCase() ||
      d.amt === `$${parseFloat(form.amt).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    );
    if (match) setWarning(match);
    else { 
      setDuplicates(prev => [...prev, { id: Date.now(), ...form, amt: `$${parseFloat(form.amt).toFixed(2)}`, conf: 0, status: 'Resolved', match: 'N/A' }]);
      setForm({ vendor: '', amt: '', ref: '', date: '' });
    }
  };

  const [editData, setEditData] = useState(null);

  const startEdit = (entry) => {
    setEditData({ ...entry, amt: entry.amt.replace('$', '').replace(',', '') });
  };

  const handleSaveEdit = () => {
    setDuplicates(prev => prev.map(d => d.id === editData.id ? { ...editData, amt: `$${parseFloat(editData.amt).toFixed(2)}` } : d));
    setEditData(null);
  };

  const handleProceed = () => {
    setDuplicates(p => [...p, { id: p.length + 1, vendor: form.vendor, amt: `$${parseFloat(form.amt).toFixed(2)}`, ref: form.ref, date: form.date, conf: warning.conf, status: 'Flagged', match: warning.match }]);
    setWarning(null); setForm({ vendor: '', amt: '', ref: '', date: '' }); setView('report');
  };

  const filtered = duplicates.filter(d => {
    const q = search.toLowerCase();
    const matchQ = !q || d.vendor.toLowerCase().includes(q) || d.ref.toLowerCase().includes(q) || d.amt.includes(q);
    const matchD = !dateFilter || d.date === dateFilter;
    const matchV = !vendorFilter || d.vendor.toLowerCase().includes(vendorFilter.toLowerCase());
    return matchQ && matchD && matchV;
  });

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Duplicates");
    XLSX.writeFile(wb, "Duplicate_Detection_Report.xlsx");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Duplicate Detection</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>AI-powered monitoring for journal entry redundancy</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', padding: '6px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          {view === 'report' && (
            <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
              <Download size={15} /> Export
            </button>
          )}
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: view === v.id ? 'linear-gradient(to right,#1a56c4,#2563eb)' : 'transparent', color: view === v.id ? '#fff' : '#64748b' }}>
              <v.icon size={15} style={{ flexShrink: 0 }} />{v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Flagged',       val: duplicates.filter(d => d.status === 'Flagged').length,   icon: FileWarning,   col: '#dc2626', bg: '#fef2f2' },
          { label: 'Potential Savings',   val: '$14.2K',                                                 icon: CheckCircle2,  col: '#059669', bg: '#ecfdf5' },
          { label: 'Avg Confidence',      val: Math.round(duplicates.reduce((s, d) => s + d.conf, 0) / duplicates.length) + '%', icon: Clock, col: '#2563eb', bg: '#eff6ff' },
        ].map(s => (
          <div key={s.label} style={{ ...S.card, padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={22} color={s.col} style={{ flexShrink: 0 }} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>{s.label}</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>

          {/* ── VIEW 1: JOURNAL ENTRY FORM ── */}
          {view === 'form' && (
            <div style={{ ...S.card, padding: '32px', maxWidth: '680px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={20} color="#2563eb" style={{ flexShrink: 0 }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>New Journal Entry</h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>AI will scan for duplicates before submission</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Vendor */}
                  <div>
                    <label style={S.label}>
                      <User size={11} style={{ display: 'inline', marginRight: '4px' }} />Vendor / Payee
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" required placeholder="e.g. Amazon Web Services" value={form.vendor}
                        onChange={e => setForm({ ...form, vendor: e.target.value })}
                        style={{ ...S.input, paddingLeft: '38px' }}
                        onFocus={e => e.target.style.borderColor = '#2563eb'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                  </div>
                  {/* Amount */}
                  <div>
                    <label style={S.label}>
                      <DollarSign size={11} style={{ display: 'inline', marginRight: '4px' }} />Amount (USD)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <DollarSign size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="number" step="0.01" required placeholder="0.00" value={form.amt}
                        onChange={e => setForm({ ...form, amt: e.target.value })}
                        style={{ ...S.input, paddingLeft: '38px' }}
                        onFocus={e => e.target.style.borderColor = '#2563eb'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                  </div>
                  {/* Reference */}
                  <div>
                    <label style={S.label}>
                      <Hash size={11} style={{ display: 'inline', marginRight: '4px' }} />Reference Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Hash size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" required placeholder="INV-0000" value={form.ref}
                        onChange={e => setForm({ ...form, ref: e.target.value })}
                        style={{ ...S.input, paddingLeft: '38px' }}
                        onFocus={e => e.target.style.borderColor = '#2563eb'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                  </div>
                  {/* Date */}
                  <div>
                    <label style={S.label}>
                      <Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} />Entry Date
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="date" required value={form.date}
                        onChange={e => setForm({ ...form, date: e.target.value })}
                        style={{ ...S.input, paddingLeft: '38px' }}
                        onFocus={e => e.target.style.borderColor = '#2563eb'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setForm({ vendor: '', amt: '', ref: '', date: '' })}
                    style={{ flex: 1, padding: '13px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                    Clear
                  </button>
                  <button type="submit"
                    style={{ flex: 2, padding: '13px', background: 'linear-gradient(to right,#1a56c4,#2563eb)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
                    <Check size={18} style={{ flexShrink: 0 }} /> Verify & Submit Entry
                  </button>
                </div>
              </form>

              <div style={{ marginTop: '20px', padding: '14px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                  <strong>AI Tip:</strong> Try entering "Amazon" as the vendor or "INV-2024-001" as the reference to trigger the duplicate detection demo.
                </p>
              </div>
            </div>
          )}

          {/* ── VIEW 2: DUPLICATE REPORT ── */}
          {view === 'report' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Filters */}
              <div style={{ ...S.card, padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                  <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" placeholder="Search vendor, reference or amount…" value={search} onChange={e => setSearch(e.target.value)}
                    style={{ ...S.input, paddingLeft: '38px', fontSize: '13px', padding: '9px 14px 9px 38px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={15} color="#64748b" style={{ flexShrink: 0 }} />
                  <input type="text" placeholder="Vendor filter" value={vendorFilter} onChange={e => setVendorFilter(e.target.value)}
                    style={{ ...S.input, width: '160px', fontSize: '13px', padding: '9px 12px' }} />
                  <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
                    style={{ ...S.input, width: '160px', fontSize: '13px', padding: '9px 12px' }} />
                  <button onClick={() => { setSearch(''); setVendorFilter(''); setDateFilter(''); }}
                    style={{ padding: '9px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <X size={13} style={{ flexShrink: 0 }} /> Clear
                  </button>
                </div>
              </div>

              <div style={{ ...S.card, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Flagged Duplicates ({filtered.length})</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['All', 'Flagged', 'Review', 'Resolved'].map(s => (
                      <button key={s} style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#64748b', background: '#fff', cursor: 'pointer' }}>{s}</button>
                    ))}
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>{['Vendor', 'Reference', 'Amount', 'Date', 'Matched Entry', 'Confidence', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filtered.map((d, i) => (
                      <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                        <td style={{ ...S.td, fontWeight: 600, color: '#0f172a' }}>{d.vendor}</td>
                        <td style={S.td}><code style={{ background: '#f1f5f9', padding: '2px 7px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600 }}>{d.ref}</code></td>
                        <td style={{ ...S.td, fontWeight: 700 }}>{d.amt}</td>
                        <td style={{ ...S.td, color: '#64748b' }}>{d.date}</td>
                        <td style={{ ...S.td, fontSize: '12px', color: '#64748b' }}>{d.match}</td>
                        <td style={S.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '50px', height: '5px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${d.conf}%`, background: confColor(d.conf), borderRadius: '4px' }} />
                            </div>
                            <span style={{ fontSize: '11.5px', fontWeight: 700, color: confColor(d.conf) }}>{d.conf}%</span>
                          </div>
                        </td>
                        <td style={S.td}><span style={S.badge(statusColor[d.status])}>{d.status}</span></td>
                        <td style={S.td}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => startEdit(d)} style={{ width: '28px', height: '28px', borderRadius: '7px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                              <Edit2 size={14} color="#64748b" style={{ flexShrink: 0 }} />
                            </button>
                            <button onClick={() => setDuplicates(p => p.map(x => x.id === d.id ? { ...x, status: 'Resolved' } : x))}
                              style={{ width: '28px', height: '28px', borderRadius: '7px', border: 'none', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                              <Check size={14} color="#059669" style={{ flexShrink: 0 }} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* ── EDIT MODAL ── */}
      <AnimatePresence>
        {editData && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Edit Flagged Entry</h3>
                <button onClick={() => setEditData(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={S.label}>Vendor</label><input style={S.input} value={editData.vendor} onChange={e => setEditData({...editData, vendor: e.target.value})} /></div>
                <div><label style={S.label}>Reference</label><input style={S.input} value={editData.ref} onChange={e => setEditData({...editData, ref: e.target.value})} /></div>
                <div><label style={S.label}>Amount (USD)</label><input type="number" style={S.input} value={editData.amt} onChange={e => setEditData({...editData, amt: e.target.value})} /></div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button onClick={() => setEditData(null)} style={{ flex: 1, padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontWeight: 600 }}>Cancel</button>
                <button onClick={handleSaveEdit} style={{ flex: 1, padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700 }}>Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
