// lib/totp-service.ts

const API = 'http://localhost:5098/api/profile';

export async function fetchTotpSetup(token: string) {
  const res = await fetch('/realms/eDB/totp-setup', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch TOTP setup data');
  return res.json();
}

export async function confirmTotpSetup(
  token: string,
  code: string,
  label: string,
) {
  const res = await fetch('/realms/eDB/totp-setup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code, label }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'TOTP verification failed');
  }
}

export async function fetchOtpDevices(token: string) {
  const res = await fetch(`${API}/otp-devices`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Cannot load devices');
  return res.json(); // already filtered to OTP
}

export async function deleteOtpDevice(token: string, id: string) {
  const res = await fetch(`${API}/otp-devices/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Delete failed');
}
