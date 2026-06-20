import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Button from '../atoms/Button';
// import * as icons from '@/../public/icons/icons';
import { StaticImageData } from 'next/image';
import Breadcrumb from '../organisms/Breadcrumb';

interface PageHeaderTypes {
  href: string;
  title: string;
  buttonName: string;
  icon: StaticImageData;
  projectName?: string;
}

const PageHeader = ({
  title,
  icon,
  buttonName,
  href,
  projectName,
}: PageHeaderTypes) => {
  return (
    <header className="hidden lg:flex justify-between w-full">
      <div className="w-full h-fit pt-2 pl-4 flex flex-col gap-2">
        <div className="flex gap-4">
          <Breadcrumb projectName={projectName} />
        </div>
        <h1 className="display-lg">{title}</h1>
      </div>

      <Link href={href}>
        <div className="flex gap-2 px-0!">
          <Button name={buttonName} className="w-55! mt-10 h-15 mr-8 px-0!">
            <div className="my-auto">
              <Image src={icon} alt="Member" />
            </div>
          </Button>
        </div>
      </Link>
    </header>
  );
};

export default PageHeader;
