// src → app → component → pages → AddNewProjectPage.tsx

'use client';
import PageHeader from '../molecules/PageHeader';
import ProjectForm from '../forms/Project-Form';
import CardHeader from '../molecules/CardHeader';
import Image from 'next/image';
import * as icons from '../../../../public/icons/icons';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createNewProject } from '@/services/create-new-project';

interface AddProjectDataTypes {
  name: string;
  description?: string;
}

const AddNewProjectPage = () => {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddProjectDataTypes>({
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (data: AddProjectDataTypes) => {
    const dataToSend = {
      name: data.name.trim(),
      description: data.description?.trim(),
    };

    try {
      await createNewProject(dataToSend);
      toast.success('Project created successfully');
      router.push('/projects');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
      console.error('Failed to create project', error);
    }
  };

  return (
    <main className="h-screen">
      <section>
        {/* --- Page Header --- */}
        <PageHeader
          title="Add New Project"
          icon={icons.Member}
          buttonName="Invite Member"
          href="/projects/add" // TODO ::: Navigate To Invtite Member
        />

        {/* --- Card  --- */}
        <div className="mx-auto rounded-md h-auto mt-10">
          {/* --- Card Header + Form + Buttons */}
          <div className="max-w-3xl mx-auto p-8 h-fit shadowrounded-t-xl shadow-sm bg-white">
            {/* --- Card Header ---  */}
            <CardHeader
              title="Initialize New Project"
              description="Define the scope and foundational details of your project."
            />

            {/* --- Add Project Form --- */}
            <ProjectForm
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              register={register}
              isSubmitting={isSubmitting}
              errors={errors}
              control={control}
              //
              placeholder_Title="Title ..."
              placeholder_Description="Provide a high-level overview of the project's architectural objectives and key milestones..."
              required_Message="name is required."
              minLength_Message="Project name must be at least 3 characters."
              maxLength_Message="Description must be at most 500 characters."
              button_Name="Create Project"
            />
          </div>

          {/* --- Pro Tip --- */}
          <div className="bg-surface-low py-6 px-6 text-[#4F5F7B] flex max-w-3xl mx-auto rounded-b-xl shadow-sm">
            <div className="my-auto mr-2">
              <Image src={icons.ProTip} alt="Pro Tip" width={14} height={14} />
            </div>
            <div className="text-sm">
              <strong>Pro Tip: </strong>
              You can invite project members and assign epics immediately after
              the initial creation process.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AddNewProjectPage;
