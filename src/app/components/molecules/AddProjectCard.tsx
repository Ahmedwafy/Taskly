import Image from 'next/image';
import * as icons from '../../../../public/icons/icons';
import Link from 'next/link';

const AddProjectCard = ({ className }: { className?: string }) => {
  return (
    <Link href="/projects/add">
      <div className={className}>
        <div className="flex flex-col gap-y-4 pt-4 justify-center items-center text-center my-auto">
          <div className=" bg-surface-low w-fit p-6 rounded-xl">
            <Image
              src={icons.Add_Project_Icon}
              alt="Add Project"
              width={20}
              height={20}
            />
          </div>
          <h1 className="headline-lg text-neutral-100">ADD PROJECT</h1>
        </div>
      </div>
    </Link>
  );
};

export default AddProjectCard;
