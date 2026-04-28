import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, CheckCircle2, AlertTriangle, ArrowRight,
  Bot, Sparkles, Send, TrendingUp, TrendingDown,
} from 'lucide-react';

const FALLBACK = [
  { id: 1,  date: '2026-04-20', desc: 'Amazon Web Services — Cloud Hosting',   amt: -1240.50, gl: '6100 · Software & Hosting',   conf: 98, status: 'Approved' },
  { id: 2,  date: '2026-04-21', desc: 'Starbucks — Client Meeting',             amt: -25.40,   gl: '6200 · Meals & Entertainment', conf: 85, status: 'Approved' },
  { id: 3,  date: '2026-04-22', desc: 'Monthly Office Rent — April',            amt: -5000.00, gl: '6300 · Rent & Lease',          conf: 99, status: 'Approved' },
  { id: 4,  date: '2026-04-22', desc: 'Miscellaneous Office Supplies',          amt: -145.20,  gl: '6400 · Office Supplies',       conf: 62, status: 'Corrected', warning: 'Low confidence — manual review advised' },
  { id: 5,  date: '2026-04-23', desc: 'Payment from Global Client X',           amt: 15000.00, gl: '4100 · Service Revenue',       conf: 95, status: 'Approved' },
  { id: 6,  date: '2026-04-24', desc: 'Uber — Transport for Sales Team',        amt: -85.00,   gl: '6500 · Travel & Transport',    conf: 88, status: 'Approved' },
  { id: 7,  date: '2026-04-24', desc: 'Adobe Creative Cloud Subscription',      amt: -82.99,   gl: '6100 · Software & Hosting',    conf: 99, status: 'Approved' },
  { id: 8,  date: '2026-04-25', desc: 'Consulting Fee — Tech Solutions Inc.',   amt: -2500.00, gl: '6600 · Professional Fees',     conf: 75, status: 'Corrected', warning: 'Check vendor mapping' },
  { id: 9,  date: '2026-04-26', desc: 'Refund from Delta Airlines',             amt: 450.00,   gl: '6500 · Travel & Transport',    conf: 92, status: 'Approved' },
  { id: 10, date: '2026-04-27', desc: 'WeWork Office Expansion Deposit',        amt: -1200.00, gl: '6300 · Rent & Lease',          conf: 96, status: 'Approved' },
];

const fmtAmt = (n) => {
  const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
  return n >= 0 ? `+$${abs}` : `-$${abs}`;
};

const STATUS_STYLE = {
  Approved:  { bg: '#ecfdf5', color: '#059669', border: '#bbf7d0' },
  Corrected: { bg: '#fdf4ff', color: '#9333ea', border: '#e9d5ff' },
};

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th: { padding: '12px 18px', fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left', whiteSpace: 'nowrap' },
  td: { padding: '14px 18px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' },
};

