import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Search, AlertTriangle, BarChart3, Download, ChevronDown, ChevronRight, Sparkles, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th: { padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left' },
  td: { padding: '13px 16px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc' },
  badge: (c) => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: c + '18', color: c }),
};

const QUICK = ['Total expenses this month', 'Top 5 vendors by spend', 'Revenue vs budget comparison', 'Show overdue invoices', 'Profit margin Q1 2026'];

const MOCK_ANSWERS = {
  default: { type: 'summary', title: 'GL Query Result', data: [
    { label: 'Total Expenses (Apr 2026)', value: '$48,230', trend: 'up', pct: '+8.4%' },
    { label: 'Total Revenue (Apr 2026)',  value: '$72,450', trend: 'up', pct: '+12.1%' },
    { label: 'Net Profit',               value: '$24,220', trend: 'up', pct: '+18.3%' },
    { label: 'Pending Invoices',          value: '14',      trend: 'down', pct: '-2 vs last month' },
  ], table: [
    { account: '6100 · Software & Hosting', debit: '$3,820', credit: '$0',     bal: '-$3,820',  status: 'Expense' },
    { account: '6200 · Meals & Ent.',       debit: '$640',   credit: '$0',     bal: '-$640',    status: 'Expense' },
    { account: '6300 · Rent & Lease',       debit: '$5,000', credit: '$0',     bal: '-$5,000',  status: 'Expense' },
    { account: '4100 · Service Revenue',    debit: '$0',     credit: '$72,450',bal: '+$72,450', status: 'Revenue' },
    { account: '6600 · Professional Fees',  debit: '$2,500', credit: '$0',     bal: '-$2,500',  status: 'Expense' },
  ]},
};

const ANOMALIES = [
  { id: 1, type: 'Duplicate', desc: 'Amazon Web Services — INV-2024-001',  amt: '$1,240.50', confidence: 98, date: '2026-04-20', severity: 'High'   },
  { id: 2, type: 'Suspicious', desc: 'Unusual vendor: XYZ Consultants Ltd', amt: '$18,500.00', confidence: 85, date: '2026-04-18', severity: 'High'   },
  { id: 3, type: 'Duplicate', desc: 'WeWork Rent — WW-RENT-APR',           amt: '$5,000.00', confidence: 99, date: '2026-04-22', severity: 'High'   },
  { id: 4, type: 'Suspicious', desc: 'Round-number payment — $10,000 exact', amt: '$10,000.00', confidence: 72, date: '2026-04-15', severity: 'Medium' },
  { id: 5, type: 'Duplicate', desc: 'Starbucks — STB-9921',                amt: '$25.40',    confidence: 85, date: '2026-04-21', severity: 'Low'    },
];

const sevColor = { High: '#dc2626', Medium: '#f59e0b', Low: '#2563eb' };

const TABS = [
  { id: 'chat',    label: 'GL Chat',          icon: Bot },
  { id: 'results', label: 'Query Results',    icon: BarChart3 },
  { id: 'anomaly', label: 'Anomaly Detection', icon: AlertTriangle },
];

