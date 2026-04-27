import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, RefreshCw, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

const BG = {
  minHeight: '100vh', width: '100%',
  background: '#ffffff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '24px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

const CARD = {
  width: '100%', maxWidth: '1100px', height: '620px', borderRadius: '32px',
  boxShadow: '0 40px 80px rgba(0,0,0,0.25)', display: 'flex', overflow: 'hidden', position: 'relative',
  background: 'linear-gradient(135deg, #1a56c4 0%, #2563eb 50%, #3b82f6 100%)',
};

const RIGHT = {
  width: '440px', flexShrink: 0, background: 'white', borderRadius: '28px', margin: '20px',
  padding: '52px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
  boxShadow: '0 20px 60px rgba(0,0,0,0.15)', zIndex: 2, overflowY: 'auto',
};

const inputStyle = (focus) => ({
  width: '100%', boxSizing: 'border-box', padding: '13px 16px',
  border: `1.5px solid ${focus ? '#2563eb' : '#e5e7eb'}`, borderRadius: '10px',
  fontSize: '13px', color: '#111827', background: '#fafafa', outline: 'none',
  transition: 'border-color 0.2s', fontFamily: 'inherit',
});

const primaryBtn = (loading) => ({
  width: '100%', padding: '14px', background: loading ? '#93c5fd' : 'linear-gradient(to right, #1a56c4, #2563eb)',
  color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700,
  cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.5px',
  boxShadow: '0 6px 20px rgba(37,99,235,0.4)', transition: 'all 0.2s', fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
});

const label = { fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block', letterSpacing: '0.5px' };

const Spinner = () => (
  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
);

const BackBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', padding: 0, marginBottom: '28px' }}>
    <ArrowLeft size={14} /> Back
  </button>
);

const LeftPanel = () => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 56px', color: 'white', position: 'relative', zIndex: 1 }}>
    <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, marginBottom: '48px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}>U</div>
    <h1 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '3px', marginBottom: '8px', lineHeight: 1.1 }}>WELCOME</h1>
    <h2 style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '1px', marginBottom: '28px', opacity: 0.85 }}>UNIGLOBAL AI ERP</h2>
    <p style={{ fontSize: '13px', lineHeight: 1.9, opacity: 0.75, maxWidth: '340px' }}>Your all-in-one intelligent ERP solution for finance, shipping, and training management.</p>
    <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {['AI-Powered GL Automation', 'Smart Shipping Budgets', 'Training & Notification Engine'].map((f, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', opacity: 0.85 }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', flexShrink: 0 }} />{f}
        </div>
      ))}
    </div>
  </div>
);

// ─── SCREENS ────────────────────────────────────────────────────────────────

const LoginScreen = ({ onForgot, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPw, setFocusPw] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1500);
  };

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f2557', marginBottom: '6px' }}>Sign in</h2>
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>Enter your credentials to access your account</p>
      </div>
      {error && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '12px', marginBottom: '16px' }}>{error}</div>}
      <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div><label style={label}>EMAIL / USERNAME</label>
          <input type="text" placeholder="admin@uniglobal.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle(focusEmail)} onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)} /></div>
        <div><label style={label}>PASSWORD</label>
          <div style={{ position: 'relative' }}>
            <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle(focusPw), paddingRight: '60px' }} onFocus={() => setFocusPw(true)} onBlur={() => setFocusPw(false)} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: '#2563eb', width: '14px', height: '14px' }} />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Remember me</span>
          </label>
          <button type="button" onClick={onForgot} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Forgot Password?</button>
        </div>
        <button type="submit" disabled={loading} style={primaryBtn(loading)}>{loading ? <Spinner /> : 'Sign In'}</button>
      </form>
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '24px' }}>Don't have an account? <span style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Sign Up</span></p>
    </>
  );
};

