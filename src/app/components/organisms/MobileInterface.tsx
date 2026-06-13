'use client';

import { ReactNode, useMemo, useState, useEffect } from 'react';
import Mobile_Header from './Mobile_Header';
import SideBar from './Side-Bar';
import * as icons from '../../../../public/icons/icons';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/reduxHooks';
import { clearUser, setUser } from '@/features/auth/authSlice';
import { signOut } from '@/services/auth';
import { toast } from 'sonner';

interface MobileInterfaceProps {
  userData: {
    name?: string;
    department?: string;
  };

  children: ReactNode;
}

const MobileInterface = ({ userData, children }: MobileInterfaceProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fullName = userData?.name ?? '';
  const department = userData?.name ?? '';

  const router = useRouter();
  const dispatch = useAppDispatch();
  // Added client-side state synchronization by dispatching setUser(userData) in a useEffect hook.
  useEffect(() => {
    dispatch(setUser(userData));
  }, [dispatch, userData]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      dispatch(clearUser());
      router.replace('/login');
      setLoading(false);
    } catch (error) {
      console.error('Logout failed', error);
      toast.error('Logout failed');
    }
  };

  const avatarText = useMemo(() => {
    const words = fullName.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }, [fullName]);

  return (
    <div className="relative h-screen">
      <Mobile_Header
        fullName={fullName}
        department={department}
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
          handleLogout={handleLogout}
        />
      </div>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default MobileInterface;
