"use client";

import React, { useEffect } from "react";
import Loading from "@/app/loading";
import { UseGetApplicants } from "@/hooks/useApplication";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PersonalInfo from "./applicant_details/personal_details";

const Application = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userId = session?.user?._id;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);
  const { data, isPending, error } = UseGetApplicants(userId);
  const application = data?.data;
  if (status === "loading" || isPending) {
    return <Loading />;
  }

  if (error) {
    return <div>Something went wrong.</div>;
  }


if (!application?.personal) {
  return <div>No personal information found.</div>;
}

  return (
    <div className="">
      <PersonalInfo  personal={application?.personal} />
    </div>
  );
};

export default Application;
