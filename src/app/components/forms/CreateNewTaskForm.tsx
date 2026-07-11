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
import { useRouter, useSearchParams } from 'next/navigation';
import { createTaskAction } from '@/app/actions/tasks';
import { toast } from 'sonner';
import { z } from 'zod';
import { CreateTaskSchema } from '@/schemas/createNewTask.schema';

interface CreateNewTaskProps {
  projectId: string;
  initialEpics: ProjectEpic[];
}

// Define the type for the form inputs based on the Zod schema instead of :
// manually defining it. This ensures that the form inputs are always in sync with the schema.
//
// z.input, TypeScript and React Hook Form will accept empty strings "" or undefined when the user interacts with the form.
// Add 'project_id' to remove it from the form inputs, since it's already provided via props and not user input.
type TaskFormInputs = Omit<z.input<typeof CreateTaskSchema>, 'project_id'>;

const truncateString = (str: string, num: number) => {
  if (!str) return '';
  return str.length <= num ? str : str.slice(0, num) + '...';
};

const CreateNewTaskForm = ({ projectId, initialEpics }: CreateNewTaskProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [epicsList] = useState<ProjectEpic[]>(initialEpics);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const epicIdFromUrl = searchParams.get('epic_id') || '';
  const taskStatus = searchParams.get('status') || '';

  const {
    list: membersData,
    loading: isMembersLoading,
    isFetched,
  } = useAppSelector((state) => state.members);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormInputs>({
    defaultValues: {
      title: '',
      status: taskStatus,
      assignee_id: '',
      due_date: '',
      epic_id: epicIdFromUrl,
      description: '',
    },
  });

  // 5. (Clean up) All old prefilledEpicId states and related useEffects are removed.

  // Fetch remaining project member data on mount
  useEffect(() => {
    if (!projectId) return;

    const isDifferentProject =
      membersData.length > 0 && membersData[0].project_id !== projectId;

    if ((!isFetched && !isMembersLoading) || isDifferentProject) {
      dispatch(fetchProjectMembers(projectId));
    }
  }, [projectId, dispatch, isFetched, isMembersLoading, membersData]);

  const onSubmit = async (data: TaskFormInputs) => {
    try {
      setSubmitError(null);

      const result = await createTaskAction({
        ...data,
        project_id: projectId,
      });

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
      {/* Form Fields remain exactly as you have them */}
      {submitError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
          {submitError}
        </div>
      )}

      <InputField
        {...register('title', { required: 'Task title is required' })}
        label="TITLE"
        requiredd
        placeholder="e.g., Finalize structural schematics"
        error={errors.title?.message}
      />

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

      <SelectField
        {...register('epic_id')}
        label="EPIC"
        placeholder="Select Epic Link..."
        error={errors.epic_id?.message}
        options={epicsList.map((epic) => ({
          value: epic.id,
          label: `${epic.id} ${truncateString(epic.title || '', 100)}`,
        }))}
      />

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

      <InputField
        {...register('description')}
        label="DESCRIPTION"
        multiline
        rows={6}
        placeholder="Provide detailed context..."
      />

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
          disabled={isSubmitting}
          className="w-full lg:w-1/4!"
        />
      </div>
    </form>
  );
};

export default CreateNewTaskForm;