const ForgotScreen = ({ onBack, onSent }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSent(email); }, 1500);
  };

  return (
    <>
      <BackBtn onClick={onBack} />
      <div style={{ marginBottom: '28px' }}>
        <div style={{ width: '52px', height: '52px', background: '#eff6ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <Mail size={24} color="#2563eb" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f2557', marginBottom: '6px' }}>Forgot Password?</h2>
        <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.7 }}>No worries! Enter your registered email and we'll send you a password reset link.</p>
      </div>
      <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div><label style={label}>REGISTERED EMAIL</label>
          <input type="email" placeholder="admin@uniglobal.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle(focus)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} /></div>
        <button type="submit" disabled={loading} style={primaryBtn(loading)}>{loading ? <Spinner /> : <><Mail size={15} /> Send Reset Link</>}</button>
      </form>
    </>
  );
};

const EmailSentScreen = ({ email, onBack }) => (
  <>
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ width: '72px', height: '72px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <CheckCircle2 size={36} color="#059669" />
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f2557', marginBottom: '10px' }}>Check your Email</h2>
      <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.8 }}>We've sent a password reset OTP to <br /><strong style={{ color: '#0f2557' }}>{email}</strong></p>
      <button onClick={() => { }} style={{ ...primaryBtn(false), marginTop: '28px', justifyContent: 'center' }}>Continue to OTP</button>
      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '16px' }}>
        Didn't receive the email? <span style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Resend</span>
      </p>
      <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#9ca3af', cursor: 'pointer', marginTop: '8px', fontFamily: 'inherit' }}>← Back to Login</button>
    </div>
  </>
);

const OTPScreen = ({ onBack, onVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(59);
  const refs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val;
    setOtp(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
  };

  const verify = () => {
    if (otp.join('').length < 6) { setError('Please enter all 6 digits.'); return; }
    setLoading(true); setError('');
    setTimeout(() => { setLoading(false); onVerified(); }, 1200);
  };

  return (
    <>
      <BackBtn onClick={onBack} />
      <div style={{ marginBottom: '24px' }}>
        <div style={{ width: '52px', height: '52px', background: '#f5f3ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <ShieldCheck size={24} color="#7c3aed" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f2557', marginBottom: '6px' }}>OTP Verification</h2>
        <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.7 }}>Enter the 6-digit code sent to your email address.</p>
      </div>
      {error && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '12px', marginBottom: '16px' }}>{error}</div>}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
        {otp.map((d, i) => (
          <input key={i} ref={el => refs.current[i] = el} maxLength={1} value={d}
            onChange={e => handleChange(e.target.value, i)} onKeyDown={e => handleKey(e, i)}
            style={{ width: '46px', height: '54px', textAlign: 'center', fontSize: '22px', fontWeight: 700, border: `2px solid ${d ? '#7c3aed' : '#e5e7eb'}`, borderRadius: '10px', outline: 'none', color: '#0f2557', background: d ? '#f5f3ff' : '#fafafa', fontFamily: 'inherit', transition: 'all 0.15s' }} />
        ))}
      </div>
      <button onClick={verify} disabled={loading} style={primaryBtn(loading)}>{loading ? <Spinner /> : 'Verify OTP'}</button>
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '16px' }}>
        {timer > 0 ? <>Resend code in <strong style={{ color: '#7c3aed' }}>00:{String(timer).padStart(2, '0')}</strong></> : <span style={{ color: '#7c3aed', fontWeight: 600, cursor: 'pointer' }} onClick={() => setTimer(59)}><RefreshCw size={12} style={{ marginRight: '4px' }} />Resend OTP</span>}
      </p>
    </>
  );
};

