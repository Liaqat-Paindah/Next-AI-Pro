import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import StudyRequest from "@/components/dashboard/applicants/studyRequest/page";

const StudyRequestPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <StudyRequest />
      </Suspense>
    </div>
  );
};

export default StudyRequestPage;
