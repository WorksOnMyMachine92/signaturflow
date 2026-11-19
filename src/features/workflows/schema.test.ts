import { buildCreateWorkflowSchema, MAX_FILE_SIZE } from './schema';

const base = {
  title: 'Testdokument',
  signerName: 'Mara Beispiel',
  signerEmail: 'mara@example.test',
  dueDate: '2026-11-20',
  note: '',
  signatureMethod: 'typed_demo' as const,
};

function pdf(name = 'demo.pdf', content = 'PDF') {
  return new File([content], name, { type: 'application/pdf' });
}

describe('create workflow validation', () => {
  const schema = buildCreateWorkflowSchema(new Date(2026, 10, 18, 12));

  it.each([
    ['title', { ...base, title: '', file: pdf() }],
    ['signerName', { ...base, signerName: '', file: pdf() }],
    ['signerEmail', { ...base, signerEmail: 'ungueltig', file: pdf() }],
    ['dueDate', { ...base, dueDate: '2026-11-17', file: pdf() }],
    ['note', { ...base, note: 'x'.repeat(501), file: pdf() }],
  ])('rejects invalid %s input', (_field, value) =>
    expect(schema.safeParse(value).success).toBe(false),
  );

  it('accepts a PDF by MIME type or file extension', () => {
    expect(schema.safeParse({ ...base, file: pdf() }).success).toBe(true);
    expect(schema.safeParse({ ...base, file: new File(['x'], 'demo.pdf') }).success).toBe(true);
  });

  it('rejects empty, non-PDF, and oversized files', () => {
    expect(schema.safeParse({ ...base, file: pdf('empty.pdf', '') }).success).toBe(false);
    expect(
      schema.safeParse({ ...base, file: new File(['x'], 'demo.txt', { type: 'text/plain' }) })
        .success,
    ).toBe(false);
    const large = new File([new Uint8Array(MAX_FILE_SIZE + 1)], 'large.pdf', {
      type: 'application/pdf',
    });
    expect(schema.safeParse({ ...base, file: large }).success).toBe(false);
  });
});
