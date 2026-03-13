import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import VisionGoals from "@/components/dashboard/applicants/visionGoals/page";

const VisionGoalsPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <VisionGoals />
      </Suspense>
    </div>
  );
};

export default VisionGoalsPage;
