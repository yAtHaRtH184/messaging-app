export default function Spinner({ size = 32 }) {
  return (
    <div
      style={{
        width: size, height: size,
        border: `3px solid rgba(0,212,255,0.2)`,
        borderTop: `3px solid #00d4ff`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}

// inject spin keyframe once
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
if (!document.head.querySelector('[data-spinner]')) {
  style.setAttribute('data-spinner', '');
  document.head.appendChild(style);
}
