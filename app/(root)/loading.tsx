import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center space-y-4">
      <Image  width={80} height={80} alt="Loading" src="/loader.gif"></Image>
    </div>
  );
}
