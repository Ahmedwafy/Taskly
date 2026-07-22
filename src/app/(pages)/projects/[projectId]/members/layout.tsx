// src > app > (pages) > projects > [projectId] > members > layout.tsx
export default function MembersLayout({
  children,
  invite,
}: {
  children: React.ReactNode;
  invite: React.ReactNode;
}) {
  return (
    <>
      {/* members > page.tsx Content */}
      {children}

      {/* Content inside @invite */}
      {invite}
    </>
  );
}
