import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Trash2,
  Eye,
  ArrowRight,
  X,
  MoreVertical as DotsIcon
} from 'lucide-react';

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' },
  label: { fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', display: 'block' },
};

const NOTIFICATIONS_MOCK = [
  { id: 1, title: 'New Student Enrollment', desc: 'Sarah Ahmed has enrolled in the Maritime Safety course.', time: '2 mins ago', type: 'info', icon: Bell },
  { id: 2, title: 'GL Mapping Success', desc: 'AI successfully mapped 148 transactions from the April statement.', time: '15 mins ago', type: 'success', icon: CheckCircle2 },
  { id: 3, title: 'System Maintenance', desc: 'The system will undergo scheduled maintenance at 02:00 AM UTC.', time: '1 hour ago', type: 'warning', icon: Clock },
  { id: 4, title: 'New Message from Bot', desc: 'Your GL Assistant has 3 new insights for your revenue reports.', time: '3 hours ago', type: 'info', icon: Bell }
];

const ALERTS_MOCK = [
  { id: 1, title: 'Failed Login Attempt', desc: 'Multiple failed login attempts detected from IP 192.168.1.105.', time: '10 mins ago', status: 'Urgent', color: '#dc2626' },
  { id: 2, title: 'Large Transaction Alert', desc: 'A transaction exceeding $50,000 was detected in the latest upload.', time: '4 hours ago', status: 'Urgent', color: '#dc2626' },
  { id: 3, title: 'User Permission Change', desc: 'Admin modified permissions for role: Shipping Coordinator.', time: '1 day ago', status: 'Notice', color: '#2563eb' }
];

const EMAIL_LOGS_MOCK = [
  { id: 1, to: 'john.doe@example.com', sub: 'Fee Due Reminder: Maritime Safety', status: 'Delivered', time: '10:45 AM', body: 'Dear John, this is a reminder that your fee for Maritime Safety is due on May 15th.' },
  { id: 2, to: 'sarah.a@gmail.com', sub: 'Enrollment Confirmation', status: 'Delivered', time: '09:30 AM', body: 'Welcome Sarah! Your enrollment in Maritime Safety has been confirmed.' },
  { id: 3, to: 'finance@uniglobal.com', sub: 'Monthly Revenue Report', status: 'Failed', time: '08:15 AM', body: 'The monthly revenue report for April is attached.' },
  { id: 4, to: 'michael.c@webmail.com', sub: 'Urgent: Missing Documents', status: 'Pending', time: '07:00 AM', body: 'Hi Michael, we are still missing your passport copy for registration.' }
];

const SYSTEM_ALERTS_MOCK = {
  duplicates: [
    { id: 1, ref: 'TX-40921', desc: 'Amazon Web Services', amt: '$1,240.50' },
    { id: 2, ref: 'TX-40925', desc: 'Amazon Web Services', amt: '$1,240.50' }
  ],
  lowConfidence: [
    { id: 1, item: 'Client Meeting Exp', conf: '62%', sug: 'Entertainment' },
    { id: 2, item: 'Office Supplies', conf: '58%', sug: 'Administrative' }
  ]
};

