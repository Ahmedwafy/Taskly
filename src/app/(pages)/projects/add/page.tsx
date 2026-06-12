// src/app/(pages)/projects/add
// Add New Project Page
'use client';
import Button from '@/app/components/atoms/Button';
import Link from 'next/link';
import * as icons from '../../../../../public/icons/icons';
import Image from 'next/image';
import Input from '@/app/components/atoms/input';
import { useState } from 'react';

const Add_New_Project = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [error, setError] = useState('');

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;

    setProjectTitle(value);

    if (value.length > 0 && value.length < 3) {
      setError('Project name must be at least 3 characters.');
    } else {
      setError('');
    }
  };
  return (
    <main className="bg-(--background) h-screen">
      {/* ==================== Desktop View ====================*/}
      <section className="hidden lg:block">
        {/* ============ Page Title ============*/}
        <header className="flex justify-between w-full">
          <div className="w-full h-fit pt-2 pl-4 flex flex-col gap-2">
            <div className="flex gap-4">
              <span className="text-gray-500">PROJECTS</span>
              <div className="my-auto">
                <Image src={icons.pathArrow} alt="path arrow" />
              </div>
              <span className="text-blue-600">ADD NEW PROJECT</span>
            </div>
            <h1 className="md:display-lg">Add New Project</h1>
          </div>

          <Link href="/projects/add">
            <div className="flex gap-2 px-0!">
              <Button
                name="Invite Member"
                className="w-55! mt-10 h-15 mr-8 px-0!"
              >
                <div className="my-auto">
                  <Image src={icons.Member} alt="Member" />
                </div>
              </Button>
            </div>
          </Link>
        </header>

        {/* ============ Card ============ */}
        <div className="md:w-3xl mx-auto rounded-md h-auto shadow-sm mt-10">
          <div className="w-3xl mx-auto p-8 h-fit">
            <div className="flex gap-4 items-center border-b pb-10 border-gray-400">
              <div className="bg-(--surface-highest) p-3 rounded-md">
                <Image
                  src={icons.Add_Project}
                  alt="Member"
                  width={22}
                  height={11}
                />
              </div>
              <div>
                <h1 className="headline-lg">Initialize New Project</h1>
                <span className="text-gray-500">
                  Define the scope and foundational details of your project.
                </span>
              </div>
            </div>

            {/* ============ Form ============ */}
            <form className="flex flex-col h-full">
              <Input
                label="PROJECT TITLE"
                className="mt-10"
                value={projectTitle}
                onChange={handleTitleChange}
                error={error}
                required={true}
              />
              <Input
                label="DESCRIPTION"
                multiline
                rows={6}
                optional="Optional"
                placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                className="mt-12"
              />
            </form>

            {/* ============ Action Buttons ============ */}
            <div className="flex justify-between mt-8">
              <Link href="/projects" className="w-1/4!">
                <Button name="Back" variant="ghost" />
              </Link>
              <Button name="Create Project" className="w-1/4!" />
            </div>
          </div>

          <div className="bg-(--surface-low) py-6 px-6 text-[#4F5F7B] flex">
            <div className="my-auto mr-2">
              <Image src={icons.ProTip} alt="Pro Tip" width={14} height={14} />
            </div>
            <div className="text-sm">
              <strong>Pro Tip: </strong>
              You can invite project members and assign epics immediately after
              the initial creation process.
            </div>
          </div>
        </div>
      </section>

      {/* ==================== Mobile View ====================*/}
      <section className="block lg:hidden">
        {/* ============ Card ============ */}
        <div className="mx-auto rounded-md h-auto shadow-sm mt-10">
          <div className="mx-auto p-8 h-fit">
            <div className="flex gap-4 items-center border-b pb-10 border-gray-400">
              <div>
                <h1 className="headline-lg">Initialize New Project</h1>
                <span className="text-gray-500">
                  Define the scope and foundational details of your project.
                </span>
              </div>
            </div>

            {/* ============ Form ============ */}
            <form className="flex flex-col h-full">
              <Input
                label="PROJECT TITLE"
                className="mt-10"
                value={projectTitle}
                onChange={handleTitleChange}
                error={error}
                required={true}
              />
              <Input
                label="DESCRIPTION"
                multiline
                rows={6}
                optional="Optional"
                placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                className="mt-12"
              />
            </form>

            {/* ============ Action Buttons ============ */}
            <div className="flex flex-col justify-between mt-8">
              <Button name="Create Project" />
              <Link href="/projects">
                <Button name="Back" variant="ghost" />
              </Link>
            </div>

            <div className="bg-(--surface-low) py-6 px-6 text-[#4F5F7B] flex">
              <div className="text-sm">
                <strong>Pro Tip: </strong>
                <p>
                  {' '}
                  You can invite project members and assign epics immediately
                  after the initial creation process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Add_New_Project;
