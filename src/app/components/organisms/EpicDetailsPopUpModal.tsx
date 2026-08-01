'use client';
import * as icons from '@/../public/icons/icons';
import { useState } from 'react';
import Image from 'next/image';
import { EpicDetails, ProjectMember, ProjectTask } from '@/types/shared';
import EpicSkeletonPopup from '../loadingSkeletons/EpicDetailsPopUpLoadingSkeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// 1. Import React Select
import Select, { SingleValue } from 'react-select';
import { getInitials } from '@/lib/helpers/user';
import { useRef } from 'react';

interface EpicDetailsPopUpModalProps {
  selectedEpic: EpicDetails | null;
  errorMsg: string | null;
  isLoadingDetails: boolean;
  membersData: ProjectMember[];
  epicTasks: ProjectTask[];
  projectId: string;
  closeModal: () => void;
  formatDate: (dateString?: string, variant?: 'US' | 'EU') => string;
  handleUpdateEpicField: (
    epicId: string,
    updatedFields: Partial<EpicDetails> & { assignee_id?: string | null },
  ) => void | Promise<void>;
}

// 2. Define the Option shape for react-select
interface MemberOption {
  value: string; // user_id (empty string for unassigned)
  label: string; // member name or email
  avatarUrl?: string;
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
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  // 3. Format members list into options accepted by react-select
  const memberOptions: MemberOption[] = [
    { value: '', label: 'Unassigned' },
    ...membersData.map((member) => ({
      value: member.user_id,
      label: member.metadata?.name || member.email,
      avatarUrl: member.metadata?.avatar_url, // optional avatar inclusion
    })),
  ];

  // 4. Find current active option based on your component logic
  const currentAssigneeUserId =
    membersData.find((m) => m.metadata?.name === selectedEpic?.assignee?.name)
      ?.user_id || '';

  const currentOption =
    memberOptions.find((opt) => opt.value === currentAssigneeUserId) ||
    memberOptions[0];

  // 5. Handle dropdown selections safely
  const handleAssigneeChange = (newValue: SingleValue<MemberOption>) => {
    if (!selectedEpic) return;

    const selectedUserId = newValue?.value || '';
    const chosenMember = membersData.find((m) => m.user_id === selectedUserId);

    handleUpdateEpicField(selectedEpic.id, {
      assignee_id: selectedUserId || null,
      assignee: chosenMember
        ? {
            name: chosenMember.metadata.name,
            avatar_url: undefined, // preserves your existing design
          }
        : undefined,
    });
  };

