import { getCurrentUser } from "@/lib/authActions";
import SignLinksClient from "@/components/signLinks/SignLinksClient";
import { UserType } from "@/lib/types";

export default async function SignLinks() {
  const currentUser: Omit<UserType, "password"> | null = await getCurrentUser();

  return <SignLinksClient currentUser={currentUser!} />;
}
