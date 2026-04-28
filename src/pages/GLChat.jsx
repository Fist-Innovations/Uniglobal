import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, AlertTriangle, BarChart3, Copy, TrendingUp, TrendingDown, ChevronDown, ChevronRight, Download, X, Search, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GLDuplicate from './GLDuplicate';

const QUICK = [
  'Total expenses this month',
  'Top 5 vendors by spend',
  'Revenue vs budget Q1 2026',
  'Show overdue invoices',
  'Profit margin analysis',
];

const RESULT = {
  data:[
    {label:'Total Expenses',value:'$48,230',trend:'up',pct:'+8.4%'},
    {label:'Total Revenue',value:'$72,450',trend:'up',pct:'+12.1%'},
    {label:'Net Profit',value:'$24,220',trend:'up',pct:'+18.3%'},
    {label:'Pending Invoices',value:'14',trend:'down',pct:'-2 vs LM'},
  ],
  table:[
    {account:'6100 · Software & Hosting',debit:'$3,820',credit:'$0',bal:'-$3,820',status:'Expense'},
    {account:'6200 · Meals & Ent.',debit:'$640',credit:'$0',bal:'-$640',status:'Expense'},
    {account:'6300 · Rent & Lease',debit:'$5,000',credit:'$0',bal:'-$5,000',status:'Expense'},
    {account:'4100 · Service Revenue',debit:'$0',credit:'$72,450',bal:'+$72,450',status:'Revenue'},
    {account:'6600 · Professional Fees',debit:'$2,500',credit:'$0',bal:'-$2,500',status:'Expense'},
  ]
};

const DUMMY_HISTORY = [
  {role:'assistant',text:"Hello! I'm your GL AI Assistant. Ask me anything about your ledger — expenses, revenue, anomalies, or account balances."},
  {role:'user',text:'Show me total expenses for this month'},
  {role:'assistant',text:"Here's your GL summary for April 2026. Total expenses stand at $48,230 — up 8.4% vs last month. Software & Hosting is the top category at $3,820. Switch to Query Results for the full breakdown.",hasResult:true},
  {role:'user',text:'Are there any duplicate entries I should know about?'},
  {role:'assistant',text:"Yes — I detected 3 high-confidence duplicates. Most critical: Amazon Web Services INV-2024-001 ($1,240.50) with 98% confidence and WeWork Rent ($5,000.00) at 99% confidence. Review them in the Anomaly Detection tab."},
];

const INIT_ANOMALIES = [
  {id:1,type:'Duplicate',desc:'Amazon Web Services — INV-2024-001',amt:'$1,240.50',conf:98,date:'2026-04-20',sev:'High'},
  {id:2,type:'Suspicious',desc:'Unusual vendor: XYZ Consultants Ltd',amt:'$18,500.00',conf:85,date:'2026-04-18',sev:'High'},
  {id:3,type:'Duplicate',desc:'WeWork Rent — WW-RENT-APR',amt:'$5,000.00',conf:99,date:'2026-04-22',sev:'High'},
  {id:4,type:'Suspicious',desc:'Round-number payment — $10,000 exact',amt:'$10,000.00',conf:72,date:'2026-04-15',sev:'Medium'},
];

const SEV = {High:'#ef4444',Medium:'#f59e0b',Low:'#3b82f6'};
const TABS = [
  {id:'chat',label:'GL Chat',icon:Bot},
  {id:'results',label:'Query Results',icon:BarChart3},
  {id:'anomaly',label:'Anomaly Detection',icon:AlertTriangle},
  {id:'duplicate',label:'Duplicate Detection',icon:Copy},
];

