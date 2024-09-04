export function TemplateWithSidebar({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [main, sidebar] = children;
  return (
    <div className="flex flex-row justify-center space-x-4">
      <div className="flex-1 max-w-[50ch] pt-4">{main}</div>
      <div className="sticky top-14 pt-4 h-min max-md:hidden">{sidebar}</div>
    </div>
  );
}
