// src > app > component > organisms > TaskDetailsPopUpModal.tsx
'use client';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { useEffect, useState } from 'react';
import TaskDetailSkeleton from '../loadingSkeletons/TaskDetailsPopUpLoadingSkeleton';
import { useProjectMembers } from '@/app/hooks/members/useProjectMembers';
import Select, {
  components,
  SingleValueProps,
  OptionProps,
} from 'react-select';
import { STATUS_OPTIONS, TaskStatus } from '@/lib/enums';
import Link from '@/../public/svgIcons/Link.svg';
import StackIcon from '@/../public/svgIcons/StackIcon.svg';
import DoneTaskIcon from '@/../public/svgIcons/doneTaskOnMobile.svg';
import Close from '@/../public/svgIcons/CloseIcon.svg';
import { toast } from 'sonner';
import { ProjectTask } from '@/types/shared';
import { getStatusColorsStyle } from '@/lib/helpers/status';
import { getInitials } from '@/lib/helpers/user';
import { formatDate } from '@/lib/helpers/date';
import { useTaskDetails } from '@/app/hooks/tasks/useTaskDetails';
import { useUpdateTask } from '@/app/hooks/tasks/useUpdateTask';
import { useProjectEpicsSelect } from '@/app/hooks/epics/useProjectEpicsSelect';

// ----------------------------------------------------------------------
// Types & Custom Components for React Select
// ----------------------------------------------------------------------
interface StatusOption {
  value: TaskStatus;
  label: string;
}
interface AssigneeOption {
  value: string;
  label: string;
  initials?: string;
}

// Custom Single Value component for Assignee (displays Avatar + Name in the input control)
const CustomAssigneeSingleValue = (props: SingleValueProps<AssigneeOption>) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2.5">
        {data.initials && (
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#D4E2FF] text-[#4A6FA5] font-bold text-xs shrink-0">
            {data.initials}
          </span>
        )}
        <span className="font-semibold text-gray-800 text-sm">
          {data.label}
        </span>
      </div>
    </components.SingleValue>
  );
};
// Custom Option component for Assignee (displays Avatar + Name in the dropdown menu)
const CustomAssigneeOption = (props: OptionProps<AssigneeOption>) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2.5 py-0.5">
        {data.initials ? (
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#D4E2FF] text-[#4A6FA5] font-bold text-xs shrink-0">
            {data.initials}
          </span>
        ) : (
          <span className="w-7 h-7 shrink-0" />
        )}
        <span className="text-sm font-medium">{data.label}</span>
      </div>
    </components.Option>
  );
};

interface TaskDetailsPopUpModalProps {
  taskId: string;
  projectId: string;
  onClose: () => void;
  onTaskUpdated?: (updatedTask: ProjectTask) => void;
}

