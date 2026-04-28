import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle2, Clock, AlertCircle, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_FILES = [
  { id: 1, name: 'April_2026_Statement.xlsx', date: '2026-04-20', size: '1.2 MB', status: 'Processed', rows: 148 },
  { id: 2, name: 'March_2026_Statement.xlsx', date: '2026-03-31', size: '980 KB', status: 'Processed', rows: 112 },
  { id: 3, name: 'Feb_2026_Payroll.csv',      date: '2026-02-28', size: '540 KB', status: 'Review',    rows: 64  },
  { id: 4, name: 'Q1_Summary.xlsx',           date: '2026-01-15', size: '2.1 MB', status: 'Pending',   rows: 220 },
];

const statusStyle = {
  Processed: { bg: '#ecfdf5', color: '#059669', dot: '#059669' },
  Review:    { bg: '#fff7ed', color: '#d97706', dot: '#d97706' },
  Pending:   { bg: '#f0f9ff', color: '#0284c7', dot: '#0284c7' },
};

const S = {
  card: { background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th: { padding: '12px 20px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', background: '#f8fafc', textAlign: 'left' },
  td: { padding: '14px 20px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f8fafc' },
};

const GLUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileList, setFileList] = useState(INITIAL_FILES);
  const [isUploading, setIsUploading] = useState(false);
  const [reviewFile, setReviewFile] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const triggerFileInput = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setShowConfirmModal(true);
    // Reset input value
    e.target.value = null;
  };

  const processUpload = () => {
    if (!pendingFile) return;
    setShowConfirmModal(false);
    setIsUploading(true);

    setTimeout(() => {
      const newFile = {
        id: Date.now(),
        name: pendingFile.name,
        date: new Date().toISOString().split('T')[0],
        size: (pendingFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        status: 'Pending',
        rows: Math.floor(Math.random() * 200) + 50
      };
      setFileList(prev => [newFile, ...prev]);
      setIsUploading(false);
      setPendingFile(null);
    }, 1500);
  };

  const handleDelete = (id) => {
    setFileList(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>GL Bank Upload</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Upload bank statements for AI-powered GL mapping</p>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} accept=".csv,.xlsx,.xls,.pdf" />
        <button 
          onClick={triggerFileInput}
          disabled={isUploading}
          style={{
            padding: '9px 20px', background: 'linear-gradient(to right, #1a56c4, #2563eb)',
            border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
            color: 'white', cursor: isUploading ? 'not-allowed' : 'pointer', 
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            display: 'flex', alignItems: 'center', gap: '6px', opacity: isUploading ? 0.7 : 1
          }}
        >
          {isUploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />} 
          {isUploading ? 'Uploading...' : 'Upload New'}
        </button>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); }}
        style={{
          ...S.card,
          padding: '48px 32px',
          border: `2px dashed ${dragging ? '#2563eb' : '#e2e8f0'}`,
          background: dragging ? '#eff6ff' : '#fafbff',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
        }}
      >
        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UploadCloud size={28} style={{ color: '#2563eb' }} />
        </div>
        <div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Drag & drop your bank statement</p>
          <p style={{ fontSize: '12.5px', color: '#94a3b8' }}>Supports .xlsx, .csv, .pdf · Max 50MB</p>
        </div>
        <button 
          onClick={triggerFileInput}
          disabled={isUploading}
          style={{
            marginTop: '4px', padding: '10px 24px',
            background: 'linear-gradient(to right, #1a56c4, #2563eb)',
            border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
            color: 'white', cursor: isUploading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', opacity: isUploading ? 0.7 : 1
          }}
        >
          {isUploading ? <Loader2 size={14} className="animate-spin" /> : null}
          {isUploading ? 'Uploading File...' : 'Browse Files'}
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { icon: CheckCircle2, label: 'Processed', val: '2 Files',  bg: '#ecfdf5', col: '#059669' },
          { icon: Clock,        label: 'In Review', val: '1 File',   bg: '#fff7ed', col: '#d97706' },
          { icon: AlertCircle,  label: 'Pending',   val: '1 File',   bg: '#f0f9ff', col: '#0284c7' },
        ].map((s, i) => (
          <div key={i} style={{ ...S.card, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={18} style={{ color: s.col }} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
              <p style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* History Table */}
      <div style={{ ...S.card, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Upload History</p>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>{fileList.length} files total</p>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['File Name', 'Date Uploaded', 'Size', 'Rows', 'Status', 'Actions'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {fileList.map((f, i) => (
                <motion.tr
                  key={f.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, display: 'none' }}
                  transition={{ duration: 0.2 }}
                  style={{ background: i % 2 === 0 ? '#fff' : '#fafbff' }}
                >
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={14} style={{ color: '#2563eb' }} />
                      </div>
                      <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>{f.name}</span>
                    </div>
                  </td>
                  <td style={S.td}>{f.date}</td>
                  <td style={S.td}>{f.size}</td>
                  <td style={S.td}><span style={{ fontWeight: 600 }}>{f.rows}</span> rows</td>
                  <td style={S.td}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                      background: statusStyle[f.status] ? statusStyle[f.status].bg : '#f0f9ff', 
                      color: statusStyle[f.status] ? statusStyle[f.status].color : '#0284c7',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusStyle[f.status] ? statusStyle[f.status].dot : '#0284c7', display: 'inline-block' }} />
                      {f.status}
                    </span>
                  </td>
                  <td style={{ ...S.td, display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={() => setReviewFile(f)} style={{ padding: '5px 12px', background: '#eff6ff', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}>Review</button>
                    <button onClick={() => handleDelete(f.id)} style={{ padding: '5px 8px', background: '#fef2f2', border: 'none', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={13} style={{ color: '#dc2626' }} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Review Modal Overlay */}
      <AnimatePresence>
        {reviewFile && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={20} color="#2563eb" /> Review Document
                </h3>
                <button onClick={() => setReviewFile(null)} style={{ background: '#f8fafc', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%', color: '#94a3b8' }}>
                  ✕
                </button>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>File Name</span>
                  <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>{reviewFile.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Upload Date</span>
                  <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>{reviewFile.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>File Size</span>
                  <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>{reviewFile.size}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Detected Rows</span>
                  <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700, color: '#2563eb' }}>{reviewFile.rows}</span>
                </div>
              </div>

              <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '12px', border: '1px dashed #bfdbfe', marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> AI Pre-processing Complete
                </p>
                <p style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px' }}>
                  The AI has successfully parsed {reviewFile.rows} transactions and generated suggested GL mappings. It is ready for manual review.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setReviewFile(null)} style={{ padding: '10px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => navigate('/gl/review')} style={{ padding: '10px 20px', background: 'linear-gradient(to right, #1a56c4, #2563eb)', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Open in Transaction Review →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && pendingFile && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'center' }}
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <FileText size={32} color="#2563eb" />
              </div>
              
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Confirm Upload</h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Are you sure you want to upload this bank statement for processing?</p>
              
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '28px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>File Name</span>
                  <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 700, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pendingFile.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Size</span>
                  <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>{(pendingFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => { setShowConfirmModal(false); setPendingFile(null); }}
                  style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={processUpload}
                  style={{ flex: 1, padding: '12px', background: 'linear-gradient(to right, #1a56c4, #2563eb)', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}
                >
                  Confirm & Upload
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GLUpload;
