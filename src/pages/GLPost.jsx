import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Send, CheckCircle2, XCircle, Loader2,
  UploadCloud, AlertTriangle, RefreshCw, Home,
} from 'lucide-react';

const FALLBACK_TXNS = [
  { id: 1, date: '2026-04-20', desc: 'Amazon Web Services — Cloud Hosting',  amt: -1240.50, gl: '6100 · Software & Hosting',   status: 'Approved' },
  { id: 2, date: '2026-04-21', desc: 'Starbucks — Client Meeting',            amt: -25.40,   gl: '6200 · Meals & Entertainment', status: 'Approved' },
  { id: 3, date: '2026-04-22', desc: 'Monthly Office Rent — April',           amt: -5000.00, gl: '6300 · Rent & Lease',          status: 'Approved' },
  { id: 4, date: '2026-04-22', desc: 'Miscellaneous Office Supplies',         amt: -145.20,  gl: '6400 · Office Supplies',       status: 'Corrected' },
  { id: 5, date: '2026-04-23', desc: 'Payment from Global Client X',          amt: 15000.00, gl: '4100 · Service Revenue',       status: 'Approved' },
  { id: 6, date: '2026-04-24', desc: 'Uber — Transport for Sales Team',       amt: -85.00,   gl: '6500 · Travel & Transport',    status: 'Approved' },
  { id: 7, date: '2026-04-24', desc: 'Adobe Creative Cloud Subscription',     amt: -82.99,   gl: '6100 · Software & Hosting',    status: 'Approved' },
  { id: 8, date: '2026-04-25', desc: 'Consulting Fee — Tech Solutions Inc.',  amt: -2500.00, gl: '6600 · Professional Fees',     status: 'Corrected' },
  { id: 9, date: '2026-04-26', desc: 'Refund from Delta Airlines',            amt: 450.00,   gl: '6500 · Travel & Transport',    status: 'Approved' },
  { id:10, date: '2026-04-27', desc: 'WeWork Office Expansion Deposit',       amt: -1200.00, gl: '6300 · Rent & Lease',          status: 'Approved' },
];

const STEPS = [
  { key: 'auth',     label: 'API Authentication',        detail: 'Verifying ERP credentials and session token' },
  { key: 'validate', label: 'Batch Validation',           detail: 'Checking GL account codes and debit/credit balance' },
  { key: 'map',      label: 'GL Account Mapping',         detail: 'Resolving account codes to ERP chart of accounts' },
  { key: 'create',   label: 'Journal Entry Creation',     detail: 'Creating journal entries in ERP ledger' },
  { key: 'sync',     label: 'Ledger Synchronization',     detail: 'Syncing balances and updating period totals' },
  { key: 'confirm',  label: 'Confirmation & Batch Close', detail: 'Generating batch reference and closing the session' },
];

const fmtAmt = (n) => {
  const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
  return n >= 0 ? `+$${abs}` : `-$${abs}`;
};

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
};

