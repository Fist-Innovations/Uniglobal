import { useState } from 'react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  FileText, 
  Users, 
  Target, 
  Download, 
  Filter, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Share2,
  Mail,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, ComposedChart 
} from 'recharts';

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' },
  sectionTitle: { fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' },
  sectionSub: { fontSize: '12px', color: '#94a3b8' },
  statCard: { background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }
};

// --- DATA ---
const GLReportData = [
  { name: 'Jan', exp: 4000, rev: 4400 }, { name: 'Feb', exp: 3000, rev: 3200 },
  { name: 'Mar', exp: 2000, rev: 2300 }, { name: 'Apr', exp: 2780, rev: 3900 },
  { name: 'May', exp: 1890, rev: 4800 }, { name: 'Jun', exp: 2390, rev: 3800 },
];

const AccuracyData = [
  { name: 'GL Mapping', val: 98.4 }, { name: 'Duplicates', val: 92.1 },
  { name: 'Budgeting', val: 89.5 }, { name: 'OCR Text', val: 95.8 },
];

const CommData = [
  { name: 'Mon', sent: 120, del: 118 }, { name: 'Tue', sent: 200, del: 195 },
  { name: 'Wed', sent: 150, del: 148 }, { name: 'Thu', sent: 180, del: 176 },
  { name: 'Fri', sent: 250, del: 245 }, { name: 'Sat', sent: 40, del: 40 },
  { name: 'Sun', sent: 10, del: 10 },
];

const FinanceCompData = [
  { name: 'Kuwait Corp', rev: 450, exp: 280, profit: 170 },
  { name: 'GCC Logistics', rev: 380, exp: 240, profit: 140 },
  { name: 'Marine Global', rev: 520, exp: 310, profit: 210 },
];

const BudgetData = [
  { name: 'Q1', actual: 120, budget: 100 },
  { name: 'Q2', actual: 140, budget: 130 },
  { name: 'Q3', actual: 110, budget: 150 },
  { name: 'Q4', actual: 160, budget: 140 },
];

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#dc2626'];

