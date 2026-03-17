import { Suspense } from "react";
import Journey from "@/components/journey/page";
import Loading from "@/app/loading";

export default function JourneyPage() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Journey />
      </Suspense>
    </div>
  );
}
