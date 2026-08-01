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
import { z } from 'zod';
import { CreateEpicSchema } from '@/schemas/epic.schema';
import { ProjectMember } from '@/types/shared';

type AddEpicFormInputs = Omit<z.input<typeof CreateEpicSchema>, 'project_id'>;

interface AddNewProjectProps {
  handleSubmit: UseFormHandleSubmit<AddEpicFormInputs>;
  onSubmit: (data: AddEpicFormInputs) => void | Promise<void>;
  register: UseFormRegister<AddEpicFormInputs>;
  control: Control<AddEpicFormInputs>;
  errors: FieldErrors<AddEpicFormInputs>;
  isSubmitting: boolean;
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

        {/* ○ ○ ○ Titl Input ○ ○ ○ */}
        <div className="w-2/3">
          <InputField
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

        {/* ○ ○ ○ Description Text-area ○ ○ ○ */}
        <div className="w-2/3">
          <InputField
            {...register('description', {
              maxLength: {
                value: 500,
                message: maxLength_Message || '',
              },
            })}
            variant="textarea"
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

          {/* ○ ○ ○ Assignee Selection Input ○ ○ ○ */}
          <select
            id="assignee"
            {...register('assignee_id', {
              required: 'Please select an assignee',
            })}
            className="py-3 px-3 border-gray-300 rounded-md bg-[#D7E2FF]"
            defaultValue=""
          >
            <option value="" disabled>
              Select an assignee...
            </option>

            {membersData?.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.metadata.name}
              </option>
            ))}
          </select>
        </div>

        {/* ○ ○ ○ deadline input ○ ○ ○ */}
        <InputField
          {...register('deadline', {
            required: 'Deadline is required',
            validate: (value) => {
              // Guard check: If there's no value, let the 'required' rule handle it
              if (!value) return true;

              // Safely parse the value now that TypeScript knows it's a string
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
      </div>

      {/* ○ ○ ○ Action Buttons ○ ○ ○ */}
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
