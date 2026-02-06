import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { ShoppingCart, User, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex items-center justify-between px-4 h-16">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={90}
            height={90}
            priority
          />
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button className="rounded-sm text-sm px-3 flex items-center gap-1">
            <ShoppingCart size={16} />
            Cart
          </Button>
          <Button className="rounded-sm text-sm px-3 flex items-center gap-1">
            <User size={16} />
            Sign In
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Button size="icon" variant="ghost">
            <ShoppingCart size={20} />
          </Button>
          <Button size="icon" variant="ghost">
            <Menu size={22} />
          </Button>
        </div>
      </div>
    </header>
  );
}
