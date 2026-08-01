'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { toast } from 'sonner';
import Button from '@/app/components/atoms/Button';
import LOGO from '@/../public/svgIcons/LOGO.svg';
import InvitationIcon from '@/../public/svgIcons/InvitationIcon.svg';
import { useAcceptInvitation } from '@/app/hooks/members/useAcceptInvitation';

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { mutate: acceptInvitation, isPending } = useAcceptInvitation();

  const handleAccept = () => {
    if (!token) {
      toast.error('Invalid or missing invitation token.');
      return;
    }

    acceptInvitation(
      { p_token: token },
      {
        onSuccess: () => {
          toast.success('Successfully joined the project!');
          router.push('/projects');
        },
        onError: (error: any) => {
          if (error.status === 401) {
            toast.error('Please log in to accept this invitation.');
            const returnUrl = `/invite?token=${encodeURIComponent(token)}`;
            router.push(`/login?redirectTo=${encodeURIComponent(returnUrl)}`);
            return;
          }
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="px-8 py-12 flex flex-col gap-4 rounded-xl relative overflow-hidden bg-white shadow-md">
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-xl" />

      <p className="bg-[#E0E8FF] w-fit rounded-2xl mx-auto label-sm flex gap-2 items-center justify-center text-[#434654] py-1 px-3">
        <InvitationIcon />
        <span className="label-sm">New Project Invitation</span>
      </p>

      <h1 className="text-2xl font-bold text-slate-800 text-[30px] text-center w-120">
        You have been invited to join new project
      </h1>

      {!token && (
        <p className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">
          No valid invitation token found in the URL.
        </p>
      )}

      <Button
        className="h-13 shadow-lg rounded-sm mt-2"
        onClick={handleAccept}
        disabled={isPending || !token}
      >
        {isPending ? 'Accepting...' : 'Accept Invitation'}
      </Button>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,var(--surface-highest)_0%,transparent_60%)] flex flex-col gap-12 items-center justify-center">
      <div className="h-7 flex items-center justify-center gap-2">
        <LOGO className="scale-150" />
        <h1 className="pop-up-title uppercase">Taskly</h1>
      </div>

      <Suspense
        fallback={<div className="text-gray-500">Loading invitation...</div>}
      >
        <AcceptInviteContent />
      </Suspense>
    </div>
  );
}
/* 
    if (result.status === 401) {
      toast.error('Please log in to accept this invitation.');
      const returnUrl = `/invite?token=${encodeURIComponent(token)}`;
      router.push(`/login?redirectTo=${encodeURIComponent(returnUrl)}`);
      return;
    }

if user is 401 Unauthorized → redirect user → `/login?redirectTo=${encodeURIComponent(returnUrl)}`

now in login page → have a query param → redirectTo = /invite?token=abc123

*/
