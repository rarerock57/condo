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

window.formatMoney = function (value) {
  const num = Number(value || 0);
  if (Number.isNaN(num)) return '0 บาท';

  return num.toLocaleString('th-TH') + ' บาท';
};

window.formatThaiDate = function (date) {
  if (!date) return '-';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '-';

  return parsedDate.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
