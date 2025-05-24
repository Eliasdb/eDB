'use client';

import * as React from 'react';
import { getToken, updateUserInfo, type UserInfo } from '../lib/user-service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type Props = {
  userInfo?: UserInfo | null;
};

export function PersonalInfoView({ userInfo }: Props) {
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  const [initialFormData, setInitialFormData] = React.useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  React.useEffect(() => {
    if (userInfo) {
      const filled = {
        username: userInfo.preferred_username || '',
        email: userInfo.email || '',
        firstName: userInfo.given_name || '',
        lastName: userInfo.family_name || '',
      };
      setFormData(filled);
      setInitialFormData(filled);
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
    const token = await getToken();
    if (!token) {
      alert('No access token found.');
      return;
    }

    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      alert('No changes detected.');
      return;
    }

    try {
      const result = await updateUserInfo(
        {
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        token,
      );
      alert(result.message);
      setInitialFormData(formData); // update baseline after successful save
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  }

  const isUnchanged =
    JSON.stringify(formData) === JSON.stringify(initialFormData);

  return (
    <section className="rounded-xl bg-muted/50 md:min-h-min">
      <h2 className="text-xl font-semibold mb-8">Personal Info</h2>
      <p className="text-base text-muted-foreground mb-8">
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
        <Button type="submit" disabled={isUnchanged}>
          Save Changes
        </Button>
      </form>
    </section>
  );
}
