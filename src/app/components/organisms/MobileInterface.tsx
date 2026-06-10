'use client';

import { ReactNode, useMemo, useState } from 'react';
import Mobile_Header from './Mobile_Header';
import SideBar from './Side-Bar';
import * as icons from '../../../../public/icons/icons';

interface MobileInterfaceProps {
  userData: {
    user_metadata?: { name?: string; department?: string };
  };
  children: ReactNode;
}

const MobileInterface = ({ userData, children }: MobileInterfaceProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const fullName = userData?.user_metadata?.name ?? '';
  const avatarText = useMemo(() => {
    const words = fullName.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }, [fullName]);

  return (
    <div className="relative h-screen">
      <Mobile_Header
        fullName={fullName}
        department={userData?.user_metadata?.department}
        avatarText={avatarText}
        onToggleSidebar={() => setIsOpen((v) => !v)}
      />

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container (kept in DOM to allow slide animation) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <SideBar
          onItemClick={() => setIsOpen(false)}
          mobileIcon={icons.Collapsed_Projects}
        />
      </div>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default MobileInterface;
