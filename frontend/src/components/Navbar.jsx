import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { motion } from 'framer-motion';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <motion.div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate('/dashboard')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-black relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(153,69,255,0.2))',
            border: '1px solid rgba(0,212,255,0.25)',
            boxShadow: '0 0 16px rgba(0,212,255,0.2)',
          }}
        >
          <span className="gradient-text text-lg">⚡</span>
        </div>
        <div>
          <span className="font-black text-lg gradient-text tracking-widest">NEXUS</span>
          <span className="font-light text-lg text-white/50 tracking-widest">CHAT</span>
        </div>
      </motion.div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse-neon" style={{ background: '#00ff87' }} />
            <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>
              {user.username || user.email?.split('@')[0]}
            </span>
          </div>
        )}

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="text-sm px-4 py-1.5 rounded-xl font-semibold transition-all duration-200"
          style={{
            background: 'rgba(255,59,59,0.08)',
            border: '1px solid rgba(255,59,59,0.18)',
            color: '#ff6b6b',
          }}
        >
          ↩ Logout
        </motion.button>
      </div>
    </nav>
  );
}
