import { getProfile } from "@/lib/getProfile";
import NavBarClient from "./NavBarClient";

export default async function NavBar() {
  const profile = await getProfile();
  return <NavBarClient profile={profile} />;
}
