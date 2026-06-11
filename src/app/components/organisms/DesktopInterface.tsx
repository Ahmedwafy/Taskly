'use client';

import { ReactNode, useState } from 'react';
import SideBar from './Side-Bar';
import Desktop_Header from './Desktop_Header';

interface DesktopInterfaceProps {
  userData: {
    user_metadata?: { name?: string; department?: string };
  };
  children: ReactNode;
}

const DesktopInterface = ({ userData, children }: DesktopInterfaceProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fullName = userData?.user_metadata?.name ?? '';

  return (
    <div className="flex h-screen">
      <div className="hidden md:block">
        <SideBar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
        />
      </div>

      <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
        <Desktop_Header
          fullName={fullName}
          department={userData?.user_metadata?.department}
          avatarText={fullName
            .trim()
            .split(/\s+/)
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
        />

        <main
          className={`flex-1 overflow-auto transition-all duration-300`}
          // style={{ paddingLeft: isCollapsed ? '5rem' : '16rem' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DesktopInterface;
