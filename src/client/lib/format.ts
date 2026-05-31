export function formatPrice(amount: number, currency = 'NPR') {
  const symbol = currency === 'NPR' ? 'Rs.' : currency;
  return `${symbol} ${amount.toLocaleString('en-IN')}`;
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem('gph_session_id');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
    localStorage.setItem('gph_session_id', id);
  }
  return id;
}
