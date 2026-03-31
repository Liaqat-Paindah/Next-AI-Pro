import { Suspense } from "react";
import UserInfo from "@/components/dashboard/setting/page";
import Loading from "@/app/loading";

export default function Setting() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <UserInfo />
      </Suspense>
    </div>
  );
}
