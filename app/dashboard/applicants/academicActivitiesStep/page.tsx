import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import AcademicActivitiesStep from "@/components/dashboard/applicants/AcademicStep";

const AcademicActivities = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <AcademicActivitiesStep />
      </Suspense>
    </div>
  );
};

export default AcademicActivities;
