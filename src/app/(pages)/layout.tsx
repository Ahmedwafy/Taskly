// src/app/(pages)/layout.tsx
import { getUserData } from '@/services/getUserData';
import { redirect } from 'next/navigation';
import MobileInterface from '../components/organisms/MobileInterface';
import DesktopInterface from '../components/organisms/DesktopInterface';

export default async function Interface_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userData;

  try {
    userData = await getUserData();
  } catch {
    redirect('/login');
  }

  if (!userData) {
    redirect('/login');
  }

  return (
    <>
      {/* ========= Desktop View =========*/}
      <div className="hidden sm:block h-screen">
        <DesktopInterface userData={userData}>{children}</DesktopInterface>
      </div>

      {/* ========= Mobile View ========= */}
      <div className="sm:hidden h-screen">
        <MobileInterface userData={userData}>{children}</MobileInterface>
      </div>
    </>
  );
}
