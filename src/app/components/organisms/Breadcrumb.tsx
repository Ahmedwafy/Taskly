'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const labels = {
  projects: 'Projects',
  members: 'Members',
  tasks: 'Tasks',
  epics: 'Epics',
  edit: 'Edit',
};

interface BreadCrumbTypes {
  projectName?: string;
}

const Breadcrumb = ({ projectName }: BreadCrumbTypes) => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean); // ['projects', '12345', 'epics']
  const projectId = segments[1]; // '12345'

  const getSegmentLabel = (segment: string) => {
    if (segment === projectId) return projectName;
    return labels[segment as keyof typeof labels] ?? segment;
  };

  const getHref = (segment: string) => {
    if (segment === 'projects') {
      return '/projects';
    }

    if (segment === projectId) {
      return `/projects/${projectId}/epics`;
    }

    return `/projects/${projectId}/${segment}`;
  };

  return (
    <nav className="flex items-center gap-2">
      {segments.map((segment, index) => {
        const href = getHref(segment);
        const isLast = index === segments.length - 1;

        return (
          <div key={href} className="flex items-center gap-2">
            {isLast ? (
              <span className="font-medium text-gray-900">
                {getSegmentLabel(segment)}
              </span>
            ) : (
              <Link
                href={href}
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                {getSegmentLabel(segment)}
              </Link>
            )}

            {!isLast && <span className="text-gray-400">/</span>}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;

// /projects/12345/epics
// →
// const segments = pathname.split('/')
// →
// ['', 'projects', '12345', 'epics']
// →
// .filter(Boolean); → Now segments is : ['projects', '12345', 'epics']
//
