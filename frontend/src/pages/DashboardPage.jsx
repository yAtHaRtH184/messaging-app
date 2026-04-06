import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import Navbar          from '../components/Navbar';
import Modal           from '../components/Modal';
import ThreeBackground from '../components/ThreeBackground';
import Spinner         from '../components/Spinner';
import { createChatroom, joinChatroom } from '../services/chatroomService';
import { setCurrentRoom } from '../store/chatroomSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState('');
  const [roomName,  setRoomName]  = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setLoading(true);
    try {
      const res  = await createChatroom(roomName.trim());
      const room = res.data;
      dispatch(setCurrentRoom({ id: room.id, name: room.name }));
      toast.success(`#${room.name} created! 🎉`);
      navigate(`/chat/${room.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to create room');
    } finally { setLoading(false); setRoomName(''); setOpenModal(''); }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setLoading(true);
    try {
      const res  = await joinChatroom(roomName.trim());
      const room = res.data;
      dispatch(setCurrentRoom({ id: room.id, name: room.name }));
      toast.success(`Joined #${room.name}! 🚀`);
      navigate(`/chat/${room.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Room not found');
    } finally { setLoading(false); setRoomName(''); setOpenModal(''); }
  };

  return (
    <div className="page flex flex-col min-h-screen overflow-hidden">
      <ThreeBackground />
      <Navbar />

      {/* Ambient light blobs */}
      <div className="fixed pointer-events-none" style={{ inset: 0, zIndex: 1 }}>
        <div style={{
          position: 'absolute', width: 900, height: 900, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.055) 0%, transparent 65%)',
          top: '-25%', left: '-10%', filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(153,69,255,0.065) 0%, transparent 65%)',
          bottom: '-15%', right: '-5%', filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,0,170,0.04) 0%, transparent 65%)',
          top: '40%', right: '20%', filter: 'blur(60px)',
        }} />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-20 px-6 py-12" style={{ position: 'relative', zIndex: 2 }}>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, transparent, #00d4ff66)' }} />
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '0.35em',
              color: '#00d4ff', textTransform: 'uppercase',
              padding: '4px 14px', borderRadius: 99,
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.18)',
            }}>
              Mission Control
            </span>
            <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, #00d4ff66, transparent)' }} />
          </motion.div>

          {/* Big Title */}
          <h1 style={{
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            fontWeight: 900, lineHeight: 0.9,
            letterSpacing: '-0.03em',
            marginBottom: '0.3em',
          }}>
            <span className="gradient-text">NEXUS</span>
          </h1>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
            fontWeight: 300, lineHeight: 1,
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.18)',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            Channels
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#475569', fontWeight: 500, letterSpacing: '0.02em' }}>
            Create or join a channel to start real-time communication.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-wrap gap-8 justify-center w-full" style={{ maxWidth: 900 }}>
          {[
            {
              key: 'create', icon: '✦', label: 'Create Channel',
              desc: 'Spin up a new private or public chatroom in seconds. Invite others and start collaborating instantly.',
              color: '#00d4ff', glow: 'rgba(0,212,255,0.12)', border: 'rgba(0,212,255,0.22)',
              bg: 'rgba(0,212,255,0.05)', num: '01',
            },
            {
              key: 'join', icon: '⊕', label: 'Join Channel',
              desc: 'Enter any existing room using its name. Connect with your team and jump right into the conversation.',
              color: '#9945ff', glow: 'rgba(153,69,255,0.12)', border: 'rgba(153,69,255,0.22)',
              bg: 'rgba(153,69,255,0.05)', num: '02',
            },
          ].map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10, scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
              onClick={() => { setRoomName(''); setOpenModal(card.key); }}
              style={{
                flex: '1 1 380px', maxWidth: 420,
                background: 'rgba(3,3,14,0.82)',
                border: `1px solid ${card.border}`,
                borderRadius: 28,
                padding: '2.5rem',
                cursor: 'pointer',
                position: 'relative', overflow: 'hidden',
                boxShadow: `0 0 80px ${card.glow}, 0 24px 48px rgba(0,0,0,0.5)`,
                backdropFilter: 'blur(24px)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              {/* Top gradient bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
              }} />
              {/* Corner accents */}
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: 40, height: 40,
                borderTop: `2px solid ${card.border}`,
                borderLeft: `2px solid ${card.border}`,
                borderTopLeftRadius: 26,
              }} />
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 40, height: 40,
                borderBottom: `2px solid ${card.border}`,
                borderRight: `2px solid ${card.border}`,
                borderBottomRightRadius: 26,
              }} />

              {/* Number badge */}
              <div style={{
                position: 'absolute', top: '1.8rem', right: '2rem',
                fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em',
                color: card.border, fontFamily: "'JetBrains Mono', monospace",
              }}>
                {card.num}
              </div>

              {/* Icon */}
              <div style={{
                width: 72, height: 72,
                borderRadius: 20,
                background: card.bg,
                border: `1px solid ${card.border}`,
                boxShadow: `0 0 24px ${card.glow}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', color: card.color,
                marginBottom: '2rem', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12), transparent)',
                }} />
                <span style={{ position: 'relative', zIndex: 1 }}>{card.icon}</span>
              </div>

              {/* Text */}
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: card.color, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
                {card.label}
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                {card.desc}
              </p>

              {/* Action row */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '1.5rem',
                borderTop: `1px solid ${card.border}44`,
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: card.color, letterSpacing: '0.04em' }}>
                  {card.label} →
                </span>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: card.bg, border: `1px solid ${card.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: card.color, fontSize: '1rem',
                }}>
                  →
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Create Modal */}
      <Modal isOpen={openModal === 'create'} onClose={() => setOpenModal('')} title="✦ Create Channel">
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#334155' }}>◎ Channel Name</label>
            <input value={roomName} onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. nexus-general" className="input-neon px-4 py-3.5" autoFocus />
          </div>
          <button type="submit" disabled={loading} className="btn-neon w-full py-4 flex items-center justify-center gap-2 text-sm">
            {loading ? <Spinner size={18} /> : '✦ Create Channel'}
          </button>
        </form>
      </Modal>

      {/* Join Modal */}
      <Modal isOpen={openModal === 'join'} onClose={() => setOpenModal('')} title="⊕ Join Channel">
        <form onSubmit={handleJoin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#334155' }}>◎ Channel Name</label>
            <input value={roomName} onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. yashroom" className="input-neon px-4 py-3.5" autoFocus />
          </div>
          <button type="submit" disabled={loading} className="btn-neon w-full py-4 flex items-center justify-center gap-2 text-sm">
            {loading ? <Spinner size={18} /> : '⊕ Join Channel'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
