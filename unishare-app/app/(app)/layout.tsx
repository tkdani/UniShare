import NavBar from "@/components/NavBar";
import { UserProvider } from "@/components/UserProvider";
import { fetchUser } from "@/lib/fetchUser";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: User | null = await fetchUser();
  return (
    <UserProvider user={user}>
      <NavBar />
      {children}
    </UserProvider>
  );
}
