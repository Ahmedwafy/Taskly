// src → app → components → organisms → EpicDetailsPopModal.tsx

'use client';

import * as icons from '@/../public/icons/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectMember } from '@/features/members/membersSlice';
import Link from 'next/link';
import Image from 'next/image';

export interface UserProfile {
  name?: string;
  avatar_url?: string;
}

export interface EpicDetails {
  id: string;
  epic_id?: string;
  title?: string;
  description?: string;
  created_by?: UserProfile;
  assignee?: UserProfile;
  deadline?: string | null;
  created_at?: string;
}

interface EpicDetailsPopUpModalProps {
  closeModal: () => void;
  selectedEpic: EpicDetails | null;
  formatDate: (dateString?: string) => string;
  errorMsg: string | null;
  isLoadingDetails: boolean;
  membersData: ProjectMember[];
  handleUpdateEpicField: (
    epicId: string,
    updatedFields: Partial<EpicDetails> & { assignee_id?: string | null },
  ) => Promise<void>;
  projectId: string;
}

const EpicDetailsPopUpModal = ({
  selectedEpic,
  errorMsg,
  isLoadingDetails,
  membersData,
  projectId,
  closeModal,
  formatDate,
  handleUpdateEpicField,
}: EpicDetailsPopUpModalProps) => {
  // 1. Initialize state directly from the props.
  // No useEffect required because changing the 'key' at the parent level resets this component.
  const [localTitle, setLocalTitle] = useState(selectedEpic?.title || '');
  const [localDesc, setLocalDesc] = useState(selectedEpic?.description || '');
  const router = useRouter();

  // 2. Define the blur save helper
  const handleBlurSave = (
    field: 'title' | 'description',
    currentValue: string,
  ) => {
    if (!selectedEpic) return;

    const originalValue = selectedEpic[field] || '';
    if (currentValue.trim() !== originalValue.trim()) {
      handleUpdateEpicField(selectedEpic.id, { [field]: currentValue });
    }
  };

  // handle onClick → Add Task
  const handleAddTaskNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedEpic) return;

    // Store the epic ID in temporary session storage [ use it in onClick '+Add Task' navigation ]
    sessionStorage.setItem('prefilled_task_epic_id', selectedEpic.id);
    // Navigate to the completely clean URL
    router.push(`/projects/${projectId}/tasks/new`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue/40 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={closeModal} />

      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 text-[#1e293b]">
        {/* Header */}
        <div className="flex items-start justify-between px-10 pt-10 pb-6">
          <div className="space-y-2 w-full pr-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
              <Image src={icons.popupLogo} alt="logo" />
              <span>{selectedEpic?.epic_id || 'EPIC-101'}</span>
            </div>

            {/* Title - Triggers save exactly on Blur */}
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={() => handleBlurSave('title', localTitle)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur(); // Quick shortcut to save on hit enter
              }}
              className="text-[26px] font-bold text-[#0f172a] tracking-tight w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-slate-50 px-2 py-1 rounded-lg outline-none transition"
              placeholder="Epic Title"
            />
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-400 hover:text-slate-600 shrink-0"
          >
            <Image src={icons.Close} alt="close" />
          </button>
        </div>

        {/* Content Area */}
        <div className="px-10 pb-10 overflow-y-auto space-y-8 flex-1">
          {isLoadingDetails && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 font-medium">
                Fetching Epic Details...
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {!isLoadingDetails && !errorMsg && selectedEpic && (
            <>
              {/* Description - Triggers save exactly on Blur */}
              <div>
                <textarea
                  value={localDesc}
                  onChange={(e) => setLocalDesc(e.target.value)}
                  onBlur={() => handleBlurSave('description', localDesc)}
                  rows={3}
                  className="w-full text-[#334155] text-[15px] leading-relaxed bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-slate-50 px-2 py-1 rounded-lg outline-none transition resize-none"
                  placeholder="Add a detailed description for this epic..."
                />
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap gap-x-12 gap-y-6 pt-2">
                {/* Created By */}
                <div className="min-w-35">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Created By
                  </span>
                  <div className="flex items-center gap-2.5">
                    {selectedEpic.created_by?.avatar_url ? (
                      <Image
                        src={selectedEpic.created_by.avatar_url}
                        alt="Creator Avatar"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {selectedEpic.created_by?.name
                          ?.charAt(0)
                          .toUpperCase() || 'M'}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-slate-700">
                      {selectedEpic.created_by?.name || 'System Admin'}
                    </span>
                  </div>
                </div>

                {/* Assignee Selection */}
                <div className="min-w-35">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Assignee
                  </span>
                  <div className="relative flex items-center gap-2 bg-transparent hover:bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-lg px-2.5 py-1.5 transition cursor-pointer">
                    {selectedEpic.assignee?.avatar_url ? (
                      <Image
                        src={selectedEpic.assignee.avatar_url}
                        alt="Assignee Avatar"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                        {selectedEpic.assignee?.name?.charAt(0).toUpperCase() ||
                          'U'}
                      </div>
                    )}

                    <select
                      value={
                        membersData.find(
                          (m) =>
                            m.metadata?.name === selectedEpic.assignee?.name,
                        )?.user_id || ''
                      }
                      onChange={(e) => {
                        const selectedUserId = e.target.value;
                        const chosenMember = membersData.find(
                          (m) => m.user_id === selectedUserId,
                        );

                        handleUpdateEpicField(selectedEpic.id, {
                          assignee_id: selectedUserId || null,
                          assignee: chosenMember
                            ? {
                                name: chosenMember.metadata.name,
                                avatar_url: undefined,
                              }
                            : undefined,
                        });
                      }}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    >
                      <option value="">Unassigned</option>
                      {membersData.map((member) => (
                        <option key={member.member_id} value={member.user_id}>
                          {member.metadata?.name || member.email}
                        </option>
                      ))}
                    </select>

                    <span className="text-sm font-semibold text-slate-700 pr-4">
                      {selectedEpic.assignee?.name || 'Unassigned'}
                    </span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="min-w-35 pl-4 border-l border-slate-200">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Deadline
                  </span>
                  <div className="relative flex items-center gap-2 text-slate-700 hover:bg-slate-50 px-2 py-1 rounded-lg transition border border-transparent hover:border-slate-200">
                    <Image src={icons.Date} alt="deadline" />
                    <input
                      type="date"
                      value={
                        selectedEpic.deadline
                          ? selectedEpic.deadline.split('T')[0]
                          : ''
                      }
                      onChange={(e) => {
                        handleUpdateEpicField(selectedEpic.id, {
                          deadline: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : null,
                        });
                      }}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <span className="text-sm font-medium">
                      {selectedEpic.deadline
                        ? formatDate(selectedEpic.deadline)
                        : 'Set Deadline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Created At */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Created At
                </span>
                <div className="flex items-center gap-2 text-slate-500">
                  <Image src={icons.Date} alt="created_at" />
                  <span className="text-sm font-medium">
                    {selectedEpic.created_at
                      ? formatDate(selectedEpic.created_at)
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Epic Tasks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Tasks</h3>
                  {/* 1. First Add Task Button (Top Right of section) */}
                  <button
                    onClick={handleAddTaskNavigation}
                    className="text-sm font-bold text-[#004dc7] hover:text-blue-800 transition cursor-pointer"
                  >
                    + Add Task
                  </button>
                  {/* <Link
                    href={`/projects/${projectId}/tasks/new`}
                    // href={`/project/${projectId}/tasks/new?epicId=${selectedEpic.id}`}
                    className="text-sm font-bold text-[#004dc7] hover:text-blue-800 transition"
                  >
                    + Add Task
                  </Link> */}
                </div>

                <div className="border border-dashed border-[#dce2f5] rounded-xl p-10 flex flex-col items-center justify-center bg-[#F1F3FF] min-h-55">
                  <div className="w-12 h-12 bg-[#dae3f8] text-[#4770db] rounded-xl flex items-center justify-center mb-4">
                    <Image src={icons.emptyState} alt="empty-state" />
                  </div>
                  <p className="text-[15px] text-slate-900 font-medium mb-5">
                    No tasks have been added to this epic yet
                  </p>
                  {/* 2. Second Add Task Button (Inside Empty State box) */}
                  <button
                    onClick={handleAddTaskNavigation}
                    className="px-5 py-2.5 bg-[#004dc7] hover:bg-[#003da1] text-white font-semibold text-sm rounded-lg transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>+</span> Add Task
                  </button>
                  {/* <Link
                    href={`/projects/${projectId}/tasks/new`}
                    // href={`/project/${projectId}/tasks/new?epicId=${selectedEpic.id}`}
                    className="px-5 py-2.5 bg-[#004dc7] hover:bg-[#003da1] text-white font-semibold text-sm rounded-lg transition shadow-sm flex items-center gap-1.5"
                  >
                    <span>+</span> Add Task
                  </Link> */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpicDetailsPopUpModal;
