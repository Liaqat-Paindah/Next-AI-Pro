import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import WorkExperience from "@/components/dashboard/applicants/workexperience/page";

const WorkExperiencePage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <WorkExperience />
      </Suspense>
    </div>
  );
};

export default WorkExperiencePage;
