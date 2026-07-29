import AddOItem from '@/../public/svgIcons/AddOItem.svg';

interface CardHeaderProps {
  title: string;
  description: string;
}

const CardHeader = ({ title, description }: CardHeaderProps) => {
  return (
    <div className="flex gap-4 items-center border-b border-gray-200 pb-10">
      <div className="hidden lg:block bg-[#0052CC1A] p-3 rounded-md w-11.5 h-11">
        <AddOItem className="w-5.5 h-5" />
      </div>
      <div>
        <h1 className="headline-lg">{title}</h1>
        <span className="text-gray-500">{description}</span>
      </div>
    </div>
  );
};

export default CardHeader;
