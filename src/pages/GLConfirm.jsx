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
  Approved:  { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
  Corrected: { bg: 'rgba(147, 51, 234, 0.1)', color: '#a855f7', border: 'rgba(168, 85, 247, 0.2)' },
};

const S = {
  card: { background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', transition: 'background 0.3s, border-color 0.3s' },
  th: { padding: '12px 18px', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', background: 'var(--bg-dark)', textAlign: 'left', whiteSpace: 'nowrap' },
  td: { padding: '14px 18px', fontSize: '13px', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', verticalAlign: 'middle' },
};

export default function GLConfirm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const txns = (state?.txns || FALLBACK);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set(txns.map(t => t.id)));

  const selectedTxns = txns.filter(t => selectedIds.has(t.id));
  const errors   = selectedTxns.filter(t => t.conf < 70 || t.warning);
  const approved = selectedTxns.filter(t => t.status === 'Approved');
  const corrected = selectedTxns.filter(t => t.status === 'Corrected');
  const totalCredit = selectedTxns.filter(t => t.amt >= 0).reduce((s, t) => s + t.amt, 0);
  const totalDebit  = selectedTxns.filter(t => t.amt < 0).reduce((s, t) => s + Math.abs(t.amt), 0);

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === txns.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(txns.map(t => t.id)));
    }
  };

  const handleConfirm = () => setConfirmed(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={() => navigate('/gl/review')} style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
            <ChevronLeft size={22} color="var(--text-main)" style={{ flexShrink: 0 }} />
          </button>
          <div>
            <h1 style={{ fontSize: '21px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>Review &amp; Confirmation</h1>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Verify all entries before posting to ERP · {selectedIds.size} of {txns.length} selected</p>
          </div>
        </div>

        <button onClick={() => navigate('/gl/post', { state: { txns: selectedTxns } })} disabled={!confirmed || selectedIds.size === 0}
          style={{
            padding: '10px 22px', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
            background: confirmed && selectedIds.size > 0 ? 'var(--text-main)' : 'var(--bg-dark)',
            color: confirmed && selectedIds.size > 0 ? 'var(--bg-card)' : 'var(--text-muted)', cursor: confirmed && selectedIds.size > 0 ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: confirmed && selectedIds.size > 0 ? '0 4px 12px rgba(15,23,42,0.3)' : 'none', transition: 'all 0.2s',
            border: confirmed && selectedIds.size > 0 ? 'none' : '1px solid var(--border)',
          }}>
          <Send size={14} /> Post Selected ({selectedIds.size})
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Entries', val: selectedIds.size,    col: 'var(--primary)', bg: 'rgba(37, 99, 235, 0.1)', icon: Sparkles },
          { label: 'Auto-Approved', val: approved.length,   col: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: CheckCircle2 },
          { label: 'Corrected',     val: corrected.length,  col: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', icon: Bot },
          { label: 'Errors / Flags', val: errors.length,    col: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: AlertTriangle },
        ].map(s => (
          <div key={s.label} style={{ ...S.card, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={18} color={s.col} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{s.label}</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: s.col }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Financial Summary ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ ...S.card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={22} color="#10b981" />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Credits</p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div style={{ ...S.card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingDown size={22} color="#ef4444" />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Debits</p>
            <p style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* ── Error / Flag Highlights ── */}
      {errors.length > 0 && (
        <div style={{ ...S.card, overflow: 'hidden', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={16} color="#f59e0b" />
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>{errors.length} Error{errors.length !== 1 ? 's' : ''} / Flag{errors.length !== 1 ? 's' : ''} Detected</p>
            <p style={{ fontSize: '12px', color: '#f59e0b', marginLeft: 'auto', opacity: 0.8 }}>These entries require your attention</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Date', 'Description', 'Amount', 'GL Account', 'Confidence', 'Issue'].map(h => (
                  <th key={h} style={{ ...S.th, background: 'rgba(245, 158, 11, 0.05)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {errors.map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'rgba(245, 158, 11, 0.03)' }}>
                  <td style={{ ...S.td, color: 'var(--text-muted)' }}>{t.date}</td>
                  <td style={{ ...S.td, fontWeight: 600, color: 'var(--text-main)' }}>{t.desc}</td>
                  <td style={{ ...S.td, fontWeight: 700, color: t.amt >= 0 ? '#10b981' : '#ef4444' }}>{fmtAmt(t.amt)}</td>
                  <td style={{ ...S.td, fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 }}>{t.gl}</td>
                  <td style={S.td}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>{t.conf}%</span>
                  </td>
                  <td style={S.td}>
                    <span style={{ fontSize: '11.5px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={11} color="#f59e0b" /> {t.warning || 'Low confidence'}
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
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>All GL Entries Summary</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{txns.length} entries ready for posting</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...S.th, width: '40px', paddingRight: 0 }}>
                  <input type="checkbox" checked={txns.length > 0 && selectedIds.size === txns.length} onChange={toggleSelectAll} style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: 'var(--primary)' }} />
                </th>
                {['Date', 'Description', 'Amount', 'GL Account', 'Confidence', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {txns.map((t, i) => (
                <tr key={t.id} style={{ background: selectedIds.has(t.id) ? 'rgba(37, 99, 235, 0.05)' : i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-dark)' }}>
                  <td style={{ ...S.td, paddingRight: 0 }}>
                    <input type="checkbox" checked={selectedIds.has(t.id)} onChange={() => toggleSelect(t.id)} style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: 'var(--primary)' }} />
                  </td>
                  <td style={{ ...S.td, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{t.date}</td>
                  <td style={{ ...S.td, fontWeight: 600, color: 'var(--text-main)', maxWidth: '260px' }}>{t.desc}</td>
                  <td style={{ ...S.td, fontWeight: 700, whiteSpace: 'nowrap', color: t.amt >= 0 ? '#10b981' : 'var(--text-main)' }}>{fmtAmt(t.amt)}</td>
                  <td style={{ ...S.td, fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bot size={12} color="var(--primary)" /> {t.gl}
                    </div>
                  </td>
                  <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: t.conf >= 90 ? '#10b981' : t.conf >= 70 ? '#f59e0b' : '#ef4444', background: t.conf >= 90 ? 'rgba(16, 185, 129, 0.1)' : t.conf >= 70 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                      {t.conf}%
                    </span>
                  </td>
                  <td style={S.td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: STATUS_STYLE[t.status]?.bg || 'rgba(2, 132, 199, 0.1)', color: STATUS_STYLE[t.status]?.color || '#0ea5e9', border: `1px solid ${STATUS_STYLE[t.status]?.border || 'rgba(14, 165, 233, 0.2)'}` }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: STATUS_STYLE[t.status]?.color || '#0ea5e9' }} />
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
      <div style={{ ...S.card, padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', background: confirmed ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)', border: confirmed ? '1px solid #10b981' : '1px solid var(--border)', transition: 'all 0.3s' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>I confirm the selected {selectedIds.size} entries have been reviewed</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>This will authorize the batch for ERP posting. This action cannot be undone.</p>
          </div>
        </label>
        <button onClick={() => navigate('/gl/post', { state: { txns: selectedTxns } })} disabled={!confirmed || selectedIds.size === 0}
          style={{
            padding: '13px 28px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
            background: confirmed && selectedIds.size > 0 ? 'var(--text-main)' : 'var(--bg-dark)',
            color: confirmed && selectedIds.size > 0 ? 'var(--bg-card)' : 'var(--text-muted)', cursor: confirmed && selectedIds.size > 0 ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: '9px', whiteSpace: 'nowrap', flexShrink: 0,
            boxShadow: confirmed && selectedIds.size > 0 ? '0 6px 20px rgba(0,0,0,0.2)' : 'none', transition: 'all 0.2s',
            border: confirmed && selectedIds.size > 0 ? 'none' : '1px solid var(--border)',
          }}>
          <Send size={16} /> Post Selected ({selectedIds.size}) <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