const CHAT_SESSIONS = [
  { id:1, title:'Total expenses this month', preview:'$48,230 total — up 8.4%', time:'2m ago', active:true },
  { id:2, title:'Duplicate entries review', preview:'3 high-confidence duplicates found', time:'1h ago', active:false },
  { id:3, title:'Revenue vs budget Q1', preview:'Revenue at $72,450, net +18.3%', time:'3h ago', active:false },
  { id:4, title:'Top vendors by spend', preview:'Amazon, WeWork, Adobe top 3', time:'Yesterday', active:false },
  { id:5, title:'Overdue invoice report', preview:'14 invoices pending clearance', time:'Yesterday', active:false },
  { id:6, title:'Profit margin analysis', preview:'Net margin at 33.4% for April', time:'Apr 26', active:false },
  { id:7, title:'GL account reconciliation', preview:'5 unreconciled entries detected', time:'Apr 25', active:false },
  { id:8, title:'Shipping cost variance', preview:'Variance > 15% in logistics dept', time:'Apr 24', active:false },
];

const card = {background:'#fff',borderRadius:'16px',border:'1px solid #e2e8f0',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'};
const th = {padding:'11px 16px',fontSize:'10.5px',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.7px',background:'#f8fafc',textAlign:'left'};
const td = {padding:'13px 16px',fontSize:'13px',borderBottom:'1px solid #f8fafc'};

export default function GLChat() {
  const [tab,setTab] = useState('chat');
  const [msgs,setMsgs] = useState(DUMMY_HISTORY);
  const [input,setInput] = useState('');
  const [loading,setLoading] = useState(false);
  const [result,setResult] = useState(RESULT);
  const [expanded,setExpanded] = useState({});
  const [anomalies,setAnomalies] = useState(INIT_ANOMALIES);
  const [activeSession,setActiveSession] = useState(1);
  const [sessions,setSessions] = useState(CHAT_SESSIONS);
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); },[msgs]);

  const send = (text) => {
    const q = text||input.trim(); if(!q) return;
    setInput(''); setMsgs(p=>[...p,{role:'user',text:q}]); setLoading(true);
    setTimeout(()=>{
      setResult(RESULT);
      setMsgs(p=>[...p,{role:'assistant',text:`Here's your GL summary for **"${q}"**. Found ${RESULT.table.length} accounts with detailed breakdowns. Switch to Query Results for the full analysis.`,hasResult:true}]);
      setLoading(false);
    },1400);
  };

  const dl = (name,content) => {
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([content])); a.download=name; a.click();
  };

  const startNewChat = () => {
    const newSession = { id: Date.now(), title: 'New conversation', preview: 'Start a new GL query...', time: 'Just now', active: true };
    setSessions(p => [newSession, ...p.map(s => ({...s, active: false}))]);
    setActiveSession(newSession.id);
    setMsgs([{role:'assistant',text:"Hello! I'm your GL AI Assistant. Ask me anything about your ledger."}]);
    setTab('chat');
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'16px',height:'calc(100vh - 120px)'}}>
      <style>{`@keyframes dot{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>

      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:'22px',fontWeight:800,color:'#0f172a',letterSpacing:'-.5px'}}>GL AI Bot</h1>
          <p style={{fontSize:'13px',color:'#94a3b8',marginTop:'2px'}}>Natural language queries, anomaly detection & ledger insights</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 16px',background:'#f0f5ff',borderRadius:'12px',border:'1px solid #dbeafe'}}>
          <Sparkles size={15} color="#1d4ed8"/>
          <span style={{fontSize:'12.5px',fontWeight:700,color:'#1d4ed8'}}>AI Powered</span>
          <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#22c55e',display:'inline-block',marginLeft:'4px'}}/>
        </div>
      </div>

      {/* Main two-panel layout */}
      <div style={{flex:1,display:'flex',gap:'16px',minHeight:0}}>

        {/* ── LEFT SIDEBAR: Chat History ── */}
        <div style={{width:'240px',flexShrink:0,...card,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          {/* New Chat button */}
          <div style={{padding:'14px 12px',borderBottom:'1px solid #f1f5f9'}}>
            <button onClick={startNewChat} style={{width:'100%',padding:'10px',background:'#1d4ed8',border:'none',borderRadius:'10px',fontSize:'13px',fontWeight:700,color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',boxShadow:'0 4px 12px rgba(29,78,216,.25)'}}>
              <Bot size={15}/> New Chat
            </button>
          </div>
          {/* Sessions list */}
          <div style={{flex:1,overflowY:'auto',padding:'8px'}}>
            {[{label:'Today',items:sessions.filter((_,i)=>i<5)},{label:'Earlier',items:sessions.filter((_,i)=>i>=5)}].map(group=>(
              <div key={group.label}>
                <p style={{fontSize:'10px',fontWeight:700,color:'#cbd5e1',textTransform:'uppercase',letterSpacing:'1px',padding:'10px 8px 6px'}}>{group.label}</p>
                {group.items.map(s=>(
                  <button key={s.id} onClick={()=>setActiveSession(s.id)}
                    style={{width:'100%',padding:'10px 10px',borderRadius:'10px',border:'none',cursor:'pointer',background:activeSession===s.id?'#eff6ff':'transparent',textAlign:'left',marginBottom:'2px',transition:'background .15s'}}
                    onMouseEnter={e=>{if(activeSession!==s.id)e.currentTarget.style.background='#f8fafc';}}
                    onMouseLeave={e=>{if(activeSession!==s.id)e.currentTarget.style.background='transparent';}}>
                    <p style={{fontSize:'12.5px',fontWeight:600,color:activeSession===s.id?'#1d4ed8':'#0f172a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:'2px'}}>{s.title}</p>
                    <p style={{fontSize:'11px',color:'#94a3b8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.preview}</p>
                    <p style={{fontSize:'10px',color:'#cbd5e1',marginTop:'3px'}}>{s.time}</p>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* AI Model / Status Footer */}
          <div style={{ padding: '16px 12px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} color="#1d4ed8" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Model Status</span>
            </div>
            <div style={{ padding: '8px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>GL-Finance v4.2</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>System Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:'14px',minWidth:0}}>
          {/* Tab Bar */}
          <div style={{...card,padding:'5px',display:'flex',gap:'4px',flexShrink:0}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'7px',padding:'10px',borderRadius:'10px',border:'none',cursor:'pointer',fontSize:'12.5px',fontWeight:600,transition:'all .2s',background:tab===t.id?'#1d4ed8':'transparent',color:tab===t.id?'#fff':'#64748b',boxShadow:tab===t.id?'0 4px 12px rgba(29,78,216,.25)':'none'}}>
                <t.icon size={15}/>{t.label}
              </button>
            ))}
          </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.15}} style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>

          {/* ── CHAT TAB ── */}
          {tab==='chat' && (
            <div style={{flex:1,display:'flex',flexDirection:'column',...card,overflow:'hidden'}}>
              {/* Chat header */}
              <div style={{padding:'16px 20px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:'12px',flexShrink:0}}>
                <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#1d4ed8,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Bot size={18} color="#fff"/>
                </div>
                <div>
                  <p style={{fontSize:'14px',fontWeight:700,color:'#0f172a'}}>UNIGLOBAL Finance GPT</p>
                  <p style={{fontSize:'11px',color:'#22c55e',fontWeight:600}}>● Online · GL Intelligence v2.1</p>
                </div>
              </div>

              {/* Messages */}
              <div style={{flex:1,overflowY:'auto',padding:'20px',display:'flex',flexDirection:'column',gap:'16px'}}>
                {msgs.map((m,i)=>(
                  <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i<DUMMY_HISTORY.length?0:0}}
                    style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',gap:'10px',alignItems:'flex-start'}}>
                    {m.role==='assistant' && (
                      <div style={{width:'32px',height:'32px',borderRadius:'9px',background:'linear-gradient(135deg,#1d4ed8,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <Bot size={15} color="#fff"/>
                      </div>
                    )}
                    <div style={{maxWidth:'68%',padding:'12px 15px',borderRadius:m.role==='user'?'16px 4px 16px 16px':'4px 16px 16px 16px',background:m.role==='user'?'#1d4ed8':'#f8fafc',color:m.role==='user'?'#fff':'#0f172a',fontSize:'13.5px',lineHeight:'1.65',border:m.role==='assistant'?'1px solid #e2e8f0':'none',fontWeight:450}}>
                      {m.text}
                      {m.hasResult && (
                        <button onClick={()=>setTab('results')} style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'10px',padding:'7px 14px',background:'#1d4ed8',border:'none',borderRadius:'8px',color:'#fff',fontSize:'12px',fontWeight:700,cursor:'pointer'}}>
                          <BarChart3 size={13}/> View Full Results
                        </button>
                      )}
                    </div>
                    {m.role==='user' && (
                      <div style={{width:'32px',height:'32px',borderRadius:'9px',background:'#1d4ed8',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'11px',fontWeight:800,color:'#fff'}}>AA</div>
                    )}
                  </motion.div>
                ))}
                {loading && (
                  <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
                    <div style={{width:'32px',height:'32px',borderRadius:'9px',background:'linear-gradient(135deg,#1d4ed8,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center'}}><Bot size={15} color="#fff"/></div>
                    <div style={{padding:'12px 15px',background:'#f8fafc',borderRadius:'4px 16px 16px 16px',border:'1px solid #e2e8f0',display:'flex',gap:'5px',alignItems:'center'}}>
                      {[0,1,2].map(d=><span key={d} style={{width:'7px',height:'7px',borderRadius:'50%',background:'#1d4ed8',animation:`dot 1s ${d*.2}s infinite`,display:'block'}}/>)}
                    </div>
                  </div>
                )}
                <div ref={endRef}/>
              </div>

              {/* Quick Queries at Bottom */}
              <div style={{padding:'12px 20px',borderTop:'1px solid #f1f5f9',background:'#fafbff',flexShrink:0}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'10px'}}>
                  <Zap size={13} color="#1d4ed8"/>
                  <span style={{fontSize:'11px',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.8px'}}>Quick Queries</span>
                </div>
                <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'12px'}}>
                  {QUICK.map(q=>(
                    <button key={q} onClick={()=>send(q)}
                      style={{padding:'6px 12px',background:'#fff',border:'1px solid #e2e8f0',borderRadius:'20px',fontSize:'11.5px',fontWeight:600,color:'#475569',cursor:'pointer',transition:'all .15s'}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='#1d4ed8';e.currentTarget.style.color='#1d4ed8';e.currentTarget.style.background='#f0f5ff';}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='#e2e8f0';e.currentTarget.style.color='#475569';e.currentTarget.style.background='#fff';}}>
                      {q}
                    </button>
                  ))}
                </div>
                {/* Input */}
                <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
                  <div style={{position:'relative',flex:1}}>
                    <Search size={15} color="#94a3b8" style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)'}}/>
                    <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
                      placeholder='Ask anything about your GL...'
                      style={{width:'100%',padding:'12px 14px 12px 42px',border:'1.5px solid #e2e8f0',borderRadius:'12px',fontSize:'13px',outline:'none',background:'#fff',boxSizing:'border-box',transition:'border-color .2s'}}
                      onFocus={e=>e.target.style.borderColor='#1d4ed8'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
                  </div>
                  <button onClick={()=>send()} disabled={!input.trim()||loading}
                    style={{width:'46px',height:'46px',borderRadius:'12px',border:'none',background:input.trim()?'#1d4ed8':'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',cursor:input.trim()?'pointer':'not-allowed',flexShrink:0,padding:0,boxShadow:input.trim()?'0 4px 12px rgba(29,78,216,.3)':'none'}}>
                    <Send size={18} color={input.trim()?'#fff':'#cbd5e1'}/>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── RESULTS TAB ── */}
          {tab==='results' && (
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:'16px',overflowY:'auto'}}>
              {!result ? (
                <div style={{...card,padding:'60px',textAlign:'center'}}>
                  <BarChart3 size={40} color="#e2e8f0" style={{margin:'0 auto 14px',display:'block'}}/>
                  <p style={{fontSize:'16px',fontWeight:700,color:'#0f172a'}}>No query results yet</p>
                  <p style={{fontSize:'13px',color:'#94a3b8',marginTop:'4px'}}>Ask something in the GL Chat tab first</p>
                  <button onClick={()=>setTab('chat')} style={{marginTop:'16px',padding:'10px 22px',background:'#1d4ed8',border:'none',borderRadius:'10px',fontSize:'13px',fontWeight:700,color:'#fff',cursor:'pointer'}}>Go to Chat</button>
                </div>
              ):(
                <>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'14px'}}>
                    {result.data.map(d=>(
                      <div key={d.label} style={{...card,padding:'18px'}}>
                        <p style={{fontSize:'10px',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.6px',marginBottom:'8px'}}>{d.label}</p>
                        <p style={{fontSize:'24px',fontWeight:800,color:'#0f172a',letterSpacing:'-.5px'}}>{d.value}</p>
                        <span style={{display:'inline-flex',alignItems:'center',gap:'4px',fontSize:'11px',fontWeight:700,color:d.trend==='up'?'#16a34a':'#dc2626',marginTop:'5px'}}>
                          {d.trend==='up'?<TrendingUp size={12}/>:<TrendingDown size={12}/>}{d.pct}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{...card,overflow:'hidden'}}>
                    <div style={{padding:'16px 20px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div><p style={{fontSize:'15px',fontWeight:700,color:'#0f172a'}}>Ledger Summary</p><p style={{fontSize:'12px',color:'#94a3b8'}}>Click any row to expand transactions</p></div>
                      <div style={{display:'flex',gap:'8px'}}>
                        <button onClick={()=>dl('gl_report.pdf','GL Report PDF')} style={{padding:'7px 13px',background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'8px',fontSize:'12px',fontWeight:600,color:'#64748b',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px'}}><Download size={13}/>PDF</button>
                        <button onClick={()=>dl('gl_data.csv',result.table.map(r=>`${r.account},${r.debit},${r.credit},${r.bal}`).join('\n'))} style={{padding:'7px 13px',background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'8px',fontSize:'12px',fontWeight:600,color:'#64748b',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px'}}><Download size={13}/>Excel</button>
                      </div>
                    </div>
                    <table style={{width:'100%',borderCollapse:'collapse'}}>
                      <thead><tr>{['GL Account','Debit','Credit','Balance','Type',''].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {result.table.map((row,i)=>(
                          <>
                            <tr key={i} onClick={()=>setExpanded(p=>({...p,[i]:!p[i]}))} style={{background:i%2===0?'#fff':'#fafbff',cursor:'pointer'}}>
                              <td style={{...td,fontWeight:600,color:'#0f172a'}}>{row.account}</td>
                              <td style={{...td,color:'#dc2626',fontWeight:600}}>{row.debit!=='$0'?row.debit:'—'}</td>
                              <td style={{...td,color:'#16a34a',fontWeight:600}}>{row.credit!=='$0'?row.credit:'—'}</td>
                              <td style={{...td,fontWeight:700,color:row.bal.startsWith('+')?'#16a34a':'#dc2626'}}>{row.bal}</td>
                              <td style={td}><span style={{padding:'3px 9px',borderRadius:'20px',fontSize:'11px',fontWeight:700,background:row.status==='Revenue'?'#dcfce7':'#eff6ff',color:row.status==='Revenue'?'#16a34a':'#1d4ed8'}}>{row.status}</span></td>
                              <td style={td}>{expanded[i]?<ChevronDown size={15} color="#94a3b8"/>:<ChevronRight size={15} color="#94a3b8"/>}</td>
                            </tr>
                            {expanded[i] && <tr key={`e${i}`}><td colSpan={6} style={{background:'#f0f5ff',padding:'0'}}><div style={{padding:'14px 20px',borderLeft:'3px solid #1d4ed8'}}><p style={{fontSize:'11px',fontWeight:700,color:'#1d4ed8',textTransform:'uppercase',marginBottom:'8px'}}>Transaction Breakdown</p>{[1,2,3].map(n=><div key={n} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #dbeafe',fontSize:'12.5px'}}><span style={{color:'#0f172a'}}>2026-04-{n*5+10} · Entry #{n}</span><span style={{fontWeight:700,color:'#0f172a'}}>-${(n*420+150).toFixed(2)}</span></div>)}</div></td></tr>}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── ANOMALY TAB ── */}
          {tab==='anomaly' && (
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:'16px',overflowY:'auto'}}>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'14px'}}>
                {[
                  {label:'Duplicates Found',val:anomalies.filter(a=>a.type==='Duplicate').length,color:'#ef4444',bg:'#fef2f2',icon:Copy},
                  {label:'Suspicious Txns',val:anomalies.filter(a=>a.type==='Suspicious').length,color:'#f59e0b',bg:'#fffbeb',icon:AlertTriangle},
                  {label:'Records Scanned',val:'2,840',color:'#1d4ed8',bg:'#eff6ff',icon:Search},
                ].map(s=>(
                  <div key={s.label} style={{...card,padding:'20px',display:'flex',alignItems:'center',gap:'16px'}}>
                    <div style={{width:'46px',height:'46px',borderRadius:'12px',background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <s.icon size={22} color={s.color}/>
                    </div>
                    <div>
                      <p style={{fontSize:'26px',fontWeight:800,color:'#0f172a',letterSpacing:'-.5px'}}>{s.val}</p>
                      <p style={{fontSize:'12px',color:'#94a3b8',fontWeight:600,marginTop:'2px'}}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <p style={{fontSize:'15px',fontWeight:700,color:'#0f172a'}}>Detected Anomalies</p>
                </div>
                <AnimatePresence>
                  {anomalies.map((a,i)=>(
                    <motion.div key={a.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,height:0,overflow:'hidden'}} transition={{delay:i*.05}}
                      style={{...card,borderLeft:`4px solid ${SEV[a.sev]}`,padding:'16px 20px',display:'flex',alignItems:'center',gap:'16px'}}>
                      <div style={{width:'40px',height:'40px',borderRadius:'10px',background:a.type==='Duplicate'?'#fef2f2':'#fffbeb',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <AlertTriangle size={20} color={a.type==='Duplicate'?'#ef4444':'#f59e0b'}/>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'3px',flexWrap:'wrap'}}>
                          <span style={{fontWeight:700,fontSize:'13.5px',color:'#0f172a'}}>{a.desc}</span>
                          <span style={{padding:'2px 8px',borderRadius:'20px',fontSize:'10px',fontWeight:700,background:`${SEV[a.sev]}15`,color:SEV[a.sev]}}>{a.sev}</span>
                          <span style={{padding:'2px 8px',borderRadius:'20px',fontSize:'10px',fontWeight:700,background:'#f1f5f9',color:'#64748b'}}>{a.type}</span>
                        </div>
                        <p style={{fontSize:'12px',color:'#64748b'}}>Amount: <strong>{a.amt}</strong> · {a.date} · Confidence: <strong style={{color:SEV[a.sev]}}>{a.conf}%</strong></p>
                      </div>
                      <div style={{display:'flex',gap:'8px',flexShrink:0}}>
                        <button onClick={()=>setAnomalies(p=>p.filter(x=>x.id!==a.id))} style={{padding:'7px 13px',background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'8px',fontSize:'12px',fontWeight:600,color:'#64748b',cursor:'pointer',display:'flex',alignItems:'center',gap:'5px'}}><X size={13}/>Dismiss</button>
                        <button onClick={()=>alert(`Reviewing: ${a.desc}`)} style={{padding:'7px 13px',background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'8px',fontSize:'12px',fontWeight:600,color:'#1d4ed8',cursor:'pointer'}}>Review</button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {anomalies.length===0 && <div style={{...card,padding:'48px',textAlign:'center'}}><p style={{color:'#94a3b8',fontWeight:600,fontSize:'14px'}}>All anomalies have been reviewed</p></div>}
              </div>
            </div>
          )}

          {/* ── DUPLICATE TAB ── */}
          {tab==='duplicate' && <div style={{flex:1,overflowY:'auto'}}><GLDuplicate/></div>}

        </motion.div>
      </AnimatePresence>
        </div>
        {/* end right panel */}
      </div>
      {/* end two-panel layout */}
    </div>
  );
}
