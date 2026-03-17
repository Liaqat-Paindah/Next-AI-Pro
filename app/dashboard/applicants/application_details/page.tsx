import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import GetDetails from "@/components/dashboard/applicants/application_details/page";

const GetApplication = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <GetDetails />
      </Suspense>
    </div>
  );
};

export default GetApplication;
