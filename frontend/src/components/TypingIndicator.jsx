export default function TypingIndicator({ users = [] }) {
  if (!users.length) return null;
  const label = users.length === 1 ? `${users[0]} is typing…` : `${users.join(', ')} are typing…`;
  return (
    <div className="flex items-center gap-2 px-6 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#00d4ff',
              animation: `bounce 1.2s ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}
