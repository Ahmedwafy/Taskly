// src > app > components > organisms > ProjectEpicsGrid.tsx

import { ProjectEpic } from '@/types/shared';
import { getInitials } from '@/lib/helpers';
import DateIcon from '@/../public/svgIcons/Date.svg';
import DotsIcon from '@/../public/svgIcons/DotsIcon.svg';
import CreatedByIcon from '@/../public/svgIcons/CreatedByIcon.svg';

interface ProjectEpicsProps {
  projectEpics: ProjectEpic[];
  onEpicClick: (epicId: string) => void;
}

const ProjectEpicsGrid = ({ projectEpics, onEpicClick }: ProjectEpicsProps) => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-wrap gap-y-6 mx-auto justify-between mt-10">
        {projectEpics.map((epic) => (
          <div
            key={epic.id}
            onClick={() => onEpicClick(epic.id)}
            className="relative flex flex-col justify-between bg-white rounded-xl shadow-sm border border-slate-100 sm:border-l-[6px] sm:border-l-emerald-800 
            w-full md:w-[49%] lg:w-[49%]! 
             cursor-pointer hover:shadow-md hover:border-slate-200 transition duration-200"
          >
            {/* ○ ○ ○  Card Content Container ○ ○ ○  */}
            <div className="p-6 sm:pl-6">
              {/* Top Row: Badge & Menu */}
              <div className="flex justify-between items-center mb-4">
                <span className="bg-[#DAE2FF] text-[#003D9B] sm:bg-[#82F9BE] sm:text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded">
                  {epic.epic_id || 'EPIC-102'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents modal from popping up when clicking the menu button
                    // Handle dropdown action here if needed
                  }}
                  className="p-1 hover:bg-slate-50 rounded-lg transition"
                >
                  <DotsIcon className="rotate-90 md:rotate-0" />
                </button>
              </div>

              {/* ○ ○ ○  Title ○ ○ ○  */}
              <h3 className="text-xl font-bold text-slate-900 mb-5 tracking-tight">
                {epic.title}
              </h3>

              {/* ○ ○ ○  Assignee Section ○ ○ ○  */}
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  {epic.assignee?.name && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold bg-[#003D9B] sm:bg-emerald-400 text-white sm:text-emerald-900 text-sm">
                      {getInitials(epic.assignee?.name)}
                    </div>
                  )}

                  <div className="flex flex-col-reverse sm:flex-col">
                    <p className="text-xs text-slate-500 font-medium">
                      Assignee
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {epic.assignee?.name ?? `Unassigned`}
                    </p>
                  </div>
                </div>

                <div className="sm:hidden flex flex-col">
                  <strong className="text-[10px] text-gray-500 text-end">
                    DEADLINE
                  </strong>
                  <span className="text-sm">
                    {epic.deadline
                      ? new Date(epic.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Created Date'}
                  </span>
                </div>
              </div>
            </div>

            {/* ○ ○ ○  Divider ○ ○ ○ */}
            <hr className="border-slate-100 hidden sm:block sm:w-[95%] sm:mx-auto" />

            {/* ○ ○ ○  Footer Row ○ ○ ○ */}
            <div className="hidden px-6 py-4 bg-white pl-8 sm:flex justify-between items-center text-xs text-slate-500 font-medium rounded-b-xl">
              <div className="flex items-center gap-1.5">
                <CreatedByIcon />
                <span>
                  Created by:
                  <strong className="text-slate-700 font-semibold">
                    {epic.created_by?.name || 'Mahmoud Taha'}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <DateIcon />
                <span>
                  {epic.created_at
                    ? new Date(epic.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Created Date'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectEpicsGrid;
