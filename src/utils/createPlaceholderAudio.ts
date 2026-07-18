function writeString(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

export function createPlaceholderAudio(notes: number[]) {
  const sampleRate = 22050;
  const duration = 2.8;
  const frameCount = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + frameCount);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + frameCount, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeString(view, 36, 'data');
  view.setUint32(40, frameCount, true);

  for (let frame = 0; frame < frameCount; frame += 1) {
    const time = frame / sampleRate;
    const note = notes[Math.floor((time / 0.7) % notes.length)];
    const attack = Math.min(1, frame / 1500);
    const release = Math.min(1, (frameCount - frame) / 3000);
    const envelope = attack * release;
    const sample =
      (Math.sin(2 * Math.PI * note * time) * 0.18 +
        Math.sin(2 * Math.PI * note * 1.5 * time) * 0.05) *
      envelope;
    view.setUint8(44 + frame, Math.max(0, Math.min(255, sample * 127 + 128)));
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const slice = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...slice);
  }

  return `data:audio/wav;base64,${btoa(binary)}`;
}