const NotificationCentre = ({ notifications, onDelete }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {notifications.length === 0 ? (
      <div style={{ ...S.card, padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No new notifications</div>
    ) : (
      notifications.map((item) => (
        <div key={item.id} style={{ ...S.card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
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
          <button 
            onClick={() => onDelete(item.id)}
            style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#dc2626'}
            onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            title="Delete Notification"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))
    )}
  </div>
);

const AlertsPanel = ({ alerts, onAction }) => (
  <div style={S.card}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Security & High Priority Alerts</h3>
      <span style={{ ...S.badge, background: '#fef2f2', color: '#dc2626' }}>{alerts.length} Urgent</span>
    </div>
    <div style={{ padding: '0 24px' }}>
      {alerts.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>All alerts cleared</div>
      ) : (
        alerts.map((alert, i) => (
          <div key={alert.id} style={{ padding: '20px 0', borderBottom: i < alerts.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', gap: '16px' }}>
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
                <button 
                  onClick={() => onAction(alert.id, 'resolve')}
                  style={{ padding: '6px 12px', background: alert.color, color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Resolve
                </button>
                <button 
                  onClick={() => onAction(alert.id, 'ignore')}
                  style={{ padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Ignore
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const EmailLogs = ({ logs, onView }) => (
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
        {logs.map((log) => (
          <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
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
              <button 
                onClick={() => onView(log)}
                style={{ padding: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}
              >
                <Eye size={14} style={{ color: '#64748b' }} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SystemAlerts = ({ data, onMerge, onReview }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
    <div style={S.card}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#fef2f2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} style={{ color: '#dc2626' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>Duplicate Entries ({data.duplicates.length})</h4>
        </div>
      </div>
      <div style={{ padding: '12px' }}>
        {data.duplicates.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No duplicates found</div>
        ) : (
          <>
            {data.duplicates.map((d) => (
              <div key={d.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', border: '1px dashed #e2e8f0' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700 }}>{d.desc}</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>Ref: {d.ref}</p>
                </div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{d.amt}</p>
              </div>
            ))}
            <button 
              onClick={onMerge}
              style={{ width: '100%', padding: '8px', background: 'none', border: '1px solid #dc2626', borderRadius: '8px', color: '#dc2626', fontSize: '12px', fontWeight: 700, marginTop: '8px', cursor: 'pointer' }}
            >
              Merge / Delete All
            </button>
          </>
        )}
      </div>
    </div>

    <div style={S.card}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#fff7ed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} style={{ color: '#d97706' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#d97706' }}>Low AI Confidence ({data.lowConfidence.length})</h4>
        </div>
      </div>
      <div style={{ padding: '12px' }}>
        {data.lowConfidence.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>All entries reviewed</div>
        ) : (
          <>
            {data.lowConfidence.map((item) => (
              <div key={item.id} style={{ padding: '12px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700 }}>{item.item}</p>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>{item.conf}</span>
                </div>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>Suggested: <span style={{ color: '#2563eb', fontWeight: 600 }}>{item.sug}</span></p>
              </div>
            ))}
            <button 
              onClick={onReview}
              style={{ width: '100%', padding: '8px', background: '#2563eb', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: 700, marginTop: '8px', cursor: 'pointer' }}
            >
              Manual Review
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('centre');
  const [notifications, setNotifications] = useState(NOTIFICATIONS_MOCK);
  const [alerts, setAlerts] = useState(ALERTS_MOCK);
  const [emailLogs, setEmailLogs] = useState(EMAIL_LOGS_MOCK);
  const [systemAlerts, setSystemAlerts] = useState(SYSTEM_ALERTS_MOCK);
  const [modal, setModal] = useState({ isOpen: false, type: '', data: null });

  const openModal = (type, data = null) => setModal({ isOpen: true, type, data });
  const closeModal = () => setModal({ isOpen: false, type: '', data: null });

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setAlerts([]);
    setSystemAlerts({ duplicates: [], lowConfidence: [] });
  };

  const handleAlertAction = (id, action) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleMergeAll = () => {
    setSystemAlerts(prev => ({ ...prev, duplicates: [] }));
    openModal('message', { title: 'Success', message: 'All duplicate entries have been merged and cleaned.' });
  };

  const handleManualReview = () => {
    setSystemAlerts(prev => ({ ...prev, lowConfidence: [] }));
    openModal('message', { title: 'Review Complete', message: 'Manual review session concluded. All confidence scores updated.' });
  };

  const tabs = [
    { id: 'centre',   label: 'Notification Centre', icon: Bell },
    { id: 'alerts',   label: 'Alerts Panel',        icon: AlertTriangle },
    { id: 'logs',     label: 'Email Logs',           icon: Mail },
    { id: 'system',   label: 'System Alerts',        icon: ShieldAlert }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'centre':   return <NotificationCentre notifications={notifications} onDelete={deleteNotification} />;
      case 'alerts':   return <AlertsPanel alerts={alerts} onAction={handleAlertAction} />;
      case 'logs':     return <EmailLogs logs={emailLogs} onView={(log) => openModal('email_view', log)} />;
      case 'system':   return <SystemAlerts data={systemAlerts} onMerge={handleMergeAll} onReview={handleManualReview} />;
      default:         return <NotificationCentre notifications={notifications} onDelete={deleteNotification} />;
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
          <button 
            onClick={clearAllNotifications}
            style={{ padding: '9px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
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

      <AnimatePresence>
        {modal.isOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  {modal.type === 'email_view' && 'Email Content Preview'}
                  {modal.type === 'message' && modal.data.title}
                </h3>
                <button onClick={closeModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
              </div>

              <div style={{ padding: '24px' }}>
                {modal.type === 'email_view' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <span style={S.label}>Recipient</span>
                      <p style={{ fontSize: '14px', fontWeight: 600 }}>{modal.data.to}</p>
                    </div>
                    <div>
                      <span style={S.label}>Subject</span>
                      <p style={{ fontSize: '14px', fontWeight: 600 }}>{modal.data.sub}</p>
                    </div>
                    <div>
                      <span style={S.label}>Message Body</span>
                      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', fontSize: '14px', color: '#475569', lineHeight: 1.6, border: '1px solid #e2e8f0' }}>
                        {modal.data.body}
                      </div>
                    </div>
                    <button onClick={closeModal} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Close Preview</button>
                  </div>
                )}

                {modal.type === 'message' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <CheckCircle2 size={32} color="#059669" />
                    </div>
                    <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>{modal.data.message}</p>
                    <button onClick={closeModal} style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Dismiss</button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
