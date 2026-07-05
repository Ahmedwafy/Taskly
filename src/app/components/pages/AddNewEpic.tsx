// src → app → components → pages → AddNewEpic.tsx
'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import AddNewEpicForm from '../forms/AddNewEpicForm';
import { createEpicAction } from '@/app/actions/epics';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/reduxHooks';
import { fetchProjectMembers } from '@/features/members/membersSlice';
import { z } from 'zod';
import { CreateEpicSchema } from '@/schemas/epic.schema';

type AddEpicFormInputs = Omit<z.input<typeof CreateEpicSchema>, 'project_id'>;

const AddNewEpic = () => {
  const dispatch = useAppDispatch();
  const { projectId } = useParams();
  const router = useRouter();

  const {
    list: members,
    isFetched,
    loading,
  } = useAppSelector((state) => state.members);

  useEffect(() => {
    if (!projectId) return;

    const isDifferentProject =
      members.length > 0 && members[0].project_id !== projectId;

    if ((!isFetched && !loading) || isDifferentProject) {
      dispatch(fetchProjectMembers(projectId as string));
    }
  }, [projectId, isFetched, loading, members, dispatch]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddEpicFormInputs>({
    defaultValues: {
      title: '',
      description: '',
      assignee_id: '',
      deadline: '',
    },
  });

  const onSubmit = async (data: AddEpicFormInputs) => {
    try {
      const result = await createEpicAction({
        ...data,
        project_id: projectId as string,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Epic created successfully');
      router.push(`/projects/${projectId}/epics`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
      console.error('Failed to create project', error);
    }
  };

  return (
    <main>
      <header className="flex flex-col gap-2 py-8">
        <h1 className="display-lg">Create New Epic</h1>
        <p className="w-1/2 title-md text-gray-400">
          Define a major project phase or high-level milestone to group related
          tasks and track architectural progress.
        </p>
      </header>

      <div className="p-8 shadow-md rounded-xl bg-white">
        <AddNewEpicForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          isSubmitting={isSubmitting}
          errors={errors}
          control={control}
          placeholder_Title="e.g. Structural Foundation Phase"
          placeholder_Description="Describe the scope and objectives of this epic..."
          required_Message="title is required."
          minLength_Message="Project name must be at least 3 characters."
          maxLength_Message="Description must be at most 500 characters."
          button_Name="Create Epic"
          membersData={members}
        />
      </div>
    </main>
  );
};

export default AddNewEpic;
