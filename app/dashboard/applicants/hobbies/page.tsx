import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import HobbiesPage from "@/components/dashboard/applicants/hobbies/page";

const HobbiesForm = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <HobbiesPage />
      </Suspense>
    </div>
  );
};

export default HobbiesForm;
