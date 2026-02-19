import { Suspense } from "react";
import Contact from "@/components/contact/page";
import Loading from "@/app/loading";

export default function ContactUs() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Contact />
      </Suspense>
    </div>
  );
}