const Reports = () => {
  const [activeReport, setActiveReport] = useState('gl');

  const reportTypes = [
    { id: 'gl', label: 'GL Reports', icon: FileText, data: GLReportData },
    { id: 'accuracy', label: 'AI Accuracy', icon: Target, data: AccuracyData },
    { id: 'duplicates', label: 'Duplicate Detection', icon: PieIcon, data: [
      { date: '2026-04-20', vendor: 'Amazon Web Services', amount: '$1,240.50', status: 'Potential Duplicate' },
      { date: '2026-04-21', vendor: 'Starbucks Coffee', amount: '$45.20', status: 'Potential Duplicate' },
      { date: '2026-04-22', vendor: 'Office Depot', amount: '$215.00', status: 'System Flagged' },
    ] },
    { id: 'communication', label: 'Student Communication', icon: Users, data: CommData },
    { id: 'finance', label: 'Financial Comparison', icon: BarChart3, data: FinanceCompData },
    { id: 'budget', label: 'Budget Reports', icon: TrendingUp, data: BudgetData },
  ];

  const handleExport = () => {
    const report = reportTypes.find(r => r.id === activeReport);
    if (!report || !report.data) return;

    const ws = XLSX.utils.json_to_sheet(report.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, report.label);
    XLSX.writeFile(wb, `${report.label.replace(/\s+/g, '_')}_Report.xlsx`);
  };

  const renderGLReport = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={S.statCard}>
          <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue (YTD)</p>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>$342,500</h2>
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>+12.4% vs LY</span>
        </div>
        <div style={S.statCard}>
          <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Operating Expenses</p>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>$158,200</h2>
          <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700 }}>+4.2% vs Budget</span>
        </div>
        <div style={S.statCard}>
          <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Net Margin</p>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>53.8%</h2>
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>Stable</span>
        </div>
      </div>
      
      <div style={{ ...S.card, padding: '24px', minWidth: 0 }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={S.sectionTitle}>Revenue vs Expense Analysis</p>
          <p style={S.sectionSub}>Monthly performance summary for FY 2025</p>
        </div>
        <div style={{ height: '300px', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GLReportData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="rev" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              <Area type="monotone" dataKey="exp" stroke="#94a3b8" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderAccuracyReport = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', minWidth: 0 }}>
      <div style={{ ...S.card, padding: '24px', minWidth: 0 }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={S.sectionTitle}>AI Model Precision</p>
          <p style={S.sectionSub}>Confidence scores across core ERP modules</p>
        </div>
        <div style={{ height: '260px', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={AccuracyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" stroke="#0f172a" fontSize={12} width={100} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={24}>
                {AccuracyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div style={{ ...S.card, padding: '24px', minWidth: 0 }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={S.sectionTitle}>Accuracy Distribution</p>
          <p style={S.sectionSub}>Contribution to overall system efficiency</p>
        </div>
        <div style={{ height: '260px', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={AccuracyData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="val">
                {AccuracyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderDuplicatesReport = () => (
    <div style={S.card}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={S.sectionTitle}>Duplicate Detection History</p>
          <p style={S.sectionSub}>Flagged transactions requiring reconciliation</p>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', background: '#fef2f2', padding: '4px 10px', borderRadius: '20px' }}>12 Flagged This Week</span>
      </div>
      <div style={{ padding: '0 24px' }}>
        {[
          { date: '2026-04-20', vendor: 'Amazon Web Services', amount: '$1,240.50', status: 'Potential Duplicate', color: '#dc2626' },
          { date: '2026-04-21', vendor: 'Starbucks Coffee', amount: '$45.20', status: 'Potential Duplicate', color: '#dc2626' },
          { date: '2026-04-22', vendor: 'Office Depot', amount: '$215.00', status: 'System Flagged', color: '#d97706' },
        ].map((item, i) => (
          <div key={i} style={{ padding: '16px 0', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieIcon size={16} style={{ color: '#64748b' }} />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700 }}>{item.vendor}</p>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>{item.date} · {item.amount}</p>
              </div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: item.color, background: `${item.color}10`, padding: '4px 10px', borderRadius: '4px' }}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommReport = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
      <div style={{ ...S.card, padding: '24px', minWidth: 0 }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={S.sectionTitle}>Automated Student Communication</p>
          <p style={S.sectionSub}>Email delivery and engagement metrics over the last 7 days</p>
        </div>
        <div style={{ height: '300px', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CommData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="sent" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} name="Emails Sent" />
              <Bar dataKey="del" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} name="Successfully Delivered" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ ...S.card, padding: '16px', textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <CheckCircle2 size={20} style={{ color: '#059669' }} />
          </div>
          <p style={{ fontSize: '20px', fontWeight: 800 }}>98.2%</p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>Delivery Rate</p>
        </div>
        <div style={{ ...S.card, padding: '16px', textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Mail size={20} style={{ color: '#2563eb' }} />
          </div>
          <p style={{ fontSize: '20px', fontWeight: 800 }}>950</p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>Total Sent (Month)</p>
        </div>
        <div style={{ ...S.card, padding: '16px', textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', background: '#f5f3ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Target size={20} style={{ color: '#7c3aed' }} />
          </div>
          <p style={{ fontSize: '20px', fontWeight: 800 }}>45%</p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>Open Rate</p>
        </div>
      </div>
    </div>
  );

  const renderFinanceReport = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
      <div style={{ ...S.card, padding: '24px', minWidth: 0 }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={S.sectionTitle}>Regional Financial Comparison</p>
          <p style={S.sectionSub}>Revenue vs Expense by Entity (USD Millions)</p>
        </div>
        <div style={{ height: '300px', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FinanceCompData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="rev" fill="#2563eb" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="exp" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ ...S.card, minWidth: 0 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
          <p style={{ fontSize: '13px', fontWeight: 700 }}>Comparison Summary</p>
        </div>
        {FinanceCompData.map((f, i) => (
          <div key={i} style={{ padding: '16px 24px', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={16} style={{ color: '#2563eb' }} />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{f.name}</span>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>+${f.profit}M Profit</span>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>Margin: {((f.profit/f.rev)*100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBudgetReport = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
      <div style={{ ...S.card, padding: '24px', minWidth: 0 }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={S.sectionTitle}>Budget vs Actual Variance</p>
          <p style={S.sectionSub}>Quarterly financial performance tracking</p>
        </div>
        <div style={{ height: '300px', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={BudgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="actual" fill="#2563eb" radius={[4, 4, 0, 0]} name="Actual Performance" barSize={30} />
              <Line type="monotone" dataKey="budget" stroke="#dc2626" strokeWidth={3} name="Budget Target" dot={{ r: 4, fill: '#dc2626' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ ...S.card, padding: '20px', background: '#eff6ff', border: '1px solid #dbeafe' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>Budget Prediction 2026</p>
          <p style={{ fontSize: '13px', color: '#3b82f6', lineHeight: 1.5 }}>Based on current growth, the 2026 budget is projected to increase by <span style={{ fontWeight: 800 }}>10%</span> for Revenue and <span style={{ fontWeight: 800 }}>15%</span> for Assets.</p>
        </div>
        <div style={{ ...S.card, padding: '20px', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>Variance Alert</p>
          <p style={{ fontSize: '13px', color: '#22c55e', lineHeight: 1.5 }}>Q3 Actuals were <span style={{ fontWeight: 800 }}>$40M</span> below budget target. Corrective logic applied to Q4 forecasts.</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeReport) {
      case 'gl': return renderGLReport();
      case 'accuracy': return renderAccuracyReport();
      case 'duplicates': return renderDuplicatesReport();
      case 'communication': return renderCommReport();
      case 'finance': return renderFinanceReport();
      case 'budget': return renderBudgetReport();
      default: return renderGLReport();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Reports & Analytics</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Comprehensive data insights across all ERP modules.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleExport}
            style={{ padding: '9px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} /> Export
          </button>
          <button style={{ padding: '9px 18px', background: 'linear-gradient(to right, #1a56c4, #2563eb)', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0', overflowX: 'auto', whiteSpace: 'nowrap' }} className="custom-scrollbar">
        {reportTypes.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveReport(t.id)}
            style={{
              padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
              background: activeReport === t.id ? 'linear-gradient(to right, #1a56c4, #2563eb)' : 'transparent',
              color: activeReport === t.id ? 'white' : '#64748b',
              transition: 'all 0.2s', fontFamily: 'inherit',
              boxShadow: activeReport === t.id ? '0 4px 12px rgba(37,99,235,0.25)' : 'none'
            }}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeReport}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default Reports;
