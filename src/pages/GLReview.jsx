import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Search, 
  Send, 
  Bot, 
  Loader2,
  AlertCircle,
  Filter,
  Check,
  X,
  Edit2
} from 'lucide-react';



const INITIAL_TRANSACTIONS = [
  { id: 1, date: '2026-04-20', desc: 'Amazon Web Services — Cloud Hosting', amt: '-$1,240.50', gl: '6100 · Software & Hosting', conf: 98, status: 'pending' },
  { id: 2, date: '2026-04-21', desc: 'Starbucks — Client Meeting', amt: '-$25.40', gl: '6200 · Meals & Entertainment', conf: 85, status: 'pending' },
  { id: 3, date: '2026-04-22', desc: 'Monthly Office Rent — April', amt: '-$5,000.00', gl: '6300 · Rent & Lease', conf: 99, status: 'pending' },
  { id: 4, date: '2026-04-22', desc: 'Miscellaneous Office Supplies', amt: '-$145.20', gl: '6400 · Office Supplies', conf: 62, status: 'pending', warning: 'Low confidence' },
  { id: 5, date: '2026-04-23', desc: 'Payment from Global Client X', amt: '+$15,000.00', gl: '4100 · Service Revenue', conf: 95, status: 'pending' },
  { id: 6, date: '2026-04-24', desc: 'Uber — Transport for Sales Team', amt: '-$85.00', gl: '6500 · Travel & Transport', conf: 88, status: 'pending' },
  { id: 7, date: '2026-04-24', desc: 'Adobe Creative Cloud Subscription', amt: '-$82.99', gl: '6100 · Software & Hosting', conf: 99, status: 'pending' },
  { id: 8, date: '2026-04-25', desc: 'Consulting Fee - Tech Solutions Inc.', amt: '-$2,500.00', gl: '6600 · Professional Fees', conf: 75, status: 'pending', warning: 'Check vendor map' },
  { id: 9, date: '2026-04-26', desc: 'Refund from Delta Airlines', amt: '+$450.00', gl: '6500 · Travel & Transport', conf: 92, status: 'pending' },
  { id: 10, date: '2026-04-27', desc: 'WeWork Office Expansion Deposit', amt: '-$1,200.00', gl: '6300 · Rent & Lease', conf: 96, status: 'pending' },
];

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th: { padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left' },
  td: { padding: '16px 20px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc' },
};

