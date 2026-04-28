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
  AlertTriangle,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

// --- Dummy Data ---

const INITIAL_STUDENTS = [
  { id: 1, name: 'John Doe', course: 'Maritime Safety', feeStatus: 'Paid', academicEvent: 'Final Exam', date: '2026-05-15', avatar: 'JD' },
  { id: 2, name: 'Sarah Ahmed', course: 'Naval Engineering', feeStatus: 'Pending', academicEvent: 'Mid-term Review', date: '2026-05-20', avatar: 'SA' },
  { id: 3, name: 'Michael Chen', course: 'Logistics Management', feeStatus: 'Overdue', academicEvent: 'Certification', date: '2026-06-05', avatar: 'MC' },
  { id: 4, name: 'Amira Hassan', course: 'Supply Chain AI', feeStatus: 'Paid', academicEvent: 'Workshop', date: '2026-05-22', avatar: 'AH' },
  { id: 5, name: 'Robert Wilson', course: 'Port Operations', feeStatus: 'Pending', academicEvent: 'Safety Drill', date: '2026-05-18', avatar: 'RW' },
];

const EVENT_TYPES = [
  { id: 'fee_due',  label: 'Fee Due',              icon: Mail,          color: '#2563eb', trigger: '3 days before due date',      enabled: true },
  { id: 'overdue',  label: 'Overdue Payment',       icon: AlertTriangle, color: '#dc2626', trigger: 'Immediate upon overdue',       enabled: true },
  { id: 'exam_reg', label: 'Exam Registration',     icon: Calendar,      color: '#059669', trigger: '7 days before opening',       enabled: false },
  { id: 'doc_sub',  label: 'Document Submission',   icon: FileCode,      color: '#7c3aed', trigger: '14 days after enrollment',    enabled: true },
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
  const [eventTypes, setEventTypes] = useState(EVENT_TYPES);
  const [templates, setTemplates] = useState(TEMPLATES);
  const [rules, setRules] = useState(RULES);
  const [logs] = useState(NOTIFICATION_LOGS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [studentFilter, setStudentFilter] = useState({ course: 'All', feeStatus: 'All' });
  const [ruleFilter, setRuleFilter] = useState({ status: 'All' });
  const [logFilter, setLogFilter] = useState({ status: 'All', method: 'All' });
  
  // Modal State
  const [modal, setModal] = useState({ isOpen: false, type: '', data: null });
  const [formData, setFormData] = useState({});

  const openModal = (type, data = null) => {
    setFormData(data ? { ...data } : {});
    setModal({ isOpen: true, type, data });
  };
  const closeModal = () => setModal({ isOpen: false, type: '', data: null });
  const setField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleAddStudent = () => {
    const newStudent = {
      id: Date.now(),
      name: formData.name || 'New Student',
      course: formData.course || 'General',
      feeStatus: formData.feeStatus || 'Pending',
      academicEvent: formData.academicEvent || 'Orientation',
      date: formData.date || new Date().toISOString().split('T')[0],
      avatar: (formData.name || 'NS').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
    };
    setStudents(prev => [...prev, newStudent]);
    closeModal();
  };

  const handleToggleEvent = (id) => {
    setEventTypes(prev => prev.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e));
  };

  const handleSaveStudent = () => {
    setStudents(prev => prev.map(s => s.id === formData.id ? { ...s, ...formData } : s));
    closeModal();
  };

  const handleAddEvent = () => {
    if (!formData.label) return;
    setEventTypes(prev => [...prev, { ...formData, id: Date.now(), icon: Calendar }]);
    closeModal();
  };

  const handleSaveTemplate = (data) => {
    setTemplates(prev => prev.map(t => t.id === data.id ? data : t));
    closeModal();
  };

  const handleDeleteTemplate = (id) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    closeModal();
  };

  const handleDeleteRule = (id) => {
    setRules(prev => prev.filter(r => r.id !== id));
    closeModal();
  };

  const handleSaveEvent = () => {
    setEventTypes(prev => prev.map(e => e.id === formData.id ? { ...e, ...formData } : e));
    closeModal();
  };

  const handleSaveRule = () => {
    if (formData.id) {
      setRules(prev => prev.map(r => r.id === formData.id ? { ...r, ...formData } : r));
    } else {
      setRules(prev => [...prev, { ...formData, id: Date.now(), status: 'Active', action: 'Send Email' }]);
    }
    closeModal();
  };

  const exportLogs = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLogs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notification Logs");
    XLSX.writeFile(wb, "Training_Notification_Logs.xlsx");
  };

  const exportStudents = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStudents);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "Training_Students_Report.xlsx");
  };

  const handleApplyFilters = (config) => {
    if (activeTab === 'students') setStudentFilter(config);
    if (activeTab === 'rules') setRuleFilter(config);
    if (activeTab === 'logs') setLogFilter(config);
    closeModal();
  };

  // Filter Logic
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = studentFilter.course === 'All' || s.course === studentFilter.course;
    const matchesFee = studentFilter.feeStatus === 'All' || s.feeStatus === studentFilter.feeStatus;
    return matchesSearch && matchesCourse && matchesFee;
  });

  const filteredRules = rules.filter(r => {
    return ruleFilter.status === 'All' || r.status === ruleFilter.status;
  });

  const filteredLogs = logs.filter(l => {
    const matchesStatus = logFilter.status === 'All' || l.status === logFilter.status;
    const matchesMethod = logFilter.method === 'All' || l.type === logFilter.method;
    return matchesStatus && matchesMethod;
  });

  // Unique Courses for Filter
  const uniqueCourses = ['All', ...new Set(students.map(s => s.course))];

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
          {['students', 'rules', 'logs'].includes(activeTab) && (
            <button 
              onClick={() => openModal('filter', { 
                tab: activeTab,
                ...(activeTab === 'students' ? { ...studentFilter, courses: uniqueCourses } : {}),
                ...(activeTab === 'rules' ? { ...ruleFilter } : {}),
                ...(activeTab === 'logs' ? { ...logFilter } : {}),
              })}
              style={{ padding: '10px 18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Filter size={16} /> Filters
            </button>
          )}
          {['students', 'logs'].includes(activeTab) && (
            <button 
              onClick={activeTab === 'students' ? exportStudents : exportLogs}
              style={{ padding: '10px 18px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Download size={16} /> Export
            </button>
          )}
          {activeTab === 'students' && (
            <button onClick={() => openModal('add_student')} style={{ padding: '10px 20px', background: 'linear-gradient(to right, #1a56c4, #2563eb)', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
              <Plus size={16} /> Add New
            </button>
          )}
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
            {activeTab === 'students' && <StudentScreen students={filteredStudents} onOpenModal={openModal} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
            {activeTab === 'events' && <EventConfigScreen eventTypes={eventTypes} onOpenModal={openModal} onToggle={handleToggleEvent} />}
            {activeTab === 'templates' && <TemplateScreen templates={templates} onOpenModal={openModal} onSave={handleSaveTemplate} onDelete={handleDeleteTemplate} />}
            {activeTab === 'rules' && <RulesScreen rules={filteredRules} onOpenModal={openModal} onDelete={handleDeleteRule} />}
            {activeTab === 'logs' && <LogsScreen logs={filteredLogs} onExport={exportLogs} onOpenModal={openModal} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Modal System */}
      <AnimatePresence>
        {modal.isOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: modal.type === 'payload' ? '600px' : '500px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
              
              {/* Modal Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  {modal.type === 'view_student' && 'Student Details'}
                  {modal.type === 'edit_student' && 'Edit Student'}
                  {modal.type === 'add_student' && 'Add New Student'}
                  {modal.type === 'add_event' && 'Define New Event Type'}
                  {modal.type === 'edit_event' && 'Edit Event Type'}
                  {modal.type === 'edit_template' && 'Edit Template'}
                  {modal.type === 'delete_confirm' && 'Confirm Deletion'}
                  {modal.type === 'edit_rule' && 'Automation Rule'}
                  {modal.type === 'payload' && 'Notification Payload'}
                  {modal.type === 'filter' && `Filter ${modal.data.tab.charAt(0).toUpperCase() + modal.data.tab.slice(1)}`}
                </h3>
                <button onClick={closeModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                {modal.type === 'view_student' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'linear-gradient(135deg, #1a56c4, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 800 }}>{modal.data.avatar}</div>
                      <div>
                        <h4 style={{ fontSize: '18px', fontWeight: 700 }}>{modal.data.name}</h4>
                        <p style={{ color: '#64748b' }}>{modal.data.course}</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div><label style={S.label}>Fee Status</label><div style={S.statusBadge(modal.data.feeStatus)}>{modal.data.feeStatus}</div></div>
                      <div><label style={S.label}>Next Academic Event</label><div style={{ fontWeight: 600 }}>{modal.data.academicEvent}</div></div>
                      <div><label style={S.label}>Scheduled Date</label><div style={{ color: '#64748b' }}>{modal.data.date}</div></div>
                    </div>
                  </div>
                )}

                {(modal.type === 'edit_student') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={S.label}>Student Name</label><input value={formData.name || ''} onChange={e => setField('name', e.target.value)} style={S.input} /></div>
                    <div><label style={S.label}>Course</label><input value={formData.course || ''} onChange={e => setField('course', e.target.value)} style={S.input} /></div>
                    <div>
                      <label style={S.label}>Fee Status</label>
                      <select value={formData.feeStatus || 'Paid'} onChange={e => setField('feeStatus', e.target.value)} style={S.input}>
                        <option>Paid</option><option>Pending</option><option>Overdue</option>
                      </select>
                    </div>
                    <button onClick={handleSaveStudent} style={{ marginTop: '12px', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
                  </div>
                )}

                {modal.type === 'add_event' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={S.label}>Event Label</label><input value={formData.label || ''} onChange={e => setField('label', e.target.value)} placeholder="e.g. Registration Open" style={S.input} /></div>
                    <div><label style={S.label}>Trigger Rule</label><input value={formData.trigger || ''} onChange={e => setField('trigger', e.target.value)} placeholder="e.g. 5 days before start" style={S.input} /></div>
                    <div>
                      <label style={S.label}>Color / Category</label>
                      <select value={formData.color || '#2563eb'} onChange={e => setField('color', e.target.value)} style={S.input}>
                        <option value="#2563eb">Blue (Info)</option>
                        <option value="#059669">Green (Success)</option>
                        <option value="#dc2626">Red (Alert)</option>
                        <option value="#7c3aed">Purple (Document)</option>
                      </select>
                    </div>
                    <button onClick={handleAddEvent} style={{ marginTop: '12px', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Create Event Type</button>
                  </div>
                )}

                {modal.type === 'edit_event' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={S.label}>Event Label</label><input value={formData.label || ''} onChange={e => setField('label', e.target.value)} style={S.input} /></div>
                    <div><label style={S.label}>Trigger Rule</label><input value={formData.trigger || ''} onChange={e => setField('trigger', e.target.value)} style={S.input} /></div>
                    <div>
                      <label style={S.label}>Color / Category</label>
                      <select value={formData.color || '#2563eb'} onChange={e => setField('color', e.target.value)} style={S.input}>
                        <option value="#2563eb">Blue (Info)</option>
                        <option value="#059669">Green (Success)</option>
                        <option value="#dc2626">Red (Alert)</option>
                        <option value="#7c3aed">Purple (Document)</option>
                      </select>
                    </div>
                    <button onClick={handleSaveEvent} style={{ marginTop: '12px', padding: '13px', background: 'linear-gradient(to right,#1a56c4,#2563eb)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Save Changes</button>
                  </div>
                )}

                {modal.type === 'delete_confirm' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                      <Trash2 size={32} color="#dc2626" />
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Are you sure?</h4>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>This action cannot be undone. You are about to delete <strong>{modal.data.name}</strong>.</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={closeModal} style={{ ...S.input, background: '#f8fafc', flex: 1, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                      <button onClick={() => modal.data.onDelete(modal.data.id)} style={{ ...S.input, background: '#dc2626', color: '#fff', border: 'none', flex: 1, fontWeight: 700, cursor: 'pointer' }}>Delete Now</button>
                    </div>
                  </div>
                )}

                {modal.type === 'payload' && (
                  <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', color: '#38bdf8', fontSize: '13px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
                    {JSON.stringify({ notification_id: modal.data.id, timestamp: modal.data.time, recipient: modal.data.recipient, method: modal.data.type, event_hook: modal.data.event, status: modal.data.status, metadata: { subject: modal.data.details, delivery_node: 'us-east-erp-01', retry_count: 0 } }, null, 2)}
                  </div>
                )}

                {modal.type === 'add_student' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={S.label}>Full Name</label><input value={formData.name || ''} onChange={e => setField('name', e.target.value)} placeholder="e.g. James Smith" style={S.input} /></div>
                    <div><label style={S.label}>Course</label><input value={formData.course || ''} onChange={e => setField('course', e.target.value)} placeholder="e.g. Maritime Safety" style={S.input} /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={S.label}>Fee Status</label>
                        <select value={formData.feeStatus || 'Pending'} onChange={e => setField('feeStatus', e.target.value)} style={S.input}>
                          <option>Paid</option><option>Pending</option><option>Overdue</option>
                        </select>
                      </div>
                      <div><label style={S.label}>Event Date</label><input type="date" value={formData.date || ''} onChange={e => setField('date', e.target.value)} style={S.input} /></div>
                    </div>
                    <div><label style={S.label}>Next Academic Event</label><input value={formData.academicEvent || ''} onChange={e => setField('academicEvent', e.target.value)} placeholder="e.g. Orientation" style={S.input} /></div>
                    <button onClick={handleAddStudent} style={{ marginTop: '8px', padding: '13px', background: 'linear-gradient(to right,#1a56c4,#2563eb)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Add Student</button>
                  </div>
                )}

                {modal.type === 'edit_template' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={S.label}>Template Name</label><input value={formData.name || ''} onChange={e => setField('name', e.target.value)} style={S.input} /></div>
                    <div><label style={S.label}>Email Subject</label><input value={formData.subject || ''} onChange={e => setField('subject', e.target.value)} style={S.input} /></div>
                    <div>
                      <label style={S.label}>Message Body</label>
                      <textarea value={formData.body || ''} onChange={e => setField('body', e.target.value)} style={{ ...S.input, height: '140px', resize: 'none', lineHeight: 1.6 }} />
                    </div>
                    <button onClick={() => { handleSaveTemplate(formData); }} style={{ marginTop: '8px', padding: '13px', background: 'linear-gradient(to right,#1a56c4,#2563eb)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Save Template</button>
                  </div>
                )}
                
                {(modal.type === 'edit_rule') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={S.label}>Rule Name</label><input value={formData.name || ''} onChange={e => setField('name', e.target.value)} style={S.input} /></div>
                    <div><label style={S.label}>Event Trigger</label><select value={formData.event || eventTypes[0]?.label} onChange={e => setField('event', e.target.value)} style={S.input}>{eventTypes.map(e => <option key={e.id}>{e.label}</option>)}</select></div>
                    <div><label style={S.label}>Condition</label><input value={formData.condition || ''} onChange={e => setField('condition', e.target.value)} style={S.input} /></div>
                    <button onClick={handleSaveRule} style={{ marginTop: '12px', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>{formData.id ? 'Update Rule' : 'Create Rule'}</button>
                  </div>
                )}

                {modal.type === 'filter' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {modal.data.tab === 'students' && (
                      <>
                        <div>
                          <label style={S.label}>COURSE</label>
                          <select value={formData.course || 'All'} onChange={e => setField('course', e.target.value)} style={S.input}>
                            {formData.courses.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={S.label}>FEE STATUS</label>
                          <select value={formData.feeStatus || 'All'} onChange={e => setField('feeStatus', e.target.value)} style={S.input}>
                            <option value="All">All Statuses</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Overdue">Overdue</option>
                          </select>
                        </div>
                      </>
                    )}

                    {modal.data.tab === 'rules' && (
                      <div>
                        <label style={S.label}>STATUS</label>
                        <select value={formData.status || 'All'} onChange={e => setField('status', e.target.value)} style={S.input}>
                          <option value="All">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Paused">Paused</option>
                        </select>
                      </div>
                    )}

                    {modal.data.tab === 'logs' && (
                      <>
                        <div>
                          <label style={S.label}>DELIVERY STATUS</label>
                          <select value={formData.status || 'All'} onChange={e => setField('status', e.target.value)} style={S.input}>
                            <option value="All">All Statuses</option>
                            <option value="Sent">Sent</option>
                            <option value="Failed">Failed</option>
                            <option value="Retrying">Retrying</option>
                          </select>
                        </div>
                        <div>
                          <label style={S.label}>METHOD</label>
                          <select value={formData.method || 'All'} onChange={e => setField('method', e.target.value)} style={S.input}>
                            <option value="All">All Methods</option>
                            <option value="Email">Email</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="SMS">SMS</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      <button 
                        onClick={() => handleApplyFilters({ course: 'All', feeStatus: 'All', status: 'All', method: 'All' })}
                        style={{ ...S.input, background: '#f1f5f9', flex: 1, fontWeight: 700, cursor: 'pointer', border: 'none' }}
                      >
                        Reset
                      </button>
                      <button 
                        onClick={() => handleApplyFilters(formData)}
                        style={{ ...S.input, background: '#2563eb', color: '#fff', flex: 1, fontWeight: 700, cursor: 'pointer', border: 'none' }}
                      >
                        Apply Filters
                      </button>
                    </div>
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

// --- Sub-Screens ---

const StudentScreen = ({ students, onOpenModal, searchTerm, setSearchTerm }) => (
  <div style={S.card}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Enrolled Students</h3>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Managing {students.length} active students</p>
      </div>
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input 
          placeholder="Search students..." 
          style={{ ...S.input, paddingLeft: '36px', width: '240px', background: '#f8fafc' }} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                <button onClick={() => onOpenModal('view_student', s)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', color: '#64748b' }}><Eye size={14} /></button>
                <button onClick={() => onOpenModal('edit_student', s)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #bfdbfe', background: '#eff6ff', cursor: 'pointer', color: '#2563eb' }}><Edit2 size={14} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const EventConfigScreen = ({ eventTypes, onOpenModal, onToggle }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
    {eventTypes.map(event => (
      <div key={event.id} style={{ ...S.card, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${event.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <event.icon size={24} style={{ color: event.color }} />
          </div>
          <button onClick={() => onOpenModal('edit_event', event)} style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer' }}><Settings2 size={14} /></button>
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
          <div
            onClick={() => onToggle(event.id)}
            style={{ width: '40px', height: '20px', background: event.enabled ? '#059669' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: event.enabled ? 'calc(100% - 18px)' : '2px', transition: 'left 0.2s' }} />
          </div>
        </div>
      </div>
    ))}
    <div 
      onClick={() => onOpenModal('add_event')}
      style={{ ...S.card, border: '2px dashed #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', minHeight: '220px' }}
    >
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        <Plus size={20} />
      </div>
      <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>Define New Event Type</span>
    </div>
  </div>
);

const TemplateScreen = ({ templates, onOpenModal, onSave, onDelete }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  return (
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
          {templates.map(t => (
            <div key={t.id} onClick={() => setSelectedTemplate(t)} style={{ ...S.card, padding: '16px', cursor: 'pointer', border: selectedTemplate.id === t.id ? '1px solid #2563eb' : '1px solid #e2e8f0', background: selectedTemplate.id === t.id ? '#eff6ff' : '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{t.name}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Edit2 size={14} color="#64748b" onClick={(e) => { e.stopPropagation(); onOpenModal('edit_template', t); }} />
                  <Trash2 size={14} color="#dc2626" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onOpenModal('delete_confirm', { ...t, onDelete: onDelete }); }} />
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</p>
            </div>
          ))}
          <button onClick={() => onOpenModal('edit_template')} style={{ padding: '12px', border: '1px dashed #cbd5e1', background: '#f8fafc', borderRadius: '12px', color: '#64748b', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <Plus size={16} /> New Template
          </button>
        </div>

        {/* Editor/Preview */}
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Template Editor</span>
            <button 
              onClick={() => {
                onSave({ ...selectedTemplate, body: document.getElementById('template-body').value });
                alert('Changes saved successfully!');
              }}
              style={{ padding: '6px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              Save Changes
            </button>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={S.label}>TEMPLATE NAME</label>
              <input value={selectedTemplate.name} style={S.input} readOnly />
            </div>
            <div>
              <label style={S.label}>EMAIL SUBJECT</label>
              <input value={selectedTemplate.subject} style={S.input} readOnly />
            </div>
            <div>
              <label style={S.label}>MESSAGE BODY</label>
              <textarea 
                id="template-body"
                style={{ ...S.input, height: '180px', resize: 'none', lineHeight: '1.6' }}
                defaultValue={selectedTemplate.body}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RulesScreen = ({ rules, onOpenModal, onDelete }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ ...S.card, padding: '20px 24px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Zap size={20} color="#2563eb" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Automation Rule Builder</h3>
          </div>
          <button onClick={() => onOpenModal('edit_rule')} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Create Rule</button>
        </div>
      </div>

      {rules.map(rule => (
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
              <button onClick={() => onOpenModal('edit_rule', rule)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}><Edit2 size={14} color="#64748b" /></button>
              <button onClick={() => onOpenModal('delete_confirm', { ...rule, onDelete: onDelete })} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #fecaca', background: '#fef2f2', cursor: 'pointer' }}><Trash2 size={14} color="#dc2626" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Side Stats omitted for brevity or kept as is */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ ...S.card, padding: '24px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#fff' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Efficiency Gain</h4>
        <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>+42%</div>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>Automation has saved approximately 18 hours of manual work this week.</p>
        <div style={{ marginTop: '24px', height: '6px', background: '#334155', borderRadius: '3px' }}>
          <div style={{ width: '42%', height: '100%', background: '#2563eb', borderRadius: '3px', boxShadow: '0 0 12px rgba(37,99,235,0.5)' }} />
        </div>
      </div>
    </div>
  </div>
);

const LogsScreen = ({ logs, onExport, onOpenModal }) => (
  <div style={S.card}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Notification History</h3>
        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Track all automated communications</p>
      </div>
      <button onClick={onExport} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
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
        {logs.map((log, idx) => (
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
              <button onClick={() => onOpenModal('payload', log)} style={{ border: 'none', background: 'transparent', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View payload</button>
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
