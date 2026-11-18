import { formatFingerprint, sha256File } from './hash';

describe('document hashing', () => {
  it('computes a known SHA-256 vector in uppercase', async () => {
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
    expect(await sha256File(file)).toBe(
      '2CF24DBA5FB0A30E26E83B2AC5B9E29E1B161E5C1FA7425E73043362938B9824',
    );
  });

  it('formats fingerprints in readable groups', () => {
    expect(formatFingerprint('AABBCCDDEEFF0011')).toBe('AABB CCDD EEFF 0011');
  });

  it('rejects empty and unreadable files with a German message', async () => {
    await expect(sha256File(new File([], 'empty.pdf'))).rejects.toThrow('Datei ist leer');
    const unreadable = { size: 10, arrayBuffer: () => Promise.reject(new Error('broken')) } as File;
    await expect(sha256File(unreadable)).rejects.toThrow('Datei konnte nicht gelesen werden');
  });
});
