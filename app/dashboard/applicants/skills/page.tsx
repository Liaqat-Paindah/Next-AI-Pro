import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import SkillsCompetencies from "@/components/dashboard/applicants/skills/page";

const CompetenciesPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <SkillsCompetencies />
      </Suspense>
    </div>
  );
};

export default CompetenciesPage;
