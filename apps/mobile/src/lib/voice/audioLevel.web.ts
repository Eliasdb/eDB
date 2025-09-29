// Robust remote level & spectrum analyzer for the RTCPeerConnection remote audio.
// Produces smoothed RMS, speaking boolean, and 7 log-spaced bands (0..1).

export type LevelMeterOptions = {
  onLevel?: (rms: number) => void; // 0..1
  onBands?: (bands: number[]) => void; // length 7, 0..1 each
  onSpeakingChanged?: (speaking: boolean) => void;
  // Tuning
  threshold?: number; // speaking threshold on RMS
  fftSize?: number; // analyser FFT size (power of two)
  smoothing?: number; // analyser smoothingTimeConstant (0..1)
  falloff?: number; // additional EMA for UI smoothing (0..1, higher = more smoothing)
};

export function attachRemoteLevelMeter(
  pc: RTCPeerConnection,
  opts: LevelMeterOptions = {},
): () => void {
  const threshold = opts.threshold ?? 0.05; // slightly lower so it lights up
  const fftSize = opts.fftSize ?? 2048;
  const smoothing = opts.smoothing ?? 0.85;
  const falloff = opts.falloff ?? 0.6;

  let audioCtx: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let raf: number | undefined;
  let lastSpeaking = false;
  let emaRms = 0; // UI-smoothed RMS
  let emaBands: number[] | null = null; // UI-smoothed bands

  const Ctx: typeof AudioContext | undefined =
    (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;

  const handleTrack = (ev: RTCTrackEvent) => {
    if (!Ctx) return; // WebAudio unavailable
    const [remoteStream] = ev.streams;
    if (!remoteStream) return;

    if (!audioCtx) audioCtx = new Ctx();
    // Some browsers require resume on user gesture; your mic button click typically satisfies that.
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    const src = audioCtx.createMediaStreamSource(remoteStream);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = smoothing;

    // Wire graph
    src.connect(analyser);

    const freqBins = new Uint8Array(analyser.frequencyBinCount);
    const timeBuf = new Float32Array(analyser.fftSize);

    const bandPlan = makeLogBands(
      analyser.frequencyBinCount,
      audioCtx.sampleRate,
      [
        60,
        120,
        250,
        500,
        1000,
        2000,
        4000,
        8000, // 8 cut points -> 7 bands
      ],
    );

    const loop = () => {
      if (!analyser) return;

      // RMS from time domain
      analyser.getFloatTimeDomainData(timeBuf);
      let sum = 0;
      for (let i = 0; i < timeBuf.length; i++) {
        const v = timeBuf[i];
        sum += v * v;
      }
      const rms = Math.sqrt(sum / timeBuf.length); // ~0..1-ish
      // UI EMA
      emaRms = emaRms === 0 ? rms : ema(emaRms, rms, falloff);

      opts.onLevel?.(emaRms);

      const speaking = emaRms > threshold;
      if (speaking !== lastSpeaking) {
        lastSpeaking = speaking;
        opts.onSpeakingChanged?.(speaking);
      }

      // Frequency bands
      analyser.getByteFrequencyData(freqBins);
      const bandsNow = bandPlan.map(({ start, end }) => {
        let max = 0;
        for (let i = start; i <= end; i++) {
          if (freqBins[i] > max) max = freqBins[i];
        }
        // Normalize 0..1 from 0..255 and add slight gamma for nicer motion
        const v = Math.pow(max / 255, 0.8);
        return v;
      });

      if (!emaBands) {
        emaBands = bandsNow;
      } else {
        for (let i = 0; i < emaBands.length; i++) {
          emaBands[i] = ema(emaBands[i], bandsNow[i], falloff);
        }
      }
      opts.onBands?.(emaBands.slice());

      raf = requestAnimationFrame(loop);
    };

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  };

  pc.addEventListener('track', handleTrack);

  return () => {
    pc.removeEventListener('track', handleTrack);
    if (raf) cancelAnimationFrame(raf);
    if (audioCtx) {
      try {
        audioCtx.close();
      } catch {}
    }
    analyser = null;
    audioCtx = null;
    emaBands = null;
  };
}

/* ---------------- helpers ---------------- */

function ema(prev: number, next: number, k: number) {
  // k in [0..1]: higher = more smoothing (slower)
  return prev * k + next * (1 - k);
}

type BandRange = { start: number; end: number };

function makeLogBands(
  binCount: number,
  sampleRate: number,
  edgesHz: number[], // sorted ascending
): BandRange[] {
  const nyquist = sampleRate / 2;
  const freqPerBin = nyquist / binCount;
  // edges define limits. We produce ranges between consecutive edges.
  const bands: BandRange[] = [];
  for (let i = 0; i < edgesHz.length - 1; i++) {
    const f1 = edgesHz[i];
    const f2 = edgesHz[i + 1];
    const start = Math.max(0, Math.floor(f1 / freqPerBin));
    const end = Math.min(binCount - 1, Math.ceil(f2 / freqPerBin));
    bands.push({ start, end });
  }
  return bands;
}
