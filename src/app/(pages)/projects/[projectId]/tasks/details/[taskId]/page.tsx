// src > app > (pages) > projects > [projectId] > tasks > [taskId] > page.tsx

// Without it, refreshing / Drirect Visit on the modal URL will 404

'use client';

import TaskDetailsPopUpModal from '@/app/components/organisms/TaskDetailsPopUpModal';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface TaskPageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
}
export default function TaskPage({ params }: TaskPageProps) {
  const { projectId, taskId } = use(params);
  const router = useRouter();

  return (
    <div>
      <TaskDetailsPopUpModal
        taskId={taskId}
        projectId={projectId}
        onClose={() => router.back()}
      />
    </div>
  );
}
