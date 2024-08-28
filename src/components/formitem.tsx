import { useId } from "react";

export function FormItem({ 
  children,
  label
}: {
  children: (props: { id: string }) => React.ReactNode;
  label: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {children({ id })}
    </div>
  )
}
