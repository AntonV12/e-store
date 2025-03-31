"use client";
import { UserType } from "@/lib/types/types";

export const User = ({ user }: { user: UserType | null }) => {
  if (!user) return null;
  return (
    <div>
      <h3>{user.name}</h3>
      <p>Age: {user.age}</p>
      <p>Salary: {user.salary}</p>
    </div>
  );
};
