// src/app/components/organisms/CreateNewTaskForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/redux/reduxHooks';
import { fetchProjectMembers } from '@/features/members/membersSlice';
import { ProjectEpic } from '@/types/shared';
import InputField from '../atoms/input';
import SelectField from '../atoms/SelectField';
import Button from '../atoms/Button';
import Link from 'next/link';
import { STATUS_OPTIONS } from '@/lib/enums';
import { useRouter } from 'next/navigation';
import { createTaskAction } from '@/app/actions/tasks';
import { toast } from 'sonner';
import { fetchProjectEpics } from '@/app/queries/epics';

interface CreateNewTaskProps {
  projectId: string;
}

interface TaskFormInputs {
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  epic_id?: string;
  status: (typeof STATUS_OPTIONS)[number];
}

const truncateString = (str: string, num: number) => {
  if (!str) return '';
  return str.length <= num ? str : str.slice(0, num) + '...';
};

const CreateNewTaskForm = ({ projectId }: CreateNewTaskProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [epicsList, setEpicsList] = useState<ProjectEpic[]>([]);
  const [isEpicsLoading, setIsEpicsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    list: membersData,
    loading: isMembersLoading,
    isFetched,
  } = useAppSelector((state) => state.members);

  const [prefilledEpicId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('prefilled_task_epic_id') || '';
    }
    return '';
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormInputs>({
    defaultValues: {
      title: '',
      status: 'TO_DO',
      assignee_id: '',
      due_date: '',
      epic_id: '',
      description: '',
    },
  });

  useEffect(() => {
    if (prefilledEpicId) {
      setValue('epic_id', prefilledEpicId);
      sessionStorage.removeItem('prefilled_task_epic_id');
    }
  }, [prefilledEpicId, setValue]);

  useEffect(() => {
    if (prefilledEpicId && epicsList.length > 0) {
      setValue('epic_id', prefilledEpicId);
    }
  }, [prefilledEpicId, epicsList, setValue]);

  // Fetch initial data on mount
  useEffect(() => {
    if (!projectId) return;

    const isDifferentProject =
      membersData.length > 0 && membersData[0].project_id !== projectId;

    if ((!isFetched && !isMembersLoading) || isDifferentProject) {
      dispatch(fetchProjectMembers(projectId));
    }

    const loadEpics = async () => {
      try {
        setIsEpicsLoading(true);
        // Hits our local API route proxy automatically behind the scenes
        const data = await fetchProjectEpics({
          projectId,
          limit: 1000,
          offset: 0,
          accessToken: '',
        });

        setEpicsList(data?.projectEpics || []);
      } catch (err) {
        console.error('Failed to fill form epics dropdown:', err);
        setEpicsList([]);
      } finally {
        setIsEpicsLoading(false);
      }
    };

    loadEpics();
  }, [projectId, dispatch, isFetched, isMembersLoading, membersData]);

  const onSubmit = async (data: TaskFormInputs) => {
    try {
      setSubmitError(null);

      // ✅ Directly call the Server Action inside your submission block
      const result = await createTaskAction({
        ...data,
        project_id: projectId,
      });

      // Catch any validation or database errors returned from the server side
      if (result?.error) {
        toast.error(result.error);
        setSubmitError(result.error);
        return;
      }

      toast.success(`Task added successfully`);
      router.push(`/projects/${projectId}/tasks`);
    } catch (err: unknown) {
      toast.error(`Failed to add task, try again`);
      setSubmitError(
        err instanceof Error ? err.message : 'An unexpected error occurred.',
      );
    }
  };

  const todayString = new Date().toISOString().split('T')[0];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-8 bg-white p-8 shadow-sm rounded-xl"
    >
      {submitError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
          {submitError}
        </div>
      )}

      {/* ○ ○ ○ Title Input ○ ○ ○ */}
      <InputField
        {...register('title', { required: 'Task title is required' })}
        label="TITLE"
        requiredd
        placeholder="e.g., Finalize structural schematics"
        error={errors.title?.message}
      />

      {/* ○ ○ ○ Status Drop-down + Assignee Drop-down ○ ○ ○ */}
      <div className="flex w-full justify-between gap-10">
        <SelectField
          {...register('status', { required: 'Please select a status' })}
          label="STATUS"
          requiredd
          options={STATUS_OPTIONS.map((status) => ({
            value: status,
            label: status.replace(/_/g, ' '),
          }))}
          className="w-full"
        />

        <SelectField
          {...register('assignee_id')}
          placeholder={
            isMembersLoading ? 'Loading members...' : 'Select an assignee...'
          }
          disabled={isMembersLoading}
          label="ASSIGNEE"
          options={
            membersData?.map((m) => ({
              value: m.user_id,
              label: m.metadata.name,
            })) || []
          }
          className="w-full"
        />
      </div>

      {/* ○ ○ ○ Epic Drop-down ○ ○ ○ */}
      <SelectField
        {...register('epic_id')}
        label="EPIC"
        placeholder={
          isEpicsLoading ? 'Loading EPICS...' : 'Select Epic Link...'
        }
        disabled={isEpicsLoading}
        error={errors.epic_id?.message}
        options={epicsList.map((epic) => ({
          value: epic.id,
          label: `${epic.id} ${truncateString(epic.title || '', 100)}`,
        }))}
      />

      {/* ○ ○ ○ Deadline Input ○ ○ ○ */}
      <InputField
        {...register('due_date', {
          validate: (value) => {
            if (!value) return true;
            const selectedDate = new Date(value);
            selectedDate.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return (
              selectedDate >= today || 'Deadline must be today or in the future'
            );
          },
        })}
        label="DEADLINE"
        type="date"
        min={todayString}
      />

      {/* ○ ○ ○ Description Input ○ ○ ○ */}
      <InputField
        {...register('description')}
        label="DESCRIPTION"
        multiline
        rows={6}
        placeholder="Provide detailed context..."
      />

      {/* ○ ○ ○ Action Buttons ○ ○ ○ */}
      <div className="flex flex-col-reverse gap-4 lg:flex-row justify-between lg:justify-end mt-8">
        <Link
          href={`/projects/${projectId}/tasks`}
          className="w-full lg:w-1/4!"
        >
          <Button name="Back" variant="ghost" disabled={isSubmitting} />
        </Link>
        <Button
          name="Create Task"
          type="submit"
          isSubmitting={isSubmitting}
          disabled={isSubmitting || isEpicsLoading}
          className="w-full lg:w-1/4!"
        />
      </div>
    </form>
  );
};

export default CreateNewTaskForm;
