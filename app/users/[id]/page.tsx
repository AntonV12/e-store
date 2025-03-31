import { User } from "@/app/components/users/User";
// import { fetchUserById } from "@/app/api/users/[id]/userController";
// import { UserType } from "@/lib/types/types";

export default async function UserPage(props: { params: { id: number } }) {
  const params = await props.params;
  const id = params.id;
  //const data: UserType | null = await fetchUserById(id);

  return (
    <>
      <h1>User page</h1>
      <User id={id} />
    </>
  );
}
