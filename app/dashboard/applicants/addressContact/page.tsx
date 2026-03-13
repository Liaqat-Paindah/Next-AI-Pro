import Loading from "@/app/loading";
import React from "react";
import { Suspense } from "react";
import AddressContact from "@/components/dashboard/applicants/addressContact/page";

const AddressContactPage = () => {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <AddressContact />
      </Suspense>
    </div>
  );
};

export default AddressContactPage;
