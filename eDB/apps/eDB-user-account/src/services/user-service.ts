import {
  Application,
  SessionInfo,
  UpdateProfilePayload,
  UserInfo,
} from '../types/types';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5098/api/profile';

export async function getToken(): Promise<string | null> {
  return (
    document.querySelector('home-react')?.getAttribute('data-token') ||
    sessionStorage.getItem('access_token') ||
    null
  );
}

export async function fetchUserInfo(token: string): Promise<UserInfo | null> {
  const res = await fetch(`${BASE_URL}/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;

  return res.json();
}

export async function updateUserInfo(
  data: UpdateProfilePayload,
  token: string,
): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Update failed');
  }

  return res.json();
}

export async function changePassword(
  newPassword: string,
  signOutOthers: boolean,
  token: string,
): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password: newPassword, signOutOthers }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Password change failed');
  }
  return res.json();
}

export async function fetchPasswordMeta(token: string) {
  const res = await fetch(`${BASE_URL}/password-meta`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed loading password metadata');
  const { createdDate } = (await res.json()) as { createdDate?: number };
  return createdDate ?? null;
}

export async function fetchUserSessions(token: string): Promise<SessionInfo[]> {
  const res = await fetch(`${BASE_URL}/sessions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function revokeSession(sessionId: string, token: string) {
  const res = await fetch(`${BASE_URL}/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to revoke session');
  }
}

export async function fetchApplications(token: string): Promise<Application[]> {
  const res = await fetch(`${BASE_URL}/applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to load applications');
  }

  return res.json();
}
