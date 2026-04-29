// ===== ROOM FORMAT UTILS =====

window.formatDisplayRoom = function (roomNumber) {
  const raw = String(roomNumber || '').trim();

  if (!raw) return '-';
  if (raw.length < 4) return raw;

  const prefix = raw.slice(0, 2) + '0';
  const suffix = parseInt(raw.slice(-2), 10);

  if (Number.isNaN(suffix)) return raw;

  return `${prefix}/${suffix}`;
};
