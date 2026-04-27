import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  FileWarning,
  ArrowUpRight, 
  ArrowDownRight, 
  Bot, 
  RefreshCw,
  DollarSign, 
  Users, 
  Activity,
  ChevronRight,
  Clock,
  Bell,
  FileText,
  BarChart3
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const chartData = [
  { name: 'Mon', revenue: 42000, accuracy: 92 },
  { name: 'Tue', revenue: 38000, accuracy: 88 },
  { name: 'Wed', revenue: 51000, accuracy: 95 },
  { name: 'Thu', revenue: 47000, accuracy: 94 },
  { name: 'Fri', revenue: 39000, accuracy: 90 },
  { name: 'Sat', revenue: 55000, accuracy: 98 },
  { name: 'Sun', revenue: 62000, accuracy: 96 },
];

const KPI_DATA = [
  { title: 'Bank Upload Accuracy %',    value: '98.4%',  sub: '+2.1% vs last week', trend: 'up',   icon: CheckCircle2, light: '#eff6ff', iconColor: '#2563eb' },
  { title: 'Duplicate Detection Count', value: '12',     sub: '−15.4% detected',    trend: 'down', icon: FileWarning,  light: '#fef2f2', iconColor: '#dc2626' },
  { title: 'Pending Notifications',     value: '24',     sub: '6 priority alerts',  trend: 'up',   icon: Bell,         light: '#fffbeb', iconColor: '#d97706' },
  { title: 'Budget Completion Status',  value: '76%',    sub: '+4.5% this quarter', trend: 'up',   icon: BarChart3,    light: '#f5f3ff', iconColor: '#7c3aed' },
];

const S = {
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    padding: '24px',
  },
  sectionTitle: { fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' },
  sectionSub:   { fontSize: '12px', color: '#94a3b8' },
};

const KPICard = ({ title, value, sub, trend, icon: Icon, light, iconColor }) => (
  <motion.div
    whileHover={{ y: -4 }}
    style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '16px', cursor: 'pointer' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <span style={{
        fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '20px',
        background: trend === 'up' ? '#ecfdf5' : '#fef2f2',
        color: trend === 'up' ? '#059669' : '#dc2626',
        display: 'flex', alignItems: 'center', gap: '2px',
      }}>
        {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {sub.split(' ')[0]}
      </span>
    </div>
    <div>
      <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>{title}</p>
      <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</h3>
      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{sub}</p>
    </div>
  </motion.div>
);

const INITIAL_SUGGESTIONS = [
  { desc: 'Amazon Web Services — Cloud Hosting', gl: '6100 · Software & Hosting', conf: 98, id: 1 },
  { desc: 'Office Rent — April 2026',           gl: '6300 · Rent & Lease',        conf: 99, id: 2 },
  { desc: 'Starbucks — Client Meeting',         gl: '6200 · Meals & Entertain.',   conf: 85, id: 3 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);

  const handleSuggestionAction = (id) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Dashboard Overview</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Welcome back, Adarsh. Here's what's happening today.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#64748b', 
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            onClick={() => navigate('/reports')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px',
              background: 'linear-gradient(to right, #1a56c4, #2563eb)',
              border: 'none', borderRadius: '10px',
              fontSize: '13px', fontWeight: 700, color: 'white', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.35)',
            }}
          >
            <TrendingUp size={14} /> View Reports
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', minWidth: 0 }}>
        {KPI_DATA.map(k => <KPICard key={k.title} {...k} />)}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', minWidth: 0 }}>
        {/* Area Chart */}
        <div style={{ ...S.card, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <p style={S.sectionTitle}>Financial Performance</p>
              <p style={S.sectionSub}>AI-driven revenue trend · Last 7 days</p>
            </div>
            <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>● Live</span>
          </div>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ ...S.card }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={S.sectionTitle}>AI Accuracy Score</p>
            <p style={S.sectionSub}>Prediction confidence · This week</p>
          </div>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '12px' }} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="accuracy" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>

        {/* AI Suggestions */}
        <div style={{ ...S.card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <p style={S.sectionTitle}>AI GL Suggestions</p>
              <p style={S.sectionSub}>Pending review · {suggestions.length} items</p>
            </div>
            <button 
              onClick={() => navigate('/gl/review')}
              style={{ fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              View All →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <AnimatePresence>
              {suggestions.slice(0, 3).map(s => (
                <motion.div 
                  key={s.id}
                  initial={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden', padding: 0, border: 'none' }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', background: '#f8fafc', borderRadius: '10px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={14} style={{ color: '#2563eb' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.desc}</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>{s.gl}</p>
                    </div>
                  </div>
                  <button onClick={() => handleSuggestionAction(s.id)} style={{ padding: '4px 8px', background: '#eff6ff', border: 'none', borderRadius: '6px', fontSize: '10px', fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}>OK</button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Alerts & Exceptions */}
        <div style={{ ...S.card, border: '1px solid #fee2e2', background: '#fffcfc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <p style={{ ...S.sectionTitle, color: '#991b1b' }}>Alerts & Exceptions</p>
              <p style={S.sectionSub}>Critical issues requiring attention</p>
            </div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626', animation: 'pulse 2s infinite' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { text: 'Budget Mismatch: Shipping Dept', sub: 'Variance > 15% detected', color: '#dc2626' },
              { text: 'Unreconciled Bank Entries', sub: '4 transactions missing GL mapping', color: '#991b1b' },
              { text: 'Duplicate Vendor Invoice', sub: 'Invoice #INV-9901 (Potential)', color: '#dc2626' },
            ].map((alert, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#fff', border: '1px solid #fee2e2', borderRadius: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={14} color="#dc2626" />
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{alert.text}</p>
                  <p style={{ fontSize: '10px', color: '#94a3b8' }}>{alert.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div style={{ ...S.card }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <p style={S.sectionTitle}>Recent Activity</p>
              <p style={S.sectionSub}>System events · Today</p>
            </div>
            <button 
              onClick={() => navigate('/notifications')}
              style={{ fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Logs →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { icon: CheckCircle2, color: '#059669', bg: '#ecfdf5', text: 'Bank statement uploaded successfully', sub: '2 minutes ago', badge: 'GL' },
              { icon: Bot,          color: '#2563eb', bg: '#eff6ff', text: 'AI processed 148 transactions',         sub: '15 minutes ago', badge: 'AI' },
              { icon: Users,        color: '#7c3aed', bg: '#f5f3ff', text: '3 new student notifications sent',      sub: '1 hour ago',     badge: 'TRN' },
              { icon: Activity,     color: '#dc2626', bg: '#fef2f2', text: '12 duplicate entries flagged',           sub: '2 hours ago',    badge: '!' },
            ].map((item, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '12px 0',
                borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none',
              }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={15} style={{ color: item.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{item.text}</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>{item.sub}</p>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: item.bg, color: item.color, flexShrink: 0 }}>{item.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
