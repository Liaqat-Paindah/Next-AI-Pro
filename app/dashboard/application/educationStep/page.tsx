import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import Education from "@/components/dashboard/application/EducationStep";

const Application = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Education />
      </Suspense>
    </div>
  );
};

export default Application;
