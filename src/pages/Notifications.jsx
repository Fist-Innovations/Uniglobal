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
  card: { background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', transition: 'background 0.3s, border-color 0.3s' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' },
  label: { fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', display: 'block' },
};

const NOTIFICATIONS_MOCK = [
  { id: 1, title: 'New Student Enrollment', desc: 'Sarah Ahmed has enrolled in the Maritime Safety course.', time: '2 mins ago', type: 'info', icon: Bell },
  { id: 2, title: 'GL Mapping Success', desc: 'AI successfully mapped 148 transactions from the April statement.', time: '15 mins ago', type: 'success', icon: CheckCircle2 },
  { id: 3, title: 'System Maintenance', desc: 'The system will undergo scheduled maintenance at 02:00 AM UTC.', time: '1 hour ago', type: 'warning', icon: Clock },
  { id: 4, title: 'New Message from Bot', desc: 'Your GL Assistant has 3 new insights for your revenue reports.', time: '3 hours ago', type: 'info', icon: Bell }
];

const ALERTS_MOCK = [
  { id: 1, title: 'Failed Login Attempt', desc: 'Multiple failed login attempts detected from IP 192.168.1.105.', time: '10 mins ago', status: 'Urgent', color: '#ef4444' },
  { id: 2, title: 'Large Transaction Alert', desc: 'A transaction exceeding $50,000 was detected in the latest upload.', time: '4 hours ago', status: 'Urgent', color: '#ef4444' },
  { id: 3, title: 'User Permission Change', desc: 'Admin modified permissions for role: Shipping Coordinator.', time: '1 day ago', status: 'Notice', color: 'var(--primary)' }
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
      <div style={{ ...S.card, padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No new notifications</div>
    ) : (
      notifications.map((item) => (
        <div key={item.id} style={{ ...S.card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: item.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : item.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <item.icon size={20} style={{ color: item.type === 'success' ? '#10b981' : item.type === 'warning' ? '#f59e0b' : 'var(--primary)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.time}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</p>
          </div>
          <button 
            onClick={() => onDelete(item.id)}
            style={{ background: 'none', border: 'none', color: 'var(--border)', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#ef4444'}
            onMouseLeave={(e) => e.target.style.color = 'var(--border)'}
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
    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>Security & High Priority Alerts</h3>
      <span style={{ ...S.badge, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>{alerts.length} Urgent</span>
    </div>
    <div style={{ padding: '0 24px' }}>
      {alerts.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>All alerts cleared</div>
      ) : (
        alerts.map((alert, i) => (
          <div key={alert.id} style={{ padding: '20px 0', borderBottom: i < alerts.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={20} style={{ color: alert.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{alert.title}</p>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alert.time}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{alert.desc}</p>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => onAction(alert.id, 'resolve')}
                  style={{ padding: '6px 12px', background: alert.color, color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Resolve
                </button>
                <button 
                  onClick={() => onAction(alert.id, 'ignore')}
                  style={{ padding: '6px 12px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}
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
        <tr style={{ background: 'var(--bg-dark)' }}>
          {['Recipient', 'Subject', 'Status', 'Timestamp', 'Actions'].map(h => (
            <th key={h} style={{ padding: '14px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.8px' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{log.to}</td>
            <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>{log.sub}</td>
            <td style={{ padding: '16px 24px' }}>
              <span style={{ ...S.badge, background: log.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' : log.status === 'Failed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: log.status === 'Delivered' ? '#10b981' : log.status === 'Failed' ? '#ef4444' : '#f59e0b' }}>
                {log.status === 'Delivered' ? <CheckCircle2 size={12} /> : log.status === 'Failed' ? <XCircle size={12} /> : <Clock size={12} />}
                {log.status}
              </span>
            </td>
            <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>{log.time}</td>
            <td style={{ padding: '16px 24px' }}>
              <button 
                onClick={() => onView(log)}
                style={{ padding: '6px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}
              >
                <Eye size={14} style={{ color: 'var(--text-muted)' }} />
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
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(239, 68, 68, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} style={{ color: '#ef4444' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444' }}>Duplicate Entries ({data.duplicates.length})</h4>
        </div>
      </div>
      <div style={{ padding: '12px' }}>
        {data.duplicates.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No duplicates found</div>
        ) : (
          <>
            {data.duplicates.map((d) => (
              <div key={d.id} style={{ padding: '12px', background: 'var(--bg-dark)', borderRadius: '10px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', border: '1px dashed var(--border)' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>{d.desc}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ref: {d.ref}</p>
                </div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>{d.amt}</p>
              </div>
            ))}
            <button 
              onClick={onMerge}
              style={{ width: '100%', padding: '8px', background: 'none', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', fontSize: '12px', fontWeight: 700, marginTop: '8px', cursor: 'pointer' }}
            >
              Merge / Delete All
            </button>
          </>
        )}
      </div>
    </div>

    <div style={S.card}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(245, 158, 11, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} style={{ color: '#f59e0b' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#f59e0b' }}>Low AI Confidence ({data.lowConfidence.length})</h4>
        </div>
      </div>
      <div style={{ padding: '12px' }}>
        {data.lowConfidence.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>All entries reviewed</div>
        ) : (
          <>
            {data.lowConfidence.map((item) => (
              <div key={item.id} style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>{item.item}</p>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444' }}>{item.conf}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Suggested: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{item.sug}</span></p>
              </div>
            ))}
            <button 
              onClick={onReview}
              style={{ width: '100%', padding: '8px', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '12px', fontWeight: 700, marginTop: '8px', cursor: 'pointer' }}
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
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>Notifications & Alerts</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Central management for all system communication and monitoring.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={clearAllNotifications}
            style={{ padding: '9px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border)', width: 'fit-content' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
              background: activeTab === t.id ? 'var(--primary)' : 'transparent',
              color: activeTab === t.id ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s', fontFamily: 'inherit',
              boxShadow: activeTab === t.id ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
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
              style={{ background: 'var(--bg-card)', borderRadius: '24px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {modal.type === 'email_view' && 'Email Content Preview'}
                  {modal.type === 'message' && modal.data.title}
                </h3>
                <button onClick={closeModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>

              <div style={{ padding: '24px' }}>
                {modal.type === 'email_view' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <span style={S.label}>Recipient</span>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{modal.data.to}</p>
                    </div>
                    <div>
                      <span style={S.label}>Subject</span>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{modal.data.sub}</p>
                    </div>
                    <div>
                      <span style={S.label}>Message Body</span>
                      <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '12px', fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.6, border: '1px solid var(--border)' }}>
                        {modal.data.body}
                      </div>
                    </div>
                    <button onClick={closeModal} style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Close Preview</button>
                  </div>
                )}

                {modal.type === 'message' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <CheckCircle2 size={32} color="#10b981" />
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px' }}>{modal.data.message}</p>
                    <button onClick={closeModal} style={{ width: '100%', padding: '12px', background: 'var(--text-main)', color: 'var(--bg-card)', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Dismiss</button>
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