  return (
    <>
      {/* ●──────────────────────────● Desktop View ●─────────────────────────● */}
      <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center bg-[#041B3C66] p-4 backdrop-blur-xs animate-fadeIn">
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

          {/* =============== Content Area =============== */}
          <div className="px-10 pb-10 overflow-y-auto space-y-8 flex-1">
            {isLoadingDetails && <EpicSkeletonPopup />}

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

                  {/* Assignee Selection (Members) */}
                  <div className="min-w-45">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      Assignee
                    </span>
                    <Select<MemberOption>
                      value={currentOption}
                      options={memberOptions}
                      onChange={handleAssigneeChange}
                      isSearchable={true}
                      placeholder="Select Assignee..."
                      components={{
                        // Custom SingleValue structure inside the selection area
                        SingleValue: ({ children, ...props }) => {
                          const avatarUrl = props.data.avatarUrl;
                          const label = props.data.label;
                          return (
                            <div className="flex items-center gap-2 h-full">
                              {avatarUrl ? (
                                <Image
                                  src={avatarUrl}
                                  alt="Avatar"
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                                  {label !== 'Unassigned'
                                    ? label.charAt(0).toUpperCase()
                                    : 'U'}
                                </div>
                              )}
                              <span className="text-sm font-semibold text-slate-700 truncate">
                                {children}
                              </span>
                            </div>
                          );
                        },
                        // Dropdown items inside the list menu
                        Option: ({
                          children,
                          innerProps,
                          isFocused,
                          isSelected,
                          data,
                        }) => (
                          <div
                            {...innerProps}
                            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium cursor-pointer transition ${
                              isSelected
                                ? 'bg-indigo-50 text-indigo-700'
                                : isFocused
                                  ? 'bg-slate-50 text-slate-900'
                                  : 'text-slate-700 bg-white'
                            }`}
                          >
                            {data.avatarUrl ? (
                              <Image
                                src={data.avatarUrl}
                                alt="Avatar"
                                width={20}
                                height={20}
                                className="w-5 h-5 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[9px] font-bold shrink-0">
                                {data.label !== 'Unassigned'
                                  ? data.label.charAt(0).toUpperCase()
                                  : 'U'}
                              </div>
                            )}
                            <span className="truncate">{children}</span>
                          </div>
                        ),
                      }}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          minHeight: '38px',
                          borderRadius: '0.5rem', // rounded-lg
                          borderWidth: '1px',
                          borderColor: state.isFocused ? '#6366f1' : '#cbd5e1',
                          backgroundColor: '#ffffff',
                          boxShadow: 'none',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: '#94a3b8',
                          },
                        }),
                        valueContainer: (baseStyles) => ({
                          ...baseStyles,
                          display: 'flex',
                          alignItems: 'center',
                          padding: '2px 8px',
                          gap: '4px',
                        }),
                        singleValue: (baseStyles) => ({
                          ...baseStyles,
                          position: 'static',
                          transform: 'none',
                          maxWidth: '100%',
                          margin: 0,
                        }),
                        menu: (baseStyles) => ({
                          ...baseStyles,
                          borderRadius: '0.5rem',
                          boxShadow:
                            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                          border: '1px solid #e2e8f0',
                          overflow: 'hidden',
                          zIndex: 60,
                        }),
                        menuList: (baseStyles) => ({
                          ...baseStyles,
                          padding: 0,
                        }),
                        indicatorSeparator: () => ({ display: 'none' }),
                        dropdownIndicator: (baseStyles) => ({
                          ...baseStyles,
                          color: '#64748b',
                          padding: '0 8px',
                          '&:hover': {
                            color: '#334155',
                          },
                        }),
                      }}
                    />
                  </div>

                  {/* Deadline */}
                  <div className="min-w-35 pl-4 border-l border-slate-200">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      Deadline
                    </span>
                    <div
                      onClick={() => dateInputRef.current?.showPicker()}
                      className="relative flex items-center gap-2 text-slate-700 hover:bg-slate-50 px-2 py-1 rounded-lg transition border border-transparent hover:border-slate-200 cursor-pointer"
                    >
                      <Image src={icons.Date} alt="deadline" />
                      <input
                        ref={dateInputRef}
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
                        className="absolute opacity-0 pointer-events-none"
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
                    <Link
                      href={`/projects/${projectId}/tasks/new?epicId=${selectedEpic.id}&epic_id=${selectedEpic.epic_id}`}
                    >
                      <button className="text-sm font-bold text-[#004dc7] hover:text-blue-800 transition cursor-pointer">
                        + Add Task
                      </button>
                    </Link>
                  </div>

                  {/* === Tasks List === */}
                  {!epicTasks || epicTasks.length === 0 ? (
                    <div className="border border-dashed border-[#dce2f5] rounded-xl p-10 flex flex-col items-center justify-center bg-[#F1F3FF] min-h-55">
                      <div className="w-12 h-12 bg-[#dae3f8] text-[#4770db] rounded-xl flex items-center justify-center mb-4">
                        <Image src={icons.emptyState} alt="empty-state" />
                      </div>
                      <p className="text-[15px] text-slate-900 font-medium mb-5">
                        No tasks have been added to this epic yet
                      </p>
                      <Link
                        href={`/projects/${projectId}/tasks/new?epicId=${selectedEpic.id}&epic_id=${selectedEpic.epic_id}`}
                      >
                        <button className="px-5 py-2.5 bg-[#004dc7] hover:bg-[#003da1] text-white font-semibold text-sm rounded-lg transition shadow-sm flex items-center gap-1.5 cursor-pointer">
                          <span>+</span> Add Task
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {epicTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() =>
                            router.push(
                              `/projects/${projectId}/tasks/details/${task.id}`,
                            )
                          }
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
                                    ? getInitials(task.assignee.name)
                                    : 'Unassigned'}
                                </span>
                                <span className="text-sm text-slate-500">
                                  {task.assignee.name
                                    ? task.assignee.name
                                    : 'Unassigned'}
                                </span>
                              </div>
                            </div>

                            {/* Due Date */}
                            <span className="text-sm font-medium text-slate-400">
                              {task.due_date
                                ? formatDate(task.due_date, 'EU')
                                : 'No due date'}
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

      {/* ●──────────────────────────● Mobile View ●─────────────────────────● */}
      <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-[#041B3C66] p-4 font-sans text-[#1e293b]">
        <div className="absolute inset-0" onClick={closeModal} />

        <div className="relative w-full max-w-97.5 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh] z-10">
          {/* Header Box (Light Blue Header) */}
          <div className="bg-[#f7f8fe] p-5 border-b border-[#eef0f8]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#3b5998] tracking-wider uppercase">
                {selectedEpic?.epic_id || 'EPIC-201'}
              </span>
              <button
                onClick={closeModal}
                className="text-[#64748b] hover:text-[#1e293b] p-1 rounded-md transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 shadow-2xs">
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={() => handleBlurSave('title', localTitle)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur();
                }}
                className="text-[17px] font-bold text-[#0f172a] w-full bg-transparent outline-none"
                placeholder="Epic Title"
              />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 overflow-y-auto space-y-6 flex-1 text-slate-700">
            {isLoadingDetails && <EpicSkeletonPopup />}

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {!isLoadingDetails && !errorMsg && selectedEpic && (
              <>
                {/* Description Box */}
                <div>
                  <label className="block text-[11px] font-bold text-[#5c6b89] tracking-wider uppercase mb-2">
                    Description
                  </label>
                  <textarea
                    value={localDesc}
                    onChange={(e) => setLocalDesc(e.target.value)}
                    onBlur={() => handleBlurSave('description', localDesc)}
                    rows={4}
                    placeholder="No description provided"
                    className="w-full border border-[#e2e8f0] rounded-xl p-3 text-[14px] text-[#475569] placeholder-[#94a3b8] focus:outline-none focus:border-[#4f46e5] transition resize-none"
                  />
                </div>

                {/* Grid Section 1: Created By & Assignee */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[11px] font-bold text-[#5c6b89] tracking-wider uppercase mb-2.5">
                      Created By
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedEpic.created_by?.avatar_url ? (
                        <Image
                          src={selectedEpic.created_by.avatar_url}
                          alt="Creator Avatar"
                          width={28}
                          height={28}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#dbe2f9] text-[#2b4c80] flex items-center justify-center text-[11px] font-bold">
                          {selectedEpic.created_by?.name
                            ? getInitials(selectedEpic.created_by.name)
                            : 'EL'}
                        </div>
                      )}
                      <span className="text-[13px] font-semibold text-[#1e293b] truncate">
                        {selectedEpic.created_by?.name || 'Elena Lopez'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-[#5c6b89] tracking-wider uppercase mb-2.5">
                      Assignee
                    </span>
                    <Select<MemberOption>
                      value={currentOption}
                      options={memberOptions}
                      onChange={handleAssigneeChange}
                      isSearchable={false}
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          minHeight: '36px',
                          borderRadius: '0.625rem',
                          borderColor: '#e2e8f0',
                          backgroundColor: '#ffffff',
                          boxShadow: 'none',
                          fontSize: '13px',
                          fontWeight: '500',
                          paddingLeft: '2px',
                        }),
                        valueContainer: (baseStyles) => ({
                          ...baseStyles,
                          padding: '0 6px',
                        }),
                        singleValue: (baseStyles) => ({
                          ...baseStyles,
                          color: '#334155',
                        }),
                        indicatorSeparator: () => ({ display: 'none' }),
                        dropdownIndicator: (baseStyles) => ({
                          ...baseStyles,
                          padding: '4px',
                          color: '#64748b',
                        }),
                      }}
                    />
                  </div>
                </div>

                <hr className="border-t border-[#f1f5f9]" />

                {/* Grid Section 2: Deadline & Created At */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[11px] font-bold text-[#5c6b89] tracking-wider uppercase mb-2">
                      Deadline
                    </span>
                    <div className="relative flex items-center justify-between border border-[#e2e8f0] rounded-xl px-3 py-2 bg-white">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <svg
                          className="w-4 h-4 text-[#004dc7] shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-[13px] font-medium text-[#1e293b] truncate">
                          {selectedEpic.deadline
                            ? formatDate(selectedEpic.deadline, 'US')
                            : 'Set Date'}
                        </span>
                      </div>
                      <svg
                        className="w-3.5 h-3.5 text-[#64748b] shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
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
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-[#5c6b89] tracking-wider uppercase mb-2">
                      Created At
                    </span>
                    <div className="flex items-center gap-2 py-2">
                      <svg
                        className="w-4 h-4 text-[#004dc7] shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-[13px] font-semibold text-[#1e293b]">
                        {selectedEpic.created_at
                          ? formatDate(selectedEpic.created_at, 'US')
                          : 'Dec 01, 2025'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tasks Header & Counter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#5c6b89] tracking-wider uppercase">
                      Tasks
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#eaf0fb] text-[#3b5998] px-2.5 py-1 rounded-full">
                      {epicTasks?.length || 0} Tasks
                    </span>
                  </div>

                  {/* Tasks Container / Empty State */}
                  {!epicTasks || epicTasks.length === 0 ? (
                    <div className="border-2 border-dashed border-[#e2e8f0] rounded-2xl p-6 flex flex-col items-center justify-center bg-[#f8fafd]">
                      <div className="w-12 h-12 bg-[#e8eefc] text-[#004dc7] rounded-xl flex items-center justify-center mb-3">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                          />
                        </svg>
                      </div>
                      <p className="text-[13px] text-[#475569] font-medium text-center mb-4 max-w-50">
                        No tasks have been added to this epic yet
                      </p>
                      <Link
                        href={`/projects/${projectId}/tasks/new?epicId=${selectedEpic.id}&epic_id=${selectedEpic.epic_id}`}
                        className="w-full flex justify-center"
                      >
                        <button className="px-4 py-2 bg-[#004dc7] hover:bg-[#003da1] text-white font-semibold text-[13px] rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
                          <span>+</span> Add Task
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {epicTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() =>
                            router.push(
                              `/projects/${projectId}/tasks/details/${task.id}`,
                            )
                          }
                          className="flex items-center justify-between py-2.5 px-3.5 border border-[#e2e8f0] rounded-xl bg-white hover:bg-slate-50 transition cursor-pointer"
                        >
                          <div className="flex flex-col gap-1 overflow-hidden pr-2">
                            <span className="font-semibold text-[13px] text-[#0f172a] truncate">
                              {task.title}
                            </span>
                            <div className="flex gap-1.5 items-center">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#004dc7] text-[9px] font-bold text-white shrink-0">
                                {task.assignee?.name
                                  ? getInitials(task.assignee.name)
                                  : 'U'}
                              </span>
                              <span className="text-[12px] text-[#64748b] truncate">
                                {task.assignee?.name || 'Unassigned'}
                              </span>
                            </div>
                          </div>

                          <span className="text-[12px] font-medium text-[#94a3b8] shrink-0">
                            {task.due_date
                              ? formatDate(task.due_date, 'US')
                              : 'No due date'}
                          </span>
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
    </>
  );
};

export default EpicDetailsPopUpModal;
