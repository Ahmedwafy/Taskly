import Image from 'next/image';
import * as icons from '@/../public/icons/icons';

interface CardHeaderProps {
  title: string;
  description: string;
}

const CardHeader = ({ title, description }: CardHeaderProps) => {
  return (
    <div className="flex gap-4 items-center border-b border-gray-200 pb-10">
      <div className="hidden lg:block bg-surface-highest p-3 rounded-md">
        <Image src={icons.Add_Project} alt="Member" width={22} height={11} />
      </div>
      <div>
        <h1 className="headline-lg">{title}</h1>
        <span className="text-gray-500">{description}</span>
      </div>
    </div>
  );
};

export default CardHeader;
