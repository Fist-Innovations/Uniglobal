import { useState } from 'react';
import { UploadCloud, FileText, BarChart3, Calculator, CheckCircle2, ArrowRight, TrendingUp, Download, Edit2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th: { padding: '13px 18px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left' },
  td: { padding: '15px 18px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc' },
  badge: (col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: col + '15', color: col }),
};

const COMPANIES = [
  { name: 'Kuwait Shipping Corp',  file: 'KSC_Annual_2025.xlsx',   revenue: 4500, assets: 12000, profit: 1700, expenses: 2800 },
  { name: 'Gulf Carriers Ltd',     file: 'GCL_Report_2025.pdf',    revenue: 3800, assets: 9500,  profit: 1400, expenses: 2400 },
  { name: 'Pearl Maritime',        file: 'Pearl_FinReport.xlsx',   revenue: 5200, assets: 15000, profit: 2100, expenses: 3100 },
  { name: 'Coastal Logistics',     file: 'CL_Statements_2025.pdf', revenue: 2100, assets: 6200,  profit: 200,  expenses: 1900 },
];

const PROFIT_TREND = [
  { month: 'Jan', KSC: 120, GCL: 100, PM: 160, CL: 10 },
  { month: 'Feb', KSC: 140, GCL: 115, PM: 180, CL: 15 },
  { month: 'Mar', KSC: 135, GCL: 120, PM: 175, CL: 8  },
  { month: 'Apr', KSC: 160, GCL: 130, PM: 200, CL: 20 },
  { month: 'May', KSC: 150, GCL: 125, PM: 190, CL: 12 },
  { month: 'Jun', KSC: 175, GCL: 140, PM: 210, CL: 18 },
];

const STEPS = [
  { id: 'upload',    label: '1. Upload',      icon: UploadCloud },
  { id: 'normalize', label: '2. Normalize',   icon: FileText },
  { id: 'compare',   label: '3. Compare',     icon: BarChart3 },
  { id: 'budget',    label: '4. Budget 2026', icon: Calculator },
  { id: 'review',    label: '5. Review',      icon: CheckCircle2 },
];

const btn = (primary) => ({
  padding: '10px 20px', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
  background: primary ? 'linear-gradient(to right,#1a56c4,#2563eb)' : '#f1f5f9',
  color: primary ? '#fff' : '#0f172a',
  boxShadow: primary ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
});

