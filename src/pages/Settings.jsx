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
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  label: { fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', display: 'block' }
};

const UserRoles = ({ roles, openModal }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <div style={{ ...S.card, padding: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>User Roles & Permissions</h3>
      <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>Manage organizational roles and their access levels.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {roles.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} style={{ color: r.color }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700 }}>{r.role}</p>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>{r.perms.join(', ')} · {r.users} Users</p>
              </div>
            </div>
            <button 
              onClick={() => openModal('EDIT_PERMS', { ...r, index: i })}
              style={{ padding: '6px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              Edit Permissions
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AIConfig = () => (
  <div style={{ ...S.card, padding: '24px' }}>
    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>AI Configuration (Learning Behaviour)</h3>
    <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>Configure how the AI models learn from your data patterns.</p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600 }}>Adaptive GL Mapping</p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>AI will automatically update rules based on manual corrections.</p>
        </div>
        <div style={{ width: '40px', height: '20px', background: '#2563eb', borderRadius: '20px', position: 'relative' }}>
          <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
        </div>
      </div>
      
      <div>
        <label style={S.label}>Confidence Threshold (%)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input type="range" style={{ flex: 1, accentColor: '#2563eb' }} defaultValue="85" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>85%</span>
        </div>
        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Minimum confidence required for automatic approval of transactions.</p>
      </div>

      <div>
        <label style={S.label}>Historical Data Window</label>
        <select style={{ ...S.input, background: '#fff' }}>
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
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>GL Mapping Rules</h3>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>Define static rules for recurring transaction descriptions.</p>
      </div>
      <button 
        onClick={() => openModal('ADD_RULE')}
        style={{ padding: '8px 16px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <Plus size={14} /> Add New Rule
      </button>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {rules.map((rule, i) => (
        <div key={i} style={{ padding: '14px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Pattern</p>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>{rule.pattern}</p>
            </div>
            <div style={{ width: '1px', background: '#f1f5f9' }} />
            <div>
              <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>GL Account</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>{rule.account}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{rule.type}</span>
            <button 
              onClick={() => setRules(prev => prev.filter((_, idx) => idx !== i))}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SMTPSettings = () => (
  <div style={{ ...S.card, padding: '24px' }}>
    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Email SMTP Settings</h3>
    <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>Configure outgoing email server for notifications and alerts.</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div style={{ gridColumn: 'span 2' }}>
        <label style={S.label}>SMTP Server</label>
        <input type="text" style={S.input} defaultValue="smtp.uniglobal-erp.com" />
      </div>
      <div>
        <label style={S.label}>Port</label>
        <input type="text" style={S.input} defaultValue="587" />
      </div>
      <div>
        <label style={S.label}>Encryption</label>
        <select style={S.input}>
          <option>TLS</option>
          <option>SSL</option>
          <option>None</option>
        </select>
      </div>
      <div>
        <label style={S.label}>Username</label>
        <input type="text" style={S.input} defaultValue="notifications@uniglobal.com" />
      </div>
      <div>
        <label style={S.label}>Password</label>
        <input type="password" style={S.input} defaultValue="••••••••••••" />
      </div>
    </div>
    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
      <button style={{ padding: '10px 20px', background: '#1a56c4', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Save Settings</button>
      <button style={{ padding: '10px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Test Connection</button>
    </div>
  </div>
);

const CurrencySettings = () => (
  <div style={{ ...S.card, padding: '24px' }}>
    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Currency Settings</h3>
    <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>Manage base currency and exchange rate providers.</p>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={S.label}>Base System Currency</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🇰🇼</div>
          <select style={{ ...S.input, flex: 1 }}>
            <option>Kuwaiti Dinar (KWD)</option>
            <option>US Dollar (USD)</option>
            <option>Saudi Riyal (SAR)</option>
          </select>
        </div>
      </div>
      
      <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '12px', display: 'flex', gap: '12px' }}>
        <Globe size={20} style={{ color: '#2563eb' }} />
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af' }}>Live Exchange Rates</p>
          <p style={{ fontSize: '12px', color: '#60a5fa' }}>Rates are automatically updated every 6 hours via Central Bank API.</p>
        </div>
      </div>
    </div>
  </div>
);

const AuditLogs = () => (
  <div style={{ ...S.card, overflow: 'hidden' }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700 }}>System Audit Logs</h3>
      <p style={{ fontSize: '12px', color: '#94a3b8' }}>Traceability and security tracking for all system actions.</p>
    </div>
    <div style={{ padding: '0 24px' }}>
      {[
        { user: 'Adarsh Admin', action: 'Approved GL Mapping', time: '2 mins ago', target: 'AWS Transaction #104' },
        { user: 'System AI', action: 'Suggested Rule Update', time: '15 mins ago', target: 'Amazon → 6100' },
        { user: 'Finance Manager', action: 'Uploaded Statement', time: '1 hour ago', target: 'April_2026.xlsx' },
        { user: 'Adarsh Admin', action: 'Changed Conf. Threshold', time: '3 hours ago', target: '80% → 85%' }
      ].map((log, i) => (
        <div key={i} style={{ padding: '16px 0', borderBottom: i < 3 ? '1px solid #f8fafc' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{log.user.split(' ').map(n => n[0]).join('')}</div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600 }}><span style={{ color: '#2563eb' }}>{log.user}</span> {log.action}</p>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Target: {log.target}</p>
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{log.time}</span>
        </div>
      ))}
    </div>
    <button style={{ width: '100%', padding: '12px', background: '#f8fafc', border: 'none', borderTop: '1px solid #f1f5f9', color: '#2563eb', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>View Full Audit Trail</button>
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([
    { role: 'Administrator', users: 2, perms: ['Dashboard', 'GL', 'Shipping', 'Training', 'Settings'], color: '#2563eb' },
    { role: 'Finance Manager', users: 5, perms: ['GL', 'Reports', 'Audit'], color: '#7c3aed' },
    { role: 'Shipping Coordinator', users: 12, perms: ['Shipping', 'Comparison'], color: '#059669' },
    { role: 'Training Admin', users: 3, perms: ['Training', 'Notifications'], color: '#dc2626' }
  ]);
  const [mappingRules, setMappingRules] = useState([
    { pattern: 'AWS *', account: '6100 · Software & Hosting', type: 'System Rule' },
    { pattern: 'Starbucks *', account: '6200 · Meals & Entertainment', type: 'Manual Rule' },
    { pattern: 'Rent *', account: '6300 · Rent & Lease', type: 'System Rule' }
  ]);

  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, payload: null });
  const [ruleForm, setRuleForm] = useState({ pattern: '', account: '' });
  const [permForm, setPermForm] = useState([]);

  const allPerms = ['Dashboard', 'GL', 'Shipping', 'Training', 'Reports', 'Notifications', 'Settings'];

  const openModal = (type, payload = null) => {
    setModalConfig({ isOpen: true, type, payload });
    if (type === 'ADD_RULE') {
      setRuleForm({ pattern: '', account: '' });
    } else if (type === 'EDIT_PERMS') {
      setPermForm(payload.perms);
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

  const togglePerm = (p) => {
    setPermForm(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const tabs = [
    { id: 'roles',    label: 'User Roles', icon: Users },
    { id: 'ai',       label: 'AI Configuration',    icon: Bot },
    { id: 'gl',       label: 'GL Mapping Rules',    icon: FileText },
    { id: 'smtp',     label: 'Email SMTP',          icon: Mail },
    { id: 'currency', label: 'Currency Settings',   icon: Coins },
    { id: 'audit',    label: 'Audit Logs',          icon: History },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'roles':    return <UserRoles roles={roles} openModal={openModal} />;
      case 'ai':       return <AIConfig />;
      case 'gl':       return <GLMapping rules={mappingRules} openModal={openModal} setRules={setMappingRules} />;
      case 'smtp':     return <SMTPSettings />;
      case 'currency': return <CurrencySettings />;
      case 'audit':    return <AuditLogs />;
      default:         return <UserRoles roles={roles} openModal={openModal} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Admin Settings</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Configure system parameters and manage user permissions.</p>
        </div>
        <button style={{ padding: '10px 20px', background: 'linear-gradient(to right, #1a56c4, #2563eb)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* Settings Navigation Bar (Top) */}
      <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0', width: 'fit-content', overflowX: 'auto' }} className="custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '10px', border: 'none',
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              background: activeTab === tab.id ? 'linear-gradient(to right, #1a56c4, #2563eb)' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              fontWeight: activeTab === tab.id ? 600 : 500,
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
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
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: modalConfig.type === 'ADD_RULE' ? '400px' : '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}
            >
              {/* Modal Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {modalConfig.type === 'ADD_RULE' ? <><Plus size={18} color="#2563eb" /> Add Mapping Rule</> : <><Shield size={18} color="#7c3aed" /> Edit {modalConfig.payload.role} Permissions</>}
                </h3>
                <button onClick={closeModal} style={{ background: '#e2e8f0', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                {modalConfig.type === 'ADD_RULE' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={S.label}>DESCRIPTION PATTERN</label>
                      <input 
                        type="text" value={ruleForm.pattern} onChange={e => setRuleForm({...ruleForm, pattern: e.target.value})}
                        placeholder="e.g. Netflix *"
                        style={{ ...S.input, background: '#fff' }} 
                      />
                    </div>
                    <div>
                      <label style={S.label}>GL ACCOUNT</label>
                      <input 
                        type="text" value={ruleForm.account} onChange={e => setRuleForm({...ruleForm, account: e.target.value})}
                        placeholder="e.g. 6400 · Subscriptions"
                        style={{ ...S.input, background: '#fff' }} 
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {allPerms.map(p => {
                      const isActive = permForm.includes(p);
                      return (
                        <button 
                          key={p} 
                          onClick={() => togglePerm(p)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '12px',
                            background: isActive ? '#f5f3ff' : '#fff',
                            border: `1px solid ${isActive ? '#7c3aed' : '#e2e8f0'}`,
                            borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                          }}
                        >
                          {isActive ? <CheckCircle2 size={16} color="#7c3aed" /> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #cbd5e1' }} />}
                          <span style={{ fontSize: '13px', fontWeight: 600, color: isActive ? '#7c3aed' : '#64748b' }}>{p}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={closeModal} style={{ padding: '9px 16px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Cancel</button>
                <button 
                  onClick={modalConfig.type === 'ADD_RULE' ? saveRule : savePerms}
                  style={{ padding: '9px 20px', background: 'linear-gradient(to right, #1a56c4, #2563eb)', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}
                >
                  Save Changes
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
