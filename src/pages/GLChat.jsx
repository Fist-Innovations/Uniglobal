import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, PieChart, Download, Trash2, AlertCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INIT = [{
  id: 1, type: 'bot',
  content: 'Hello! I\'m your GL Assistant powered by AI. I can help you with financial queries, expense summaries, and anomaly detection. What would you like to know today?',
  suggestions: ['Total expenses this month', 'Revenue trends Q1', 'Any suspicious transactions?'],
}];

const RESPONSES = {
  expense:    { content: "Total expenses for April 2026 are $14,250.60. The largest category is 'Software & Hosting' at $4,200. Would you like a detailed breakdown?", chart: true },
  suspicious: { content: "I've detected 3 suspicious transactions that might be duplicates or incorrectly categorized. I recommend reviewing the Anomaly Detection panel.", alert: true },
};

const AnomalyPanel = ({ onClose }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
    style={{ width: '380px', background: '#fff', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
    <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertCircle size={18} color="#dc2626" /> Anomaly Detection
      </h3>
      <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
    </div>
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[
        { title: 'Duplicate Invoice', desc: 'Vendor: Amazon Web Services', amt: '$1,240.50', ref: 'INV-2024-001', conf: 98 },
        { title: 'Suspicious Amount', desc: 'Uber - Unusual transport fee', amt: '$840.00', ref: 'UB-9902', conf: 76 },
        { title: 'Category Mismatch', desc: 'Starbucks - Logged as Rent', amt: '$42.10', ref: 'STB-112', conf: 92 },
      ].map((a, i) => (
        <div key={i} style={{ padding: '14px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>{a.title}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>{a.conf}% Match</span>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{a.desc}</p>
          <p style={{ fontSize: '12px', color: '#64748b' }}>{a.ref} · {a.amt}</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button style={{ flex: 1, padding: '6px', background: '#fff', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#dc2626', cursor: 'pointer' }}>Void Entry</button>
            <button style={{ flex: 1, padding: '6px', background: '#dc2626', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Reclassify</button>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const LedgerResult = ({ onClose }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
    style={{ width: '420px', background: '#fff', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
    <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <PieChart size={18} color="#2563eb" /> Ledger Summary
      </h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ padding: '6px', borderRadius: '6px', background: '#eff6ff', border: 'none', cursor: 'pointer' }}><Download size={14} color="#2563eb" /></button>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
      </div>
    </div>
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Total Monthly Expenses</p>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>$14,250.60</h2>
        <p style={{ fontSize: '12px', color: '#059669', marginTop: '6px', fontWeight: 600 }}>↓ 4.2% from last month</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { category: '6100 · Software', amt: '$4,200', pct: 40, col: '#2563eb' },
          { category: '6300 · Rent', amt: '$5,000', pct: 35, col: '#7c3aed' },
          { category: '6200 · Meals', amt: '$1,250', pct: 15, col: '#059669' },
          { category: '6500 · Travel', amt: '$3,800', pct: 10, col: '#d97706' },
        ].map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569' }}>{item.category}</span>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{item.amt}</span>
            </div>
            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${item.pct}%`, background: item.col }} />
            </div>
          </div>
        ))}
      </div>
      <button style={{ width: '100%', marginTop: '24px', padding: '10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        Drill Down Analysis <ChevronRight size={14} />
      </button>
    </div>
  </motion.div>
);

const GLChat = () => {
  const [messages, setMessages] = useState(INIT);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [activePanel, setActivePanel] = useState(null); // 'ledger' or 'anomaly'
  const scrollRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, typing]);

  const send = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages(p => [...p, { id: Date.now(), type: 'user', content: msg }]);
    setInput(''); setTyping(true);
    setTimeout(() => {
      const key = msg.toLowerCase().includes('expense') ? 'expense' : msg.toLowerCase().includes('suspicious') ? 'suspicious' : null;
      const res = key ? RESPONSES[key] : { content: `I've processed your query: "${msg}". At this POC stage, I can provide simulated insights for expenses, revenue, and anomalies.` };
      setMessages(p => [...p, { id: Date.now() + 1, type: 'bot', ...res }]);
      setTyping(false);
      if (key === 'expense') setTimeout(() => setActivePanel('ledger'), 500);
      if (key === 'suspicious') setTimeout(() => setActivePanel('anomaly'), 500);
    }, 1400);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        {/* Chat Header */}
        <div style={{ padding: '18px 24px', background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #1a56c4, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(37,99,235,0.3)' }}>
              <Sparkles size={20} style={{ color: 'white' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>GL Smart Query Bot</p>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>AI-powered financial intelligence · Online</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setActivePanel('anomaly')} style={{ padding: '6px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <AlertCircle size={14} /> Anomalies
            </button>
            <button onClick={() => setMessages(INIT)} style={{ width: '34px', height: '34px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', gap: '10px', maxWidth: '78%', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: msg.type === 'user' ? 'linear-gradient(135deg,#7c3aed,#8b5cf6)' : 'linear-gradient(135deg,#1a56c4,#2563eb)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                    {msg.type === 'user' ? <User size={16} style={{ color: '#fff' }} /> : <Bot size={16} style={{ color: '#fff' }} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      padding: '13px 16px', borderRadius: msg.type === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      background: msg.type === 'user' ? 'linear-gradient(135deg,#1a56c4,#2563eb)' : '#ffffff',
                      color: msg.type === 'user' ? '#fff' : '#0f172a',
                      fontSize: '13.5px', lineHeight: 1.6,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: msg.type === 'bot' ? '1px solid #f1f5f9' : 'none',
                    }}>
                      {msg.content}
                    </div>
                    {msg.suggestions && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {msg.suggestions.map((s, i) => (
                          <button key={i} onClick={() => send(s)} style={{ padding: '5px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '11.5px', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {typing && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg,#1a56c4,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} style={{ color: '#fff' }} />
              </div>
              <div style={{ background: '#fff', border: '1px solid #f1f5f9', padding: '14px 18px', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <motion.span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb', display: 'block' }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1, delay: d }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything about your general ledger…"
              style={{ width: '100%', boxSizing: 'border-box', padding: '14px 56px 14px 20px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '13.5px', color: '#0f172a', outline: 'none', fontFamily: 'inherit' }}
            />
            <button onClick={() => send()} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#1a56c4,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Send size={15} style={{ color: '#fff' }} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activePanel === 'ledger' && <LedgerResult onClose={() => setActivePanel(null)} />}
        {activePanel === 'anomaly' && <AnomalyPanel onClose={() => setActivePanel(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default GLChat;

