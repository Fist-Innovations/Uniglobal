import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Bot,
  FileText,
  Mail,
  Coins,
  History,
  Shield,
  Save,
  CheckCircle2,
  Settings as SettingsIcon,
  ChevronRight,
  Database,
  Globe,
  X,
  Plus,
  Trash2,
  Lock,
  Unlock
} from 'lucide-react';

const S = {
  card: { background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', transition: 'background 0.3s, border-color 0.3s' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box', background: 'var(--bg-dark)', color: 'var(--text-main)' },
  label: { fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }
};

const AUDIT_LOGS_MOCK = [
  { user: 'Admin', action: 'Approved GL Mapping', time: '2 mins ago', target: 'AWS Transaction #104' },
  { user: 'System AI', action: 'Suggested Rule Update', time: '15 mins ago', target: 'Amazon → 6100' },
  { user: 'Finance Manager', action: 'Uploaded Statement', time: '1 hour ago', target: 'April_2026.xlsx' },
  { user: 'Admin', action: 'Changed Conf. Threshold', time: '3 hours ago', target: '80% → 85%' },
  { user: 'Admin', action: 'Updated SMTP Server', time: '5 hours ago', target: 'smtp.uniglobal.com' },
  { user: 'Shipping User', action: 'Created Kuwait Shipment', time: '1 day ago', target: 'SHP-2091' },
  { user: 'System AI', action: 'Flagged Duplicate', time: '1 day ago', target: 'Starbucks #0921' },
  { user: 'Admin', action: 'Deleted User Role', time: '2 days ago', target: 'Junior Auditor' },
];

