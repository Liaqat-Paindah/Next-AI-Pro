import { Suspense } from "react";
import ABoutUS from "@/components/about/page";
import Loading from "@/app/loading";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <ABoutUS />
      </Suspense>
    </div>
  );
}
