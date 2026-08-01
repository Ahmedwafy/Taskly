'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import AddNewEpicForm from '../forms/AddNewEpicForm';
import { z } from 'zod';
import { CreateEpicSchema } from '@/schemas/epic.schema';
import { useCreateEpic } from '@/app/hooks/epics/useCreateEpic';
import { useProjectMembers } from '@/app/hooks/members/useProjectMembers';

type AddEpicFormInputs = Omit<z.input<typeof CreateEpicSchema>, 'project_id'>;

const AddNewEpic = () => {
  const { projectId } = useParams();
  const router = useRouter();

  const { data: members = [] } = useProjectMembers(projectId as string);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddEpicFormInputs>({
    defaultValues: {
      title: '',
      description: '',
      assignee_id: '',
      deadline: '',
    },
  });

  const { mutate: createEpic, isPending } = useCreateEpic();

  const onSubmit = (data: AddEpicFormInputs) => {
    createEpic(
      { ...data, project_id: projectId as string },
      {
        onSuccess: () => {
          toast.success('Epic created successfully');
          router.push(`/projects/${projectId}/epics`);
        },
        onError: (error) => {
          toast.error(error.message);
          console.error('Failed to create project', error.message);
        },
      },
    );
  };

  return (
    <div>
      <header className="flex flex-col gap-2 py-8">
        <h1 className="title-style">Create New Epic</h1>
        <p className="w-1/2 title-md text-gray-400">
          Define a major project phase or high-level milestone to group related
          tasks and track architectural progress.
        </p>
      </header>

      <div className="p-0 sm:p-8 shadow-md rounded-xl">
        <AddNewEpicForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          isSubmitting={isPending}
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
    </div>
  );
};

export default AddNewEpic;
