// components/lib/user-service.ts

export type UserInfo = {
  email: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
};

export type UpdateProfilePayload = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
};

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
