// Regra brasileira compartilhada por cópia entre API, mobile e web.
const DDDS = new Set('11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' '));
export const PHONE_ERROR = 'Informe um telefone válido com DDD, como (11) 99999-9999.';
export function normalizePhone(value: unknown): string | null {
  if (typeof value !== 'string' || !/^[+\d\s().-]*$/.test(value)) return null;
  let digits = value.replace(/\D/g, '');
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) digits = digits.slice(2);
  return digits || null;
}
export function validPhone(value: unknown): boolean {
  const n = normalizePhone(value);
  return !!n && DDDS.has(n.slice(0, 2)) && /^(?:\d{2}[2-5]\d{7}|\d{2}9\d{8})$/.test(n);
}
export function formatPhone(value: string): string {
  const n = normalizePhone(value);
  if (!n) return value;
  if (n.length < 3) return n;
  const split = n.length > 10 ? 7 : 6;
  return '(' + n.slice(0,2) + ') ' + n.slice(2,split) + (n.length > split ? '-' + n.slice(split) : '');
}
