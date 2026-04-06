import { motion } from 'framer-motion';
import { formatTime, getInitials, stringToHue } from '../utils/helpers';
import { useSelector } from 'react-redux';

const bubbleVariants = {
  hidden:  { opacity: 0, y: 16, scale: 0.92 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', damping: 22, stiffness: 280 },
  },
};

export default function MessageBubble({ message }) {
  const { user } = useSelector((s) => s.auth);
  const isMine   = message.sender === user?.username;
  const hue      = stringToHue(message.sender || '');
  const initials = getInitials(message.sender);

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-3 px-4 py-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center text-sm font-bold select-none relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, hsl(${hue},65%,35%), hsl(${(hue+40)%360},70%,45%))`,
          boxShadow: isMine
            ? `0 0 14px rgba(0,212,255,0.5), 0 4px 12px rgba(0,0,0,0.4)`
            : `0 4px 10px rgba(0,0,0,0.3)`,
          fontFamily: "'JetBrains Mono', monospace",
          border: isMine ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* shimmer overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <span className="relative z-10">{initials}</span>
      </div>

      {/* Bubble + meta */}
      <div className={`flex flex-col gap-1.5 max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
        {/* Sender + Timestamp */}
        <div className={`flex items-center gap-2 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
          <span
            className="text-xs font-bold tracking-wide"
            style={{ color: `hsl(${hue},80%,68%)`, textShadow: `0 0 8px hsl(${hue},80%,50%)` }}
          >
            {message.sender}
          </span>
          <span className="text-[10px] font-medium" style={{ color: '#334155' }}>
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Content bubble */}
        <div
          className={`px-5 py-3.5 text-[0.92rem] leading-relaxed tracking-wide relative overflow-hidden ${isMine ? 'msg-mine' : 'msg-theirs'}`}
          style={{
            borderRadius: isMine ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
            color: isMine ? '#e2e8f0' : '#cbd5e1',
          }}
        >
          {/* Subtle scan line for own messages */}
          {isMine && (
            <div className="absolute left-0 top-0 w-full h-[1px] opacity-20"
              style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }} />
          )}
          <span className="relative z-10">{message.content}</span>
        </div>
      </div>
    </motion.div>
  );
}
