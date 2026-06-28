'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/redux/reduxHooks';
import { fetchProjectMembers } from '@/features/members/membersSlice';
import { getProjectEpics } from '@/services/getProjectEpics';
import { ProjectEpic } from '@/types/shared';
import InputField from '../atoms/input';
import SelectField from '../atoms/SelectField';
import Button from '../atoms/Button';
import Link from 'next/link';
import { STATUS_OPTIONS } from '@/lib/enums';
import { useRouter } from 'next/navigation';
import { createNewTask } from '@/services/create-new-task';
import { toast } from 'sonner';

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

  // 1 ── Updated Redux Selectors ──
  const {
    list: membersData,
    loading: isMembersLoading,
    isFetched,
  } = useAppSelector((state) => state.members);

  // Define state using a lazy initializer function
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

  // get selected epic ID + storage cleanup on mount
  useEffect(() => {
    if (prefilledEpicId) {
      setValue('epic_id', prefilledEpicId);
      sessionStorage.removeItem('prefilled_task_epic_id');
    }
  }, [prefilledEpicId, setValue]);

  // waits until the (epicsList) load
  useEffect(() => {
    if (prefilledEpicId && epicsList.length > 0) {
      setValue('epic_id', prefilledEpicId);
    }
  }, [prefilledEpicId, epicsList, setValue]);

  // Fetch data on mount
  useEffect(() => {
    if (!projectId) return;

    // 2 ── Conditional Cache Guard Checks ── check if members already fetched from another component
    const isDifferentProject =
      membersData.length > 0 && membersData[0].project_id !== projectId;

    if ((!isFetched && !isMembersLoading) || isDifferentProject) {
      dispatch(fetchProjectMembers(projectId));
    }

    const loadEpics = async () => {
      try {
        setIsEpicsLoading(true);
        const data = await getProjectEpics({ projectId });
        setEpicsList(data?.epics || []);
      } catch (err) {
        console.error('Failed to fill form epics dropdown:', err);
        setEpicsList([]);
      } finally {
        setIsEpicsLoading(false);
      }
    };

    loadEpics();
    // Added the caching selectors to the dependency array below
  }, [projectId, dispatch, isFetched, isMembersLoading, membersData]);

  const onSubmit = async (data: TaskFormInputs) => {
    try {
      setSubmitError(null);
      await createNewTask({
        ...data,
        project_id: projectId,
      });

      toast.success(`Task added sccessfuly`);
      router.push(`/projects/${projectId}/tasks`);
      router.refresh();
    } catch (err: unknown) {
      toast.error(`Faild to add task, try again`);
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
          label: `${epic.id} ${truncateString(epic.title, 100)}`,
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
