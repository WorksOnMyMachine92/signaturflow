import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { AccessibilityPage } from '../features/accessibility/AccessibilityPage';
import { NotFoundPage } from '../features/NotFoundPage';
import { VerificationPage } from '../features/verification/VerificationPage';
import { CreateWorkflowPage } from '../features/workflows/CreateWorkflowPage';
import { WorkflowDetailPage } from '../features/workflows/WorkflowDetailPage';
import { RouteErrorPage } from '../features/RouteErrorPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      errorElement: <RouteErrorPage />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'vorgaenge/neu', element: <CreateWorkflowPage /> },
        { path: 'vorgaenge/:id', element: <WorkflowDetailPage /> },
        { path: 'pruefen', element: <VerificationPage /> },
        { path: 'barrierefreiheit', element: <AccessibilityPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
);