const TaskDetailsPopUpModal = ({
  taskId,
  projectId,
  onClose,
  onTaskUpdated,
}: TaskDetailsPopUpModalProps) => {
  // • • GET Task Details • •
  const {
    data: task,
    isLoading: loading,
    error: fetchError,
  } = useTaskDetails(projectId, taskId);

  // • • Update Task  • •
  const { mutate: updateTask, isPending: isSaving } = useUpdateTask();

  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');

  // Sync local input buffers whenever the fetched task changes
  useEffect(() => {
    if (task) {
      setTitleInput(task.title || '');
      setDescInput(task.description || '');
    }
  }, [task]);
  const error = fetchError instanceof Error ? fetchError.message : null;
  //  • get list of members •
  const { data: membersData = [] } = useProjectMembers(projectId);

  const isMobile = useIsMobile();

  const handlePatchTask = (
    fieldKey: string,
    dbPayload: Record<string, unknown>,
    optimisticPatch: Partial<ProjectTask>,
    toastMessage: string,
  ) => {
    if (!task) return;

    updateTask(
      { projectId, taskId, dbPayload, optimisticPatch },
      {
        onSuccess: (updatedTask) => {
          if (onTaskUpdated) onTaskUpdated({ ...task, ...optimisticPatch });
          toast.success(toastMessage);
        },
        onError: () => {
          setTitleInput(task.title || '');
          setDescInput(task.description || '');
          toast.error('Failed to update task. Please try again.');
        },
      },
    );
  };
  // • • GET Members & Epics • •
  const { data: epicsData } = useProjectEpicsSelect({ projectId });
  const projectEpics = epicsData?.projectEpics ?? [];

  if (!task) return null;
  const statusColors = getStatusColorsStyle(task.status);

  // • • Centralized Optimistic PATCH Handler • •

  // Status change now moves the card between Board columns too
  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!task || newStatus === task.status) return;
    const originalStatus = task.status;

    updateTask(
      {
        projectId,
        taskId,
        dbPayload: { status: newStatus },
        optimisticPatch: { status: newStatus },
        boardMove: {
          fromStatus: originalStatus,
          toStatus: newStatus,
          taskData: task,
        },
      },
      {
        onSuccess: () => {
          if (onTaskUpdated) onTaskUpdated({ ...task, status: newStatus });
          toast.success('status successfully updated');
        },
        onError: () => {
          toast.error('Failed to update task. Please try again.');
        },
      },
    );
  };

  // --- Handlers for Specific Fields ---
  const handleTitleBlur = () => {
    if (!task) return;
    const trimmed = titleInput.trim();

    // If empty/invalid, revert back
    if (!trimmed) {
      setTitleInput(task.title);
      return;
    }

    // Skip API call if unchanged
    if (trimmed === task.title) return;

    handlePatchTask(
      'title',
      { title: trimmed },
      { title: trimmed },
      'title sccessfuly updated',
    );
  };

  const handleDescriptionBlur = () => {
    if (!task) return;
    const trimmed = descInput.trim();
    const finalValue = trimmed === '' ? null : trimmed;

    if (finalValue === task.description) return;

    handlePatchTask(
      'description',
      { description: finalValue },
      { description: finalValue ?? '' },
      'description sccessfuly updated',
    );
  };

  const handleAssigneeChange = (memberId: string) => {
    if (!task) return;
    const assignee_id = memberId === 'unassigned' ? null : memberId;

    if (assignee_id === (task.assignee?.id || null)) return;

    // const selectedMember = membersData.find((m: any) => m.id === memberId);
    const selectedMember = membersData.find(
      (member) => member.member_id === memberId,
    );

    const newAssignee: ProjectTask['assignee'] = selectedMember
      ? {
          id: selectedMember.user_id,
          name: selectedMember.metadata.name,
          email: selectedMember.metadata.email,
          department: selectedMember.metadata.department || '',
        }
      : {
          id: '',
          name: 'Unassigned',
          email: '',
          department: '',
        };

    handlePatchTask(
      'assignee_id',
      { assignee_id },
      { assignee: newAssignee },
      'assignee sccessfuly updated',
    );
  };

  const handleEpicChange = (epicId: string) => {
    if (!task) return;
    const epic_id = epicId === 'none' ? null : epicId;

    if (epic_id === (task.epic?.id || null)) return;

    // const selectedEpic = projectEpics.find((e: any) => e.id === epicId);
    const selectedEpic = projectEpics.find((epic) => epic.id === epicId);
    handlePatchTask(
      'epic_id',
      { epic_id },
      {
        epic: selectedEpic
          ? {
              id: selectedEpic.id,
              epic_id: selectedEpic.epic_id,
              title: selectedEpic.title,
            }
          : { id: '', epic_id: 'No Epic', title: '' },
      },
      'epic sccessfuly updated',
    );
  };

  const handleDueDateChange = (dateString: string) => {
    if (!task) return;

    const due_date = dateString ? new Date(dateString).toISOString() : null;

    handlePatchTask(
      'due_date',
      { due_date },
      { due_date: due_date || '' },
      'date sccessfuly updated',
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link Copied');
    // alert('Link Cpoied');
  };

  const showDoneIcon = ['DONE', 'COMPLETED'].includes(task.status);

  // Prevents selecting past dates
  const todayDateString = new Date().toISOString().split('T')[0];

  if (isMobile === null) return null;

  return (
    <>
      {/* ●──────────────────────────● Desktop View ●─────────────────────────● */}
      {!isMobile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#041B3C66] p-4 backdrop-blur-xs animate-fadeIn">
          <div className="absolute inset-0" onClick={onClose} />

          {loading && <TaskDetailSkeleton />}

          {error && (
            <p className="text-sm text-red-400 text-center mt-4">{error}</p>
          )}

          {!loading && !error && !task && (
            <p className="text-sm italic text-center mt-8">No tasks found</p>
          )}

          {task && (
            <div className="flex w-4xl h-217.5 z-10 rounded-lg bg-white overflow-hidden shadow-xl">
              {/* ●───────────────────● Left Section ●──────────────● */}
              <div className="relative w-2/3 flex flex-col pt-6 justify-between ">
                <div className="h-full">
                  <div className="flex gap-2 pl-8 items-center">
                    <span className="break-all bg-[#DAE2FF] text-[#003D9B] px-4 py-1 rounded-sm text-[12px] font-bold">
                      {task.task_id}
                    </span>

                    {/* Epic Selection Dropdown */}

                    <div className="flex gap-2 items-center px-2 py-1 rounded-sm bg-gray-100 text-xs">
                      <StackIcon />

                      <div className="min-w-24">
                        <Select
                          value={{
                            value: task.epic?.id || 'none',
                            label: task.epic?.epic_id || 'No Epic',
                          }}
                          isDisabled={isSaving}
                          options={[
                            { value: 'none', label: 'No Epic' },
                            ...projectEpics.map((epic) => ({
                              value: epic.id,
                              label: epic.epic_id,
                            })),
                          ]}
                          onChange={(selected) =>
                            selected && handleEpicChange(selected.value)
                          }
                          isSearchable={false}
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: 'none',
                              backgroundColor: 'transparent',
                              minHeight: 'unset',
                              boxShadow: 'none',
                              cursor: 'pointer',
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              padding: 0,
                            }),
                            singleValue: (base) => ({
                              ...base,
                              fontSize: '12px',
                              fontWeight: 500,
                            }),
                            indicatorSeparator: () => ({
                              display: 'none',
                            }),
                            dropdownIndicator: (base) => ({
                              ...base,
                              padding: 2,
                            }),
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Editable Title */}
                  <div className="border-b border-[#E8EDFF] pt-4 pb-4 px-6">
                    <input
                      type="text"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      disabled={isSaving}
                      onBlur={handleTitleBlur}
                      className="w-full text-2xl font-bold text-gray-800 bg-transparent rounded border border-transparent hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none px-2 py-1 transition-all"
                      placeholder="Task title..."
                    />
                  </div>

                  {/* Editable Description */}
                  <div className="flex flex-col gap-2 px-6 pt-6 h-[80%]">
                    <span className="uppercase text-xs font-semibold text-gray-500 tracking-wider">
                      description
                    </span>
                    <textarea
                      rows={4}
                      value={descInput}
                      disabled={isSaving}
                      onChange={(e) => setDescInput(e.target.value)}
                      onBlur={handleDescriptionBlur}
                      placeholder="No description provided"
                      className="w-full h-full p-2 text-sm text-gray-700 border rounded-lg border-gray-300 focus:border-blue-300 focus:bg-white focus:outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Modal Bottom Actions */}
                <div className="flex justify-between bg-[#F1F3FF] w-full h-18 px-8 items-center py-4 mt-6">
                  <span
                    onClick={handleCopyLink}
                    className="flex gap-2 items-center cursor-pointer text-sm text-gray-700 hover:text-black"
                  >
                    <Link /> Copy Link
                  </span>
                  <button
                    className="bg-[#D7E2FF] hover:bg-[#c3d5ff] py-2 px-4 rounded-md cursor-pointer transition-colors"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* ●───────────────────● Right Section ●─────────────● */}
              <div className="w-1/3 bg-[#E8EDFF] p-6 rounded-r-lg flex flex-col gap-6">
                {/* Editable Status */}
                <div className="flex flex-col gap-2">
                  <strong className="uppercase text-[12px] font-bold tracking-wider text-gray-500">
                    status
                  </strong>

                  <Select<StatusOption>
                    value={{
                      value: task.status,
                      label: task.status.replace(/_/g, ' '),
                    }}
                    isDisabled={isSaving}
                    options={STATUS_OPTIONS.map((status) => ({
                      value: status,
                      label: status.replace(/_/g, ' '),
                    }))}
                    onChange={(selected) =>
                      selected && handleStatusChange(selected.value)
                    }
                    isSearchable={false}
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: 'none',
                        borderRadius: '8px',
                        minHeight: '44px',
                        padding: '0 8px',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: statusColors.text,
                        fontWeight: '700',
                        fontSize: '13px',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: '4px',
                      }),
                      indicatorSeparator: () => ({ display: 'none' }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        zIndex: 20,
                      }),
                      option: (base, state) => ({
                        ...base,
                        fontWeight: '600',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        backgroundColor: state.isSelected
                          ? '#F3F4F6'
                          : state.isFocused
                            ? '#F9FAFB'
                            : 'white',
                        color: '#1F2937',
                        cursor: 'pointer',
                      }),
                    }}
                  />
                </div>

                {/* Editable Assignee */}
                <div className="flex flex-col gap-2">
                  <strong className="uppercase text-[12px] font-bold tracking-wider text-gray-500">
                    assignee
                  </strong>
                  <Select<AssigneeOption>
                    value={{
                      value: task.assignee?.id || 'unassigned',
                      label: task.assignee?.name || 'Unassigned',
                      initials: task.assignee?.name
                        ? getInitials(task.assignee.name)
                        : '',
                    }}
                    isDisabled={isSaving}
                    options={[
                      {
                        value: 'unassigned',
                        label: 'Unassigned',
                        initials: '',
                      },
                      ...membersData.map((member) => ({
                        value: member.member_id,
                        label: member.metadata.name,
                        initials: getInitials(member.metadata.name),
                      })),
                    ]}
                    onChange={(selected) =>
                      selected && handleAssigneeChange(selected.value)
                    }
                    components={{
                      SingleValue: CustomAssigneeSingleValue,
                      Option: CustomAssigneeOption,
                    }}
                    isSearchable={true}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #DCE4FF',
                        borderRadius: '12px',
                        minHeight: '48px',
                        padding: '0 6px',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: '#B3C8FF',
                        },
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        color: '#4B5563',
                        padding: '4px',
                        '&:hover': {
                          color: '#111827',
                        },
                      }),
                      indicatorSeparator: () => ({ display: 'none' }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        zIndex: 20,
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? '#F0F4FF'
                          : state.isFocused
                            ? '#F8FAFC'
                            : 'white',
                        color: '#1F2937',
                        cursor: 'pointer',
                      }),
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <strong className="uppercase text-[12px] text-description">
                    reporter
                  </strong>
                  <div className="rounded-md flex gap-3 items-center h-10">
                    <span className="bg-[#CDDDFF] rounded-full w-6 h-6 px-1 text-[#51617E] text-[10px] font-bold flex items-center justtify-center ml-2">
                      {task.assignee?.name
                        ? getInitials(task.assignee.name)
                        : '?'}
                    </span>
                    <span>{task.assignee.name}</span>
                  </div>
                </div>

                <hr className="border-gray-300" />

                {/* Editable Due Date */}
                <div className="flex flex-col justify-between gap-2 w-full">
                  <span className="text-[#434654] font-medium text-sm">
                    Due Date
                  </span>
                  <input
                    type="date"
                    min={todayDateString}
                    disabled={isSaving}
                    value={
                      task.due_date
                        ? new Date(task.due_date).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) => handleDueDateChange(e.target.value)}
                    className="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 cursor-pointer focus:outline-none h-10"
                  />
                </div>

                {/* Created At (Read-only) */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-[#434654] font-medium text-sm">
                    Created At
                  </span>
                  <span className="text-end text-xs text-gray-600">
                    {formatDate(task.created_at, `EU`)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ●──────────────────────────● Mobile View ●─────────────────────────● */}
      {isMobile && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-fadeIn p-0">
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={onClose} />

          {loading && <TaskDetailSkeleton />}

          {error && (
            <p className="text-sm text-red-400 text-center z-10 my-4">
              {error}
            </p>
          )}

          {!loading && !error && !task && (
            <p className="text-sm italic text-center z-10 my-8 text-white">
              No tasks found
            </p>
          )}

          {task && (
            <div className="relative z-10 w-full max-w-lg min-h-[70%] overflow-y-auto bg-[#F0F3F9] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
              {/* Top Grab Handle */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto -mt-2 mb-1" />

              {/* Header: Task ID & Close Button */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  {task.task_id}
                </span>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Close />
                </button>
              </div>

              {/* Task Title */}
              <div>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  disabled={isSaving}
                  onBlur={handleTitleBlur}
                  placeholder="Task title..."
                  className="w-full text-xl sm:text-2xl font-bold text-[#0B192C] bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              {/* Badges: Status & Epic */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status Badge Select */}
                <div
                  className={`flex gap-2 items-center min-h-6.25 ${showDoneIcon && 'bg-[#82F9BE] rounded-full px-2 py-0 justify-center'}`}
                >
                  {showDoneIcon && <DoneTaskIcon />}
                  <div className="relative">
                    <Select<StatusOption>
                      value={{
                        value: task.status,
                        label: task.status.replace(/_/g, ' '),
                      }}
                      isDisabled={isSaving}
                      options={STATUS_OPTIONS.map((status) => ({
                        value: status,
                        label: status.replace(/_/g, ' '),
                      }))}
                      onChange={(selected) =>
                        selected && handleStatusChange(selected.value)
                      }
                      isSearchable={false}
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: 'none',
                          borderRadius: '9999px',
                          minHeight: '32px',
                          padding: '0 8px',
                          boxShadow: 'none',
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: '11px',
                        }),
                        option: (base, state) => ({
                          ...base,
                          fontWeight: '600',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          backgroundColor: state.isSelected
                            ? '#F3F4F6'
                            : state.isFocused
                              ? '#F9FAFB'
                              : 'white',
                          color: '#1F2937',
                          cursor: 'pointer',
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: '#00623B',
                          fontWeight: '700',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                        }),
                        indicatorSeparator: () => ({ display: 'none' }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          padding: '2px',
                          color: '#00623B',
                        }),
                      }}
                    />
                  </div>
                </div>

                {/* Epic Badge Select */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DCE4FF] text-[#003D9B] min-h-6.25">
                  <StackIcon className="w-3.5 h-3.5" />

                  <div className="min-w-20">
                    <Select
                      value={{
                        value: task.epic?.id || 'none',
                        label: task.epic?.epic_id || 'No Epic',
                      }}
                      isDisabled={isSaving}
                      options={[
                        { value: 'none', label: 'No Epic' },
                        ...projectEpics.map((epic) => ({
                          value: epic.id,
                          label: epic.epic_id,
                        })),
                      ]}
                      onChange={(selected) =>
                        selected && handleEpicChange(selected.value)
                      }
                      isSearchable={false}
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: 'none',
                          backgroundColor: 'transparent',
                          minHeight: 'unset',
                          boxShadow: 'none',
                        }),
                        option: (base, state) => ({
                          ...base,
                          fontWeight: '600',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          backgroundColor: state.isSelected
                            ? '#F3F4F6'
                            : state.isFocused
                              ? '#F9FAFB'
                              : 'white',
                          color: '#1F2937',
                          cursor: 'pointer',
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: 0,
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: '#003D9B',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }),
                        indicatorSeparator: () => ({
                          display: 'none',
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          padding: 2,
                          color: '#003D9B',
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 2x2 Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Assignee Card */}
                <div className="bg-[#E9EEFA] p-3.5 rounded-xl flex flex-col justify-between min-h-20.25 min-w-41.25">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Assignee
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-6 h-6 rounded-full bg-[#CDDDFF] text-[#3355A6] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {task.assignee?.name
                        ? getInitials(task.assignee.name)
                        : '?'}
                    </span>
                    <span className="text-xs font-semibold text-gray-800 truncate">
                      {task.assignee?.name || 'Unassigned'}
                    </span>
                  </div>
                </div>

                {/* Due Date Card */}
                <div className="bg-[#E9EEFA] p-3.5 rounded-xl flex flex-col justify-between min-h-20.25 min-w-41.25">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Due Date
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Calendar Icon */}
                    <svg
                      className="w-4 h-4 text-blue-600 shrink-0"
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
                    <input
                      type="date"
                      min={todayDateString}
                      disabled={isSaving}
                      value={
                        task.due_date
                          ? new Date(task.due_date).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) => handleDueDateChange(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer w-full"
                    />
                  </div>
                </div>

                {/* Created By / Reporter Card */}
                <div className="bg-[#E9EEFA] p-3.5 rounded-xl flex flex-col justify-between min-h-20.25 min-w-41.25">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Created By
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-6 h-6 rounded-full bg-[#CDDDFF] text-[#3355A6] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {task.assignee?.name
                        ? getInitials(task.assignee.name)
                        : '?'}
                    </span>
                    <span className="text-xs font-semibold text-gray-800 truncate">
                      {task.assignee?.name || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Created At Card */}
                <div className="bg-[#E9EEFA] p-3.5 rounded-xl flex flex-col justify-between min-h-20.25 min-w-41.25">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Created At
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {/* History / Clock Icon */}
                    <svg
                      className="w-4 h-4 text-blue-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs font-semibold text-gray-800">
                      {formatDate(task.created_at, `EU`)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="flex flex-col gap-2 mt-1 min-w-85.5 min-h-47">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Description
                </span>
                <textarea
                  rows={5}
                  value={descInput}
                  disabled={isSaving}
                  onChange={(e) => setDescInput(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  placeholder="No description provided..."
                  className="w-full p-4 text-xs sm:text-sm text-gray-700 bg-white border-none rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-xs transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TaskDetailsPopUpModal;
