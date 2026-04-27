import { useState } from 'react';
import { Users, Settings2, Mail, Calendar, Clock, Plus, Play, CheckCircle2, AlertCircle, Eye, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const students = [
  { name: 'John Doe',     course: 'Maritime Safety',      fee: 'Paid',    date: '2026-01-15', avatar: 'JD' },
  { name: 'Sarah Ahmed',  course: 'Naval Engineering',    fee: 'Pending', date: '2026-02-10', avatar: 'SA' },
  { name: 'Michael Chen', course: 'Logistics Management', fee: 'Overdue', date: '2026-03-05', avatar: 'MC' },
  { name: 'Amira Hassan', course: 'Supply Chain AI',      fee: 'Paid',    date: '2026-03-20', avatar: 'AH' },
];

const rules = [
  { id: 1, name: 'Fee Due Reminder',   cond: 'Fee due in 3 days',       action: 'Send Email',        status: 'Active' },
  { id: 2, name: 'Exam Registration',  cond: 'New exam added',           action: 'Send SMS',          status: 'Active' },
  { id: 3, name: 'Document Overdue',   cond: '30 days after enrollment', action: 'Send Notification', status: 'Paused' },
];

const feeStyle = {
  Paid:    { bg: '#ecfdf5', color: '#059669' },
  Pending: { bg: '#fff7ed', color: '#d97706' },
  Overdue: { bg: '#fef2f2', color: '#dc2626' },
};

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th:   { padding: '12px 20px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left' },
  td:   { padding: '14px 20px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc' },
};

