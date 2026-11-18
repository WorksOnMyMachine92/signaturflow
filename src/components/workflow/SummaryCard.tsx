type SummaryCardProps = { label: string; value: number; tone?: 'default' | 'warning' | 'success' };

export function SummaryCard({ label, value, tone = 'default' }: SummaryCardProps) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
