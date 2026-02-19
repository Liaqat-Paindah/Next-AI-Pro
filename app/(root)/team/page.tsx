import { Suspense } from "react";
import TeamMeber from "@/components/team/page";
import Loading from "@/app/loading";

export default function Teams() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <TeamMeber />
      </Suspense>
    </div>
  );
}
