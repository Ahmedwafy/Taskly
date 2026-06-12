import Button from '@/app/components/atoms/Button';
import Link from 'next/link';

export default function projects() {
  return (
    <main className="flex justify-between p-4">
      <header className="w-full h-fit pt-6 pl-4 flex flex-col gap-2">
        <h1 className="headline-lg">projects</h1>
        <span className="text-gray-500">Manage and curate your projects</span>
      </header>

      <Link href="/projects/add">
        <Button name="+ Create New Project" className="w-75! mt-10 h-15 mr-8" />
      </Link>
      {/* <div className="w-1/4 py-4"></div> */}
    </main>
  );
}
