"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UseGetApplicants } from "@/hooks/useApplication";
import Loading from "@/app/loading";
import ApplicationProgress from "../applicationProgress";

// Digital Cursor
const DigitalCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 700 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 700 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-8 w-8 rounded-sm border-2 border-[#00A3FF] hidden lg:block mix-blend-difference"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    />
  );
};

const Application = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const id = session?.user?._id;

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  // Fetch application data
  const {
    data: applicationData,
    isPending,
    error,
  } = UseGetApplicants(id as string);

  // Loading
  if (status === "loading" || isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
        <p className="mt-4 text-gray-500">Loading your application...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 font-medium">
          Something went wrong. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <DigitalCursor />
      <section className="relative w-full overflow-hidden py-10">
        <ApplicationProgress application={applicationData} />
      </section>
    </>
  );
};

export default Application;
