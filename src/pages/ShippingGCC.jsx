import { useState } from 'react';
import { UploadCloud, Globe, BarChart3, Calculator, AlertTriangle, ArrowRight, Check, X, Download, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th: { padding: '13px 18px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left' },
  td: { padding: '15px 18px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc' },
  badge: (col) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: col + '18', color: col }),
};

const COUNTRIES = [
  { code: 'KW', name: 'Kuwait',       currency: 'KWD', rate: 1,      companies: 4, revenue: 15600, profit: 5400, expenses: 10200, assets: 42700, flag: '🇰🇼' },
  { code: 'AE', name: 'UAE',          currency: 'AED', rate: 0.0816, companies: 6, revenue: 24200, profit: 8100, expenses: 16100, assets: 68000, flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', rate: 0.0726, companies: 5, revenue: 31000, profit: 9800, expenses: 21200, assets: 87000, flag: '🇸🇦' },
  { code: 'BH', name: 'Bahrain',      currency: 'BHD', rate: 0.9565, companies: 2, revenue: 7200,  profit: 2100, expenses: 5100,  assets: 18500, flag: '🇧🇭' },
  { code: 'QA', name: 'Qatar',        currency: 'QAR', rate: 0.0748, companies: 3, revenue: 18400, profit: 6200, expenses: 12200, assets: 51000, flag: '🇶🇦' },
  { code: 'OM', name: 'Oman',         currency: 'OMR', rate: 0.0705, companies: 2, revenue: 8800,  profit: 2400, expenses: 6400,  assets: 22000, flag: '🇴🇲' },
];

const ANOMALIES = [
  { country: 'Saudi Arabia', metric: 'Expense Ratio', value: '68.4%', expected: '<55%', severity: 'High',   detail: 'Operating expenses significantly above regional benchmark.' },
  { country: 'UAE',          metric: 'Revenue Growth',value: '-12%',  expected: '+5%',  severity: 'Medium', detail: 'Declining revenue trend detected in Q2 2025 data.' },
  { country: 'Oman',         metric: 'Profit Margin', value: '27.3%', expected: '>30%', severity: 'Low',    detail: 'Slightly below GCC average profit margin threshold.' },
  { country: 'Bahrain',      metric: 'Asset Turnover',value: '0.39',  expected: '>0.5', severity: 'Medium', detail: 'Low asset utilization efficiency compared to peers.' },
];

const STEPS = [
  { id: 'upload',   label: '1. Upload',    icon: UploadCloud },
  { id: 'currency', label: '2. Currency',  icon: Globe },
  { id: 'regional', label: '3. Compare',   icon: BarChart3 },
  { id: 'budget',   label: '4. Budget',    icon: Calculator },
  { id: 'anomaly',  label: '5. Anomalies', icon: AlertTriangle },
];

const CHART_DATA = COUNTRIES.map(c => ({ name: c.flag + ' ' + c.code, revenue: +(c.revenue / 1000).toFixed(1), profit: +(c.profit / 1000).toFixed(1), expenses: +(c.expenses / 1000).toFixed(1) }));
const sevColor = { High: '#dc2626', Medium: '#f59e0b', Low: '#2563eb' };
const btn = (p) => ({ padding: '10px 20px', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: p ? 'linear-gradient(to right,#1a56c4,#2563eb)' : '#f1f5f9', color: p ? '#fff' : '#0f172a', boxShadow: p ? '0 4px 12px rgba(37,99,235,0.25)' : 'none' });

export default function ShippingGCC() {
  const [step, setStep] = useState('upload');
  const [uploaded, setUploaded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [tempFiles, setTempFiles] = useState([]);
  const [filter, setFilter] = useState({ country: 'All', company: 'All' });
  const [selectedBudgetIds, setSelectedBudgetIds] = useState(new Set(COUNTRIES.map(c => c.code)));
  const [selectedAnomalyIds, setSelectedAnomalyIds] = useState(new Set(ANOMALIES.map((_, i) => i)));
  const [anomaliesReviewed, setAnomaliesReviewed] = useState(false);

  const toggleBudgetSelect = (id) => {
    setSelectedBudgetIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBudgetSelectAll = () => {
    if (selectedBudgetIds.size === COUNTRIES.length) setSelectedBudgetIds(new Set());
    else setSelectedBudgetIds(new Set(COUNTRIES.map(c => c.code)));
  };

  const toggleAnomalySelect = (id) => {
    setSelectedAnomalyIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAnomalySelectAll = () => {
    if (selectedAnomalyIds.size === ANOMALIES.length) setSelectedAnomalyIds(new Set());
    else setSelectedAnomalyIds(new Set(ANOMALIES.map((_, i) => i)));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setTempFiles(files);
      setShowConfirm(true);
    }
  };

  const confirmUpload = () => {
    setUploaded(true);
    setShowConfirm(false);
  };

  const exportBudgetExcel = () => {
    const data = COUNTRIES.map(c => {
      const revUSD = Math.round(c.revenue * c.rate);
      return {
        'Country': c.name,
        'Currency': c.currency,
        'Revenue (Local)': c.revenue,
        'Revenue (USD)': revUSD,
        'Budget 2026 (USD)': Math.round(revUSD * 1.10),
        'Profit 2026 (USD)': Math.round(c.profit * c.rate * 1.10),
        'Expenses 2026 (USD)': Math.round(c.expenses * c.rate * 0.95)
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "GCC Budget 2026");
    XLSX.writeFile(wb, "Shipping_GCC_Budget_2026.xlsx");
  };

  const exportAnomalyPDF = () => {
    const doc = new jsPDF();
    doc.text("Shipping Management — GCC Anomaly Detection Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    
    const tableData = ANOMALIES.map(a => [
      a.country,
      a.metric,
      a.value,
      a.expected,
      a.severity,
      a.detail
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Country', 'Metric', 'Detected', 'Expected', 'Severity', 'Detail']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] }
    });

    doc.save("Shipping_GCC_Anomalies_Report.pdf");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Step Bar */}
      <div style={{ ...S.card, padding: '8px', display: 'flex', gap: '4px' }}>
        {STEPS.map((s, i) => {
          const done = STEPS.findIndex(x => x.id === step) > i;
          const active = step === s.id;
          return (
            <button key={s.id} onClick={() => setStep(s.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: active ? 'linear-gradient(to right,#1a56c4,#2563eb)' : done ? '#ecfdf5' : '#f8fafc', color: active ? '#fff' : done ? '#059669' : '#94a3b8', transition: 'all 0.2s' }}>
              {done ? <Check size={15} /> : <s.icon size={15} />}<span style={{ whiteSpace: 'nowrap' }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

          {/* STEP 1: MULTI-COUNTRY UPLOAD */}
          {step === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <input type="file" id="gcc-upload" multiple style={{ display: 'none' }} onChange={handleFileSelect} />
              <div style={{ ...S.card, padding: '48px', textAlign: 'center', border: '2px dashed #bfdbfe', background: '#fafbff', cursor: 'pointer' }} 
                onClick={() => document.getElementById('gcc-upload').click()}>
                <Globe size={48} style={{ color: '#2563eb', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Multi-Country Financial Data Upload</h3>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Upload reports from all 6 GCC countries. Supports PDF, Excel, CSV formats.</p>
                <button style={btn(true)}><UploadCloud size={16} /> Select Country Files</button>
              </div>

              <AnimatePresence>
                {showConfirm && (
                  <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                      style={{ ...S.card, width: '100%', maxWidth: '440px', padding: '32px', textAlign: 'center' }}>
                      <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Globe size={32} color="#2563eb" />
                      </div>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>Confirm GCC Data Upload</h2>
                      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
                        You are about to upload <strong>{tempFiles.length}</strong> regional report{tempFiles.length > 1 ? 's' : ''} for multi-country analysis. Continue?
                      </p>
                      
                      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px', marginBottom: '24px', textAlign: 'left', maxHeight: '120px', overflowY: 'auto' }}>
                        {tempFiles.map((f, i) => (
                          <div key={i} style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                            <Globe size={14} /> {f.name} ({(f.size / 1024).toFixed(1)} KB)
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => setShowConfirm(false)} style={{ ...btn(false), flex: 1, justifyContent: 'center' }}>Cancel</button>
                        <button onClick={confirmUpload} style={{ ...btn(true), flex: 1, justifyContent: 'center' }}>Confirm &amp; Upload</button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {uploaded && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                  {COUNTRIES.map(c => (
                    <div key={c.code} style={{ ...S.card, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '28px' }}>{c.flag}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{c.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{c.companies} companies · {c.currency}</div>
                      </div>
                      <span style={S.badge('#059669')}>✓ Ready</span>
                    </div>
                  ))}
                </div>
              )}
              {uploaded && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={btn(true)} onClick={() => setStep('currency')}>Currency Normalization <ArrowRight size={16} /></button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CURRENCY NORMALIZATION */}
          {step === 'currency' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ ...S.card, padding: '20px 24px', background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)', border: '1px solid #bfdbfe' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px', marginBottom: '4px' }}>Base Currency: USD</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>All financial figures will be converted to USD for standardised comparison.</div>
              </div>
              <div style={{ ...S.card, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>Currency Conversion Preview</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Country','Currency','Rate (→ USD)','Revenue (Local)','Revenue (USD)','Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {COUNTRIES.map((c, i) => (
                      <tr key={c.code} style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                        <td style={S.td}><span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '18px' }}>{c.flag}</span><span style={{ fontWeight: 600 }}>{c.name}</span></span></td>
                        <td style={S.td}><span style={S.badge('#2563eb')}>{c.currency}</span></td>
                        <td style={{ ...S.td, fontWeight: 600, color: '#0f172a' }}>1 {c.currency} = {c.rate < 1 ? c.rate.toFixed(4) : c.rate.toFixed(4)} USD</td>
                        <td style={S.td}>{c.revenue.toLocaleString()} {c.currency}</td>
                        <td style={{ ...S.td, fontWeight: 700, color: '#059669' }}>${Math.round(c.revenue * c.rate).toLocaleString()}</td>
                        <td style={S.td}><span style={S.badge('#059669')}>Converted</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button style={btn(false)} onClick={() => setStep('upload')}>Back</button>
                <button style={btn(true)} onClick={() => setStep('regional')}>View Comparison <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {/* STEP 3: REGIONAL COMPARISON */}
          {step === 'regional' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ ...S.card, padding: '24px' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px', marginBottom: '4px' }}>Country-wise Financial Breakdown (USD '000s)</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>FY 2025 · All figures converted to USD</div>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}k`} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }} />
                      <Bar dataKey="revenue"  fill="#2563eb" radius={[4,4,0,0]} barSize={18} name="Revenue" />
                      <Bar dataKey="profit"   fill="#059669" radius={[4,4,0,0]} barSize={18} name="Profit" />
                      <Bar dataKey="expenses" fill="#f59e0b" radius={[4,4,0,0]} barSize={18} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ ...S.card, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#0f172a' }}>Regional Financial Breakdown</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Country','Companies','Revenue (USD)','Profit (USD)','Expenses (USD)','Profit Margin'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {COUNTRIES.map((c, i) => {
                      const revUSD = Math.round(c.revenue * c.rate);
                      const profUSD = Math.round(c.profit * c.rate);
                      const expUSD = Math.round(c.expenses * c.rate);
                      const margin = ((c.profit / c.revenue) * 100).toFixed(1);
                      return (
                        <tr key={c.code} style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                          <td style={S.td}><span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>{c.flag}</span><span style={{ fontWeight: 600 }}>{c.name}</span></span></td>
                          <td style={S.td}>{c.companies}</td>
                          <td style={{ ...S.td, fontWeight: 700, color: '#2563eb' }}>${revUSD.toLocaleString()}</td>
                          <td style={{ ...S.td, fontWeight: 700, color: '#059669' }}>${profUSD.toLocaleString()}</td>
                          <td style={S.td}>${expUSD.toLocaleString()}</td>
                          <td style={S.td}><span style={S.badge(parseFloat(margin) > 30 ? '#059669' : parseFloat(margin) > 20 ? '#f59e0b' : '#dc2626')}>{margin}%</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button style={btn(false)} onClick={() => setStep('currency')}>Back</button>
                <button style={btn(true)} onClick={() => setStep('budget')}>GCC Budget <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {/* STEP 4: GCC BUDGET DASHBOARD */}
          {step === 'budget' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Filters */}
              <div style={{ ...S.card, padding: '16px 24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 600 }}><Filter size={16} /> Filters:</div>
                {[
                  { label: 'Country', key: 'country', opts: ['All', ...COUNTRIES.map(c => c.name)] },
                  { label: 'Company', key: 'company', opts: ['All', 'Shipping Corp', 'Carriers Ltd', 'Maritime', 'Logistics'] },
                ].map(f => (
                  <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{f.label}:</span>
                    <select value={filter[f.key]} onChange={e => setFilter(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#f8fafc', color: '#0f172a' }}>
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <button style={{ ...btn(false), marginLeft: 'auto' }}><X size={14} /> Clear</button>
              </div>

              {/* Aggregate Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
                {[
                  { label: 'Total GCC Revenue', val: '$15.8M', sub: '+9.2% YoY', col: '#2563eb' },
                  { label: 'Total GCC Profit',  val: '$4.7M',  sub: '+11.4% YoY', col: '#059669' },
                  { label: 'Total Companies',   val: '22',     sub: 'Across 6 countries', col: '#7c3aed' },
                  { label: 'Avg Profit Margin', val: '29.8%',  sub: 'GCC average', col: '#f59e0b' },
                ].map(stat => (
                  <div key={stat.label} style={{ ...S.card, padding: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{stat.label}</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: stat.col, marginBottom: '4px' }}>{stat.val}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Country Budget Table */}
              <div style={{ ...S.card, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>Aggregated GCC Budget View — FY 2026</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={exportBudgetExcel} style={{ ...btn(false), padding: '8px 14px' }}><Download size={14} /> Export Excel</button>
                    <button disabled={selectedBudgetIds.size === 0} style={{ ...btn(true), padding: '8px 14px' }}>
                      <Check size={14} /> Approve Selected ({selectedBudgetIds.size})
                    </button>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ ...S.th, width: '40px', paddingRight: 0 }}>
                        <input type="checkbox" checked={COUNTRIES.length > 0 && selectedBudgetIds.size === COUNTRIES.length} onChange={toggleBudgetSelectAll} style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: '#2563eb' }} />
                      </th>
                      {['Country','Curr. Revenue','Budget Revenue (+10%)','Budget Profit (+10%)','Budget Expenses (-5%)','Status'].map(h => <th key={h} style={S.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTRIES.map((c, i) => {
                      const revUSD = Math.round(c.revenue * c.rate);
                      return (
                        <tr key={c.code} style={{ background: selectedBudgetIds.has(c.code) ? '#eff6ff' : i % 2 === 0 ? '#fff' : '#fafbff' }}>
                          <td style={{ ...S.td, paddingRight: 0 }}>
                            <input type="checkbox" checked={selectedBudgetIds.has(c.code)} onChange={() => toggleBudgetSelect(c.code)} style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: '#2563eb' }} />
                          </td>
                          <td style={S.td}><span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>{c.flag}</span><span style={{ fontWeight: 600 }}>{c.name}</span></span></td>
                          <td style={S.td}>${revUSD.toLocaleString()}</td>
                          <td style={{ ...S.td, fontWeight: 700, color: '#059669' }}>${Math.round(revUSD * 1.10).toLocaleString()}</td>
                          <td style={{ ...S.td, fontWeight: 700, color: '#7c3aed' }}>${Math.round(c.profit * c.rate * 1.10).toLocaleString()}</td>
                          <td style={{ ...S.td, fontWeight: 700, color: '#f59e0b' }}>${Math.round(c.expenses * c.rate * 0.95).toLocaleString()}</td>
                          <td style={S.td}><span style={S.badge('#059669')}>Approved</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button style={btn(false)} onClick={() => setStep('regional')}>Back</button>
                <button style={btn(true)} onClick={() => setStep('anomaly')}>Anomaly Detection <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {/* STEP 5: ANOMALY DETECTION */}
          {step === 'anomaly' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                {[
                  { label: 'Anomalies Found', val: ANOMALIES.length, col: '#dc2626', icon: '⚠️' },
                  { label: 'High Severity',   val: ANOMALIES.filter(a => a.severity === 'High').length,   col: '#dc2626', icon: '🔴' },
                  { label: 'Data Points Scanned', val: '2,840', col: '#2563eb', icon: '🔍' },
                ].map(stat => (
                  <div key={stat.label} style={{ ...S.card, padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '32px' }}>{stat.icon}</div>
                    <div>
                      <div style={{ fontSize: '32px', fontWeight: 800, color: stat.col }}>{stat.val}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                    <input type="checkbox" checked={ANOMALIES.length > 0 && selectedAnomalyIds.size === ANOMALIES.length} onChange={toggleAnomalySelectAll} style={{ width: '16px', height: '16px', accentColor: '#2563eb' }} />
                    Select All Anomalies
                  </label>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{selectedAnomalyIds.size} of {ANOMALIES.length} selected</span>
                </div>
                {ANOMALIES.map((a, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    style={{ ...S.card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: `4px solid ${sevColor[a.severity]}`, background: selectedAnomalyIds.has(i) ? '#eff6ff' : '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <input type="checkbox" checked={selectedAnomalyIds.has(i)} onChange={() => toggleAnomalySelect(i)} style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: sevColor[a.severity] }} />
                      <AlertTriangle size={24} style={{ color: sevColor[a.severity], flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{a.country} — {a.metric}</span>
                          <span style={S.badge(sevColor[a.severity])}>{a.severity}</span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>{a.detail}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Detected Value</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: sevColor[a.severity] }}>{a.value}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Expected: {a.expected}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ ...S.card, padding: '20px 24px', background: 'linear-gradient(135deg,#f8fafc,#eff6ff)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Anomaly Report Ready</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{selectedAnomalyIds.size} outliers selected in GCC regional data. Review and take action.</div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={exportAnomalyPDF} style={{ ...btn(false), background: '#fff', border: '1px solid #e2e8f0' }}><Download size={16} /> Export PDF Report</button>
                  <button onClick={() => setAnomaliesReviewed(true)} disabled={selectedAnomalyIds.size === 0} style={{ ...btn(true), background: anomaliesReviewed ? '#059669' : selectedAnomalyIds.size === 0 ? '#e2e8f0' : 'linear-gradient(to right,#1a56c4,#2563eb)' }}>
                    <Check size={16} /> {anomaliesReviewed ? 'Reviewed ✓' : `Mark Selected as Reviewed (${selectedAnomalyIds.size})`}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button style={btn(false)} onClick={() => setStep('budget')}>Back</button>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
