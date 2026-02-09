import Header from "@/components/shared/navigation/header";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex-1">
      <Header></Header>
      {children}
      <Toaster />
    </div>
  );
}
