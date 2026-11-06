export function socialUrl(network: 'facebook' | 'instagram', raw: unknown): string | null {
  const value = String(raw ?? '').trim();
  if (!value) return '';
  if (/\s/.test(value)) return null;
  const username = value.replace(/^@/, '');
  const pattern = network === 'instagram' ? /^[a-z\d._]{1,30}$/i : /^[a-z\d.]{1,100}$/i;
  if (pattern.test(username) && !/\.(com|net|org)$/i.test(username)) return `https://www.${network}.com/${username}`;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const host = url.hostname.replace(/^(www\.|m\.)/, '').toLowerCase();
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) return null;
    if (host !== `${network}.com` && !(network === 'facebook' && host === 'fb.com')) return null;
    const path = url.pathname.replace(/\/+$/, '');
    if (!path || path === '/') return null;
    if (network === 'instagram' && !/^\/[a-z\d._]{1,30}$/i.test(path)) return null;
    if (network === 'facebook' && path === '/profile.php') {
      const id = url.searchParams.get('id');
      return id && /^\d+$/.test(id) ? `https://www.facebook.com/profile.php?id=${id}` : null;
    }
    return `https://www.${network}.com${path}`;
  } catch { return null; }
}
