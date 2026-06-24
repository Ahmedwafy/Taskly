import Image from 'next/image';
import * as icons from '@/../public/icons/icons';

interface UserProfile {
  name?: string;
  avatar_url?: string;
}

interface EpicDetails {
  epic_id?: string;
  title?: string;
  description?: string;
  created_by?: UserProfile;
  assignee?: UserProfile;
  deadline?: string;
  created_at?: string;
}

interface EpicDetailsPopUpModalProps {
  closeModal: () => void;
  selectedEpic: EpicDetails | null;
  formatDate: (dateString?: string) => string;
  errorMsg: string | null;
  isLoadingDetails: boolean;
}

const EpicDetailsPopUpModal = ({
  closeModal,
  selectedEpic,
  formatDate,
  errorMsg,
  isLoadingDetails,
}: EpicDetailsPopUpModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue/40 p-4 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop Click to Close */}
      <div className="absolute inset-0" onClick={closeModal} />

      {/* Modal Box */}
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 text-[#1e293b]">
        {/* Header */}
        <div className="flex items-start justify-between px-10 pt-10 pb-6">
          <div className="space-y-2">
            {/* Epic Logo & ID */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
              <Image src={icons.popupLogo} alt="logo" />
              <span>{selectedEpic?.epic_id || 'EPIC-101'}</span>
            </div>

            {/* Epic Title */}
            <h1 className="text-[26px] font-bold text-[#0f172a] tracking-tight">
              {selectedEpic?.title || 'Modern Architecture Overhaul'}
            </h1>
          </div>

          {/* Close Button */}
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-400 hover:text-slate-600"
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
              {/* Description */}
              <div>
                <p className="text-[#334155] text-[15px] leading-relaxed">
                  {selectedEpic.description || 'No description provided.'}
                </p>
              </div>

              {/* Metadata Flex/Grid Row */}
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
                      {selectedEpic.created_by?.name || 'Mahmoud Taha'}
                    </span>
                  </div>
                </div>

                {/* Assignee */}
                <div className="min-w-35">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Assignee
                  </span>
                  <div className="flex items-center gap-2.5">
                    {selectedEpic.assignee?.avatar_url ? (
                      <Image
                        src={selectedEpic.assignee.avatar_url}
                        alt="Assignee Avatar"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {selectedEpic.assignee?.name?.charAt(0).toUpperCase() ||
                          'J'}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-slate-700">
                      {selectedEpic.assignee?.name || 'John Doe'}
                    </span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="min-w-35 pl-4 border-l border-slate-200">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Deadline
                  </span>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Image src={icons.Date} alt="deadline" />
                    <span className="text-sm font-medium">
                      {selectedEpic.deadline
                        ? formatDate(selectedEpic.deadline)
                        : 'Oct 15, 2025'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Created At row */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Created At
                </span>
                <div className="flex items-center gap-2 text-slate-700">
                  <Image src={icons.Date} alt="deadline" />
                  <span className="text-sm font-medium">
                    {selectedEpic.created_at
                      ? formatDate(selectedEpic.created_at)
                      : 'Oct 15, 2025'}
                  </span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Epic Tasks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Tasks</h3>
                  <button
                    onClick={() => {
                      /* add task callback */
                    }}
                    className="text-sm font-bold text-[#004dc7] hover:text-blue-800 transition"
                  >
                    + Add Task
                  </button>
                </div>

                {/* Empty State  */}
                <div className="border border-dashed border-[#dce2f5] rounded-xl p-10 flex flex-col items-center justify-center bg-[#F1F3FF] min-h-55">
                  <div className="w-12 h-12 bg-[#dae3f8] text-[#4770db] rounded-xl flex items-center justify-center mb-4">
                    <Image src={icons.emptyState} alt="empty-state" />
                  </div>

                  <p className="text-[15px] text-slate-900 font-medium mb-5">
                    No tasks have been added to this epic yet
                  </p>

                  <button
                    onClick={() => {
                      /* add task callback */
                    }}
                    className="px-5 py-2.5 bg-[#004dc7] hover:bg-[#003da1] text-white font-semibold text-sm rounded-lg transition shadow-sm flex items-center gap-1.5"
                  >
                    <span>+</span> Add Task
                  </button>
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
