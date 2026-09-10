interface PageHeadingProps {
  title: string;
  action?: React.ReactNode;
}

export default function PageHeading({ title, action }: PageHeadingProps) {
  return (
    <div className="flex min-h-[53px] items-center justify-between gap-4">
      <h1 className="text-xl font-semibold leading-8 text-[#3a3a3a]">{title}</h1>
      {action}
    </div>
  );
}
