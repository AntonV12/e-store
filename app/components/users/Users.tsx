"use client";
// import { selectAllUsers, UsersSliceState } from "@/lib/features/users/usersSlice";
// import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import { fetchUsers } from "@/lib/features/users/usersAPI";
import { useGetUsersQuery } from "@/lib/features/users/usersApiSlice";
import { useState } from "react";

const options = [2, 4, 6, 8];

export const Users = () => {
  // const dispatch = useAppDispatch();
  // const users = useAppSelector(selectAllUsers);
  // const status = useSelector((state: { users: UsersSliceState }) => state.users.status);

  // console.log("status", status);

  // useEffect(() => {
  //   dispatch(fetchUsers());
  // }, [dispatch]);

  // console.log("users", users);
  const [numberOfUsers, setNumberOfUsers] = useState(4);
  const { data, isError, isLoading, isSuccess } = useGetUsersQuery(numberOfUsers);

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isSuccess) {
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
        {data.users.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </>
    );
  }

  return null;

  // return (
  //   <>
  //     <h1>Users</h1>
  //     {users?.map((user) => (
  //       <div key={user.id}>{user.name}</div>
  //     ))}
  //   </>
  // );
};
