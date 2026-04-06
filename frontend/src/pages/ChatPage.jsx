import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar          from '../components/Navbar';
import MessageBubble   from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import Skeleton        from '../components/Skeleton';
import ThreeBackground from '../components/ThreeBackground';
import Spinner         from '../components/Spinner';

import wsService from '../services/websocketService';
import { getChatHistory } from '../services/chatroomService';
import {
  setCurrentRoom, addMessage, prependMessages,
  incrementPage, setHasMore, addTypingUser, removeTypingUser,
} from '../store/chatroomSlice';
import { playNotificationSound } from '../utils/sounds';
import { PAGE_SIZE } from '../utils/constants';

export default function ChatPage() {
  const { chatroomId }  = useParams();
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const { user }        = useSelector((s) => s.auth);
  const { currentRoom, messages, page, hasMore, typingUsers } =
    useSelector((s) => s.chatroom);

  const [input,       setInput]       = useState('');
  const [wsReady,     setWsReady]     = useState(false);
  const [histLoading, setHistLoading] = useState(true);

  const bottomRef      = useRef(null);
  const typingTimerRef = useRef(null);
  const listRef        = useRef(null);

  useEffect(() => {
    if (!chatroomId) return;
    if (!currentRoom || currentRoom.id !== chatroomId) {
      dispatch(setCurrentRoom({ id: chatroomId, name: chatroomId }));
    }
    loadHistory(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId]);

  const loadHistory = useCallback(async (pageNum, reset = false) => {
    try {
      setHistLoading(true);
      const res  = await getChatHistory(chatroomId, pageNum, PAGE_SIZE);
      const msgs = res.data?.content ?? res.data ?? [];
      const last = res.data?.last    ?? msgs.length < PAGE_SIZE;
      const formattedMsgs = msgs.map(m => ({
        ...m,
        sender:    typeof m.sender === 'object' ? m.sender?.username : (m.sender || 'Anonymous'),
        timestamp: m.timestamp || m.timeStamp || new Date().toISOString(),
      }));
      if (reset) {
        dispatch({ type: 'chatroom/setMessages', payload: formattedMsgs });
      } else {
        dispatch(prependMessages(formattedMsgs));
      }
      dispatch(setHasMore(!last));
      if (!reset && pageNum > 0) dispatch(incrementPage());
    } catch (_) {} finally { setHistLoading(false); }
  }, [chatroomId, dispatch]);

  const fetchMoreHistory = () => {
    if (!hasMore || histLoading) return;
    loadHistory(page + 1, false);
    dispatch(incrementPage());
  };

  useEffect(() => {
    if (!chatroomId) return;
    const roomName = currentRoom?.name ?? chatroomId;
    wsService.connect(
      roomName,
      (msg) => {
        if (msg.type === 'TYPING') {
          msg.isTyping && msg.sender !== user?.username
            ? dispatch(addTypingUser(msg.sender))
            : dispatch(removeTypingUser(msg.sender));
          return;
        }
        const formatted = {
          ...msg,
          sender:    msg.sender  || msg.username || msg.senderName || 'Anonymous',
          timestamp: msg.timestamp || new Date().toISOString(),
        };
        dispatch(addMessage(formatted));
        if (formatted.sender !== user?.username) playNotificationSound();
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      },
      () => setWsReady(true)
    );
    return () => { wsService.disconnect(); setWsReady(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId]);

  useEffect(() => {
    if (!histLoading && messages.length > 0 && page === 0) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'instant' }), 100);
    }
  }, [histLoading]);

  const sendMessage = () => {
    const content = input.trim();
    if (!content || !wsReady) return;
    const msg = {
      sender:      user?.username ?? 'Anonymous',
      senderEmail: user?.email    ?? 'anonymous@example.com',
      content,
      timestamp:   new Date().toISOString(),
      roomName:    currentRoom?.name ?? chatroomId,
    };
    wsService.sendMessage(chatroomId, msg);
    setInput('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    wsService.sendTyping(chatroomId, user?.username, true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => wsService.sendTyping(chatroomId, user?.username, false), 1500);
  };

  return (
    <div className="page flex flex-col h-screen overflow-hidden">
      <ThreeBackground />
      <Navbar />

      {/* Chat container */}
      <div className="flex flex-1 min-h-0 w-full max-w-7xl mx-auto px-3 sm:px-6 pb-4 pt-3" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="flex flex-col flex-1 min-h-0 overflow-hidden relative"
          style={{
            background: 'rgba(3,3,14,0.78)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 28,
            backdropFilter: 'blur(28px)',
            boxShadow: '0 0 60px rgba(0,212,255,0.04), 0 40px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] z-10"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), rgba(153,69,255,0.4), transparent)' }} />

          {/* Room header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 px-6 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            {/* Status dot */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full animate-pulse-neon"
                style={{ background: wsReady ? '#00ff87' : '#ff6b6b' }} />
              <span className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: wsReady ? '#00ff87' : '#ff6b6b' }}>
                {wsReady ? 'Live' : 'Connecting'}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {/* Room name */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-black gradient-text tracking-wide">
                # {currentRoom?.name ?? chatroomId}
              </span>
            </div>

            {/* Back button */}
            <motion.button
              onClick={() => navigate('/dashboard')}
              whileHover={{ x: -2 }}
              className="ml-auto text-sm px-4 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#475569',
              }}
            >
              ← Back
            </motion.button>
          </motion.div>

          {/* Messages */}
          <div
            id="scrollable-messages" ref={listRef}
            className="flex-1 overflow-y-auto scroll-smooth"
            style={{ display: 'flex', flexDirection: 'column', padding: '12px 8px' }}
          >
            {hasMore ? (
              <div className="flex justify-center py-5">
                <button onClick={fetchMoreHistory} disabled={histLoading}
                  className="px-5 py-2 rounded-2xl text-xs font-bold tracking-wide transition-all"
                  style={{
                    background: 'rgba(0,212,255,0.07)',
                    border: '1px solid rgba(0,212,255,0.18)',
                    color: '#00d4ff',
                  }}>
                  {histLoading ? <Spinner size={16} /> : '↑ Load previous messages'}
                </button>
              </div>
            ) : <div className="py-6" />}

            {histLoading && messages.length === 0 && <div className="py-4"><Skeleton count={6} /></div>}

            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <MessageBubble key={`${msg.timestamp}-${i}`} message={msg} />
              ))}
            </AnimatePresence>

            {!histLoading && messages.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-28 text-center">
                <div className="text-7xl mb-5 animate-float">💬</div>
                <p className="font-black text-xl gradient-text mb-2">No messages yet</p>
                <p className="text-sm font-medium" style={{ color: '#334155' }}>Be the first to transmit</p>
              </motion.div>
            )}

            <AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-3">
                  <TypingIndicator users={typingUsers} />
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={bottomRef} className="h-2" />
          </div>

          {/* Input bar */}
          <div
            className="shrink-0 px-4 py-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-2xl transition-all duration-300 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <textarea
                rows={1} value={input}
                onChange={handleTyping} onKeyDown={handleKeyDown}
                placeholder={wsReady ? 'Type a message… (⏎ to send)' : 'Establishing secure connection…'}
                disabled={!wsReady}
                className="flex-1 bg-transparent outline-none resize-none py-2.5 text-base placeholder-[#1e293b]"
                style={{ color: '#e2e8f0', fontFamily: 'Outfit, sans-serif', maxHeight: 140, lineHeight: '1.5' }}
              />

              {/* Send button */}
              <motion.button
                onClick={sendMessage}
                disabled={!wsReady || !input.trim()}
                whileHover={{ scale: input.trim() && wsReady ? 1.08 : 1 }}
                whileTap={{ scale: input.trim() && wsReady ? 0.92 : 1 }}
                className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: input.trim() && wsReady
                    ? 'linear-gradient(135deg, #00d4ff, #9945ff)'
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: input.trim() && wsReady ? '0 0 20px rgba(0,212,255,0.4)' : 'none',
                  border: input.trim() && wsReady ? 'none' : '1px solid rgba(255,255,255,0.07)',
                  cursor: input.trim() && wsReady ? 'pointer' : 'not-allowed',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>

            {/* Status line */}
            <div className="text-center mt-1.5">
              <span className="text-[10px] font-medium tracking-wide" style={{ color: '#1e293b' }}>
                {wsReady ? `✦ Connected as ${user?.username}` : '⟳ Securing connection…'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