export default function ShippingKuwait() {
  const [step, setStep] = useState('upload');
  const [uploaded, setUploaded] = useState([]);
  const [fieldMap, setFieldMap] = useState({ Revenue: 'Revenue', Assets: 'Total Assets', Profit: 'Net Income', Expenses: 'Operating Expenses' });
  const [budget, setBudget] = useState(COMPANIES.map(c => ({
    name: c.name,
    revenue: Math.round(c.revenue * 1.10),
    assets:  Math.round(c.assets  * 1.10),
    profit:  Math.round(c.profit  * 1.10),
    expenses:Math.round(c.expenses * 0.95),
  })));
  const [approved, setApproved] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set(COMPANIES.map(c => c.name)));

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === COMPANIES.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(COMPANIES.map(c => c.name)));
    }
  };

  const handleBulkApprove = () => {
    setApproved(true);
    // In a real app, we'd mark selectedIds as approved in the backend
  };

  const compChart = [
    { name: 'Revenue',  ...Object.fromEntries(COMPANIES.map(c => [c.name.split(' ')[0], +(c.revenue/1000).toFixed(1)])) },
    { name: 'Assets',   ...Object.fromEntries(COMPANIES.map(c => [c.name.split(' ')[0], +(c.assets/1000).toFixed(1)]))  },
    { name: 'Profit',   ...Object.fromEntries(COMPANIES.map(c => [c.name.split(' ')[0], +(c.profit/1000).toFixed(1)]))  },
    { name: 'Expenses', ...Object.fromEntries(COMPANIES.map(c => [c.name.split(' ')[0], +(c.expenses/1000).toFixed(1)])) },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Step Bar */}
      <div style={{ ...S.card, padding: '8px', display: 'flex', gap: '4px' }}>
        {STEPS.map((s, i) => {
          const done = STEPS.findIndex(x => x.id === step) > i;
          const active = step === s.id;
          return (
            <button key={s.id} onClick={() => setStep(s.id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              background: active ? 'linear-gradient(to right,#1a56c4,#2563eb)' : done ? '#ecfdf5' : '#f8fafc',
              color: active ? '#fff' : done ? '#059669' : '#94a3b8', transition: 'all 0.2s',
            }}>
              {done ? <Check size={15} /> : <s.icon size={15} />} <span style={{ whiteSpace: 'nowrap' }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ ...S.card, padding: '48px', textAlign: 'center', border: '2px dashed #bfdbfe', background: '#fafbff', cursor: 'pointer' }}
                onClick={() => { setUploaded(COMPANIES.map(c => c.file)); }}>
                <UploadCloud size={48} style={{ color: '#2563eb', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Drop Financial Reports Here</h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Supports PDF, Excel (.xlsx), CSV. Upload multiple company reports at once.</p>
                <button style={btn(true)}><UploadCloud size={16} /> Select Files</button>
              </div>
              {uploaded.length > 0 && (
                <div style={S.card}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#0f172a' }}>Uploaded Files ({uploaded.length})</div>
                  {uploaded.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < uploaded.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} color="#2563eb" /></div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{f}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{COMPANIES[i].name}</div>
                        </div>
                      </div>
                      <span style={S.badge('#059669')}>Uploaded</span>
                    </div>
                  ))}
                </div>
              )}
              {uploaded.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={btn(true)} onClick={() => setStep('normalize')}>Continue to Normalize <ArrowRight size={16} /></button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: NORMALIZE */}
          {step === 'normalize' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ ...S.card, padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Field Mapping</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Map extracted columns to standard financial fields.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
                  {Object.entries(fieldMap).map(([k, v]) => (
                    <div key={k}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>{k}</label>
                      <select value={v} onChange={e => setFieldMap(p => ({ ...p, [k]: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', background: '#fff' }}>
                        <option>Revenue</option><option>Total Assets</option><option>Net Income</option><option>Operating Expenses</option><option>Gross Profit</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...S.card, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>Extracted Data Preview</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Company', 'Revenue (KWD)', 'Assets (KWD)', 'Profit (KWD)', 'Expenses (KWD)'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {COMPANIES.map((c, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                        <td style={{ ...S.td, fontWeight: 600 }}>{c.name}</td>
                        <td style={S.td}>{c.revenue.toLocaleString()}</td>
                        <td style={S.td}>{c.assets.toLocaleString()}</td>
                        <td style={S.td}>{c.profit.toLocaleString()}</td>
                        <td style={S.td}>{c.expenses.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button style={btn(false)} onClick={() => setStep('upload')}>Back</button>
                <button style={btn(true)} onClick={() => setStep('compare')}>Confirm & Compare <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {/* STEP 3: COMPARE */}
          {step === 'compare' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                <div style={{ ...S.card, padding: '24px' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Revenue Comparison (KWD '000s)</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Side-by-side metric comparison · FY 2025</p>
                  <div style={{ height: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={compChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }} />
                        <Bar dataKey="Kuwait" fill="#2563eb" radius={[4,4,0,0]} barSize={14} />
                        <Bar dataKey="Gulf"   fill="#7c3aed" radius={[4,4,0,0]} barSize={14} />
                        <Bar dataKey="Pearl"  fill="#059669" radius={[4,4,0,0]} barSize={14} />
                        <Bar dataKey="Coastal" fill="#f59e0b" radius={[4,4,0,0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={{ ...S.card, padding: '24px' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Profit Trends</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Monthly profit trajectory · H1 2025</p>
                  <div style={{ height: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={PROFIT_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }} />
                        <Line type="monotone" dataKey="KSC" stroke="#2563eb" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="GCL" stroke="#7c3aed" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="PM"  stroke="#059669" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="CL"  stroke="#f59e0b" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div style={{ ...S.card, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#0f172a' }}>Side-by-Side Comparison Table</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Company','Revenue','Assets','Profit','Expenses','Margin'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {COMPANIES.map((c, i) => {
                      const margin = ((c.profit / c.revenue) * 100).toFixed(1);
                      return (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                          <td style={{ ...S.td, fontWeight: 600, color: '#0f172a' }}>{c.name}</td>
                          <td style={S.td}>KWD {c.revenue.toLocaleString()}</td>
                          <td style={S.td}>KWD {c.assets.toLocaleString()}</td>
                          <td style={{ ...S.td, fontWeight: 700, color: '#059669' }}>KWD {c.profit.toLocaleString()}</td>
                          <td style={S.td}>KWD {c.expenses.toLocaleString()}</td>
                          <td style={S.td}><span style={S.badge(parseFloat(margin) > 20 ? '#059669' : '#f59e0b')}>{margin}%</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button style={btn(false)} onClick={() => setStep('normalize')}>Back</button>
                <button style={btn(true)} onClick={() => setStep('budget')}>Generate Budget <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {/* STEP 4: BUDGET */}
          {step === 'budget' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
                {[
                  { label: 'Revenue', rule: '+10%', col: '#059669', icon: '📈' },
                  { label: 'Assets',  rule: '+10%', col: '#2563eb', icon: '🏦' },
                  { label: 'Profit',  rule: '+10%', col: '#7c3aed', icon: '💰' },
                  { label: 'Expenses',rule: '-5%',  col: '#f59e0b', icon: '📉' },
                ].map(item => (
                  <div key={item.label} style={{ ...S.card, padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: item.col }}>{item.rule}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Auto-applied for 2026</div>
                  </div>
                ))}
              </div>
              <div style={{ ...S.card, overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>2026 Budget — Editable Fields</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Auto-calculated · click any field to edit</div>
                  </div>
                  <span style={S.badge('#059669')}>Auto Logic Applied</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Company','Revenue 2026','Assets 2026','Profit 2026','Expenses 2026'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {budget.map((b, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                        <td style={{ ...S.td, fontWeight: 600 }}>{b.name}</td>
                        {['revenue','assets','profit','expenses'].map(field => (
                          <td key={field} style={S.td}>
                            <input
                              type="number"
                              value={b[field]}
                              onChange={e => setBudget(p => p.map((row, ri) => ri === i ? { ...row, [field]: +e.target.value } : row))}
                              style={{ width: '110px', padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: field === 'expenses' ? '#f59e0b' : '#059669', outline: 'none', background: '#f8fafc' }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button style={btn(false)} onClick={() => setStep('compare')}>Back</button>
                <button style={btn(true)} onClick={() => setStep('review')}>Review Budget <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {step === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {approved && (
                <div style={{ ...S.card, padding: '20px 24px', background: 'linear-gradient(to right, #ecfdf5, #f0fdf4)', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <CheckCircle2 size={28} color="#059669" />
                  <div>
                    <div style={{ fontWeight: 700, color: '#059669', fontSize: '15px' }}>Budget Approved!</div>
                    <div style={{ fontSize: '13px', color: '#064e3b' }}>The 2026 budget has been locked and is ready for export.</div>
                  </div>
                </div>
              )}
              <div style={{ ...S.card, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '16px' }}>Final Budget Draft — FY 2026</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Kuwait Financial Comparison · {selectedIds.size} of {COMPANIES.length} selected</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ ...btn(false), background: '#fff', border: '1px solid #e2e8f0' }}><Download size={16} /> Export PDF</button>
                    <button style={{ ...btn(false), background: '#fff', border: '1px solid #e2e8f0' }}><Download size={16} /> Export Excel</button>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ ...S.th, width: '40px', paddingRight: 0 }}>
                        <input type="checkbox" checked={COMPANIES.length > 0 && selectedIds.size === COMPANIES.length} onChange={toggleSelectAll} style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: '#2563eb' }} />
                      </th>
                      {['Company','Rev 2025','Rev 2026 (+10%)','Assets 2026 (+10%)','Profit 2026 (+10%)','Expenses 2026 (-5%)'].map(h=><th key={h} style={S.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {budget.map((b, i) => (
                      <tr key={i} style={{ background: selectedIds.has(b.name) ? '#eff6ff' : i % 2 === 0 ? '#fff' : '#fafbff' }}>
                        <td style={{ ...S.td, paddingRight: 0 }}>
                          <input type="checkbox" checked={selectedIds.has(b.name)} onChange={() => toggleSelect(b.name)} style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: '#2563eb' }} />
                        </td>
                        <td style={{ ...S.td, fontWeight: 700, color: '#0f172a' }}>{b.name}</td>
                        <td style={S.td}>KWD {COMPANIES[i].revenue.toLocaleString()}</td>
                        <td style={{ ...S.td, color: '#059669', fontWeight: 700 }}>KWD {b.revenue.toLocaleString()}</td>
                        <td style={{ ...S.td, color: '#2563eb', fontWeight: 700 }}>KWD {b.assets.toLocaleString()}</td>
                        <td style={{ ...S.td, color: '#7c3aed', fontWeight: 700 }}>KWD {b.profit.toLocaleString()}</td>
                        <td style={{ ...S.td, color: '#f59e0b', fontWeight: 700 }}>KWD {b.expenses.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button style={btn(false)} onClick={() => setStep('budget')}>Back</button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button disabled={selectedIds.size === 0} style={{ ...btn(false), color: selectedIds.size === 0 ? '#94a3b8' : '#dc2626', background: selectedIds.size === 0 ? '#f8fafc' : '#fef2f2', border: selectedIds.size === 0 ? '1px solid #e2e8f0' : '1px solid #fecaca', cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer' }}>
                    <X size={16} /> Reject Selected ({selectedIds.size})
                  </button>
                  <button onClick={handleBulkApprove} disabled={selectedIds.size === 0} style={{ ...btn(true), background: approved ? '#059669' : selectedIds.size === 0 ? '#e2e8f0' : 'linear-gradient(to right,#1a56c4,#2563eb)', cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer' }}>
                    <Check size={16} /> {approved ? 'Approved ✓' : `Approve Selected (${selectedIds.size})`}
                  </button>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
