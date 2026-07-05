// src → app → (pages) → layout.tsx
import { redirect } from 'next/navigation';
import MobileInterface from '../components/organisms/MobileInterface';
import DesktopInterface from '../components/organisms/DesktopInterface';
import { getAuthCookies } from '@/lib/auth';
import { fetchUserData } from '@/app/queries/user'; // Clean Import!

export default async function Interface_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken } = await getAuthCookies();

  if (!accessToken) {
    redirect('/login');
  }

  let userData;

  try {
    userData = await fetchUserData({ accessToken });
  } catch (error) {
    console.error('Failed to resolve authenticated session payload:', error);
    redirect('/login');
  }

  if (!userData) {
    redirect('/login');
  }

  return (
    <>
      {/* ========= Desktop View [ Sidebar + Header ] =========*/}
      <div className="hidden sm:block h-screen">
        <DesktopInterface userData={userData}>{children}</DesktopInterface>
      </div>

      {/* ========= Mobile View  [ Sidebar + Header ] ========= */}
      <div className="sm:hidden h-screen">
        <MobileInterface userData={userData}>{children}</MobileInterface>
      </div>
    </>
  );
}
