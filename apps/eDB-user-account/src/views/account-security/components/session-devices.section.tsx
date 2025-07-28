import { Button } from '../../../components/ui/button';
import { SessionInfo } from '../../../types/types';

type SessionProps = {
  sessions: SessionInfo[];
  onRevoke: (id: string) => void;
};

export function SessionDevicesSection({ sessions, onRevoke }: SessionProps) {
  if (sessions.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-base font-medium">Signed-in Devices</h4>
      <div className="mt-6 p-4 rounded-xl border bg-white/90 shadow-sm space-y-4">
        <ul className="space-y-3">
          {sessions.map((s) => (
            <li key={s.id} className="border rounded p-3 space-y-1 text-sm">
              <div>
                <strong>IP:</strong> {s.ipAddress}
              </div>
              <div>
                <strong>Clients:</strong> {Object.values(s.clients).join(', ')}
              </div>
              <div>
                <strong>Started:</strong> {new Date(s.start).toLocaleString()}
              </div>
              <div>
                <strong>Last Access:</strong>{' '}
                {new Date(s.lastAccess).toLocaleString()}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRevoke(s.id)}
              >
                Sign out this device
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
