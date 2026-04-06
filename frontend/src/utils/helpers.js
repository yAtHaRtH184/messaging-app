/** Format an ISO timestamp → "HH:MM am/pm" */
export function formatTime(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return '';
  }
}

/** Get the first letter(s) of a name for the avatar */
export function getInitials(name) {
  if (!name) return '?';
  return name.slice(0, 2).toUpperCase();
}

/** Deterministic hue from a string (for colour-coding usernames) */
export function stringToHue(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}
