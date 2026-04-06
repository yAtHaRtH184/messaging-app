import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login as loginApi } from '../services/authService';
import { setCredentials } from '../store/authSlice';
import ThreeBackground from '../components/ThreeBackground';
import Spinner from '../components/Spinner';

const itemVariants = {
  hidden:  { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', damping: 20, stiffness: 260 } },
};

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Fill in all fields'); return; }
    setLoading(true);
    try {
      const res   = await loginApi(form);
      const data  = res.data;
      const token = data.token;
      const user  = data.user ?? { username: data.username ?? form.email.split('@')[0], email: form.email };
      dispatch(setCredentials({ token, user }));
      toast.success('Access granted 👾');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <ThreeBackground />

      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)', top: '-10%', left: '-15%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(153,69,255,0.08) 0%, transparent 70%)', bottom: '-10%', right: '-10%', filter: 'blur(60px)' }} />
      </div>

      {/* Two-column layout — left branding, right form */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', width: '100%', maxWidth: 1100,
        margin: '0 auto', padding: '2rem',
        alignItems: 'center', gap: '4rem', minHeight: '100vh',
      }}>

        {/* LEFT — Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(153,69,255,0.2))',
              border: '1px solid rgba(0,212,255,0.3)',
              boxShadow: '0 0 30px rgba(0,212,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
            }}>⚡</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.3rem', letterSpacing: '0.1em' }}>
                <span className="gradient-text">NEXUS</span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>CHAT</span>
              </div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: '#334155', fontWeight: 700, textTransform: 'uppercase' }}>
                Real-Time Universe
              </div>
            </div>
          </div>

          {/* Big headline */}
          <div>
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.03em', marginBottom: '1.2rem' }}>
              <span className="gradient-text">Welcome</span>
              <br />
              <span style={{ color: 'rgba(255,255,255,0.15)', fontWeight: 300 }}>Back</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.75, maxWidth: 380 }}>
              Sign in and re-enter the NexusChat universe. Your channels are waiting.
            </p>
          </div>

          {/* Features */}
          {[
            { icon: '⚡', text: 'Real-time messaging with WebSockets' },
            { icon: '🔒', text: 'JWT-secured authentication' },
            { icon: '🌐', text: 'Unlimited chatrooms' },
          ].map((f) => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
              }}>{f.icon}</div>
              <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>{f.text}</span>
            </div>
          ))}
        </motion.div>

        {/* RIGHT — Form card */}
        <motion.div
          initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            width: '100%', maxWidth: 460,
            background: 'rgba(3,3,14,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 28, padding: '3rem',
            backdropFilter: 'blur(28px)',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 0 80px rgba(0,212,255,0.05), 0 40px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Top neon line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #00d4ff, #9945ff, transparent)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTop: '2px solid rgba(0,212,255,0.3)', borderLeft: '2px solid rgba(0,212,255,0.3)', borderTopLeftRadius: 26 }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottom: '2px solid rgba(153,69,255,0.3)', borderRight: '2px solid rgba(153,69,255,0.3)', borderBottomRightRadius: 26 }} />

          <motion.h2 variants={itemVariants} initial="hidden" animate="visible"
            style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: '0.4rem' }}>
            <span className="gradient-text">Sign In</span>
          </motion.h2>
          <motion.p variants={itemVariants} initial="hidden" animate="visible"
            style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '2.5rem', fontWeight: 500 }}>
            Enter your credentials to access your account
          </motion.p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {[
              { name: 'email',    label: 'Email',    type: 'email',    placeholder: 'you@universe.com', icon: '✉' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••',          icon: '🔑' },
            ].map((field, idx) => (
              <motion.div key={field.name}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.08, type: 'spring', damping: 22 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem', color: focused === field.name ? '#00d4ff' : '#334155', transition: 'color 0.3s' }}>
                  <span>{field.icon}</span> {field.label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input name={field.name} type={field.type} value={form[field.name]} onChange={handleChange}
                    placeholder={field.placeholder} className="input-neon"
                    style={{ padding: '14px 16px', fontSize: '0.95rem' }}
                    onFocus={() => setFocused(field.name)} onBlur={() => setFocused('')}
                    autoComplete={field.name === 'email' ? 'email' : 'current-password'}
                  />
                  {focused === field.name && (
                    <div style={{ position: 'absolute', bottom: 0, left: 8, right: 8, height: 1, background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }} />
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, type: 'spring', damping: 22 }}>
              <button type="submit" disabled={loading} className="btn-neon w-full"
                style={{ padding: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? <Spinner size={22} /> : <><span>⚡</span> Access Granted</>}
              </button>
            </motion.div>
          </form>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: '#334155' }}>
            New to the universe?{' '}
            <Link to="/signup" style={{ color: '#00d4ff', fontWeight: 700, textDecoration: 'none' }}>
              Create Identity →
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
