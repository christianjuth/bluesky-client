export function TemplateWithSidebar({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  const [main, sidebar] = Array.isArray(children) ? children : [children];
  return (
    <div className="flex flex-col lg:flex-row justify-center lg:px-4">
      {sidebar && <div className="lg:hidden p-4 -mb-4">{sidebar}</div>}
      <div className="flex-1 w-full lg:max-w-[60ch] pt-4">{main}</div>
      <div className="sticky top-14 pt-4 h-min max-lg:hidden w-80 ml-4">
        {sidebar}
      </div>
    </div>
  );
}
