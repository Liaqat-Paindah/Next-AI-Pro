import { Suspense } from "react";
import OpportunitiesPage from "@/components/scholarships/scholarshipList";
import Loading from "@/app/loading";

export default function Opportunities() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <OpportunitiesPage />
      </Suspense>
    </div>
  );
}
