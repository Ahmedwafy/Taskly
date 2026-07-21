export default function MembersLayout({
  children,
  invite,
}: {
  children: React.ReactNode;
  invite: React.ReactNode;
}) {
  return (
    <>
      {children}
      {invite}
    </>
  );
}
