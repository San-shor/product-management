export const API_BASE_URL = 'https://api.bitechx.com';

export async function postAuth(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error('Authentication failed');
  }

  return res.json(); // should return { token: "..." }
}
