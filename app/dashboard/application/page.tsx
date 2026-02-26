import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import Personal from "@/components/dashboard/application/personalStep";

const Application = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Personal />
      </Suspense>
    </div>
  );
};

export default Application;
