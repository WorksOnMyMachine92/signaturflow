async function readFile(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === 'function') return file.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('read failed'));
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.readAsArrayBuffer(file);
  });
}

export async function sha256File(file: File): Promise<string> {
  if (file.size === 0) throw new Error('Die Datei ist leer.');
  try {
    const fileBuffer = await readFile(file);
    const bytes = Uint8Array.from(new Uint8Array(fileBuffer));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  } catch (error) {
    if (error instanceof Error && error.message === 'Die Datei ist leer.') throw error;
    throw new Error('Die Datei konnte nicht gelesen werden.');
  }
}

export function formatFingerprint(hash: string): string {
  return (
    hash
      .toUpperCase()
      .match(/.{1,4}/g)
      ?.join(' ') ?? hash.toUpperCase()
  );
}
