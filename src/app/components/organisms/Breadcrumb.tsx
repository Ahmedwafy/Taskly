'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const labels: Record<string, string> = {
  projects: 'Projects',
  members: 'Members',
  tasks: 'Tasks',
  epics: 'Epics',
  edit: 'Edit',
  new: 'New',
};

interface BreadcrumbProps {
  projectName?: string;
  className?: string;
}
// [projectID] = '123' or 'bd3c69cc-cad9-442e-8169-e2a689fb1a9c' or etc...
const Breadcrumb = ({ projectName, className }: BreadcrumbProps) => {
  const pathname = usePathname(); // Ex → "/projects/123/members"
  const segments = pathname.split('/').filter(Boolean); // ["projects", 123 , "members"]

  return (
    <nav
      className={`flex items-center gap-2 ${className}`}
      aria-label="Breadcrumb"
    >
      {segments.map((segment, index) => {
        // 1. Build the natural cumulative href
        // e.g. → /projects/123/members
        let href = `/${segments.slice(0, index + 1).join('/')}`;

        // 2. Identify if this specific segment is the Project ID
        const isProjectId = index === 1 && segment !== 'projects';

        // 3. FORCE the Project ID link to append '/epics'
        if (isProjectId) {
          href = `${href}/epics`;
        }

        const label = isProjectId ? projectName : (labels[segment] ?? segment);
        const isLast = index === segments.length - 1;

        return (
          <div key={href} className="flex items-center gap-2">
            {isLast ? (
              <span
                className="text-sm font-semibold text-primary-container uppercase tracking-wider"
                aria-current="page"
              >
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {label}
              </Link>
            )}

            {!isLast && (
              <span className="text-gray-400" aria-hidden="true">
                →
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