const GLReview = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const matchSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        t.gl.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        t.amt.includes(searchTerm);
    const matchDate = dateFilter ? t.date === dateFilter : true;
    return matchSearch && matchDate;
  });

  const handleAction = (id, newStatus) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleBulkApprove = () => {
    setTransactions([]);
  };

  const handlePostToERP = () => {
    if (transactions.length > 0) return alert('Please review all transactions before posting.');
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      setPostSuccess(true);
      setTimeout(() => setPostSuccess(false), 3000);
    }, 2000);
  };

  const pendingCount = transactions.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              width: '40px', height: '40px', borderRadius: '10px', background: '#fff', 
              border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', cursor: 'pointer', padding: 0
            }}
          >
            <ChevronLeft size={20} color="#000000" style={{ minWidth: '20px' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Transaction Review</h1>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Review AI-suggested GL mappings · {pendingCount} pending</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Filter size={16} color="#64748b" style={{ position: 'absolute', left: '12px', pointerEvents: 'none', zIndex: 1 }} />
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              title="Filter by date"
              style={{ 
                padding: '9px 12px 9px 36px', background: '#fff', border: '1px solid #e2e8f0', 
                borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#64748b',
                cursor: 'pointer', outline: 'none', fontFamily: 'inherit',
                width: '140px'
              }}
            />
            {dateFilter && (
              <button onClick={() => setDateFilter('')} style={{ position: 'absolute', right: '-8px', top: '-8px', padding: '4px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#dc2626' }}>
                <X size={12} />
              </button>
            )}
          </div>
          <button 
            onClick={handleBulkApprove}
            disabled={pendingCount === 0}
            style={{ 
              padding: '9px 20px', background: 'linear-gradient(to right, #1a56c4, #2563eb)', 
              border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, 
              color: 'white', cursor: pendingCount === 0 ? 'not-allowed' : 'pointer', 
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              opacity: pendingCount === 0 ? 0.6 : 1
            }}
          >
            <CheckCircle2 size={16} color="#ffffff" /> Bulk Approve
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { label: 'Total Transactions', val: INITIAL_TRANSACTIONS.length, col: '#2563eb' },
          { label: 'Pending Review',    val: pendingCount, col: '#d97706' },
          { label: 'Approved',          val: INITIAL_TRANSACTIONS.length - pendingCount, col: '#059669' },
          { label: 'Rejected',          val: '0', col: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{ ...S.card, padding: '16px 20px' }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</p>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: s.col }}>{s.val}</h3>
          </div>
        ))}
      </div>

      {/* Main Table Area */}
      <div style={{ ...S.card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Filter by description, amount or GL account..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', 
                border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' 
              }} 
            />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Date', 'Description', 'Amount', 'AI Suggestion', 'Confidence', 'Actions'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredTransactions.map((t) => (
                  <motion.tr 
                    key={t.id}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{ background: '#fff' }}
                  >
                    <td style={{ ...S.td, whiteSpace: 'nowrap', color: '#94a3b8' }}>{t.date}</td>
                    <td style={S.td}>
                      <p style={{ fontWeight: 600, color: '#0f172a' }}>{t.desc}</p>
                      {t.warning && <p style={{ fontSize: '10px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><AlertCircle size={10} color="#dc2626" /> {t.warning} — manual review advised</p>}
                    </td>
                    <td style={{ ...S.td, fontWeight: 700, color: t.amt.startsWith('+') ? '#059669' : '#0f172a' }}>{t.amt}</td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: 600 }}>
                        <Bot size={14} color="#2563eb" /> {t.gl}
                      </div>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '4px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', minWidth: '60px' }}>
                          <div style={{ height: '100%', width: `${t.conf}%`, background: t.conf > 90 ? '#059669' : t.conf > 70 ? '#d97706' : '#dc2626' }} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: t.conf > 90 ? '#059669' : t.conf > 70 ? '#d97706' : '#dc2626' }}>{t.conf}%</span>
                      </div>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setEditingTransaction(t)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                          <Edit2 size={14} color="#64748b" strokeWidth={2.5} />
                        </button>
                        <button onClick={() => handleAction(t.id, 'rejected')} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                          <X size={14} color="#dc2626" strokeWidth={3} />
                        </button>
                        <button onClick={() => handleAction(t.id, 'approved')} style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                          <Check size={14} color="#059669" strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Search size={24} color="#94a3b8" />
                    </div>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>No matching transactions</p>
                    <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Try adjusting your search or date filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post to ERP Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button 
          onClick={handlePostToERP}
          disabled={isPosting || postSuccess}
          style={{ 
            padding: '12px 32px', 
            background: postSuccess ? '#059669' : 'linear-gradient(to right, #0f172a, #1e293b)', 
            border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, 
            color: 'white', cursor: (isPosting || postSuccess) ? 'not-allowed' : 'pointer', 
            display: 'flex', alignItems: 'center', gap: '10px',
            boxShadow: '0 4px 12px rgba(15,23,42,0.3)',
            transition: 'all 0.2s'
          }}
        >
          {isPosting ? <Loader2 size={18} className="animate-spin" color="#ffffff" /> : postSuccess ? <CheckCircle2 size={18} color="#ffffff" /> : <Send size={18} color="#ffffff" />}
          {isPosting ? 'Posting to ERP...' : postSuccess ? 'Successfully Posted!' : 'Post to ERP'}
        </button>
      </div>

      {/* Edit Modal Overlay */}
      <AnimatePresence>
        {editingTransaction && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Edit GL Mapping</h3>
                <button onClick={() => setEditingTransaction(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={20} color="#94a3b8" />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Transaction Description</label>
                  <input type="text" value={editingTransaction.desc} readOnly style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '13px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Amount</label>
                  <input type="text" value={editingTransaction.amt} readOnly style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '13px', outline: 'none', fontWeight: 700 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>AI Suggested GL Account</label>
                  <select style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #2563eb', background: '#fff', color: '#0f172a', fontSize: '13px', outline: 'none', fontWeight: 600, boxShadow: '0 0 0 3px rgba(37,99,235,0.1)' }}>
                    <option value={editingTransaction.gl}>{editingTransaction.gl}</option>
                    <option value="6100">6100 · Software & Hosting</option>
                    <option value="6200">6200 · Meals & Entertainment</option>
                    <option value="6300">6300 · Rent & Lease</option>
                    <option value="6400">6400 · Office Supplies</option>
                    <option value="6500">6500 · Travel & Transport</option>
                    <option value="4100">4100 · Service Revenue</option>
                  </select>
                  {editingTransaction.warning && <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} color="#dc2626" /> {editingTransaction.warning}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button onClick={() => setEditingTransaction(null)} style={{ padding: '10px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => setEditingTransaction(null)} style={{ padding: '10px 20px', background: 'linear-gradient(to right, #1a56c4, #2563eb)', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Posting Result Modal */}
      <AnimatePresence>
        {postSuccess && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '520px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={32} color="#059669" />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Posting Successful</h2>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>All transactions have been synchronized with the ERP system.</p>
              
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '24px' }}>
                <p style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Sync Log</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { event: 'API Authentication', status: 'Success' },
                    { event: 'Batch Validation', status: 'Success' },
                    { event: 'GL Account Mapping', status: 'Success' },
                    { event: 'ERP Entry Creation', status: 'Success (Ref: BATCH-882)', time: '0.4s' },
                  ].map((log, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#475569', fontWeight: 500 }}>{log.event}</span>
                      <span style={{ color: '#059669', fontWeight: 700 }}>{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => { setPostSuccess(false); navigate('/gl/upload'); }}
                style={{ width: '100%', padding: '14px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
              >
                Back to Uploads
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GLReview;