export default function GLConfirm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const txns = (state?.txns || FALLBACK);
  const [confirmed, setConfirmed] = useState(false);

  const errors   = txns.filter(t => t.conf < 70 || t.warning);
  const approved = txns.filter(t => t.status === 'Approved');
  const corrected = txns.filter(t => t.status === 'Corrected');
  const totalCredit = txns.filter(t => t.amt >= 0).reduce((s, t) => s + t.amt, 0);
  const totalDebit  = txns.filter(t => t.amt < 0).reduce((s, t) => s + Math.abs(t.amt), 0);

  const handleConfirm = () => setConfirmed(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={() => navigate('/gl/review')} style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
            <ChevronLeft size={22} color="#374151" style={{ flexShrink: 0 }} />
          </button>
          <div>
            <h1 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>Review &amp; Confirmation</h1>
            <p style={{ fontSize: '12.5px', color: '#94a3b8' }}>Verify all entries before posting to ERP · {txns.length} entries</p>
          </div>
        </div>

        <button onClick={() => navigate('/gl/post', { state: { txns } })} disabled={!confirmed}
          style={{
            padding: '10px 22px', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
            background: confirmed ? 'linear-gradient(to right,#0f172a,#1e293b)' : '#f1f5f9',
            color: confirmed ? '#fff' : '#94a3b8', cursor: confirmed ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: confirmed ? '0 4px 12px rgba(15,23,42,0.3)' : 'none', transition: 'all 0.2s',
          }}>
          <Send size={14} /> Post to ERP
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Entries', val: txns.length,       col: '#2563eb', bg: '#eff6ff', icon: Sparkles },
          { label: 'Auto-Approved', val: approved.length,   col: '#059669', bg: '#ecfdf5', icon: CheckCircle2 },
          { label: 'Corrected',     val: corrected.length,  col: '#9333ea', bg: '#fdf4ff', icon: Bot },
          { label: 'Errors / Flags', val: errors.length,    col: '#dc2626', bg: '#fef2f2', icon: AlertTriangle },
        ].map(s => (
          <div key={s.label} style={{ ...S.card, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={18} color={s.col} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{s.label}</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: s.col }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Financial Summary ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ ...S.card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={22} color="#059669" />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Credits</p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#059669' }}>${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div style={{ ...S.card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingDown size={22} color="#dc2626" />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Debits</p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626' }}>${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* ── Error / Flag Highlights ── */}
      {errors.length > 0 && (
        <div style={{ ...S.card, overflow: 'hidden', border: '1px solid #fed7aa' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #fed7aa', background: '#fff7ed', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={16} color="#d97706" />
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#92400e' }}>{errors.length} Error{errors.length !== 1 ? 's' : ''} / Flag{errors.length !== 1 ? 's' : ''} Detected</p>
            <p style={{ fontSize: '12px', color: '#b45309', marginLeft: 'auto' }}>These entries require your attention</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Date', 'Description', 'Amount', 'GL Account', 'Confidence', 'Issue'].map(h => (
                  <th key={h} style={{ ...S.th, background: '#fffbeb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {errors.map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: i % 2 === 0 ? '#fff' : '#fffbeb' }}>
                  <td style={{ ...S.td, color: '#64748b' }}>{t.date}</td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#0f172a' }}>{t.desc}</td>
                  <td style={{ ...S.td, fontWeight: 700, color: t.amt >= 0 ? '#059669' : '#dc2626' }}>{fmtAmt(t.amt)}</td>
                  <td style={{ ...S.td, fontSize: '12.5px', color: '#1e40af', fontWeight: 600 }}>{t.gl}</td>
                  <td style={S.td}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#dc2626', background: '#fef2f2', padding: '2px 8px', borderRadius: '10px' }}>{t.conf}%</span>
                  </td>
                  <td style={S.td}>
                    <span style={{ fontSize: '11.5px', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={11} color="#d97706" /> {t.warning || 'Low confidence'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Full Entry Summary Table ── */}
      <div style={{ ...S.card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>All GL Entries Summary</p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>{txns.length} entries ready for posting</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Date', 'Description', 'Amount', 'GL Account', 'Confidence', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {txns.map((t, i) => (
                <tr key={t.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}>
                  <td style={{ ...S.td, color: '#64748b', whiteSpace: 'nowrap' }}>{t.date}</td>
                  <td style={{ ...S.td, fontWeight: 600, color: '#0f172a', maxWidth: '260px' }}>{t.desc}</td>
                  <td style={{ ...S.td, fontWeight: 700, whiteSpace: 'nowrap', color: t.amt >= 0 ? '#059669' : '#0f172a' }}>{fmtAmt(t.amt)}</td>
                  <td style={{ ...S.td, fontSize: '12.5px', color: '#1e40af', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bot size={12} color="#2563eb" /> {t.gl}
                    </div>
                  </td>
                  <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: t.conf >= 90 ? '#059669' : t.conf >= 70 ? '#d97706' : '#dc2626', background: t.conf >= 90 ? '#ecfdf5' : t.conf >= 70 ? '#fff7ed' : '#fef2f2', padding: '2px 8px', borderRadius: '10px' }}>
                      {t.conf}%
                    </span>
                  </td>
                  <td style={S.td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: STATUS_STYLE[t.status]?.bg || '#f0f9ff', color: STATUS_STYLE[t.status]?.color || '#0284c7', border: `1px solid ${STATUS_STYLE[t.status]?.border || '#bae6fd'}` }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: STATUS_STYLE[t.status]?.color || '#0284c7' }} />
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Confirm & Post Footer ── */}
      <div style={{ ...S.card, padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', background: confirmed ? '#f0fdf4' : '#fff', border: confirmed ? '1px solid #bbf7d0' : '1px solid #e2e8f0', transition: 'all 0.3s' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#059669', cursor: 'pointer' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>I confirm all entries have been reviewed and are accurate</p>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>This will authorize the batch for ERP posting. This action cannot be undone.</p>
          </div>
        </label>
        <button onClick={() => navigate('/gl/post', { state: { txns } })} disabled={!confirmed}
          style={{
            padding: '13px 28px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
            background: confirmed ? 'linear-gradient(to right,#0f172a,#1e293b)' : '#e2e8f0',
            color: confirmed ? '#fff' : '#94a3b8', cursor: confirmed ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: '9px', whiteSpace: 'nowrap', flexShrink: 0,
            boxShadow: confirmed ? '0 6px 20px rgba(15,23,42,0.35)' : 'none', transition: 'all 0.2s',
          }}>
          <Send size={16} /> Post to ERP <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
