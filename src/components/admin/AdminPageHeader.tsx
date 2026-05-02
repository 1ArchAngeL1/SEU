interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  action,
  badge,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-6 border-b border-admin-border-soft">
      <div className="min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-[--font-bodoni] font-normal text-seu-heading-lg text-admin-fg leading-none">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-seu-caption text-admin-fg-muted font-montserrat mt-2">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
