export default function AppWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-main mx-auto max-w-[600px] flex flex-col min-h-dvh">
      {children}
    </div>
  );
}
