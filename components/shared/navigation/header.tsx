"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../ui/button";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { ModeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Tools", href: "/tools" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={90}
            height={90}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <ModeToggle></ModeToggle>
          <Button variant="outline" size="sm" className="gap-2 rounded-sm">
            <ShoppingCart size={16} />
            Cart
          </Button>

          <Button size="sm" variant="outline" className="gap-2 rounded-sm">
            <User size={16} />
            Sign In
          </Button>
        </nav>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
          <Button size="icon" variant="ghost">
            <ShoppingCart size={20} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            aria-label="Toggle Menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="flex sm:flex-row gap-4 px-4 py-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <ModeToggle></ModeToggle>
            <Button className="w-full gap-2">
              <User size={16} />
              Sign In
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
