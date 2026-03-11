import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import FinancialInformation from "@/components/dashboard/applicants/financialInformation/page";

const FinancialInformationForm = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <FinancialInformation />
      </Suspense>
    </div>
  );
};

export default FinancialInformationForm;
