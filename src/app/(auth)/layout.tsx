import * as icons from '../../../public/icons/icons';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center w-full bg-surface-low gap-10">
      <div className="w-full flex py-6 gap-2">
        <div className="relative left-4 mr-4 my-auto">
          <Image src={icons.Logo} alt="Logo" width={18} height={20} />
        </div>
        <h1 className="text-[20px] font-bold">TASKLY</h1>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
