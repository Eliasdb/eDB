'use client';

import { Contact, Pencil } from 'lucide-react';
import * as React from 'react';
import { getToken, updateUserInfo, type UserInfo } from '../lib/user-service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type Props = { userInfo?: UserInfo | null };

export function PersonalInfoView({ userInfo }: Props) {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    displayName: '',
  });
  const [initial, setInitial] = React.useState(formData);
  const [editing, setEditing] = React.useState<keyof typeof formData | null>(
    null,
  );

  React.useEffect(() => {
    if (!userInfo) return;
    const filled = {
      firstName: userInfo.given_name || '',
      lastName: userInfo.family_name || '',
      username: userInfo.preferred_username || '',
      email: userInfo.email || '',
      displayName: userInfo.preferred_username || '',
    };
    setFormData(filled);
    setInitial(filled);
  }, [userInfo]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function submit(field: keyof typeof formData) {
    const token = await getToken();
    if (!token) return alert('No access token');
    if (formData[field] === initial[field]) {
      setEditing(null);
      return;
    }
    try {
      const res = await updateUserInfo(formData, token);
      alert(res.message);
      setInitial(formData);
      setEditing(null);
    } catch (e: any) {
      alert(e.message || 'Failed');
    }
  }

  const rows: { key: keyof typeof formData; label: string }[] = [
    { key: 'firstName', label: 'Name' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email address' },
    { key: 'displayName', label: 'Display name' },
  ];

  return (
    <section>
      <div className="flex items-center justify-between  pb-2">
        <h2 className="text-base font-medium flex items-center gap-2">
          <Contact className="w-5 h-5" />
          Personal information
        </h2>
      </div>
      <section className="text-sm bg-white space-y-6">
        {rows.map(({ key, label }) => {
          const isName = key === 'firstName';
          const displayValue =
            key === 'firstName'
              ? `${formData.firstName} ${formData.lastName}`.trim()
              : formData[key] || (
                  <span className="text-muted-foreground">Not set</span>
                );

          return (
            <div
              key={key}
              className={`
              border-t pt-4
              grid gap-y-2
              grid-cols-1
              md:grid-cols-[1fr_2fr_1fr]
              ${editing === key ? 'md:items-start' : 'md:items-center'}  
            `}
            >
              {/* 1: label + edit */}
              <div className="flex justify-between items-center md:justify-start md:col-start-1 md:col-end-2">
                <span className="font-medium">{label}</span>
                <div className="md:hidden w-[72px] flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`text-sm transition-opacity duration-150 ${
                      editing === key
                        ? 'opacity-0 pointer-events-none'
                        : 'opacity-100'
                    }`}
                    onClick={() => setEditing(key)}
                  >
                    Edit <Pencil className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* 2: value or input */}
              <div className="md:col-start-2 md:col-end-3 flex flex-col gap-2">
                {editing === key ? (
                  <>
                    <span className="text-sm font-base text-muted-foreground">
                      Update your {label.toLowerCase()}
                    </span>
                    {isName ? (
                      <div className="flex flex-col gap-4 mt-4">
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="firstName">First name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full text-sm h-10 md:max-w-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full text-sm h-10 md:max-w-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <Input
                        id={key}
                        name={key}
                        type={key === 'email' ? 'email' : 'text'}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-full text-sm h-10 md:max-w-xs"
                      />
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{displayValue}</span>
                    {key === 'email' && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: '#f1f6fd',
                          color: '#2a5bd7',
                          fontWeight: 500,
                        }}
                      >
                        Primary
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* 3: action on desktop, buttons on edit */}
              <div className="md:col-start-3 md:col-end-4 text-right flex flex-col items-end gap-2">
                <div className="hidden md:block relative">
                  {editing !== key && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-sm absolute top-1/2 right-0 -translate-y-1/2"
                      onClick={() => setEditing(key)}
                    >
                      Edit <Pencil className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>

                {editing === key && (
                  <div className="w-full flex flex-col md:flex-row md:justify-end gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full md:w-auto"
                      onClick={() => {
                        setFormData(initial);
                        setEditing(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="w-full md:w-auto"
                      onClick={() => submit(key)}
                      disabled={formData[key] === initial[key]}
                    >
                      Update
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </section>
  );
}