const ResetPasswordScreen = ({ onBack, onReset }) => {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => {
    e.preventDefault();
    if (pw.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (pw !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    setTimeout(() => { setLoading(false); onReset(); }, 1200);
  };

  const strength = pw.length === 0 ? 0 : pw.length < 6 ? 1 : pw.length < 10 ? 2 : 3;
  const strengthColor = ['#e5e7eb', '#dc2626', '#f59e0b', '#059669'][strength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][strength];

  return (
    <>
      <BackBtn onClick={onBack} />
      <div style={{ marginBottom: '24px' }}>
        <div style={{ width: '52px', height: '52px', background: '#eff6ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <Lock size={24} color="#2563eb" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f2557', marginBottom: '6px' }}>Reset Password</h2>
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>Create a new strong password for your account.</p>
      </div>
      {error && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '12px', marginBottom: '16px' }}>{error}</div>}
      <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div><label style={label}>NEW PASSWORD</label>
          <div style={{ position: 'relative' }}>
            <input type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" value={pw} onChange={e => setPw(e.target.value)} style={{ ...inputStyle(false), paddingRight: '44px' }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {pw.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ height: '4px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${[0, 33, 66, 100][strength]}%`, background: strengthColor, transition: 'all 0.3s', borderRadius: '4px' }} />
              </div>
              <p style={{ fontSize: '11px', color: strengthColor, fontWeight: 600, marginTop: '4px' }}>{strengthLabel}</p>
            </div>
          )}
        </div>
        <div><label style={label}>CONFIRM PASSWORD</label>
          <input type="password" placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)} style={inputStyle(false)} /></div>
        <button type="submit" disabled={loading} style={primaryBtn(loading)}>{loading ? <Spinner /> : 'Update Password'}</button>
      </form>
    </>
  );
};

const RoleSelectionScreen = ({ onSelect }) => {
  const roles = [
    { id: 'admin', label: 'Administrator', desc: 'Full system access', color: '#2563eb', bg: '#eff6ff' },
    { id: 'finance', label: 'Finance Manager', desc: 'GL, Reports & Audit', color: '#7c3aed', bg: '#f5f3ff' },
    { id: 'training', label: 'Training Staff', desc: 'Training & Notifications', color: '#059669', bg: '#ecfdf5' },
    { id: 'management', label: 'Management', desc: 'Dashboard & Reports', color: '#d97706', bg: '#fffbeb' },
  ];
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onSelect(selected); }, 1000);
  };

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f2557', marginBottom: '6px' }}>Select Your Role</h2>
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>You have multiple roles assigned. Choose how you'd like to proceed.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {roles.map(r => (
          <button key={r.id} onClick={() => setSelected(r.id)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
            border: `2px solid ${selected === r.id ? r.color : '#e5e7eb'}`,
            background: selected === r.id ? r.bg : '#fff', transition: 'all 0.2s', fontFamily: 'inherit',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: r.color, border: `1px solid ${r.color}30` }}>
                {r.label[0]}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{r.label}</p>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>{r.desc}</p>
              </div>
            </div>
            {selected === r.id && <CheckCircle2 size={18} color={r.color} />}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={handle} disabled={!selected || loading} style={{ ...primaryBtn(!selected || loading), opacity: !selected ? 0.5 : 1, flex: 1 }}>
          {loading ? <Spinner /> : <>Continue <ChevronRight size={15} /></>}
        </button>
        <button onClick={() => onSelect(null)} style={{ padding: '14px 24px', background: '#f8fafc', color: '#64748b', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.background = '#f1f5f9'} onMouseOut={e => e.target.style.background = '#f8fafc'}>
          Skip
        </button>
      </div>
    </>
  );
};

// ─── MAIN ────────────────────────────────────────────────────────────────────

const Login = ({ onLogin }) => {
  const [screen, setScreen] = useState('login'); // login | forgot | sent | otp | reset | role | success
  const [sentEmail, setSentEmail] = useState('');
  const navigate = useNavigate();

  const goLogin = () => navigate('/');

  const handleLogin = () => {
    onLogin();
    navigate('/');
  };

  const screens = {
    login: <LoginScreen onForgot={() => setScreen('forgot')} onLogin={() => setScreen('role')} />,
    forgot: <ForgotScreen onBack={() => setScreen('login')} onSent={(e) => { setSentEmail(e); setScreen('otp'); }} />,
    sent: <EmailSentScreen email={sentEmail} onBack={() => setScreen('login')} />,
    otp: <OTPScreen onBack={() => setScreen('forgot')} onVerified={() => setScreen('reset')} />,
    reset: <ResetPasswordScreen onBack={() => setScreen('otp')} onReset={() => setScreen('login')} />,
    role: <RoleSelectionScreen onSelect={() => handleLogin()} />,
  };

  return (
    <div style={BG}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} style={CARD}>
        <LeftPanel />
        <div style={RIGHT} className="hide-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div key={screen} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              {screens[screen]}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Login;
