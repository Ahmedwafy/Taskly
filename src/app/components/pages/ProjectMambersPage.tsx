'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // Added for the Mobile FAB routing
import * as icons from '@/../public/icons/icons';
import PageHeader from '../molecules/PageHeader';
import MambersLoadingSkeleton from '@/app/(pages)/projects/[projectId]/members/MambersLoadingSkeleton';
import { fetchProjectMembers } from '@/features/members/membersSlice';
import { useAppSelector, useAppDispatch } from '@/redux/reduxHooks';
import Button from '../atoms/Button';
import { getInitials } from '@/lib/helpers';
import BlackDots from '@/../public/svgIcons/BlackDots.svg';
import AddMember from '@/../public/svgIcons/Member.svg';

interface ProjectMembersPageProps {
  projectName: string;
}

const ProjectMembersPage = ({ projectName }: ProjectMembersPageProps) => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : (params.projectId ?? '');

  // ── Redux members state ──
  const {
    list: members,
    isFetched,
    loading,
    error,
  } = useAppSelector((state) => state.members);

  useEffect(() => {
    if (!projectId) return;

    // Check if the current members in store belong to a completely different project ID
    const isDifferentProject =
      members.length > 0 && members[0].project_id !== projectId;

    // Only dispatch if it hasn't been fetched yet, OR we just swapped to a different project
    if ((!isFetched && !loading) || isDifferentProject) {
      dispatch(fetchProjectMembers(projectId as string));
    }
  }, [projectId, isFetched, loading, members, dispatch]);

  if (loading)
    return (
      <div className="w-4xl mx-auto shadow-md rounded-2xl mt-20">
        <MambersLoadingSkeleton />
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* ▲ ▲ ▲ Desktop View ▲ ▲ ▲ */}
      <section className="relative hidden sm:block">
        <PageHeader
          title="Project Members"
          icon={icons.Member}
          buttonName="Invite Members"
          href="/projects/add"
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
                    {/* Member Column */}
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

                    {/* Role Column */}
                    <td className="px-8 py-6">
                      <span className="inline-block text-sm font-bold bg-primary-container py-1 px-3 rounded-full text-white uppercase">
                        {member.role}
                      </span>
                    </td>

                    {/* Action Column */}
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

      {/* ▲ ▲ ▲ Mobile View  ▲ ▲ ▲ */}
      <section className="sm:hidden min-h-screen bg-[#f8faff] px-0 py-8 relative pb-28">
        <header className="text-2xl font-bold text-center text-[#0f172a] mb-6">
          Project Members
        </header>

        {/* Member Cards List */}
        <div className="space-y-4">
          {members.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No members found</p>
          ) : (
            members.map((member) => (
              <div
                key={member.member_id}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center"
              >
                {/* Left Side: Avatar Initials + Name & Email */}
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

                {/* Right Side: Role Badge + More Options Icon */}
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
    </>
  );
};

export default ProjectMembersPage;
