// src/app/(pages)/projects/add
// Add New Project Page
'use client';
import Button from '@/app/components/atoms/Button';
import Link from 'next/link';
import * as icons from '../../../../../public/icons/icons';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createNewProject } from '@/services/create-new-project';
import { DevTool } from '@hookform/devtools';
import Input from '@/app/components/atoms/input';
import { useRouter } from 'next/navigation';

interface AddProjectDataTypes {
  name: string;
  description?: string;
}

const Add_New_Project = () => {
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
    <main className="bg-background h-screen">
      <section className="">
        {/* --- Page Header --- */}
        <header className="hidden lg:flex justify-between w-full">
          <div className="w-full h-fit pt-2 pl-4 flex flex-col gap-2">
            <div className="flex gap-4">
              <span className="text-gray-500">PROJECTS</span>
              <div className="my-auto">
                <Image src={icons.pathArrow} alt="path arrow" />
              </div>
              <span className="text-blue-600">ADD NEW PROJECT</span>
            </div>
            <h1 className="display-lg">Add New Project</h1>
          </div>

          <Link href="/projects/add">
            <div className="flex gap-2 px-0!">
              <Button
                name="Invite Member"
                className="w-55! mt-10 h-15 mr-8 px-0!"
              >
                <div className="my-auto">
                  <Image src={icons.Member} alt="Member" />
                </div>
              </Button>
            </div>
          </Link>
        </header>

        {/* --- Card  --- */}
        <div className="mx-auto rounded-md h-auto mt-10">
          {/* --- Card Header + Form + Buttons */}
          <div className="max-w-3xl mx-auto p-8 h-fit shadowrounded-t-xl shadow-sm">
            {/* --- Card Header ---  */}
            <div className="flex gap-4 items-center border-b pb-10 border-gray-400">
              <div className="hidden lg:block bg-surface-highest p-3 rounded-md">
                <Image
                  src={icons.Add_Project}
                  alt="Member"
                  width={22}
                  height={11}
                />
              </div>
              <div>
                <h1 className="headline-lg">Initialize New Project</h1>
                <span className="text-gray-500">
                  Define the scope and foundational details of your project.
                </span>
              </div>
            </div>

            {/* --- Form --- */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col h-full"
              noValidate
            >
              <Input
                {...register('name', {
                  required: 'name is required.',
                  minLength: {
                    value: 3,
                    message: 'Project name must be at least 3 characters.',
                  },
                })}
                label="PROJECT TITLE"
                className="mt-10"
                type="text"
                disabled={isSubmitting}
                error={errors.name?.message}
              />
              <Input
                {...register('description', {
                  maxLength: {
                    value: 500,
                    message: 'Description must be at most 500 characters.',
                  },
                })}
                label="DESCRIPTION"
                multiline
                rows={6}
                optional="Optional"
                placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                className="mt-12"
                disabled={isSubmitting}
              />

              {/* --- Action Buttons --- */}
              <div className="flex flex-col-reverse gap-4 lg:flex-row justify-between mt-8 ">
                <Link
                  href="/projects"
                  className={`w-full lg:w-1/4! ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <Button name="Back" variant="ghost" disabled={isSubmitting} />
                </Link>
                <Button
                  name="Create Project"
                  className="w-full lg:w-1/4!"
                  type="submit"
                  isSubmitting={isSubmitting}
                  disabled={isSubmitting}
                />
              </div>
              <DevTool control={control} />
            </form>
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

export default Add_New_Project;
