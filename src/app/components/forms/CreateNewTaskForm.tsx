'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../atoms/input';
import SelectField from '../atoms/SelectField';
import Button from '../atoms/Button';
import Link from 'next/link';
import { STATUS_OPTIONS } from '@/lib/enums';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { CreateTaskSchema } from '@/schemas/createNewTask.schema';
import Plus from '@/../public/svgIcons/Plus.svg';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProjectMembers } from '@/app/hooks/members/useProjectMembers';
import { useCreateTask } from '@/app/hooks/tasks/useCreateTask';
import { useProjectEpicsSelect } from '@/app/hooks/epics/useProjectEpicsSelect';

interface CreateNewTaskProps {
  projectId: string;
  accessToken: string;
}

type TaskFormInputs = Omit<z.input<typeof CreateTaskSchema>, 'project_id'>;

const CreateNewTaskForm = ({ projectId }: CreateNewTaskProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const epicIdFromUrl = searchParams.get('epicId') || '';
  const taskStatus = searchParams.get('status') || '';

  const { data: membersData = [], isLoading: isMembersLoading } =
    useProjectMembers(projectId);

  const { data: epicsData, isLoading: isEpicsLoading } = useProjectEpicsSelect({
    projectId,
  });
  const projectEpics = epicsData?.projectEpics ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    resolver: zodResolver(CreateTaskSchema.omit({ project_id: true })),
    defaultValues: {
      title: '',
      status: taskStatus,
      assignee_id: '',
      due_date: '',
      epic_id: epicIdFromUrl,
      description: '',
    },
  });

  const { mutate: createTask, isPending } = useCreateTask();

  const onSubmit = (data: TaskFormInputs) => {
    createTask(
      { ...data, project_id: projectId },
      {
        onSuccess: () => {
          toast.success(`Task added successfully`);
          router.push(`/projects/${projectId}/tasks`);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to add task, try again');
        },
      },
    );
  };

  const todayString = new Date().toISOString().split('T')[0];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-8 bg-white py-4 px-4 sm:p-8 shadow-sm rounded-xl"
    >
      <InputField
        {...register('title', { required: 'Task title is required' })}
        label="TITLE"
        requiredd
        placeholder="e.g., Finalize structural schematics"
        error={errors.title?.message}
      />

      <div className="flex flex-col sm:flex-row w-full justify-between gap-8 sm:gap-10">
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
        options={projectEpics.map((epic) => ({
          value: epic.id,
          label: `${epic.epic_id}`,
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
        variant="textarea"
        rows={6}
        placeholder="Provide detailed context..."
      />

      <div className="flex flex-col-reverse gap-4 lg:flex-row justify-between lg:justify-end mt-8">
        <Link
          href={`/projects/${projectId}/tasks`}
          className="w-full lg:w-1/4!"
        >
          <Button name="Back" variant="ghost" disabled={isPending} />
        </Link>
        <Button
          name="Create Task"
          type="submit"
          isSubmitting={isPending}
          disabled={isPending}
          className="w-full lg:w-1/4!"
        >
          <Plus />
        </Button>
      </div>
    </form>
  );
};

export default CreateNewTaskForm;
