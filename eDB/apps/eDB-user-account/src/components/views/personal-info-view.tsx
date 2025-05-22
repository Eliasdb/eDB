'use client';

import * as React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type Props = {
  userInfo?: {
    email: string;
    given_name: string;
    family_name: string;
    preferred_username: string;
  } | null;
};

export function PersonalInfoView({ userInfo }: Props) {
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  React.useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.preferred_username || '',
        email: userInfo.email || '',
        firstName: userInfo.given_name || '',
        lastName: userInfo.family_name || '',
      });
    }
  }, [userInfo]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = sessionStorage.getItem('access_token');
    // const res = await fetch('http://localhost:5098/api/profile/update', {
    const res = await fetch(
      'https://api.staging.eliasdebock.com/platform/api/profile/update',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      },
    );

    const result = await res.json();
    if (res.ok) {
      alert(result.message);
    } else {
      alert(result.message || 'Update failed');
    }
  }

  return (
    <section className="rounded-xl bg-muted/50 md:min-h-min">
      <h2 className="text-xl font-semibold">Personal Info</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Manage your basic information
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </section>
  );
}
