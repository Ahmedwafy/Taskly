import Link from 'next/link';

export default function ProjectSidebar({ projectId }: { projectId: string }) {
  return (
    <aside>
      <Link href={`/projects/${projectId}/tasks`}>Tasks</Link>

      <Link href={`/projects/${projectId}/members`}>Members</Link>

      <Link href={`/projects/${projectId}/epics`}>Epics</Link>

      <Link href={`/projects/${projectId}/edit`}>Project Details</Link>
    </aside>
  );
}
