// src/app/components/pages/AddNewEpics.tsx

// Projects > Project-Name > Epics > New Epic

'use client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import AddNewEpicForm from '../forms/AddNewEpicForm';
import { createEpic } from '@/services/createEpic';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/reduxHooks';
import { fetchProjectMembers } from '@/features/members/membersSlice';

interface AddProjectDataTypes {
  title: string;
  description?: string;
  assignee_id?: string;
  project_id: string;
  deadline?: string;
}
const AddNewEpic = () => {
  const members = useAppSelector((state) => state.members.list); // from redux store
  const dispatch = useAppDispatch();
  const { projectId } = useParams();

  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddProjectDataTypes>({
    defaultValues: {
      title: '',
      description: '',
      assignee_id: '',
      deadline: '',
    },
  });

  // console.log(`xxxxxxxxxxxxxxxxxx`, projectId);

  const onSubmit = async (data: AddProjectDataTypes) => {
    const dataToSend = {
      title: data.title.trim(),
      description: data.description?.trim() || '',
      assignee_id: data.assignee_id?.trim() || '',
      project_id: projectId as string,
      deadline: data.deadline || '',

      // ...(data.description?.trim() && {
      //   description: data.description?.trim(),
      // }),
      // ...(data.assignee?.trim() && {
      //   assignee_id: data.assignee.trim(),
      // }),

      // ...(data.deadline && {
      //   deadline: data.deadline,
      // }),
    };
    // description: data.description?.trim() || '',

    try {
      await createEpic(dataToSend);

      toast.success('Epic created successfully');
      router.push('/projects');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
      console.error('Failed to create project', error);
    }
  };

  // for testing
  useEffect(() => {
    console.log('projectId:', projectId);

    dispatch(fetchProjectMembers(projectId as string));
  }, [projectId, dispatch]);

  return (
    <div>
      <div className="flex flex-col gap-2 py-8">
        <h1 className="display-lg">Create New Epic</h1>
        <p className="w-1/2 title-md text-gray-400">
          Define a major project phase or high-level milestone to group related
          tasks and track architectural progress.
        </p>
      </div>
      {/* -- Form -- */}
      <div className="p-8 shadow-md rounded-xl bg-white">
        <AddNewEpicForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          isSubmitting={isSubmitting}
          errors={errors}
          control={control}
          //
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
