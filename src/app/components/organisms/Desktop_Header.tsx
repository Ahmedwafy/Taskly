import Image from 'next/image';
import * as icons from '../../../../public/icons/icons';

interface Desktop_Header_Types {
  fullName: string;
  department?: string;
  avatarText: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Desktop_Header = ({
  fullName,
  avatarText,
  department,
  // isCollapsed,
  // onToggleCollapse,
}: Desktop_Header_Types) => {
  return (
    <header className="h-16 border-b border-gray-300 px-4 flex items-center justify-end">
      {/* <div className="flex items-center justufy-end w-full"> */}
      {/* <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-2 rounded-md hover:bg-slate-100"
          >
            <Image src={icons.Collapse} alt="Collapse" width={18} height={18} />
          </button>
        </div> */}

      {/* Name + Avatar */}
      <div className="flex items-center justify-end gap-2">
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-semibold">{fullName}</span>
          <span className="text-xs text-slate-500">{department}</span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--primary-container) text-sm font-semibold text-white">
          {avatarText}
        </div>
      </div>
      {/* </div> */}
    </header>
  );
};

export default Desktop_Header;
