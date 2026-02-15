import { Suspense } from "react";
import DashboardMain from "@/components/dashboard/page";
import Loading from "@/app/(root)/loading";

export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <DashboardMain />
      </Suspense>
    </div>
  );
}
