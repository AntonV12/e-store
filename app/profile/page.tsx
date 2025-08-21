import Profile from "@/components/profile/Profile";
import { getCurrentUser } from "@/lib/authActions";
import OrdersList from "@/components/profile/OrdersList";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  return <Profile currentUser={currentUser} />;
}
