import { ProjectProps } from '@/types/shared';
import Link from 'next/link';
import DataIcon from '@/../public/svgIcons/Data.svg';

interface ProjectCardProps {
  project?: ProjectProps;
  className?: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = date.getUTCDate();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
};

const ProjectCard = ({ project, className }: ProjectCardProps) => {
  return (
    <div className={className}>
      <div className="relative flex flex-col pt-4 md:pt-2 h-full gap-4">
        <h1 className="project-card-title wrap-break-word break-all flex justify-between">
          {project?.name}
          <span className="md:hidden rotate-90">...</span>
        </h1>
        <p className="project-card-description wrap-break-word break-all">
          {project?.description}
        </p>
        <div className="hidden md:block absolute right-0 bottom-0 bg-surface-low w-fit py-2 px-4">
          <Link href={`/projects/${project?.id}/edit`}>Edit</Link>
        </div>

        <hr className="text-gray-100 absolute bottom-0 left-0 right-0 border-t" />
      </div>

      {/* --- for Desktop --- */}
      <div className="hidden md:flex justify-between w-full pt-4 items-center">
        <p className="style-1">CREATED AT</p>
        {project?.created_at ? (
          <p className="style-2">{formatDate(project?.created_at)}</p>
        ) : (
          <p className="style-2">N/A</p>
        )}
      </div>

      {/* --- for Mobile --- */}
      <div className="md:hidden flex gap-2 w-full py-4 items-center">
        <DataIcon />
        {project?.created_at ? (
          <p className="style-2">{formatDate(project?.created_at)}</p>
        ) : (
          <p className="style-2">N/A</p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
