// Hooks
import { useEffect, useState } from 'react';

// Components
import { Card } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';

// Services
import { fetchApplications, getToken } from '../../services/user-service';

// Types
import { Application } from '../../types/types';

export function ApplicationsView() {
  const [apps, setApps] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadApps() {
      const token = await getToken();
      if (!token) return;

      try {
        const data = await fetchApplications(token);
        setApps(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
      }
    }

    loadApps();
  }, []);

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-normal mb-8">Applications</h2>
      <p className="text-base text-muted-foreground">
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
