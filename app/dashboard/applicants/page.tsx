import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import Applicants from "@/components/dashboard/applicants/page";

const ApplicantsPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Applicants />
      </Suspense>
    </div>
  );
};

export default ApplicantsPage;
