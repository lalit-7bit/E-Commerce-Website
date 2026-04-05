import { AccountSidebar } from "@/components/account/account-sidebar";

export function AccountLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <AccountSidebar />
        <div className="md:col-span-2">{children}</div>
      </div>
    </div>
  );
}
