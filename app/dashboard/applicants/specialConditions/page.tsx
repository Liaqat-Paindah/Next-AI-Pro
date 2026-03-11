import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import SpecialCondition from "@/components/dashboard/applicants/specialConditions/page";

const SpecialConditionPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <SpecialCondition />
      </Suspense>
    </div>
  );
};

export default SpecialConditionPage;
