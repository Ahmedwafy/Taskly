'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import * as icons from '@/../public/icons/icons';
import PageHeader from '../molecules/PageHeader';
import MambersLoadingSkeleton from '@/app/(pages)/projects/[projectId]/members/MambersLoadingSkeleton';
import Button from '../atoms/Button';
import BlackDots from '@/../public/svgIcons/BlackDots.svg';
import AddMember from '@/../public/svgIcons/Member.svg';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { getInitials } from '@/lib/helpers/user';
import { useProjectMembers } from '@/app/hooks/members/useProjectMembers';

interface ProjectMembersPageProps {
  projectName: string;
}

const ProjectMembersPage = ({ projectName }: ProjectMembersPageProps) => {
  const isMobile = useIsMobile();
  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : (params.projectId ?? '');

  const {
    data: members = [],
    isLoading: loading,
    isError,
    error,
  } = useProjectMembers(projectId as string);

  if (loading)
    return (
      <div className="w-4xl mx-auto shadow-md rounded-2xl mt-20">
        <MambersLoadingSkeleton />
      </div>
    );

  if (isError) return <div>Error: {error.message}</div>;

  if (isMobile === null) return null;

  return (
    <>
      {/* ●──────────────────────────● Desktop View ●──────────────────────────● */}
      {!isMobile && (
        <section className="relative">
          <PageHeader
            title="Project Members"
            icon={icons.Member}
            buttonName="Invite Members"
            href={`/projects/${projectId}/members/invite`}
            projectName={projectName}
          />
          <div className="max-w-196.25 mx-auto shadow-md rounded-md mt-20 overflow-hidden bg-white">
            <table className="w-full border-collapse text-left">
              <thead className="bg-surface-low text-label-sm">
                <tr>
                  <th className="px-8 py-6 font-semibold text-xs text-gray-500 uppercase tracking-wider w-1/2">
                    MEMBER
                  </th>
                  <th className="px-8 py-6 font-semibold text-xs text-gray-500 uppercase tracking-wider w-1/4">
                    ROLE
                  </th>
                  <th className="px-8 py-6 font-semibold text-xs text-gray-500 uppercase tracking-wider w-1/4 text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-8 py-6 text-center text-gray-500"
                    >
                      No members found
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr
                      key={member.member_id}
                      className="hover:bg-gray-50/50 transition"
                    >
                      <td className="px-8 py-6">
                        <div className="flex gap-4 items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-container text-sm font-semibold text-white shrink-0">
                            {getInitials(member.metadata.name)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">
                              {member.metadata.name}
                            </span>
                            <span className="text-xs font-normal text-gray-500">
                              {member.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-block text-sm font-bold bg-primary-container py-1 px-3 rounded-full text-white uppercase">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="inline-flex items-center justify-center p-1.5 hover:bg-gray-100 rounded-full transition">
                          <BlackDots />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ●──────────────────────────● Mobile View ●──────────────────────────● */}
      {isMobile && (
        <section className="min-h-screen bg-[#f8faff] px-0 py-8 relative pb-28">
          <header className="text-2xl font-bold text-center text-[#0f172a] mb-6">
            Project Members
          </header>

          <div className="space-y-4">
            {members.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                No members found
              </p>
            ) : (
              members.map((member) => (
                <div
                  key={member.member_id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center"
                >
                  <div className="flex gap-4 items-center">
                    <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-[#e0eafd] text-[#2563eb] text-base font-bold shrink-0">
                      {getInitials(member.metadata.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-slate-800 leading-tight">
                        {member.metadata.name}
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        {member.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-14 py-0.5">
                    <span className="text-[10px] font-bold tracking-wider bg-[#dbeafe] text-[#434654] py-1 px-2.5 rounded-md uppercase">
                      {member.role}
                    </span>
                    <button className="transition">
                      <BlackDots />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="fixed bottom-10 right-6 z-30">
            <Link href="/projects/add">
              <Button
                variant="primary"
                className="rounded-2xl! shadow-lg flex items-center justify-center bg-[#0052cc] hover:bg-blue-700 transition px-4 py-4"
              >
                <AddMember className="scale-150" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default ProjectMembersPage;
