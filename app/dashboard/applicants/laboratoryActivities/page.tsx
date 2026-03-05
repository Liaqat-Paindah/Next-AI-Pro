import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import Laboratory from "@/components/dashboard/applicants/academicActivities/laboratoryActivities";

const ApplicationLaboratory = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Laboratory />
      </Suspense>
    </div>
  );
};

export default ApplicationLaboratory;
