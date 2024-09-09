export function TemplateWithSidebar({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const [main, sidebar] = Array.isArray(children) ? children : [children];
  return (
    <div className="flex flex-row justify-center space-x-4">
      <div className="flex-1 w-full max-w-[60ch] pt-4">{main}</div>
      <div className="sticky top-14 pt-4 h-min max-md:hidden w-60">
        {sidebar}
      </div>
    </div>
  );
}
