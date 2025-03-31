// "use client";
// import { selectUsers, selectStatus } from "@/lib/features/users/usersSlice";
// import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// import { useEffect } from "react";
// import { fetchUsers } from "@/lib/features/users/usersAPI";
// import { useState } from "react";
// import Link from "next/link";

// const options = [1, 2, 4, 6, 8];

// export const Users = () => {
//   const [numberOfUsers, setNumberOfUsers] = useState(4);
//   const dispatch = useAppDispatch();
//   const users = useAppSelector(selectUsers);
//   const status = useAppSelector(selectStatus);

//   useEffect(() => {
//     dispatch(fetchUsers(numberOfUsers));
//   }, [dispatch, numberOfUsers]);

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   } else if (status === "failed") {
//     return <div>Error</div>;
//   } else if (status === "idle") {
//     return (
//       <>
//         <h1>Users</h1>
//         <select
//           value={numberOfUsers}
//           onChange={(e) => {
//             setNumberOfUsers(Number(e.target.value));
//           }}
//         >
//           {options.map((option) => (
//             <option key={option} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>
//         {users?.map((user) => (
//           <Link href={`/users/${user.id}`} key={user.id}>
//             {user.name}
//           </Link>
//         ))}
//       </>
//     );
//   }
// };

"use client";
import { useGetUsersQuery } from "@/lib/features/users/usersApiSlice";
import { useState, useEffect } from "react";
import Link from "next/link";

const options = [1, 2, 4, 6, 8];

function getFromStorage(key: string) {
  const value = sessionStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
function setToStorage(key: string, value: any) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export const Users = () => {
  const [numberOfUsers, setNumberOfUsers] = useState(4);
  // Using a query hook automatically fetches data and returns query values
  const { data, isError, isLoading, isSuccess } = useGetUsersQuery(numberOfUsers);

  useEffect(() => {
    const storedValue = getFromStorage("numberOfUsers");
    if (storedValue) {
      setNumberOfUsers(storedValue);
    }
  }, []);

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

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumberOfUsers(Number(e.target.value));
    setToStorage("numberOfUsers", e.target.value);
  };

  if (isSuccess) {
    return (
      <div>
        <h3>Select the Quantity of Users to Fetch:</h3>
        <select value={numberOfUsers} onChange={onChange}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {data.map((user) => (
          <div key={user.id}>
            <Link href={`/users/${user.id}`}>{user.name}</Link>
          </div>
        ))}
      </div>
    );
  }

  return null;
};
