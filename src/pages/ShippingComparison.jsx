import { useState } from 'react';
import { BarChart3, TrendingUp, Globe, Layers, Info, ArrowUpRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const compData = [
  { name: 'Revenue',  Kuwait: 4.5, GCC: 3.8, Marine: 5.2 },
  { name: 'Assets',   Kuwait: 12,  GCC: 9.5, Marine: 15  },
  { name: 'Expenses', Kuwait: 2.8, GCC: 2.4, Marine: 3.1 },
  { name: 'Profit',   Kuwait: 1.7, GCC: 1.4, Marine: 2.1 },
];

const rows = [
  { name: 'Kuwait Shipping Corp', rev: '4.5M', exp: '2.8M', prof: '1.7M', proj: '1.95M', trend: 'up'   },
  { name: 'GCC Logistics Ltd',    rev: '3.8M', exp: '2.4M', prof: '1.4M', proj: '1.62M', trend: 'up'   },
  { name: 'Marine Global Port',   rev: '5.2M', exp: '3.1M', prof: '2.1M', proj: '2.38M', trend: 'up'   },
  { name: 'Regional Cargo S.A.',  rev: '2.1M', exp: '1.9M', prof: '0.2M', proj: '0.18M', trend: 'down' },
];

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th:   { padding: '12px 20px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left' },
  td:   { padding: '14px 20px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc' },
};

const ShippingComparison = () => {
  const [region, setRegion] = useState('GCC Region');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [exportState, setExportState] = useState(null);

  const handleGenerate = () => {
    if (isGenerating || isGenerated) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  const handleExport = (type) => {
    if (exportState) return;
    setExportState(type);
    setTimeout(() => {
      setExportState(null);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Shipping Financial Comparison</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Multi-company analysis & AI-driven 2026 budget forecasting</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setRegion(prev => prev === 'GCC Region' ? 'Global Network' : 'GCC Region')}
            style={{ padding: '9px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: 500, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Globe size={14} /> {region}
          </button>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || isGenerated}
            style={{ 
              padding: '9px 18px', 
              background: isGenerated ? '#059669' : 'linear-gradient(to right,#1a56c4,#2563eb)', 
              border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: 'white', 
              cursor: (isGenerating || isGenerated) ? 'default' : 'pointer', 
              boxShadow: isGenerated ? 'none' : '0 4px 12px rgba(37,99,235,0.3)', 
              display: 'flex', alignItems: 'center', gap: '6px',
              opacity: isGenerating ? 0.7 : 1, transition: 'all 0.3s'
            }}
          >
            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : isGenerated ? <CheckCircle2 size={14} /> : <Layers size={14} />} 
            {isGenerating ? 'Analyzing...' : isGenerated ? 'Budget Generated' : 'Generate 2026 Budget'}
          </button>
        </div>
      </div>

    {/* Chart + Logic */}
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', minWidth: 0 }}>
      {/* Bar Chart */}
      <div style={{ ...S.card, padding: '24px', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
              <BarChart3 size={16} style={{ display: 'inline', marginRight: '6px', color: '#2563eb', verticalAlign: 'middle' }} />
              Financial Metric Comparison (USD M)
            </p>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>FY 2025 · Three companies</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#64748b' }}>
            {[['#2563eb','Kuwait Corp'],['#7c3aed','GCC Logistics'],['#059669','Marine Global']].map(([c,l])=>(
              <span key={l} style={{ display:'flex',alignItems:'center',gap:'5px',fontWeight:600 }}>
                <span style={{ width:'8px',height:'8px',borderRadius:'50%',background:c,display:'inline-block' }} />{l}
              </span>
            ))}
          </div>
        </div>
        <div style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v=>`$${v}M`} />
              <Tooltip contentStyle={{ background:'#fff',border:'1px solid #e2e8f0',borderRadius:'10px',fontSize:'12px' }} cursor={{ fill:'rgba(0,0,0,0.02)' }} />
              <Bar dataKey="Kuwait" fill="#2563eb" radius={[5,5,0,0]} barSize={18} />
              <Bar dataKey="GCC"    fill="#7c3aed" radius={[5,5,0,0]} barSize={18} />
              <Bar dataKey="Marine" fill="#059669" radius={[5,5,0,0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Budget Logic */}
      <div style={{ ...S.card, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={16} style={{ color: '#059669' }} /> AI Budget Logic (2026)
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>Automated forecast assumptions</p>
        </div>

        {[
          { label: 'Revenue Growth',    val: '+10%',  w: 70, col: '#059669', bg: '#ecfdf5', note: 'Based on GCC trade growth patterns.' },
          { label: 'Expense Reduction', val: '−5%',   w: 40, col: '#2563eb', bg: '#eff6ff', note: 'Targeting logistics & fuel optimization.' },
        ].map(b => (
          <div key={b.label} style={{ background: b.bg, borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}>{b.label}</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: b.col }}>{b.val}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '99px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', width: `${b.w}%`, background: b.col, borderRadius: '99px' }} />
            </div>
            <p style={{ fontSize: '10.5px', color: '#64748b' }}>{b.note}</p>
          </div>
        ))}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <Info size={20} style={{ color: '#2563eb' }} />
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Forecast Accuracy</p>
          <p style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a' }}>92.8%</p>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Confidence for 2026 predictions</p>
        </div>
      </div>
    </div>

    {/* Table */}
    <div style={{ ...S.card, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Consolidated Financial Table</p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>{rows.length} companies · FY 2025–2026</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['Export PDF', 'Export Excel'].map(t => {
            const isThisExporting = exportState === t;
            return (
              <button 
                key={t} 
                onClick={() => handleExport(t)}
                disabled={exportState !== null}
                style={{ 
                  padding: '7px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', 
                  borderRadius: '8px', fontSize: '12px', color: '#64748b', 
                  cursor: exportState !== null ? 'not-allowed' : 'pointer', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  opacity: exportState && !isThisExporting ? 0.5 : 1
                }}
              >
                {isThisExporting ? <Loader2 size={12} className="animate-spin" /> : null}
                {isThisExporting ? 'Exporting...' : t}
              </button>
            );
          })}
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>{['Entity Name','Revenue (2025)','Expenses (2025)','Profit (2025)','Projected Profit (2026)','Trend'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
              style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
              <td style={{ ...S.td, fontWeight: 600, color: '#0f172a' }}>{r.name}</td>
              <td style={S.td}>${r.rev}</td>
              <td style={S.td}>${r.exp}</td>
              <td style={{ ...S.td, fontWeight: 700, color: '#0f172a' }}>${r.prof}</td>
              <td style={{ ...S.td, fontWeight: 700, color: '#059669' }}>${r.proj}</td>
              <td style={S.td}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: r.trend === 'up' ? '#ecfdf5' : '#fef2f2', color: r.trend === 'up' ? '#059669' : '#dc2626' }}>
                  {r.trend === 'up' ? <ArrowUpRight size={12} /> : <TrendingUp size={12} style={{ transform: 'rotate(180deg)' }} />}
                  {r.trend === 'up' ? 'Growth' : 'Decline'}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default ShippingComparison;
