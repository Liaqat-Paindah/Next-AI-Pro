import { Suspense } from "react";
import HomeMain from "@/components/home/page";
import Loading from "@/components/Loading";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <HomeMain />
      </Suspense>
    </div>
  );
}
