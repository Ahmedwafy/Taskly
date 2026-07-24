// intercepts navigations to /projects/[projectId]/tasks/details/[taskId]

// src > app > (pages) > projects > [projectId] > @taskModal > (.)tasks > details > [taskId] > page.tsx
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

  console.log(`taskId`, taskId); // taskId new

  return (
    <TaskDetailsPopUpModal
      taskId={taskId}
      projectId={projectId}
      onClose={() => router.back()}
    />
  );
}
/* 
    this page will show as a pop up when click on the task card
*/
