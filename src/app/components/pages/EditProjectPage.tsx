'use client';
import Image from 'next/image';
import CardHeader from '../molecules/CardHeader';
import ProjectForm from '../forms/Project-Form';
import { toast } from 'sonner';
import { ProjectProps } from '@/types/shared';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import * as icons from '@/../public/icons/icons';
import PageHeader from '../molecules/PageHeader';
import { UpdateProjectSchema } from '@/schemas/project.schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateProject } from '@/app/hooks/projects/useUpdateProject';

interface EditProjectPageProps {
  projects: ProjectProps[];
  projectName: string;
}

type EditProjectFormInputs = Omit<
  z.input<typeof UpdateProjectSchema>,
  'projectId'
>;

const EditProjectPage = ({ projects, projectName }: EditProjectPageProps) => {
  const router = useRouter();
  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  const currentProject = projects.find((p) => p.id === projectId);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProjectFormInputs>({
    resolver: zodResolver(UpdateProjectSchema.omit({ projectId: true })),
    defaultValues: { name: '', description: '' },
  });

  const { mutate: updateProject, isPending } = useUpdateProject();

  const onSubmit = (data: EditProjectFormInputs) => {
    if (!projectId) {
      toast.error('Invalid project id');
      return;
    }

    const dataToSend = {
      projectId,
      name: data.name.trim(),
      description: data.description?.trim(),
    };

    updateProject(dataToSend, {
      onSuccess: () => {
        toast.success('Project updated successfully');
        router.replace('/projects');
      },
      onError: (error) => {
        toast.error(error.message);
        reset({
          name: currentProject?.name,
          description: currentProject?.description || '',
        });
      },
    });
  };

  useEffect(() => {
    if (!currentProject) return;

    reset({
      name: currentProject.name,
      description: currentProject.description || '',
    });
  }, [currentProject, reset]);

  return (
    <div className="">
      <PageHeader
        title="Edit Projects"
        icon={icons.Plus}
        buttonName="Create New Project"
        href="/projects/add"
        projectName={projectName}
      />
      <div className="mx-auto rounded-md h-auto mt-10">
        <div className="max-w-3xl mx-auto p-8 h-fit shadowrounded-t-xl shadow-sm bg-white">
          <CardHeader
            title="Edit Project"
            description="Define the scope and foundational details of your project."
          />

          <ProjectForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            isSubmitting={isPending}
            errors={errors}
            control={control}
            placeholder_Title="Title ..."
            placeholder_Description="Provide a high-level overview of the project's architectural objectives and key milestones..."
            required_Message="project title is required."
            minLength_Message="Project name must be at least 3 characters."
            maxLength_Message="Description must be at most 500 characters."
            button_Name="Save Changes"
          />
        </div>

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
    </div>
  );
};

export default EditProjectPage;
