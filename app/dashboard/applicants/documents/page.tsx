import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import Ducoments from "@/components/dashboard/applicants/documents/page";

const DocumentsPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Ducoments />
      </Suspense>
    </div>
  );
};

export default DocumentsPage;
