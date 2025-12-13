import type { RTCPeerConnection } from 'react-native-webrtc';

// Poll inbound/outbound audio levels using WebRTC stats.
// Returns a detach() function.
export function attachRemoteLevelMeter(
  pc: RTCPeerConnection,
  opts: {
    onLevel?: (v: number) => void;
    onSpeakingChanged?: (b: boolean) => void;
    threshold?: number; // 0..1
    intervalMs?: number; // poll rate
  } = {},
) {
  const threshold = opts.threshold ?? 0.7;
  const intervalMs = opts.intervalMs ?? 250;

  let speaking = false;
  async function sample() {
    try {
      const stats = await pc.getStats();
      let level = 0;

      stats.forEach((report: any) => {
        // Modern stats: audioLevel ∈ [0..1]
        if (
          report.type === 'inbound-rtp' &&
          report.kind === 'audio' &&
          typeof report.audioLevel === 'number'
        ) {
          level = Math.max(level, report.audioLevel);
        }
        // Fallback: totalAudioEnergy / totalSamplesDuration → normalize roughly
        if (
          report.type === 'inbound-rtp' &&
          report.kind === 'audio' &&
          typeof report.totalAudioEnergy === 'number' &&
          typeof report.totalSamplesDuration === 'number' &&
          report.totalSamplesDuration > 0
        ) {
          const approx = Math.min(
            1,
            Math.sqrt(report.totalAudioEnergy / report.totalSamplesDuration),
          );
          level = Math.max(level, approx);
        }
      });

      opts.onLevel?.(level);

      const nowSpeaking = level >= threshold;
      if (nowSpeaking !== speaking) {
        speaking = nowSpeaking;
        opts.onSpeakingChanged?.(speaking);
      }
    } catch {
      // ignore sampling errors
    }
  }

  const timer = setInterval(sample, intervalMs);

  return () => {
    clearInterval(timer);
  };
}
