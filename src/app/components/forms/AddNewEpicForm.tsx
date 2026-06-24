import Link from 'next/link';
import Button from '../atoms/Button';
import {
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
  Control,
} from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import Input from '@/app/components/atoms/Input';

interface AddNewEpicTypes {
  title: string;
  description?: string;
  assignee_id?: string;
  project_id: string;
  deadline?: string;
}

interface ProjectMember {
  member_id: string;
  project_id: string;
  user_id: string;
  role: string;
  email: string;
  metadata: {
    name: string;
    email: string;
    department?: string;
  };
}

interface AddNewProjectProps {
  handleSubmit: UseFormHandleSubmit<AddNewEpicTypes>;
  onSubmit: (data: AddNewEpicTypes) => Promise<void>;
  register: UseFormRegister<AddNewEpicTypes>;
  isSubmitting: boolean;
  errors: FieldErrors<AddNewEpicTypes>;
  control: Control<AddNewEpicTypes>;
  required_Message?: string;
  minLength_Message?: string;
  maxLength_Message?: string;
  placeholder_Title?: string;
  placeholder_Description?: string;
  button_Name: string;
  membersData: ProjectMember[];
}

const AddNewEpicForm = ({
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
  membersData,
}: AddNewProjectProps) => {
  console.log(`membersData`, membersData);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full"
      noValidate
    >
      <div className="flex items-center justify-between">
        <span className="label-sm text-gray-500">
          TITLE <span className="text-[#BA1A1A] ">*</span>
        </span>
        <div className="w-2/3">
          <Input
            {...register('title', {
              required: required_Message,
              minLength: {
                value: 3,
                message: minLength_Message || '',
              },
            })}
            type="text"
            disabled={isSubmitting}
            error={errors.title?.message}
            placeholder={placeholder_Title}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="label-sm text-gray-500 flex flex-col">
          <span>DESCRIPTION</span>
          <span className="text-gray-400">Optional</span>
        </p>
        <div className="w-2/3">
          <Input
            {...register('description', {
              maxLength: {
                value: 500,
                message: maxLength_Message || '',
              },
            })}
            multiline
            rows={6}
            placeholder={placeholder_Description}
            className="mt-12"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex justify-between py-10 items-center">
        <div className="w-[49%] flex flex-col gap-1">
          <label
            htmlFor="assignee"
            className="text-[#4F5F7B] label-sm relative left-1"
          >
            ASSIGNEE
          </label>
          <select
            id="assignee"
            {...register('assignee_id')}
            className={`py-3 px-3 border-gray-300 rounded-md bg-[#D7E2FF]`}
          >
            {membersData?.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.metadata.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          {...register('deadline', {
            required: 'Deadline is required',
            validate: (value) => {
              // 1. Guard check: If there's no value, let the 'required' rule handle it
              if (!value) return true;

              // 2. Safely parse the value now that TypeScript knows it's a string
              const selectedDate = new Date(value);
              selectedDate.setHours(0, 0, 0, 0);

              const today = new Date();
              today.setHours(0, 0, 0, 0);

              return (
                selectedDate >= today ||
                'Deadline must be today or in the future'
              );
            },
          })}
          className="w-[49%]"
          label="DEADLINE"
          type="date"
          min={new Date().toISOString().split('T')[0]}
        />
        {/* <Input
          {...register('deadline', {})}
          className="w-[49%]"
          label="DEADLINE"
          type="date"
        /> */}
      </div>
      {/* --- Action Buttons --- */}
      <div className="flex flex-col-reverse gap-4 lg:flex-row justify-between lg:justify-end mt-8 ">
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

export default AddNewEpicForm;
