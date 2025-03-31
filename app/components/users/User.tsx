"use client";
import { UserType } from "@/lib/types/types";
import { useGetUserByIdQuery } from "@/lib/features/users/usersApiSlice";

export const User = ({ id }: { id: number }) => {
  const { data, isError, isLoading, isSuccess } = useGetUserByIdQuery(id);

  if (!data) return null;
  return (
    <div>
      <h3>{data?.name}</h3>
      <p>Age: {data?.age}</p>
      <p>Salary: {data?.salary}</p>
    </div>
  );
};
