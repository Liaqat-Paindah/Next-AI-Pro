import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import LanguageSkills from "@/components/dashboard/applicants/languageSkills/page";

const LanguageSkillsPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <LanguageSkills />
      </Suspense>
    </div>
  );
};

export default LanguageSkillsPage;
