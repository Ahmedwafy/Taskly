// src → app → (pages) → layout.tsx
import { redirect } from 'next/navigation';
import MobileInterface from '../components/organisms/MobileInterface';
import DesktopInterface from '../components/organisms/DesktopInterface';
import { getAuthCookies } from '@/lib/auth';
import { fetchUserData } from '@/app/queries/user'; // Clean Import!
import ResponsiveLayout from '../components/ResponsiveLayout';

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
    <ResponsiveLayout
      mobile={<MobileInterface userData={userData}>{children}</MobileInterface>}
      desktop={
        <DesktopInterface userData={userData}>{children}</DesktopInterface>
      }
    />
  );
}
