import { useState } from 'react';
import { 
  Users, 
  Settings2, 
  Mail, 
  Calendar, 
  Clock, 
  Plus, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Edit2, 
  Trash2, 
  X, 
  Bell, 
  History, 
  FileCode, 
  Zap, 
  ChevronRight,
  Search,
  Filter,
  Check,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Dummy Data ---

const INITIAL_STUDENTS = [
  { id: 1, name: 'John Doe', course: 'Maritime Safety', feeStatus: 'Paid', academicEvent: 'Final Exam', date: '2026-05-15', avatar: 'JD' },
  { id: 2, name: 'Sarah Ahmed', course: 'Naval Engineering', feeStatus: 'Pending', academicEvent: 'Mid-term Review', date: '2026-05-20', avatar: 'SA' },
  { id: 3, name: 'Michael Chen', course: 'Logistics Management', feeStatus: 'Overdue', academicEvent: 'Certification', date: '2026-06-05', avatar: 'MC' },
  { id: 4, name: 'Amira Hassan', course: 'Supply Chain AI', feeStatus: 'Paid', academicEvent: 'Workshop', date: '2026-05-22', avatar: 'AH' },
  { id: 5, name: 'Robert Wilson', course: 'Port Operations', feeStatus: 'Pending', academicEvent: 'Safety Drill', date: '2026-05-18', avatar: 'RW' },
];

const EVENT_TYPES = [
  { id: 'fee_due', label: 'Fee Due', icon: Mail, color: '#2563eb', trigger: '3 days before due date' },
  { id: 'overdue', label: 'Overdue Payment', icon: AlertTriangle, color: '#dc2626', trigger: 'Immediate upon overdue' },
  { id: 'exam_reg', label: 'Exam Registration', icon: Calendar, color: '#059669', trigger: '7 days before opening' },
  { id: 'doc_sub', label: 'Document Submission', icon: FileCode, color: '#7c3aed', trigger: '14 days after enrollment' },
];

const TEMPLATES = [
  { id: 1, name: 'Fee Reminder (Gentle)', subject: 'Upcoming Fee Payment - {{Course}}', body: 'Dear {{Name}}, this is a reminder that your fee for {{Course}} is due on {{Date}}.' },
  { id: 2, name: 'Overdue Notice', subject: 'URGENT: Payment Overdue', body: 'Dear {{Name}}, your payment for {{Course}} is now overdue. Please settle immediately.' },
  { id: 3, name: 'Exam Registration Open', subject: 'Registration Open: {{Course}} Exam', body: 'Hi {{Name}}, registration for the upcoming exam in {{Course}} is now open until {{Date}}.' },
];

const RULES = [
  { id: 1, name: 'Auto Fee Reminder', event: 'Fee Due', condition: 'Balance > 0', action: 'Send Email', template: 'Fee Reminder (Gentle)', status: 'Active' },
  { id: 2, name: 'Overdue Alert', event: 'Overdue Payment', condition: 'Days Overdue > 5', action: 'Send Email', template: 'Overdue Notice', status: 'Active' },
  { id: 3, name: 'Exam Alert', event: 'Exam Registration', condition: 'Always', action: 'Send Notification', template: 'Exam Registration Open', status: 'Paused' },
];

const NOTIFICATION_LOGS = [
  { id: 1, recipient: 'John Doe', type: 'Email', event: 'Fee Reminder', status: 'Delivered', time: '2026-04-28 09:00', details: 'Subject: Upcoming Fee...' },
  { id: 2, recipient: 'Sarah Ahmed', type: 'SMS', event: 'Exam Alert', status: 'Delivered', time: '2026-04-28 08:30', details: 'Exam registration now open.' },
  { id: 3, recipient: 'Michael Chen', type: 'Email', event: 'Overdue Notice', status: 'Failed', time: '2026-04-27 14:20', details: 'SMTP Error: Connection lost' },
  { id: 4, recipient: 'Amira Hassan', type: 'Email', event: 'Course Update', status: 'Delivered', time: '2026-04-27 11:15', details: 'Module 4 content updated' },
];

// --- Styles ---

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' },
  th: { padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left' },
  td: { padding: '16px 20px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc' },
  label: { display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', transition: 'all 0.2s' },
  tabBtn: (active) => ({
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
    background: active ? 'linear-gradient(to right, #1a56c4, #2563eb)' : 'transparent',
    color: active ? '#fff' : '#64748b',
    boxShadow: active ? '0 4px 12px rgba(37,99,235,0.25)' : 'none'
  }),
  statusBadge: (status) => {
    const colors = {
      Paid: { bg: '#ecfdf5', text: '#059669' },
      Pending: { bg: '#fff7ed', text: '#d97706' },
      Overdue: { bg: '#fef2f2', text: '#dc2626' },
      Active: { bg: '#ecfdf5', text: '#059669' },
      Paused: { bg: '#f1f5f9', text: '#64748b' },
      Delivered: { bg: '#ecfdf5', text: '#059669' },
      Failed: { bg: '#fef2f2', text: '#dc2626' },
    };
    const c = colors[status] || colors.Paused;
    return { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: c.bg, color: c.text };
  }
};

const TrainingManagement = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Tabs Configuration
  const TABS = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'events', label: 'Event Config', icon: Calendar },
    { id: 'templates', label: 'Templates', icon: Mail },
    { id: 'rules', label: 'Automation Rules', icon: Zap },
    { id: 'logs', label: 'Notification Logs', icon: History },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Training Management</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Automated student lifecycle notifications and event tracking</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '10px 18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Filter size={16} /> Filters
          </button>
          <button style={{ padding: '10px 20px', background: 'linear-gradient(to right, #1a56c4, #2563eb)', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#fff', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
        {TABS.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            style={S.tabBtn(activeTab === tab.id)}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ minHeight: '500px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'students' && <StudentScreen students={students} />}
            {activeTab === 'events' && <EventConfigScreen />}
            {activeTab === 'templates' && <TemplateScreen />}
            {activeTab === 'rules' && <RulesScreen />}
            {activeTab === 'logs' && <LogsScreen />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Sub-Screens ---

const StudentScreen = ({ students }) => (
  <div style={S.card}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Enrolled Students</h3>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Managing {students.length} active students</p>
      </div>
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input placeholder="Search students..." style={{ ...S.input, paddingLeft: '36px', width: '240px', background: '#f8fafc' }} />
      </div>
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['Student', 'Course', 'Fee Status', 'Next Event', 'Event Date', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {students.map((s, idx) => (
          <tr key={s.id} style={{ background: idx % 2 === 0 ? '#fff' : '#fafbff' }}>
            <td style={S.td}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #1a56c4, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                  {s.avatar}
                </div>
                <span style={{ fontWeight: 600 }}>{s.name}</span>
              </div>
            </td>
            <td style={S.td}>{s.course}</td>
            <td style={S.td}><span style={S.statusBadge(s.feeStatus)}>{s.feeStatus}</span></td>
            <td style={S.td}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontWeight: 600 }}>
                <Zap size={14} /> {s.academicEvent}
              </div>
            </td>
            <td style={S.td}><div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}><Calendar size={14} /> {s.date}</div></td>
            <td style={S.td}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b' }}><Eye size={14} /></button>
                <button style={{ padding: '6px', borderRadius: '6px', border: '1px solid #bfdbfe', background: '#eff6ff', cursor: 'pointer', color: '#2563eb' }}><Edit2 size={14} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const EventConfigScreen = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
    {EVENT_TYPES.map(event => (
      <div key={event.id} style={{ ...S.card, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${event.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <event.icon size={24} style={{ color: event.color }} />
          </div>
          <button style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer' }}><Settings2 size={14} /></button>
        </div>
        <div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{event.label}</h4>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Triggers notification to students when this event is detected.</p>
        </div>
        <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Trigger Rule</div>
          <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>{event.trigger}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Status</span>
          <div style={{ width: '40px', height: '20px', background: '#059669', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }} />
          </div>
        </div>
      </div>
    ))}
    <div style={{ ...S.card, border: '2px dashed #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', minHeight: '220px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        <Plus size={20} />
      </div>
      <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>Define New Event Type</span>
    </div>
  </div>
);

const TemplateScreen = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ ...S.card, padding: '24px', background: 'linear-gradient(135deg, #f8fafc, #eff6ff)', border: '1px solid #bfdbfe' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ width: '50px', height: '50px', background: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.1)' }}>
          <Zap size={24} color="#2563eb" />
        </div>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Dynamic Variables</h4>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Use these tags in your templates: <code style={{ color: '#2563eb', fontWeight: 700 }}>{"{{Name}}"}</code>, <code style={{ color: '#2563eb', fontWeight: 700 }}>{"{{Date}}"}</code>, <code style={{ color: '#2563eb', fontWeight: 700 }}>{"{{Course}}"}</code></p>
        </div>
      </div>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
      {/* Template List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {TEMPLATES.map(t => (
          <div key={t.id} style={{ ...S.card, padding: '16px', cursor: 'pointer', border: t.id === 1 ? '1px solid #2563eb' : '1px solid #e2e8f0', background: t.id === 1 ? '#eff6ff' : '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{t.name}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Edit2 size={14} color="#64748b" />
                <Trash2 size={14} color="#dc2626" />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</p>
          </div>
        ))}
        <button style={{ padding: '12px', border: '1px dashed #cbd5e1', background: '#f8fafc', borderRadius: '12px', color: '#64748b', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
          <Plus size={16} /> New Template
        </button>
      </div>

      {/* Editor/Preview */}
      <div style={{ ...S.card, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Template Editor</span>
          <button style={{ padding: '6px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={S.label}>TEMPLATE NAME</label>
            <input value="Fee Reminder (Gentle)" style={S.input} readOnly />
          </div>
          <div>
            <label style={S.label}>EMAIL SUBJECT</label>
            <input value="Upcoming Fee Payment - {{Course}}" style={S.input} readOnly />
          </div>
          <div>
            <label style={S.label}>MESSAGE BODY</label>
            <textarea 
              style={{ ...S.input, height: '180px', resize: 'none', lineHeight: '1.6' }}
              value="Dear {{Name}},\n\nThis is a friendly reminder that your enrollment fee for the {{Course}} program is scheduled for payment on {{Date}}.\n\nPlease ensure your account has sufficient funds to avoid any service interruption.\n\nBest regards,\nUniglobal Training Team"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RulesScreen = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ ...S.card, padding: '20px 24px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Zap size={20} color="#2563eb" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Automation Rule Builder</h3>
          </div>
          <button style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Create Rule</button>
        </div>
      </div>

      {RULES.map(rule => (
        <div key={rule.id} style={{ ...S.card, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: rule.status === 'Active' ? '#ecfdf5' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={20} style={{ color: rule.status === 'Active' ? '#059669' : '#94a3b8' }} fill={rule.status === 'Active' ? '#059669' : 'none'} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{rule.name}</h4>
                  <span style={S.statusBadge(rule.status)}>{rule.status}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>If</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '6px' }}>{rule.event}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>and</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>{rule.condition}</span>
                  <ChevronRight size={14} color="#cbd5e1" />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Then</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed', background: '#f5f3ff', padding: '2px 8px', borderRadius: '6px' }}>{rule.action}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}><Edit2 size={14} color="#64748b" /></button>
              <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #fecaca', background: '#fef2f2', cursor: 'pointer' }}><Trash2 size={14} color="#dc2626" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Side Stats */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ ...S.card, padding: '24px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#fff' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Efficiency Gain</h4>
        <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>+42%</div>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>Automation has saved approximately 18 hours of manual work this week.</p>
        <div style={{ marginTop: '24px', height: '6px', background: '#334155', borderRadius: '3px' }}>
          <div style={{ width: '42%', height: '100%', background: '#2563eb', borderRadius: '3px', boxShadow: '0 0 12px rgba(37,99,235,0.5)' }} />
        </div>
      </div>

      <div style={{ ...S.card, padding: '20px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Quick Insights</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Rules Executed', val: '1,240', color: '#2563eb' },
            { label: 'Emails Sent', val: '892', color: '#7c3aed' },
            { label: 'Success Rate', val: '99.2%', color: '#059669' },
          ].map(stat => (
            <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{stat.label}</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: stat.color }}>{stat.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const LogsScreen = () => (
  <div style={S.card}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Notification History</h3>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Track all automated communications</p>
      </div>
      <button style={{ padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <History size={16} /> Export Logs
      </button>
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['Recipient', 'Method', 'Event Type', 'Status', 'Timestamp', 'Details'].map(h => <th key={h} style={S.th}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {NOTIFICATION_LOGS.map((log, idx) => (
          <tr key={log.id} style={{ background: idx % 2 === 0 ? '#fff' : '#fafbff' }}>
            <td style={S.td}><span style={{ fontWeight: 600 }}>{log.recipient}</span></td>
            <td style={S.td}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {log.type === 'Email' ? <Mail size={14} color="#2563eb" /> : <Zap size={14} color="#7c3aed" />}
                {log.type}
              </div>
            </td>
            <td style={S.td}>{log.event}</td>
            <td style={S.td}><span style={S.statusBadge(log.status)}>{log.status}</span></td>
            <td style={S.td}><span style={{ color: '#94a3b8', fontSize: '12px' }}>{log.time}</span></td>
            <td style={S.td}>
              <button style={{ border: 'none', background: 'transparent', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View payload</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center' }}>
      <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Load More History</button>
    </div>
  </div>
);

export default TrainingManagement;
