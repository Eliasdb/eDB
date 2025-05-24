'use client';

import { useEffect, useState } from 'react';
import { getToken } from '../lib/user-service';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

type Application = {
  clientId: string;
  name: string;
  url: string;
  type: 'Internal' | 'External';
  status: 'In use' | 'Idle';
};

export function ApplicationsView() {
  const [apps, setApps] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadApps() {
      const token = await getToken();
      if (!token) return;

      try {
        const res = await fetch(
          'http://localhost:5098/api/profile/applications',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error('Failed to load apps');
        const data = await res.json();
        setApps(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      }
    }

    loadApps();
  }, []);

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Applications</h2>
      <p className="text-sm text-muted-foreground">
        View applications your account has access to.
      </p>

      <Separator />

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <Card key={app.clientId} className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">{app.name}</h4>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {app.url}
                  </a>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {app.type} • {app.status}
              </span>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
