import NavBar from "@/components/NavBar";
import { UserProvider } from "@/components/UserProvider";
import { useUser } from "@/lib/hooks/useUser";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: User | null = await useUser();
  return (
    <UserProvider user={user}>
      <NavBar />
      {children}
    </UserProvider>
  );
}
