import Link from 'next/link';
import AddProject from '@/../public/svgIcons/AddProject.svg';

const AddProjectCard = () => {
  return (
    <Link href="/projects/add">
      <div
        className="flex flex-col gap-y-4 pt-4 justify-center items-center text-center my-auto border-2 border-dashed
         border-gray-200 py-4 px-8 w-full h-55 bg-white"
      >
        <div className=" bg-surface-low w-12 h-12 rounded-xl flex items-center justify-center">
          <AddProject className="w-5 h-5" />
        </div>

        <h1 className="text-md font-bold text-neutral-100">ADD PROJECT</h1>
      </div>
    </Link>
  );
};

export default AddProjectCard;
