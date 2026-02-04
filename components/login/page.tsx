"use client";

import Loading from "@/components/Loading";
import { User } from "@/data/user";
import { useUser } from "@/hooks/user";

export default function Login() {
  const { data, isLoading, isError } = useUser();
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      {data &&
        data.map((user: User, index: number) => (
          <div className="p-8" key={index}>
            <li>{user.name}</li>
            <li>{user.email}</li>
            <li>{user.role}</li>
          </div>
        ))}
    </div>
  );
}
