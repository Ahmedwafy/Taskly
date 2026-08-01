'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import InviteMemberIcon from '@/../public/svgIcons/InviteMemberPOP.svg';
import CloseIcon from '@/../public/svgIcons/CloseIcon.svg';
import Button from '@/app/components/atoms/Button';
import InputField from '@/app/components/atoms/input';
import {
  InviteFormSchema,
  InviteFormData,
} from '@/schemas/inviteMember.schema';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { useInviteMember } from '@/app/hooks/members/useInviteMember';

export default function InviteModal() {
  const router = useRouter();
  const params = useParams();
  const isMobile = useIsMobile();

  const projectID = Array.isArray(params.projectId)
    ? params.projectId[0]
    : (params.projectId ?? '');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(InviteFormSchema),
    defaultValues: { p_email: '' },
  });

  const { mutate: inviteMember, isPending } = useInviteMember();

  const onSubmit = (data: InviteFormData) => {
    const dataToSend = {
      p_email: data.p_email,
      p_project_id: projectID,
      p_app_url: typeof window !== 'undefined' ? window.location.origin : '',
    };

    inviteMember(dataToSend, {
      onSuccess: () => {
        toast.success('Invitation sent successfully!');
        router.back();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (isMobile === null) return null;

  return (
    <>
      {/* ●──────────────────────────● Desktop View ●──────────────────────────● */}
      {!isMobile && (
        <section
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
                    Send an invitation to join the Architectural Studio
                    workspace.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6 mt-4">
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
                    name={isPending ? 'Sending...' : 'Send Invitation'}
                    disabled={isPending}
                  />
                </div>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* ●──────────────────────────● Mobile View ●──────────────────────────● */}
      {isMobile && (
        <section
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
                    Send an invitation to join the Architectural Studio
                    workspace.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6 mt-4">
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
                    name={isPending ? 'Sending...' : 'Send Invitation'}
                    disabled={isPending}
                  />
                </div>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
