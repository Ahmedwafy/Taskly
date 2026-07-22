// intercepts navigations to /projects/[projectId]/tasks/[taskId]

// src > app > (pages) > projects > [projectId] > @taskModal > (.)tasks > [taskId] > page.tsx
'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import TaskDetailsPopUpModal from '@/app/components/organisms/TaskDetailsPopUpModal';

export default function InterceptedTaskModal({
  params,
}: {
  params: Promise<{ projectId: string; taskId: string }>;
}) {
  const router = useRouter();
  const { projectId, taskId } = use(params);

  return (
    <TaskDetailsPopUpModal
      taskId={taskId}
      projectId={projectId}
      onClose={() => router.back()}
    />
  );
}