export default function GLPost() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const txns = state?.txns || FALLBACK_TXNS;

  const [phase, setPhase] = useState('idle'); // idle | posting | success | failed
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [batchRef] = useState(`BATCH-${Math.floor(Math.random() * 9000) + 1000}`);
  const [failedStep, setFailedStep] = useState(null);

  const totalCredit = txns.filter(t => t.amt >= 0).reduce((s, t) => s + t.amt, 0);
  const totalDebit  = txns.filter(t => t.amt < 0).reduce((s, t) => s + Math.abs(t.amt), 0);

  const runPost = (simulateFail = false) => {
    setPhase('posting');
    setCompletedSteps([]);
    setCurrentStep(null);
    setFailedStep(null);

    let stepIndex = 0;
    const failAt = simulateFail ? 3 : -1;

    const tick = () => {
      if (stepIndex >= STEPS.length) {
        setCurrentStep(null);
        setPhase('success');
        return;
      }
      const step = STEPS[stepIndex];
      setCurrentStep(step.key);

      setTimeout(() => {
        if (stepIndex === failAt) {
          setFailedStep(step.key);
          setPhase('failed');
          return;
        }
        setCompletedSteps(prev => [...prev, step.key]);
        stepIndex++;
        setTimeout(tick, 350);
      }, 700 + Math.random() * 400);
    };

    setTimeout(tick, 300);
  };

  const isCompleted = (key) => completedSteps.includes(key);
  const isCurrent   = (key) => currentStep === key;
  const isFailed    = (key) => failedStep === key;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigate('/gl/confirm', { state: { txns } })}
            disabled={phase === 'posting'}
            style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: phase === 'posting' ? 'not-allowed' : 'pointer', opacity: phase === 'posting' ? 0.5 : 1, padding: 0 }}
          >
            <ChevronLeft size={22} color="#374151" style={{ flexShrink: 0 }} />
          </button>
          <div>
            <h1 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Post to ERP</h1>
            <p style={{ fontSize: '12.5px', color: '#94a3b8' }}>One-click posting · {txns.length} journal entries · Batch <strong style={{ color: '#2563eb' }}>{batchRef}</strong></p>
          </div>
        </div>
        {phase === 'success' && (
          <button onClick={() => navigate('/')} style={{ padding: '9px 18px', background: 'linear-gradient(to right,#059669,#10b981)', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
            <Home size={14} /> Go to Dashboard
          </button>
        )}
      </div>

      {/* ── Batch Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Entries',  val: txns.length,                                             col: '#2563eb', bg: '#eff6ff' },
          { label: 'Total Credits',  val: `$${totalCredit.toLocaleString('en-US',{minimumFractionDigits:2})}`, col: '#059669', bg: '#ecfdf5' },
          { label: 'Total Debits',   val: `$${totalDebit.toLocaleString('en-US',{minimumFractionDigits:2})}`,  col: '#dc2626', bg: '#fef2f2' },
          { label: 'Batch Reference',val: batchRef,                                                col: '#7c3aed', bg: '#f5f3ff' },
        ].map(s => (
          <div key={s.label} style={{ ...S.card, padding: '18px 20px' }}>
            <p style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{s.label}</p>
            <p style={{ fontSize: s.label === 'Batch Reference' ? '16px' : '22px', fontWeight: 800, color: s.col }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* ── Main Post Panel ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Left: Post Button + Progress */}
        <div style={{ ...S.card, padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            {/* Status Icon */}
            <AnimatePresence mode="wait">
              {phase === 'idle' && (
                <motion.div key="idle" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                  style={{ width: '80px', height: '80px', borderRadius: '22px', background: 'linear-gradient(135deg,#1a56c4,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 12px 30px rgba(37,99,235,0.35)' }}>
                  <Send size={36} color="#fff" />
                </motion.div>
              )}
              {phase === 'posting' && (
                <motion.div key="posting" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                  style={{ width: '80px', height: '80px', borderRadius: '22px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(37,99,235,0.15)' }}>
                  <Loader2 size={36} color="#2563eb" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                </motion.div>
              )}
              {phase === 'success' && (
                <motion.div key="success" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                  style={{ width: '80px', height: '80px', borderRadius: '22px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(5,150,105,0.2)' }}>
                  <CheckCircle2 size={40} color="#059669" />
                </motion.div>
              )}
              {phase === 'failed' && (
                <motion.div key="failed" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                  style={{ width: '80px', height: '80px', borderRadius: '22px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(220,38,38,0.2)' }}>
                  <XCircle size={40} color="#dc2626" />
                </motion.div>
              )}
            </AnimatePresence>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              {phase === 'idle'    ? 'Ready to Post'         : ''}
              {phase === 'posting' ? 'Posting in Progress…'  : ''}
              {phase === 'success' ? 'Posted Successfully!'  : ''}
              {phase === 'failed'  ? 'Posting Failed'        : ''}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '280px', margin: '0 auto' }}>
              {phase === 'idle'    ? `${txns.length} entries will be written to the ERP general ledger.` : ''}
              {phase === 'posting' ? 'Please do not close this window while posting is in progress.' : ''}
              {phase === 'success' ? `All ${txns.length} journal entries synced. Ref: ${batchRef}` : ''}
              {phase === 'failed'  ? 'An error occurred during posting. Review the log and retry.' : ''}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(phase === 'idle' || phase === 'failed') && (
              <button onClick={() => runPost(false)}
                style={{ width: '100%', padding: '14px', background: 'linear-gradient(to right,#0f172a,#1e293b)', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', boxShadow: '0 6px 20px rgba(15,23,42,0.3)', transition: 'transform 0.1s' }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {phase === 'failed' ? <RefreshCw size={16} /> : <Send size={16} />}
                {phase === 'failed' ? 'Retry Posting' : 'Post to ERP'}
              </button>
            )}
            {phase === 'idle' && (
              <button onClick={() => runPost(true)}
                style={{ width: '100%', padding: '11px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                <AlertTriangle size={13} /> Simulate Failure (Demo)
              </button>
            )}
            {phase === 'success' && (
              <button onClick={() => navigate('/gl/upload')}
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                <UploadCloud size={14} /> Upload Another Statement
              </button>
            )}
          </div>
        </div>

        {/* Right: Step Log */}
        <div style={{ ...S.card, padding: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Posting Log</p>

          {STEPS.map((step, i) => {
            const done    = isCompleted(step.key);
            const current = isCurrent(step.key);
            const failed  = isFailed(step.key);
            const waiting = !done && !current && !failed && phase !== 'idle';
            const isIdle  = phase === 'idle';

            return (
              <motion.div key={step.key}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '13px 16px', borderRadius: '12px',
                  background: done ? '#f0fdf4' : failed ? '#fef2f2' : current ? '#eff6ff' : '#f8fafc',
                  border: `1px solid ${done ? '#bbf7d0' : failed ? '#fecaca' : current ? '#bfdbfe' : '#e2e8f0'}`,
                  transition: 'all 0.3s',
                }}>
                {/* Status icon */}
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? '#dcfce7' : failed ? '#fee2e2' : current ? '#dbeafe' : '#f1f5f9' }}>
                  {done    && <CheckCircle2 size={16} color="#059669" />}
                  {failed  && <XCircle size={16} color="#dc2626" />}
                  {current && <Loader2 size={16} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />}
                  {(waiting || isIdle) && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1', display: 'block' }} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: done ? '#059669' : failed ? '#dc2626' : current ? '#1d4ed8' : '#94a3b8', marginBottom: '2px' }}>
                    {step.label}
                  </p>
                  <p style={{ fontSize: '11.5px', color: done ? '#16a34a' : failed ? '#b91c1c' : current ? '#3b82f6' : '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {done ? '✓ Completed' : failed ? '✗ ' + step.detail : current ? step.detail : step.detail}
                  </p>
                </div>

                {done && (
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#059669', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap' }}>OK</span>
                )}
                {failed && (
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap' }}>ERR</span>
                )}
              </motion.div>
            );
          })}

          {/* Success Batch Info */}
          <AnimatePresence>
            {phase === 'success' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ marginTop: '10px', padding: '14px 16px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#064e3b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Batch Summary</p>
                {[
                  ['Batch Reference', batchRef],
                  ['Entries Posted',  `${txns.length} journal entries`],
                  ['Total Credits',   `$${totalCredit.toLocaleString('en-US',{minimumFractionDigits:2})}`],
                  ['Total Debits',    `$${totalDebit.toLocaleString('en-US',{minimumFractionDigits:2})}`],
                  ['Posted At',       new Date().toLocaleString()],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                    <span style={{ color: '#065f46' }}>{k}</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{v}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Failure Info */}
          <AnimatePresence>
            {phase === 'failed' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ marginTop: '10px', padding: '14px 16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={14} color="#dc2626" />
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b' }}>Posting Halted</p>
                </div>
                <p style={{ fontSize: '12px', color: '#b91c1c' }}>
                  The process was interrupted at <strong>{STEPS.find(s => s.key === failedStep)?.label}</strong>. No entries have been committed to the ERP. Please retry or contact your ERP administrator.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Entry Preview Table ── */}
      <div style={{ ...S.card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Entries Queued for Posting</p>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{txns.length} entries</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['#', 'Date', 'Description', 'GL Account', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ padding: '11px 18px', fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txns.map((t, i) => (
                <tr key={t.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                  <td style={{ padding: '13px 18px', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{String(i + 1).padStart(2, '0')}</td>
                  <td style={{ padding: '13px 18px', fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>{t.date}</td>
                  <td style={{ padding: '13px 18px', fontSize: '13px', color: '#0f172a', fontWeight: 600, maxWidth: '260px' }}>{t.desc}</td>
                  <td style={{ padding: '13px 18px', fontSize: '12.5px', color: '#1e40af', fontWeight: 600, whiteSpace: 'nowrap' }}>{t.gl}</td>
                  <td style={{ padding: '13px 18px', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', color: t.amt >= 0 ? '#059669' : '#0f172a' }}>{fmtAmt(t.amt)}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                      background: phase === 'success' ? '#ecfdf5' : phase === 'failed' && isCompleted(t.id?.toString()) ? '#ecfdf5' : '#f0f9ff',
                      color: phase === 'success' ? '#059669' : '#0284c7',
                      border: `1px solid ${phase === 'success' ? '#bbf7d0' : '#bae6fd'}`,
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: phase === 'success' ? '#059669' : '#0284c7' }} />
                      {phase === 'success' ? 'Posted' : t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS keyframe for spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
