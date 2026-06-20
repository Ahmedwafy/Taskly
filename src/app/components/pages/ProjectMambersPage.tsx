// src/app/components/pages/ProjectMembersPage.tsx
// here used reduc thunk + redux tool kit to → fetch members'd data and store data
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import * as icons from '@/../public/icons/icons';
import Image from 'next/image';
import PageHeader from '../molecules/PageHeader';
import MambersLoadingSkeleton from '@/app/(pages)/projects/[projectId]/members/MambersLoadingSkeleton';
import { fetchProjectMembers } from '@/features/members/membersSlice';
import { useAppSelector, useAppDispatch } from '@/redux/reduxHooks';
// import { useAppDispatch } from '@/redux/reduxHooks';

// type Member = {
//   member_id: string;
//   email: string;
//   role: string;
//   metadata: {
//     name: string;
//   };
// };

interface ProjectMembersPageProps {
  projectName: string;
}

const ProjectMembersPage = ({ projectName }: ProjectMembersPageProps) => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : (params.projectId ?? '');

  // console.log(projectId); // bac9d718-56d0-4467-958c-e5840c4aaada

  const {
    list: members,
    loading,
    error,
  } = useAppSelector((state) => state.members);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchProjectMembers(projectId));
  }, [projectId, dispatch]);

  if (loading)
    return (
      <div className="w-4xl mx-auto shadow-md rounded-2xl mt-20">
        <MambersLoadingSkeleton />
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <PageHeader
        title="Project Members"
        icon={icons.Member}
        buttonName="Invite Members"
        href="/projects/add"
        projectName={projectName}
      />

      <div className="w-4xl mx-auto shadow-md rounded-2xl mt-20">
        <div className="flex justify-between px-8 py-6 bg-surface-low rounded-t-2xl">
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
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-sm font-semibold text-white">
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
                    <div className="flex justify-between w-1/2">
                      <span className="text-sm font-bold bg-primary-container py-1 px-3 rounded-full text-white my-auto">
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
    </>
  );
};

export default ProjectMembersPage;
