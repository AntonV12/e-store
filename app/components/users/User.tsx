"use client";
import { useGetUserByIdQuery } from "@/lib/features/users/usersApiSlice";
import styles from "./Users.module.css";
import { CardSkeleton } from "@/app/components/skeletons/skeletons";

export const User = ({ id }: { id: number }) => {
  const { data, isError, isLoading, isSuccess } = useGetUserByIdQuery(id);

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    );
  }

  if (isLoading) {
    return <CardSkeleton />;
  }

  if (isSuccess) {
    return (
      <div className={styles.user}>
        <h3 className={styles.user__title}>{data?.name}</h3>
        <p className={styles.user__text}>Age: {data?.age}</p>
        <p className={styles.user__text}>Salary: {data?.salary}</p>
      </div>
    );
  }
};
