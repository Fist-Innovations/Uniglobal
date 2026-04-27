import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  Mail, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight,
  MoreVertical,
  Trash2,
  Eye,
  ArrowRight
} from 'lucide-react';

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }
};

const NotificationCentre = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {[
      { title: 'New Student Enrollment', desc: 'Sarah Ahmed has enrolled in the Maritime Safety course.', time: '2 mins ago', type: 'info', icon: Bell },
      { title: 'GL Mapping Success', desc: 'AI successfully mapped 148 transactions from the April statement.', time: '15 mins ago', type: 'success', icon: CheckCircle2 },
      { title: 'System Maintenance', desc: 'The system will undergo scheduled maintenance at 02:00 AM UTC.', time: '1 hour ago', type: 'warning', icon: Clock },
      { title: 'New Message from Bot', desc: 'Your GL Assistant has 3 new insights for your revenue reports.', time: '3 hours ago', type: 'info', icon: Bell }
    ].map((item, i) => (
      <div key={i} style={{ ...S.card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: item.type === 'success' ? '#ecfdf5' : item.type === 'warning' ? '#fff7ed' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <item.icon size={20} style={{ color: item.type === 'success' ? '#059669' : item.type === 'warning' ? '#d97706' : '#2563eb' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{item.title}</h4>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.time}</span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{item.desc}</p>
        </div>
        <button style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}><MoreVertical size={18} /></button>
      </div>
    ))}
  </div>
);

const AlertsPanel = () => (
  <div style={S.card}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Security & High Priority Alerts</h3>
      <span style={{ ...S.badge, background: '#fef2f2', color: '#dc2626' }}>2 Urgent</span>
    </div>
    <div style={{ padding: '0 24px' }}>
      {[
        { title: 'Failed Login Attempt', desc: 'Multiple failed login attempts detected from IP 192.168.1.105.', time: '10 mins ago', status: 'Urgent', color: '#dc2626' },
        { title: 'Large Transaction Alert', desc: 'A transaction exceeding $50,000 was detected in the latest upload.', time: '4 hours ago', status: 'Urgent', color: '#dc2626' },
        { title: 'User Permission Change', desc: 'Admin modified permissions for role: Shipping Coordinator.', time: '1 day ago', status: 'Notice', color: '#2563eb' }
      ].map((alert, i) => (
        <div key={i} style={{ padding: '20px 0', borderBottom: i < 2 ? '1px solid #f8fafc' : 'none', display: 'flex', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${alert.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} style={{ color: alert.color }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '14px', fontWeight: 700 }}>{alert.title}</p>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{alert.time}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{alert.desc}</p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <button style={{ padding: '6px 12px', background: alert.color, color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>Resolve</button>
              <button style={{ padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>Ignore</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmailLogs = () => (
  <div style={S.card}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f8fafc' }}>
          {['Recipient', 'Subject', 'Status', 'Timestamp', 'Actions'].map(h => (
            <th key={h} style={{ padding: '14px 24px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.8px' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[
          { to: 'john.doe@example.com', sub: 'Fee Due Reminder: Maritime Safety', status: 'Delivered', time: '10:45 AM' },
          { to: 'sarah.a@gmail.com', sub: 'Enrollment Confirmation', status: 'Delivered', time: '09:30 AM' },
          { to: 'finance@uniglobal.com', sub: 'Monthly Revenue Report', status: 'Failed', time: '08:15 AM' },
          { to: 'michael.c@webmail.com', sub: 'Urgent: Missing Documents', status: 'Pending', time: '07:00 AM' }
        ].map((log, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600 }}>{log.to}</td>
            <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>{log.sub}</td>
            <td style={{ padding: '16px 24px' }}>
              <span style={{ ...S.badge, background: log.status === 'Delivered' ? '#ecfdf5' : log.status === 'Failed' ? '#fef2f2' : '#fff7ed', color: log.status === 'Delivered' ? '#059669' : log.status === 'Failed' ? '#dc2626' : '#d97706' }}>
                {log.status === 'Delivered' ? <CheckCircle2 size={12} /> : log.status === 'Failed' ? <XCircle size={12} /> : <Clock size={12} />}
                {log.status}
              </span>
            </td>
            <td style={{ padding: '16px 24px', fontSize: '13px', color: '#94a3b8' }}>{log.time}</td>
            <td style={{ padding: '16px 24px' }}>
              <button style={{ padding: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}><Eye size={14} style={{ color: '#64748b' }} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SystemAlerts = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
    <div style={S.card}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#fef2f2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} style={{ color: '#dc2626' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>Duplicate Entries (12)</h4>
        </div>
      </div>
      <div style={{ padding: '12px' }}>
        {[
          { ref: 'TX-40921', desc: 'Amazon Web Services', amt: '$1,240.50' },
          { ref: 'TX-40925', desc: 'Amazon Web Services', amt: '$1,240.50' }
        ].map((d, i) => (
          <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', border: '1px dashed #e2e8f0' }}>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700 }}>{d.desc}</p>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Ref: {d.ref}</p>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{d.amt}</p>
          </div>
        ))}
        <button style={{ width: '100%', padding: '8px', background: 'none', border: '1px solid #dc2626', borderRadius: '8px', color: '#dc2626', fontSize: '12px', fontWeight: 700, marginTop: '8px', cursor: 'pointer' }}>Merge / Delete All</button>
      </div>
    </div>

    <div style={S.card}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#fff7ed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} style={{ color: '#d97706' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#d97706' }}>Low AI Confidence</h4>
        </div>
      </div>
      <div style={{ padding: '12px' }}>
        {[
          { item: 'Client Meeting Exp', conf: '62%', sug: 'Entertainment' },
          { item: 'Office Supplies', conf: '58%', sug: 'Administrative' }
        ].map((item, i) => (
          <div key={i} style={{ padding: '12px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '10px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700 }}>{item.item}</p>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>{item.conf}</span>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>Suggested: <span style={{ color: '#2563eb', fontWeight: 600 }}>{item.sug}</span></p>
          </div>
        ))}
        <button style={{ width: '100%', padding: '8px', background: '#2563eb', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: 700, marginTop: '8px', cursor: 'pointer' }}>Manual Review</button>
      </div>
    </div>
  </div>
);

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('centre');

  const tabs = [
    { id: 'centre',   label: 'Notification Centre', icon: Bell },
    { id: 'alerts',   label: 'Alerts Panel',        icon: AlertTriangle },
    { id: 'logs',     label: 'Email Logs',           icon: Mail },
    { id: 'system',   label: 'System Alerts',        icon: ShieldAlert }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'centre':   return <NotificationCentre />;
      case 'alerts':   return <AlertsPanel />;
      case 'logs':     return <EmailLogs />;
      case 'system':   return <SystemAlerts />;
      default:         return <NotificationCentre />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Notifications & Alerts</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Central management for all system communication and monitoring.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '9px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
              background: activeTab === t.id ? 'linear-gradient(to right, #1a56c4, #2563eb)' : 'transparent',
              color: activeTab === t.id ? 'white' : '#64748b',
              transition: 'all 0.2s', fontFamily: 'inherit',
              boxShadow: activeTab === t.id ? '0 4px 12px rgba(37,99,235,0.25)' : 'none'
            }}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default Notifications;
