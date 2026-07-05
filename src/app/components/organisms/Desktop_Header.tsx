'use client';
import { useEffect, useRef, useState } from 'react';

interface Desktop_Header_Types {
  fullName: string;
  department?: string;
  avatarText: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  handleLogout?: () => void;
}

const Desktop_Header = ({
  fullName,
  avatarText,
  department,
  handleLogout,
}: Desktop_Header_Types) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 border-b border-gray-300 px-4 flex items-center justify-end">
      {/* --- Name + Avatar --- */}
      <div className="relative flex items-center justify-end gap-2">
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-semibold">{fullName}</span>
          <span className="text-xs text-slate-500">{department}</span>
        </div>

        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-sm font-semibold text-white"
            aria-expanded={menuOpen}
            aria-label="Open user menu"
          >
            {avatarText}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white p-2 shadow-lg shadow-black/5 z-20">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#BA1A1A] hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Desktop_Header;
