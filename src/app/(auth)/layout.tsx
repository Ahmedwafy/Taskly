// src > app > (auth) > layout.tsx
import LOGO from '@/../public/svgIcons/LOGO.svg';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex flex-col items-center w-full bg-surface-low gap-10">
      <div className="w-full flex py-6 gap-2">
        <div className="relative left-4 mr-4 my-auto">
          <LOGO />
        </div>
        <h1 className="text-[20px] font-bold">TASKLY</h1>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