const TrainingManagement = () => {
  const [tab, setTab] = useState('students');
  const [studentList, setStudentList] = useState(students);
  const [ruleList, setRuleList] = useState(rules);

  // Modal State
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, studentIndex: null });
  const [formData, setFormData] = useState({ name: '', course: '', fee: 'Pending', date: '' });
  const [ruleFormData, setRuleFormData] = useState({ name: '', cond: '', action: 'Send Email', status: 'Active' });

  const openModal = (type, item = null, index = null) => {
    setModalConfig({ isOpen: true, type, studentIndex: index });
    if (type === 'ADD_RULE') {
      setRuleFormData({ name: '', cond: '', action: 'Send Email', status: 'Active' });
    } else if (item && type !== 'ADD') {
      setFormData({ name: item.name, course: item.course, fee: item.fee, date: item.date });
    } else {
      setFormData({ name: '', course: '', fee: 'Pending', date: new Date().toISOString().split('T')[0] });
    }
  };

  const closeModal = () => setModalConfig({ isOpen: false, type: null, studentIndex: null });

  const saveStudent = () => {
    if (!formData.name.trim() || !formData.course.trim()) return;
    
    const avatar = formData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'ST';
    const newStudent = { ...formData, avatar };
    
    if (modalConfig.type === 'ADD') {
      setStudentList(prev => [newStudent, ...prev]);
    } else if (modalConfig.type === 'EDIT') {
      setStudentList(prev => {
        const copy = [...prev];
        copy[modalConfig.studentIndex] = newStudent;
        return copy;
      });
    }
    closeModal();
  };

  const deleteStudent = () => {
    setStudentList(prev => prev.filter((_, idx) => idx !== modalConfig.studentIndex));
    closeModal();
  };

  const saveRule = () => {
    if (!ruleFormData.name.trim() || !ruleFormData.cond.trim()) return;
    const newRule = { ...ruleFormData, id: Date.now() };
    setRuleList(prev => [...prev, newRule]);
    closeModal();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Training Management</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Automate notifications, fee reminders & academic alerts</p>
        </div>
        <button 
          onClick={() => openModal('ADD')}
          style={{ 
            padding: '9px 18px', background: 'linear-gradient(to right,#1a56c4,#2563eb)', border: 'none', 
            borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: 'white', 
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', 
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          <Plus size={14} /> Add Student
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '4px', width: 'fit-content', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {[{ key: 'students', icon: Users, label: 'Students List' }, { key: 'automation', icon: Settings2, label: 'Automation Rules' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600,
            background: tab === t.key ? 'linear-gradient(to right,#1a56c4,#2563eb)' : 'transparent',
            color: tab === t.key ? '#fff' : '#64748b',
            boxShadow: tab === t.key ? '0 4px 10px rgba(37,99,235,0.25)' : 'none',
            transition: 'all 0.2s', fontFamily: 'inherit',
          }}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'students' ? (
        <div style={{ ...S.card, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Student Records</p>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>{studentList.length} enrolled students</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Student', 'Course', 'Fee Status', 'Enrollment Date', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {studentList.map((s, i) => (
                <motion.tr key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#1a56c4,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                        {s.avatar}
                      </div>
                      <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ ...S.td, color: '#64748b' }}>{s.course}</td>
                  <td style={S.td}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: feeStyle[s.fee].bg, color: feeStyle[s.fee].color }}>
                      {s.fee}
                    </span>
                  </td>
                  <td style={{ ...S.td, color: '#64748b' }}>{s.date}</td>
                  <td style={S.td}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openModal('VIEW', s, i)} title="View Details" style={{ width: '28px', height: '28px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        <Eye size={13} style={{ color: '#64748b' }} />
                      </button>
                      <button onClick={() => openModal('EDIT', s, i)} title="Edit Student" style={{ width: '28px', height: '28px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        <Edit2 size={13} style={{ color: '#2563eb' }} />
                      </button>
                      <button onClick={() => openModal('DELETE', s, i)} title="Delete Student" style={{ width: '28px', height: '28px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        <Trash2 size={13} style={{ color: '#dc2626' }} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {ruleList.map(rule => (
              <motion.div key={rule.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ ...S.card, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: rule.status === 'Active' ? '#ecfdf5' : '#f8fafc', flexShrink: 0 }}>
                    <Play size={18} style={{ color: rule.status === 'Active' ? '#059669' : '#94a3b8' }} fill={rule.status === 'Active' ? '#059669' : 'none'} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>{rule.name}</p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>
                      IF <span style={{ color: '#2563eb', fontWeight: 600 }}>{rule.cond}</span> → THEN <span style={{ color: '#7c3aed', fontWeight: 600 }}>{rule.action}</span>
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: rule.status === 'Active' ? '#ecfdf5' : '#f1f5f9', color: rule.status === 'Active' ? '#059669' : '#94a3b8' }}>
                    {rule.status}
                  </span>
                  <button 
                    onClick={() => setRuleList(p => p.filter(r => r.id !== rule.id))}
                    title="Delete Rule"
                    style={{ width: '32px', height: '32px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  >
                    <Settings2 size={14} style={{ color: '#64748b', minWidth: '14px' }} />
                  </button>
                </div>
              </motion.div>
            ))}
            <button 
              onClick={() => openModal('ADD_RULE')}
              style={{ padding: '16px', background: '#fafbff', border: '2px dashed #e2e8f0', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = '#fafbff'; }}
            >
              <Plus size={16} /> Create New Automation Rule
            </button>
          </div>

          {/* Insights Panel */}
          <div style={{ ...S.card, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>AI Rule Insights</p>
            {[
              { icon: Mail,  col: '#2563eb', bg: '#eff6ff', text: 'Automating "Fee Due" notifications increased payment accuracy by', highlight: '24%' },
              { icon: Clock, col: '#7c3aed', bg: '#f5f3ff', text: 'Suggested: Send reminders', highlight: '5 days', after: 'before exam registration closes.' },
            ].map((ins, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '14px', background: ins.bg, borderRadius: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ins.icon size={16} style={{ color: ins.col }} />
                </div>
                <p style={{ fontSize: '12.5px', color: '#374151', lineHeight: 1.6 }}>
                  {ins.text} <span style={{ color: ins.col, fontWeight: 700 }}>{ins.highlight}</span> {ins.after || 'last month.'}
                </p>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Automation Log</p>
              {[1,2,3].map(i => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f8fafc' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={13} style={{ color: '#059669' }} />
                    <span style={{ fontSize: '12px', color: '#374151' }}>Rule #1 executed</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600, background: '#ecfdf5', padding: '2px 7px', borderRadius: '20px' }}>Success</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{i * 2}m ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      <AnimatePresence>
        {modalConfig.isOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}
            >
              {/* Modal Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {modalConfig.type === 'ADD' && <><Plus size={20} color="#2563eb" /> Add New Student</>}
                  {modalConfig.type === 'EDIT' && <><Edit2 size={20} color="#2563eb" /> Edit Student</>}
                  {modalConfig.type === 'VIEW' && <><Eye size={20} color="#2563eb" /> Student Details</>}
                  {modalConfig.type === 'DELETE' && <><AlertCircle size={20} color="#dc2626" /> Confirm Deletion</>}
                  {modalConfig.type === 'ADD_RULE' && <><Settings2 size={20} color="#059669" /> Create Automation Rule</>}
                </h3>
                <button onClick={closeModal} style={{ background: '#e2e8f0', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                {modalConfig.type === 'DELETE' ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Trash2 size={28} color="#dc2626" />
                    </div>
                    <p style={{ fontSize: '15px', color: '#374151', marginBottom: '8px' }}>Are you sure you want to remove <b>{formData.name}</b>?</p>
                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>This action cannot be undone.</p>
                  </div>
                ) : (modalConfig.type === 'ADD' || modalConfig.type === 'EDIT' || modalConfig.type === 'VIEW') ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>FULL NAME</label>
                      <input 
                        type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        disabled={modalConfig.type === 'VIEW'}
                        placeholder="e.g. John Doe"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: modalConfig.type === 'VIEW' ? '#f8fafc' : '#fff', color: '#0f172a' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>COURSE</label>
                      <input 
                        type="text" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})}
                        disabled={modalConfig.type === 'VIEW'}
                        placeholder="e.g. Maritime Safety"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: modalConfig.type === 'VIEW' ? '#f8fafc' : '#fff', color: '#0f172a' }} 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>FEE STATUS</label>
                        <select 
                          value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})}
                          disabled={modalConfig.type === 'VIEW'}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: modalConfig.type === 'VIEW' ? '#f8fafc' : '#fff', color: '#0f172a' }}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>ENROLLMENT DATE</label>
                        <input 
                          type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                          disabled={modalConfig.type === 'VIEW'}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: modalConfig.type === 'VIEW' ? '#f8fafc' : '#fff', color: '#0f172a', fontFamily: 'inherit' }} 
                        />
                      </div>
                    </div>
                  </div>
                ) : modalConfig.type === 'ADD_RULE' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>RULE NAME</label>
                      <input 
                        type="text" value={ruleFormData.name} onChange={e => setRuleFormData({...ruleFormData, name: e.target.value})}
                        placeholder="e.g. Fee Due Reminder"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none', color: '#0f172a' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>CONDITION (IF)</label>
                      <input 
                        type="text" value={ruleFormData.cond} onChange={e => setRuleFormData({...ruleFormData, cond: e.target.value})}
                        placeholder="e.g. Fee is overdue by 5 days"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none', color: '#2563eb', fontWeight: 500 }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>ACTION (THEN)</label>
                      <select 
                        value={ruleFormData.action} onChange={e => setRuleFormData({...ruleFormData, action: e.target.value})}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none', color: '#7c3aed', fontWeight: 500 }}
                      >
                        <option value="Send Email">Send Email</option>
                        <option value="Send SMS">Send SMS</option>
                        <option value="Send Notification">Send Push Notification</option>
                        <option value="Create Task">Create Manual Task</option>
                      </select>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={closeModal} style={{ padding: '9px 16px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                  {modalConfig.type === 'VIEW' ? 'Close' : 'Cancel'}
                </button>
                {modalConfig.type === 'DELETE' && (
                  <button onClick={deleteStudent} style={{ padding: '9px 16px', background: '#dc2626', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', cursor: 'pointer', boxShadow: '0 2px 6px rgba(220,38,38,0.2)' }}>
                    Yes, Delete
                  </button>
                )}
                {(modalConfig.type === 'ADD' || modalConfig.type === 'EDIT') && (
                  <button onClick={saveStudent} style={{ padding: '9px 20px', background: 'linear-gradient(to right,#1a56c4,#2563eb)', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 10px rgba(37,99,235,0.2)' }}>
                    {modalConfig.type === 'ADD' ? 'Save Student' : 'Update Record'}
                  </button>
                )}
                {modalConfig.type === 'ADD_RULE' && (
                  <button onClick={saveRule} style={{ padding: '9px 20px', background: '#059669', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 10px rgba(5,150,105,0.2)' }}>
                    Create Rule
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TrainingManagement;
