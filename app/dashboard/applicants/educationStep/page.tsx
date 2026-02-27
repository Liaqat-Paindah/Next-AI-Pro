import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import Education from "@/components/dashboard/applicants/EducationStep";

const ApplicationEducation = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Education />
      </Suspense>
    </div>
  );
};

export default ApplicationEducation;
