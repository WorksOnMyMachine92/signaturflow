import { z } from 'zod';

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

function toLocalDateString(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function buildCreateWorkflowSchema(today = new Date()) {
  const minimumDate = toLocalDateString(today);
  return z.object({
    title: z.string().trim().min(3, 'Geben Sie einen Dokumenttitel ein.'),
    signerName: z.string().trim().min(2, 'Geben Sie den Namen der unterzeichnenden Person ein.'),
    signerEmail: z.email('Geben Sie eine gültige Demo-E-Mail-Adresse ein.'),
    dueDate: z
      .string()
      .min(1, 'Wählen Sie eine Frist.')
      .refine((value) => value >= minimumDate, 'Die Frist darf nicht in der Vergangenheit liegen.'),
    note: z.string().max(500, 'Die Notiz darf höchstens 500 Zeichen enthalten.'),
    file: z
      .instanceof(File, { error: 'Wählen Sie ein PDF-Dokument.' })
      .refine((file) => file.size > 0, 'Die Datei ist leer.')
      .refine((file) => file.size <= MAX_FILE_SIZE, 'Die Datei darf höchstens 10 MB groß sein.')
      .refine(
        (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'),
        'Wählen Sie eine PDF-Datei.',
      ),
  });
}

export const createWorkflowSchema = buildCreateWorkflowSchema();
export type CreateWorkflowFields = z.infer<typeof createWorkflowSchema>;
