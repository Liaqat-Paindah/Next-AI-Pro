import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import AcademicPreferences from "@/components/dashboard/applicants/academicPreferences/page";

const AcademicPreferencesPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <AcademicPreferences />
      </Suspense>
    </div>
  );
};

export default AcademicPreferencesPage;
