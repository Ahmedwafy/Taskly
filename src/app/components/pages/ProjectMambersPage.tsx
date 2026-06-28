// src/app/components/pages/ProjectMembersPage.tsx
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import * as icons from '@/../public/icons/icons';
import Image from 'next/image';
import PageHeader from '../molecules/PageHeader';
import MambersLoadingSkeleton from '@/app/(pages)/projects/[projectId]/members/MambersLoadingSkeleton';
import { fetchProjectMembers } from '@/features/members/membersSlice';
import { useAppSelector, useAppDispatch } from '@/redux/reduxHooks';
import Button from '../atoms/Button';

interface ProjectMembersPageProps {
  projectName: string;
}

const ProjectMembersPage = ({ projectName }: ProjectMembersPageProps) => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : (params.projectId ?? '');

  // 1 ── Redux members state ──
  const {
    list: members,
    isFetched,
    loading,
    error,
  } = useAppSelector((state) => state.members);
  // 2 ── conditional fetch ──
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
    <section className="relative">
      <PageHeader
        title="Project Members"
        icon={icons.Member}
        buttonName="Invite Members"
        href="/projects/add"
        projectName={projectName}
      />

      <header className="block md:hidden headline-lg text-center mt-10">
        Project Members
      </header>

      <div className="max-w-4xl mx-auto shadow-md rounded-2xl mt-20">
        <div className="hidden sm:flex justify-between px-8 py-6 bg-surface-low rounded-t-2xl">
          <div className="w-1/2 label-sm">MEMBER</div>
          <div className="flex justify-between w-1/2 label-sm">
            <span>ROLE</span>
            <span>ACTIONS</span>
          </div>
        </div>

        <div>
          {members.length === 0 ? (
            <p>No members found</p>
          ) : (
            <ul>
              {members.map((member) => (
                <li key={member.member_id}>
                  <div className="flex px-8 py-6">
                    <div className="flex w-1/2 gap-4">
                      <div className="flex h-10 min-w-10 items-center justify-center rounded-sm sm:rounded-xl bg-primary-container text-sm font-semibold text-white">
                        {member.metadata.name
                          .trim()
                          .split(/\s+/)
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {member.metadata.name}
                        </span>
                        <span className="text-[11px] font-normal">
                          {member.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:gap-0 sm:flex-row items-end sm:items-center justify-between w-full sm:w-1/2 bg-amber-20">
                      <span className="text-sm font-bold bg-primary-container py-1 rounded-sm px-3 sm:rounded-full text-white my-auto">
                        {member.role}
                      </span>
                      <div>
                        <Image src={icons.Dots} alt="Action" />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}{' '}
        </div>
      </div>

      <div className="my-auto w-full flex justify-end">
        <Button variant="primary" className="sm:hidden max-w-12.5 mt-5 h-12">
          <Image src={icons.Member} alt="Member" />
        </Button>
      </div>
    </section>
  );
};

export default ProjectMembersPage;
