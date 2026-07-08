// src → app → components → organisms → EpicDetailsPopModal.tsx
'use client';
import * as icons from '@/../public/icons/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectMember } from '@/features/members/membersSlice';
import Image from 'next/image';
import { EpicDetails } from '@/types/shared';
import { ProjectTask } from '@/features/tasks/tasksSlice';

interface EpicDetailsPopUpModalProps {
  closeModal: () => void;
  formatDate: (dateString?: string, variant?: 'US' | 'EU') => string;
  selectedEpic: EpicDetails | null;
  errorMsg: string | null;
  isLoadingDetails: boolean;
  membersData: ProjectMember[];
  epicTasks: ProjectTask[];
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
  epicTasks,
}: EpicDetailsPopUpModalProps) => {
  const [localTitle, setLocalTitle] = useState(selectedEpic?.title || '');
  const [localDesc, setLocalDesc] = useState(selectedEpic?.description || '');
  const router = useRouter();

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

  const handleAddTaskNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedEpic) return;

    router.push(`/projects/${projectId}/tasks/new?epic_id=${selectedEpic.id}`);
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

            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={() => handleBlurSave('title', localTitle)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur();
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

        {/* === Loading Case === */}
        <div className="px-10 pb-10 overflow-y-auto space-y-8 flex-1">
          {isLoadingDetails && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 font-medium">
                Fetching Epic Details...
              </p>
            </div>
          )}

          {/* === Error Case === */}
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {!isLoadingDetails && !errorMsg && selectedEpic && (
            <>
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

              {/* Tasks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Tasks</h3>
                  <button
                    onClick={handleAddTaskNavigation}
                    className="text-sm font-bold text-[#004dc7] hover:text-blue-800 transition cursor-pointer"
                  >
                    + Add Task
                  </button>
                </div>

                {!epicTasks || epicTasks.length === 0 ? (
                  <div className="border border-dashed border-[#dce2f5] rounded-xl p-10 flex flex-col items-center justify-center bg-[#F1F3FF] min-h-55">
                    <div className="w-12 h-12 bg-[#dae3f8] text-[#4770db] rounded-xl flex items-center justify-center mb-4">
                      <Image src={icons.emptyState} alt="empty-state" />
                    </div>
                    <p className="text-[15px] text-slate-900 font-medium mb-5">
                      No tasks have been added to this epic yet
                    </p>
                    <button
                      onClick={handleAddTaskNavigation}
                      className="px-5 py-2.5 bg-[#004dc7] hover:bg-[#003da1] text-white font-semibold text-sm rounded-lg transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>+</span> Add Task
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {epicTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 py-2 px-4 border border-slate-100 rounded-lg bg-white hover:bg-slate-50 transition cursor-pointer"
                      >
                        <div className="flex justify-between w-full items-center">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-slate-900">
                              {task.title}
                            </span>
                            <div className="flex gap-2 items-center">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container text-[10px] font-semibold text-white">
                                {task.assignee.name
                                  .trim()
                                  .split(/\s+/)
                                  .map((w) => w[0])
                                  .slice(0, 2)
                                  .join('')
                                  .toUpperCase()}
                              </span>
                              <span className="text-sm text-slate-500">
                                {task.assignee.name}
                              </span>
                            </div>
                          </div>

                          {/* Due Date */}
                          <span className="text-sm font-medium text-slate-400">
                            {task.due_date
                              ? formatDate(task.due_date, 'EU')
                              : 'No due date'}
                            {/* <span>{formatDate(task.due_date, 'EU')}</span> */}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpicDetailsPopUpModal;

// [ User types a new title ]
//           │
//           ▼
// 1. "updateEpicOptimistically" fires instantly in Redux!
//    ├── It clones the current epic and tucks it away safely in `backupEpic`
//    └── It updates `selectedEpic` on the screen immediately. (Zero delay for the user! )
//           │
//           ▼
// 2. The Server Action (`updateEpicAction`) runs in the background.
//           │
//     ┌─────┴────────────────┐
//     ▼                      ▼
// [ SUCCESS ]            [ FAILURE ]
// The database matches   The internet dropped or database failed!
// our UI. We are done!   "rollbackEpicUpdate" fires.
//                        It grabs the original copy out of `backupEpic`
//                        and snaps the UI right back to how it was,
//                        then shows an error toast.
