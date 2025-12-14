export type LevelMeterOptions = {
  onLevel?: (rms: number) => void; // 0..1
  onBands?: (bands: number[]) => void; // length 7, 0..1 each
  onSpeakingChanged?: (speaking: boolean) => void;
  // Tuning
  threshold?: number; // RMS threshold for speaking
  fftSize?: number; // power of two
  smoothing?: number; // analyser.smoothingTimeConstant (0..1)
  falloff?: number; // extra UI EMA (0..1), higher = smoother/slower
};

export function attachRemoteLevelMeter(
  pc: RTCPeerConnection,
  opts: LevelMeterOptions = {},
): () => void {
  const threshold = opts.threshold ?? 0.1; // sensible default for speech
  const fftSize = opts.fftSize ?? 2048;
  const smoothing = opts.smoothing ?? 0.85;
  const falloff = opts.falloff ?? 0.6;

  let audioCtx: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let zeroGain: GainNode | null = null;
  let raf: number | undefined;
  let lastSpeaking = false;
  let emaRms = 0;
  let emaBands: number[] | null = null;
  let wiredStreamId: string | null = null;

  const Ctx: typeof AudioContext | undefined =
    (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;

  const handleTrack = (ev: RTCTrackEvent) => {
    if (!Ctx) return; // WebAudio unavailable (very old browsers)
    const [remoteStream] = ev.streams;
    if (!remoteStream) return;

    // avoid wiring multiple times for the same stream
    if (wiredStreamId === remoteStream.id) return;
    wiredStreamId = remoteStream.id;

    if (!audioCtx) audioCtx = new Ctx();
    // try to resume in case context was created without a user gesture
    audioCtx.resume().catch(() => undefined);

    const src = audioCtx.createMediaStreamSource(remoteStream);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = smoothing;

    // 🔈 IMPORTANT: ensure this branch of the graph renders.
    // Route through a zero-gain sink so nothing is heard.
    zeroGain = audioCtx.createGain();
    zeroGain.gain.value = 0;

    src.connect(analyser);
    analyser.connect(zeroGain);
    zeroGain.connect(audioCtx.destination);

    const freqBins = new Uint8Array(analyser.frequencyBinCount);
    const timeBuf = new Float32Array(analyser.fftSize);

    const bandPlan = makeLogBands(
      analyser.frequencyBinCount,
      audioCtx.sampleRate,
      [60, 120, 250, 500, 1000, 2000, 4000, 8000],
    );

    const loop = () => {
      if (!analyser) return;

      // RMS from time domain
      analyser.getFloatTimeDomainData(timeBuf);
      let sum = 0;
      for (let i = 0; i < timeBuf.length; i++) sum += timeBuf[i] * timeBuf[i];
      const rms = Math.sqrt(sum / timeBuf.length);
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
        for (let i = start; i <= end; i++)
          if (freqBins[i] > max) max = freqBins[i];
        return Math.pow(max / 255, 0.8); // normalize & gentle gamma
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
    raf = undefined;
    analyser?.disconnect();
    zeroGain?.disconnect();
    audioCtx?.close().catch(() => undefined);
    analyser = null;
    zeroGain = null;
    audioCtx = null;
    emaBands = null;
    wiredStreamId = null;
  };
}

/* ---------------- helpers ---------------- */

function ema(prev: number, next: number, k: number) {
  return prev * k + next * (1 - k);
}

type BandRange = { start: number; end: number };

function makeLogBands(
  binCount: number,
  sampleRate: number,
  edgesHz: number[],
): BandRange[] {
  const nyquist = sampleRate / 2;
  const freqPerBin = nyquist / binCount;
  const bands: BandRange[] = [];
  for (let i = 0; i < edgesHz.length - 1; i++) {
    const start = Math.max(0, Math.floor(edgesHz[i] / freqPerBin));
    const end = Math.min(binCount - 1, Math.ceil(edgesHz[i + 1] / freqPerBin));
    bands.push({ start, end });
  }
  return bands;
}
