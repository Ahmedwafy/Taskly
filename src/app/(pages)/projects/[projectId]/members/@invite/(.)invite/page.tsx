'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import InviteMemberIcon from '@/../public/svgIcons/InviteMemberPOP.svg';
import CloseIcon from '@/../public/svgIcons/CloseIcon.svg';
import Button from '@/app/components/atoms/Button';
import InputField from '@/app/components/atoms/input';
import { baseURL } from '@/lib/supabase';
import { inviteMemberRequest } from '@/app/actions/members';
import {
  InviteFormSchema,
  InviteFormData,
} from '@/schemas/inviteMember.schema';

export default function InviteModal() {
  const router = useRouter();
  const params = useParams();

  const projectID = Array.isArray(params.projectId)
    ? params.projectId[0]
    : (params.projectId ?? '');

  // Type generated from Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(InviteFormSchema),
    defaultValues: { p_email: '' },
  });
  // p_base_url: baseURL ?? '',
  const onSubmit = async (data: InviteFormData) => {
    const dataToSend = {
      p_email: data.p_email,
      p_project_id: projectID,
      p_app_url: typeof window !== 'undefined' ? window.location.origin : '',
    };

    try {
      const result = await inviteMemberRequest(dataToSend);

      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Invitation sent successfully!');
      router.back();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'unauthorized, validation errors',
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#041B3C66]/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => router.back()}
    >
      <div
        className="bg-white p-8 rounded-xl h-96.25 w-md flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full justify-between"
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center justify-center rounded-md bg-[#F1F3FF] w-12 h-12">
                <InviteMemberIcon className="scale-150" />
              </div>
              <button
                type="button"
                onClick={() => router.back()}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors hover:cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-2">
              <h2 className="pop-up-title">Invite Team Member</h2>
              <p className="title-desc-style">
                Send an invitation to join the Architectural Studio workspace.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            {/* Registered directly as p_email so zero mapping is required */}
            <div>
              <InputField
                id="email"
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                error={errors.p_email?.message}
                {...register('p_email')}
              />
            </div>

            <div className="flex justify-end gap-3 p-2">
              <Button
                type="button"
                variant="ghost"
                name="Cancel"
                onClick={() => router.back()}
              />
              <Button
                type="submit"
                name={isSubmitting ? 'Sending...' : 'Send Invitation'}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
