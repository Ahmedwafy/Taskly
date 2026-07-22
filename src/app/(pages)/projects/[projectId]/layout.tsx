// src/app/(pages)/projects/[projectId]/layout.tsx
export default function ProjectLayout({
  children,
  taskModal,
  invite,
}: {
  children: React.ReactNode;
  taskModal: React.ReactNode;
  invite: React.ReactNode;
}) {
  return (
    <>
      {children}

      {/* Renders @taskModal Slot */}
      {taskModal}

      {/* Content inside @invite slot*/}
      {invite}
    </>
  );
}
