// Web Crypto API based token authentication (Edge & Node compatible, zero third-party edge issues)

const SECRET = process.env.JWT_SECRET || 'flags-battle-secret-jwt-key-2026-very-secure';
export const COOKIE_NAME = 'flag_session';

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return Buffer.from(b64, 'base64').toString();
}

export async function createSession(username: string): Promise<string> {
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const payload = JSON.stringify({
    username,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600, // 12 hours
    iat: Math.floor(Date.now() / 1000),
  });

  const headerB64 = base64UrlEncode(header);
  const payloadB64 = base64UrlEncode(payload);
  const data = `${headerB64}.${payloadB64}`;

  const key = await getKey();
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const signatureB64 = Buffer.from(signatureBuffer)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signatureB64}`;
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const data = `${headerB64}.${payloadB64}`;

    const key = await getKey();
    const enc = new TextEncoder();

    let sigB64 = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    while (sigB64.length % 4) sigB64 += '=';
    const sigBytes = Uint8Array.from(Buffer.from(sigB64, 'base64'));

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(data));
    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
