import Link from 'next/link';
import Button from '../atoms/Button';
import {
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
  Control,
} from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import InputField from '../atoms/input';
// import Input from '@/app/components/atoms/input';

interface ProjectDataTypes {
  name: string;
  description?: string;
}

interface AddNewProjectProps {
  handleSubmit: UseFormHandleSubmit<ProjectDataTypes>;
  onSubmit: (data: ProjectDataTypes) => Promise<void>;
  register: UseFormRegister<ProjectDataTypes>;
  isSubmitting: boolean;
  errors: FieldErrors<ProjectDataTypes>;
  control: Control<ProjectDataTypes>;
  required_Message: string;
  minLength_Message: string;
  maxLength_Message: string;
  placeholder_Title: string;
  placeholder_Description: string;
  button_Name: string;
}

const ProjectForm = ({
  handleSubmit,
  onSubmit,
  register,
  isSubmitting,
  errors,
  control,
  required_Message,
  minLength_Message,
  maxLength_Message,
  placeholder_Title,
  placeholder_Description,
  button_Name,
}: AddNewProjectProps) => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full"
      noValidate
    >
      <InputField
        {...register('name', {
          required: required_Message,
          minLength: {
            value: 3,
            message: minLength_Message,
          },
        })}
        label="PROJECT TITLE"
        className="mt-10"
        type="text"
        disabled={isSubmitting}
        error={errors.name?.message}
        placeholder={placeholder_Title}
      />
      <InputField
        {...register('description', {
          maxLength: {
            value: 500,
            message: maxLength_Message,
          },
        })}
        label="DESCRIPTION"
        variant="textarea"
        rows={6}
        optional="Optional"
        placeholder={placeholder_Description}
        className="mt-12"
        disabled={isSubmitting}
      />

      {/* --- Action Buttons --- */}
      <div className="flex flex-col-reverse gap-4 lg:flex-row justify-between mt-8 ">
        <Link
          href="/projects"
          className={`w-full lg:w-1/4! ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}
        >
          <Button name="Cancel" variant="ghost" disabled={isSubmitting} />
        </Link>
        <Button
          name={button_Name}
          className="w-full lg:w-1/4!"
          type="submit"
          isSubmitting={isSubmitting}
          disabled={isSubmitting}
        />
      </div>
      <DevTool control={control} />
    </form>
  );
};

export default ProjectForm;
