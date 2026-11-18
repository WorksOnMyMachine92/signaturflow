import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { VerificationPage } from '../features/verification/VerificationPage';
import { CreateWorkflowPage } from '../features/workflows/CreateWorkflowPage';
import { WorkflowDetailPage } from '../features/workflows/WorkflowDetailPage';

function Placeholder({ title }: { title: string }) {
  return (
    <section className="content-panel">
      <h1>{title}</h1>
      <p>Dieser Bereich wird im nächsten Umsetzungsschritt ergänzt.</p>
    </section>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'vorgaenge/neu', element: <CreateWorkflowPage /> },
        { path: 'vorgaenge/:id', element: <WorkflowDetailPage /> },
        { path: 'pruefen', element: <VerificationPage /> },
        { path: 'barrierefreiheit', element: <Placeholder title="Barrierefreiheit" /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
);
