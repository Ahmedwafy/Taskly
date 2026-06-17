import { Project } from '@/types/project';

interface ProjectCardProps {
  project?: Project;
  // onOpenModal?: (projectId: string) => void;
  // onAssignTask?: (projectId: string) => void;
  // onArchive?: (projectId: string) => void;
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
      <div className="flex flex-col gap-y-4 pt-4">
        <h1 className="headline-lg wrap-break-word break-all">
          {project?.name}
        </h1>
        <p className="wrap-break-word break-all">{project?.description}</p>
      </div>
      <div className="flex justify-between w-full border-t border-gray-200 pt-10">
        <p className="text-gray-500 font-medium">CREATED AT</p>
        {project?.created_at ? (
          <p className="font-semibold text-(--primary)">
            {formatDate(project?.created_at)}
          </p>
        ) : (
          <p className="font-semibold text-(--primary)">N/A</p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
