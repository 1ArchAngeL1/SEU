interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-[--font-bodoni] font-normal text-seu-heading text-pale-gray">
          {title}
        </h1>
        {description && (
          <p className="text-seu-caption text-secondary-grey font-montserrat mt-1">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
