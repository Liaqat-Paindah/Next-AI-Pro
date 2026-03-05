import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import ResearchProject from "@/components/dashboard/applicants/academicActivities/researchProjects";

const ApplicantsArticles = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <ResearchProject />
      </Suspense>
    </div>
  );
};

export default ApplicantsArticles;