export default function GLChat() {
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I\'m your GL AI Assistant. Ask me anything about your ledger — expenses, revenue, anomalies, or account balances.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const [expanded, setExpanded] = useState({});
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput('');
    setMessages(p => [...p, { role: 'user', text: q }]);
    setLoading(true);
    setTimeout(() => {
      const result = MOCK_ANSWERS.default;
      setQueryResult(result);
      setMessages(p => [...p, { role: 'assistant', text: `Here's your GL summary for: **"${q}"**. I found **${result.table.length} accounts** with detailed breakdowns. Switch to **Query Results** tab to see the full drill-down.`, result: true }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>GL AI Bot · Smart Query</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Natural language GL queries, anomaly detection & instant ledger insights</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
          <Sparkles size={16} color="#2563eb" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af' }}>AI Powered</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ ...S.card, padding: '6px', display: 'flex', gap: '4px' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: tab === t.id ? 'linear-gradient(to right,#1a56c4,#2563eb)' : '#f8fafc', color: tab === t.id ? '#fff' : '#64748b', transition: 'all 0.2s' }}>
            <t.icon size={16} />{t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>

          {/* ── TAB 1: CHAT ── */}
          {tab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Quick prompts */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {QUICK.map(q => (
                  <button key={q} onClick={() => sendMessage(q)} style={{ padding: '7px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}>
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat window */}
              <div style={{ ...S.card, height: '440px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {messages.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '10px', alignItems: 'flex-start' }}>
                      {m.role === 'assistant' && (
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg,#1a56c4,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Bot size={16} color="#fff" />
                        </div>
                      )}
                      <div style={{ maxWidth: '72%', padding: '12px 16px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: m.role === 'user' ? 'linear-gradient(to right,#1a56c4,#2563eb)' : '#f8fafc', color: m.role === 'user' ? '#fff' : '#0f172a', fontSize: '13.5px', lineHeight: '1.6', fontWeight: 500, border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none' }}>
                        {m.text}
                        {m.result && (
                          <button onClick={() => setTab('results')} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', padding: '7px 14px', background: 'linear-gradient(to right,#059669,#10b981)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                            <Eye size={14} /> View Full Results
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg,#1a56c4,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={16} color="#fff" /></div>
                      <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '4px 16px 16px 16px', border: '1px solid #e2e8f0', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {[0,1,2].map(d => <span key={d} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2563eb', animation: `pulse 1s ${d*0.2}s infinite`, display: 'block' }} />)}
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      placeholder='Ask anything: "Show total expenses this month"'
                      style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#2563eb'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                  <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                    style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: input.trim() ? 'linear-gradient(to right,#1a56c4,#2563eb)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', flexShrink: 0, transition: 'all 0.2s', padding: 0 }}>
                    <Send size={18} color={input.trim() ? '#fff' : '#cbd5e1'} style={{ flexShrink: 0 }} />
                  </button>
                </div>
              </div>
              <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
            </div>
          )}

          {/* ── TAB 2: QUERY RESULTS ── */}
          {tab === 'results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {!queryResult ? (
                <div style={{ ...S.card, padding: '60px', textAlign: 'center' }}>
                  <BarChart3 size={40} color="#cbd5e1" style={{ margin: '0 auto 16px', display: 'block' }} />
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>No query yet</p>
                  <p style={{ fontSize: '13px', color: '#94a3b8' }}>Ask a question in the GL Chat tab to see results here.</p>
                  <button onClick={() => setTab('chat')} style={{ marginTop: '16px', padding: '10px 20px', background: 'linear-gradient(to right,#1a56c4,#2563eb)', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Go to Chat</button>
                </div>
              ) : (
                <>
                  {/* Summary KPI cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
                    {queryResult.data.map(d => (
                      <div key={d.label} style={{ ...S.card, padding: '18px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>{d.label}</p>
                        <p style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>{d.value}</p>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: d.trend === 'up' ? '#059669' : '#dc2626' }}>
                          {d.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{d.pct}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Ledger Table with drill-down */}
                  <div style={{ ...S.card, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Ledger Summary</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Click any row to drill down</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['Export PDF', 'Export Excel'].map(t => (
                          <button key={t} style={{ padding: '8px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Download size={13} />{t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr>{['GL Account', 'Debit', 'Credit', 'Balance', 'Type', ''].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {queryResult.table.map((row, i) => (
                          <>
                            <tr key={i} onClick={() => setExpanded(p => ({ ...p, [i]: !p[i] }))}
                              style={{ background: i % 2 === 0 ? '#fff' : '#fafbff', cursor: 'pointer' }}>
                              <td style={{ ...S.td, fontWeight: 600, color: '#0f172a' }}>{row.account}</td>
                              <td style={{ ...S.td, color: '#dc2626', fontWeight: 600 }}>{row.debit !== '$0' ? row.debit : '—'}</td>
                              <td style={{ ...S.td, color: '#059669', fontWeight: 600 }}>{row.credit !== '$0' ? row.credit : '—'}</td>
                              <td style={{ ...S.td, fontWeight: 700, color: row.bal.startsWith('+') ? '#059669' : '#dc2626' }}>{row.bal}</td>
                              <td style={S.td}><span style={S.badge(row.status === 'Revenue' ? '#059669' : '#2563eb')}>{row.status}</span></td>
                              <td style={S.td}>{expanded[i] ? <ChevronDown size={16} color="#94a3b8" /> : <ChevronRight size={16} color="#94a3b8" />}</td>
                            </tr>
                            {expanded[i] && (
                              <tr key={`exp-${i}`}>
                                <td colSpan={6} style={{ padding: '0 0 0 24px', background: '#f8faff' }}>
                                  <div style={{ padding: '14px 16px', borderLeft: '3px solid #2563eb' }}>
                                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Transaction Breakdown</p>
                                    {[1,2,3].map(n => (
                                      <div key={n} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e2e8f0', fontSize: '12.5px' }}>
                                        <span style={{ color: '#0f172a', fontWeight: 500 }}>2026-04-{(n*5+10).toString().padStart(2,'0')} · Sub-entry #{n}</span>
                                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{row.debit !== '$0' ? `-$${(Math.random()*1000+100).toFixed(2)}` : `+$${(Math.random()*5000+1000).toFixed(2)}`}</span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── TAB 3: ANOMALY DETECTION ── */}
          {tab === 'anomaly' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                {[
                  { label: 'Duplicate Entries',       val: ANOMALIES.filter(a => a.type === 'Duplicate').length,   col: '#dc2626', icon: '🔄' },
                  { label: 'Suspicious Transactions', val: ANOMALIES.filter(a => a.type === 'Suspicious').length,  col: '#f59e0b', icon: '⚠️' },
                  { label: 'Data Points Scanned',     val: '2,840',                                                 col: '#2563eb', icon: '🔍' },
                ].map(s => (
                  <div key={s.label} style={{ ...S.card, padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '32px' }}>{s.icon}</div>
                    <div>
                      <p style={{ fontSize: '28px', fontWeight: 800, color: s.col }}>{s.val}</p>
                      <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Anomaly list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Detected Anomalies</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['All', 'Duplicate', 'Suspicious'].map(f => (
                      <button key={f} style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: '#fff', color: '#64748b', cursor: 'pointer' }}>{f}</button>
                    ))}
                  </div>
                </div>
                {ANOMALIES.map((a, i) => (
                  <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ ...S.card, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '18px', borderLeft: `4px solid ${sevColor[a.severity]}` }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: a.type === 'Duplicate' ? '#fef2f2' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <AlertTriangle size={20} color={a.type === 'Duplicate' ? '#dc2626' : '#f59e0b'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{a.desc}</span>
                        <span style={S.badge(sevColor[a.severity])}>{a.severity}</span>
                        <span style={S.badge(a.type === 'Duplicate' ? '#dc2626' : '#f59e0b')}>{a.type}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>Amount: <strong>{a.amt}</strong> · Date: {a.date} · Confidence: <strong style={{ color: sevColor[a.severity] }}>{a.confidence}%</strong></p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ padding: '7px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Dismiss</button>
                      <button style={{ padding: '7px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}>Review</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
