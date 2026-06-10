'use client';
import Image from 'next/image';
import * as icons from '../../../../public/icons/icons';

interface Mobile_Header_Types {
  fullName: string;
  department?: string;
  avatarText: string;
  onToggleSidebar?: () => void;
}

const Mobile_Header = ({
  fullName,
  avatarText,
  department,
  onToggleSidebar,
}: Mobile_Header_Types) => {
  return (
    <header className="h-16 border-b border-gray-300 px-4 flex items-center justify-end">
      <div className="flex items-center justify-between w-full">
        <div className="md:hidden flex gap-4 items-center">
          <button onClick={onToggleSidebar} aria-label="Open sidebar">
            <Image src={icons.Burger_Icon} alt="Burger Icon" />
          </button>
          <span className="font-bold text-xl">TASKLY</span>
        </div>

        {/* Name + Avatar */}
        <div className="flex gap-2 sm:hidden">
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold">{fullName}</span>
            <span className="text-xs text-slate-500">{department}</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--primary-container) text-sm font-semibold text-white">
            {avatarText}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Mobile_Header;
