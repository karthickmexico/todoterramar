// This layout is shared by ALL admin routes including /admin/login.
// Auth protection lives in admin/(protected)/layout.tsx so the login
// page never gets caught in a redirect loop.
export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
