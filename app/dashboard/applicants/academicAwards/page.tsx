import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import AcademicAwards from "@/components/dashboard/applicants/academicActivities/academicAwards";

const AcademicAwardsPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <AcademicAwards />
      </Suspense>
    </div>
  );
};

export default AcademicAwardsPage;