const UserRoles = ({ roles, openModal }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ ...S.card, padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-main)' }}>User Roles & Permissions</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage organizational roles and their access levels.</p>
        </div>
        <button 
          onClick={() => openModal('ADD_ROLE')}
          style={{ padding: '8px 16px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={14} /> New Role
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {roles.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} style={{ color: r.color }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>{r.role}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.perms.join(', ')} · {r.users} Users</p>
              </div>
            </div>
            <button
              onClick={() => openModal('EDIT_PERMS', { ...r, index: i })}
              style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-main)' }}
            >
              Edit Permissions
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AIConfig = ({ config, setConfig }) => (
  <div style={{ ...S.card, padding: '24px' }}>
    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-main)' }}>AI Configuration (Learning Behaviour)</h3>
    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Configure how the AI models learn from your data patterns.</p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>Adaptive GL Mapping</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI will automatically update rules based on manual corrections.</p>
        </div>
        <div 
          onClick={() => setConfig({ ...config, glEnabled: !config.glEnabled })}
          style={{ width: '40px', height: '20px', background: config.glEnabled ? 'var(--primary)' : 'var(--border)', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
        >
          <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', right: config.glEnabled ? '2px' : '22px', top: '2px', transition: 'all 0.3s' }}></div>
        </div>
      </div>

      <div>
        <label style={S.label}>Confidence Threshold ({config.threshold}%)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input type="range" style={{ flex: 1, accentColor: 'var(--primary)' }} value={config.threshold} onChange={e => setConfig({ ...config, threshold: e.target.value })} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{config.threshold}%</span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Minimum confidence required for automatic approval of transactions.</p>
      </div>

      <div>
        <label style={S.label}>Historical Data Window</label>
        <select value={config.window} onChange={e => setConfig({ ...config, window: e.target.value })} style={S.input}>
          <option>Last 12 Months</option>
          <option>Last 2 Years</option>
          <option>All Time</option>
        </select>
      </div>
    </div>
  </div>
);

const GLMapping = ({ rules, openModal, setRules }) => (
  <div style={{ ...S.card, padding: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-main)' }}>GL Mapping Rules</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Define static rules for recurring transaction descriptions.</p>
      </div>
      <button
        onClick={() => openModal('ADD_RULE')}
        style={{ padding: '8px 16px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <Plus size={14} /> Add New Rule
      </button>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {rules.map((rule, i) => (
        <div key={i} style={{ padding: '14px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Pattern</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{rule.pattern}</p>
            </div>
            <div style={{ width: '1px', background: 'var(--border)' }} />
            <div>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>GL Account</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>{rule.account}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>{rule.type}</span>
            <button
              onClick={() => setRules(prev => prev.filter((_, idx) => idx !== i))}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SMTPSettings = ({ smtp, setSmtp, onTest }) => {
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    await new Promise(r => setTimeout(r, 1500));
    setTesting(false);
    onTest();
  };

  return (
    <div style={{ ...S.card, padding: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-main)' }}>Email SMTP Settings</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Configure outgoing email server for notifications and alerts.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={S.label}>SMTP Server</label>
          <input type="text" style={S.input} value={smtp.server} onChange={e => setSmtp({ ...smtp, server: e.target.value })} />
        </div>
        <div>
          <label style={S.label}>Port</label>
          <input type="text" style={S.input} value={smtp.port} onChange={e => setSmtp({ ...smtp, port: e.target.value })} />
        </div>
        <div>
          <label style={S.label}>Encryption</label>
          <select style={S.input} value={smtp.encryption} onChange={e => setSmtp({ ...smtp, encryption: e.target.value })}>
            <option>TLS</option>
            <option>SSL</option>
            <option>None</option>
          </select>
        </div>
        <div>
          <label style={S.label}>Username</label>
          <input type="text" style={S.input} value={smtp.user} onChange={e => setSmtp({ ...smtp, user: e.target.value })} />
        </div>
        <div>
          <label style={S.label}>Password</label>
          <input type="password" style={S.input} value={smtp.pass} onChange={e => setSmtp({ ...smtp, pass: e.target.value })} />
        </div>
      </div>
      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => alert('SMTP Settings Saved Successfully!')}
          style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
        >
          Save Settings
        </button>
        <button 
          onClick={handleTest}
          disabled={testing}
          style={{ padding: '10px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}
        >
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
};

const CurrencySettings = () => (
  <div style={{ ...S.card, padding: '24px' }}>
    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-main)' }}>Currency Settings</h3>
    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Manage base currency and exchange rate providers.</p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={S.label}>Base System Currency</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--bg-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
            <Globe size={20} color="var(--primary)" />
          </div>
          <select style={{ ...S.input, flex: 1 }}>
            <option>Kuwaiti Dinar (KWD)</option>
            <option>US Dollar (USD)</option>
            <option>Saudi Riyal (SAR)</option>
          </select>
        </div>
      </div>

      <div style={{ padding: '16px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', display: 'flex', gap: '12px' }}>
        <Globe size={20} style={{ color: 'var(--primary)' }} />
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>Live Exchange Rates</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rates are automatically updated every 6 hours via Central Bank API.</p>
        </div>
      </div>
    </div>
  </div>
);

const AuditLogs = ({ openModal }) => (
  <div style={{ ...S.card, overflow: 'hidden' }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>System Audit Logs</h3>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Traceability and security tracking for all system actions.</p>
    </div>
    <div style={{ padding: '0 24px' }}>
      {AUDIT_LOGS_MOCK.slice(0, 4).map((log, i) => (
        <div key={i} style={{ padding: '16px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--text-main)', border: '1px solid var(--border)' }}>{log.user.split(' ').map(n => n[0]).join('')}</div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}><span style={{ color: 'var(--primary)' }}>{log.user}</span> {log.action}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: {log.target}</p>
            </div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.time}</span>
        </div>
      ))}
    </div>
    <button 
      onClick={() => openModal('VIEW_AUDIT')}
      style={{ width: '100%', padding: '12px', background: 'var(--bg-dark)', border: 'none', borderTop: '1px solid var(--border)', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
    >
      View Full Audit Trail
    </button>
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([
    { role: 'Administrator', users: 2, perms: ['Dashboard', 'GL', 'Shipping', 'Training', 'Settings'], color: 'var(--primary)' },
    { role: 'Finance Manager', users: 5, perms: ['GL', 'Reports', 'Audit'], color: '#a855f7' },
    { role: 'Shipping Coordinator', users: 12, perms: ['Shipping', 'Comparison'], color: '#10b981' },
    { role: 'Training Admin', users: 3, perms: ['Training', 'Notifications'], color: '#ef4444' }
  ]);
  const [mappingRules, setMappingRules] = useState([
    { pattern: 'AWS *', account: '6100 · Software & Hosting', type: 'System Rule' },
    { pattern: 'Starbucks *', account: '6200 · Meals & Entertainment', type: 'Manual Rule' },
    { pattern: 'Rent *', account: '6300 · Rent & Lease', type: 'System Rule' }
  ]);

  const [aiConfig, setAiConfig] = useState({ glEnabled: true, threshold: 85, window: 'Last 12 Months' });
  const [smtp, setSmtp] = useState({ server: 'smtp.uniglobal-erp.com', port: '587', encryption: 'TLS', user: 'notifications@uniglobal.com', pass: 'password123' });

  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, payload: null });
  const [ruleForm, setRuleForm] = useState({ pattern: '', account: '' });
  const [roleForm, setRoleForm] = useState({ role: '', perms: [] });
  const [permForm, setPermForm] = useState([]);

  const allPerms = ['Dashboard', 'GL', 'Shipping', 'Training', 'Reports', 'Notifications', 'Settings'];

  const openModal = (type, payload = null) => {
    setModalConfig({ isOpen: true, type, payload });
    if (type === 'ADD_RULE') {
      setRuleForm({ pattern: '', account: '' });
    } else if (type === 'EDIT_PERMS') {
      setPermForm(payload.perms);
    } else if (type === 'ADD_ROLE') {
      setRoleForm({ role: '', perms: [] });
    }
  };

  const closeModal = () => setModalConfig({ isOpen: false, type: null, payload: null });

  const saveRule = () => {
    if (!ruleForm.pattern || !ruleForm.account) return;
    setMappingRules(prev => [...prev, { ...ruleForm, type: 'Manual Rule' }]);
    closeModal();
  };

  const savePerms = () => {
    setRoles(prev => {
      const copy = [...prev];
      copy[modalConfig.payload.index].perms = permForm;
      return copy;
    });
    closeModal();
  };

  const saveRole = () => {
    if (!roleForm.role) return;
    setRoles(prev => [...prev, { ...roleForm, users: 0, color: 'var(--text-muted)' }]);
    closeModal();
  };

  const togglePerm = (p, isNew = false) => {
    if (isNew) {
      setRoleForm(prev => ({
        ...prev,
        perms: prev.perms.includes(p) ? prev.perms.filter(x => x !== p) : [...prev.perms, p]
      }));
    } else {
      setPermForm(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    }
  };

  const tabs = [
    { id: 'roles', label: 'User Roles', icon: Users },
    { id: 'ai', label: 'AI Configuration', icon: Bot },
    { id: 'gl', label: 'GL Mapping Rules', icon: FileText },
    { id: 'smtp', label: 'Email SMTP', icon: Mail },
    { id: 'currency', label: 'Currency Settings', icon: Coins },
    { id: 'audit', label: 'Audit Logs', icon: History },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'roles': return <UserRoles roles={roles} openModal={openModal} />;
      case 'ai': return <AIConfig config={aiConfig} setConfig={setAiConfig} />;
      case 'gl': return <GLMapping rules={mappingRules} openModal={openModal} setRules={setMappingRules} />;
      case 'smtp': return <SMTPSettings smtp={smtp} setSmtp={setSmtp} onTest={() => alert('Connection Test Successful!')} />;
      case 'currency': return <CurrencySettings />;
      case 'audit': return <AuditLogs openModal={openModal} />;
      default: return <UserRoles roles={roles} openModal={openModal} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>Admin Settings</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Configure system parameters and manage user permissions.</p>
        </div>
        <button 
          onClick={() => alert('All system settings saved successfully!')}
          style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* Settings Navigation Bar (Top) */}
      <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border)', width: 'fit-content', overflowX: 'auto' }} className="custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '10px', border: 'none',
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? 600 : 500,
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
              fontFamily: 'inherit',
            }}
          >
            <tab.icon size={16} />
            <span style={{ fontSize: '13px' }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content Area */}
      <div style={{ flex: 1 }}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {modalConfig.isOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'var(--bg-card)', borderRadius: '16px', width: '100%', maxWidth: modalConfig.type === 'ADD_RULE' ? '400px' : '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden', border: '1px solid var(--border)' }}
            >
              {/* Mod               <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {modalConfig.type === 'ADD_RULE' && <><Plus size={18} color="var(--primary)" /> Add Mapping Rule</>}
                  {modalConfig.type === 'ADD_ROLE' && <><Plus size={18} color="var(--primary)" /> Create New Role</>}
                  {modalConfig.type === 'EDIT_PERMS' && <><Shield size={18} color="#a855f7" /> Edit {modalConfig.payload.role} Permissions</>}
                  {modalConfig.type === 'VIEW_AUDIT' && <><History size={18} color="var(--primary)" /> Full Audit Trail</>}
                </h3>
                <button onClick={closeModal} style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} />
                </button>
              </div>        </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                {modalConfig.type === 'ADD_RULE' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div><label style={S.label}>DESCRIPTION PATTERN</label><input type="text" value={ruleForm.pattern} onChange={e => setRuleForm({ ...ruleForm, pattern: e.target.value })} placeholder="e.g. Netflix *" style={S.input} /></div>
                    <div><label style={S.label}>GL ACCOUNT</label><input type="text" value={ruleForm.account} onChange={e => setRuleForm({ ...ruleForm, account: e.target.value })} placeholder="e.g. 6400 · Subscriptions" style={S.input} /></div>
                  </div>
                )}
                
                {modalConfig.type === 'ADD_ROLE' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div><label style={S.label}>ROLE NAME</label><input type="text" value={roleForm.role} onChange={e => setRoleForm({ ...roleForm, role: e.target.value })} placeholder="e.g. Auditor" style={S.input} /></div>
                    <div>
                      <label style={S.label}>PERMISSIONS</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {allPerms.map(p => {
                          const isActive = roleForm.perms.includes(p);
                          return (
                            <button key={p} onClick={() => togglePerm(p, true)} style={{ padding: '8px', background: isActive ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-dark)', border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`, borderRadius: '8px', fontSize: '12px', textAlign: 'left', cursor: 'pointer', color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>{p}</button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {modalConfig.type === 'EDIT_PERMS' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {allPerms.map(p => {
                      const isActive = permForm.includes(p);
                      return (
                        <button key={p} onClick={() => togglePerm(p)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: isActive ? 'rgba(168, 85, 247, 0.1)' : 'var(--bg-dark)', border: `1px solid ${isActive ? '#a855f7' : 'var(--border)'}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'left' }}>
                          {isActive ? <CheckCircle2 size={16} color="#a855f7" /> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border)' }} />}
                          <span style={{ fontSize: '13px', fontWeight: 600, color: isActive ? '#a855f7' : 'var(--text-muted)' }}>{p}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {modalConfig.type === 'VIEW_AUDIT' && (
                  <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }} className="custom-scrollbar">
                    {AUDIT_LOGS_MOCK.map((log, i) => (
                      <div key={i} style={{ padding: '16px', background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>{log.user.split(' ').map(n => n[0]).join('')}</div>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}><span style={{ color: 'var(--primary)' }}>{log.user}</span> {log.action}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: {log.target}</p>
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-dark)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={closeModal} style={{ padding: '9px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                <button
                  onClick={modalConfig.type === 'VIEW_AUDIT' ? closeModal : (modalConfig.type === 'ADD_RULE' ? saveRule : modalConfig.type === 'ADD_ROLE' ? saveRole : savePerms)}
                  style={{ padding: '9px 20px', background: 'var(--primary)', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}
                >
                  {modalConfig.type === 'VIEW_AUDIT' ? 'Close' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
