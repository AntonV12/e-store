"use client";
import { selectUsers, selectStatus } from "@/lib/features/users/usersSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { fetchUsers } from "@/lib/features/users/usersAPI";
import { useState } from "react";
import Link from "next/link";

const options = [1, 2, 4, 6, 8];

export const Users = () => {
  const [numberOfUsers, setNumberOfUsers] = useState(4);
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    dispatch(fetchUsers(numberOfUsers));
  }, [dispatch, numberOfUsers]);

  // const [numberOfUsers, setNumberOfUsers] = useState(4);
  // const { data, isError, isLoading, isSuccess } = useGetUsersQuery(numberOfUsers);

  // if (isError) {
  //   return (
  //     <div>
  //       <h1>There was an error!!!</h1>
  //     </div>
  //   );
  // }

  // if (isLoading) {
  //   return (
  //     <div>
  //       <h1>Loading...</h1>
  //     </div>
  //   );
  // }

  // if (isSuccess) {
  //   return (
  //     <>
  //       <h1>Users</h1>
  //       <select
  //         value={numberOfUsers}
  //         onChange={(e) => {
  //           setNumberOfUsers(Number(e.target.value));
  //         }}
  //       >
  //         {options.map((option) => (
  //           <option key={option} value={option}>
  //             {option}
  //           </option>
  //         ))}
  //       </select>
  //       {data.users.map((user) => (
  //         <div key={user.id}>
  //           <Link href={`/users/${user.id}`}>{user.name}</Link>
  //         </div>
  //       ))}
  //     </>
  //   );
  // }

  // return null;

  if (status === "loading") {
    return <div>Loading...</div>;
  } else if (status === "failed") {
    return <div>Error</div>;
  } else if (status === "idle") {
    return (
      <>
        <h1>Users</h1>
        <select
          value={numberOfUsers}
          onChange={(e) => {
            setNumberOfUsers(Number(e.target.value));
          }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {users?.map((user) => (
          <Link href={`/users/${user.id}`} key={user.id}>
            {user.name}
          </Link>
        ))}
      </>
    );
  }
};
