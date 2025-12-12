export type RealtimeToken = { enabled: boolean; url: string; token: string };

export type RealtimeOptions = {
  bearer?: string;
  // keep room for future hooks, but not required yet
  onToolEffect?: (name: string, args: any, result: any) => void;
  onInvalidate?: () => void;

  // 🔊 visualizer callbacks
  onLevel?: (rms: number) => void; // 0..1
  onSpeakingChanged?: (speaking: boolean) => void;
};

export type RealtimeConnections = {
  pc: RTCPeerConnection;
  dc: RTCDataChannel;
  close: () => void;
};
