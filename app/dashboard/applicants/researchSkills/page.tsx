import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import ResearchSkills from "@/components/dashboard/applicants/academicActivities/reseachSkills";

const ResearchSkillsPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <ResearchSkills />
      </Suspense>
    </div>
  );
};

export default ResearchSkillsPage;
