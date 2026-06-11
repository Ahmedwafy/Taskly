import { cookies } from 'next/headers';
import { getUserData } from '@/services/getUserData';
import { redirect } from 'next/navigation';
import MobileInterface from '../components/organisms/MobileInterface';
import DesktopInterface from '../components/organisms/DesktopInterface';

export default async function Interface_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    redirect('/login');
  }

  let userData;

  try {
    userData = await getUserData(accessToken);
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
