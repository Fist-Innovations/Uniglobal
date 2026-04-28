import { useState } from 'react';
import { Anchor, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShippingKuwait from './ShippingKuwait';
import ShippingGCC from './ShippingGCC';

const TABS = [
  { id: 'kuwait', label: '5.1 Kuwait Financial', sub: 'Comparison & Budget', icon: Anchor },
  { id: 'gcc',    label: '5.2 GCC Financial',   sub: 'Regional Analysis',   icon: Globe },
];

export default function ShippingComparison() {
  const [tab, setTab] = useState('kuwait');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Shipping Management</h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Financial comparison, budget generation & GCC regional analytics</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', padding: '4px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 24px', border: 'none', borderRadius: '10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s',
              background: tab === t.id ? 'linear-gradient(to right,#1a56c4,#2563eb)' : 'transparent',
              color: tab === t.id ? '#fff' : '#64748b',
              boxShadow: tab === t.id ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
            }}>
              <t.icon size={18} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>{t.label}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>{t.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {tab === 'kuwait' ? <ShippingKuwait /> : <ShippingGCC />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
