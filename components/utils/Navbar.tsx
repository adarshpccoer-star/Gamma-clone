"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

import { authClient } from "@/lib/auth-client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

const navItems = [
  { title: "Home", href: "/" },
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
  { title: "About", href: "#about" },
];

export default function Navbar() {
  // 1. Initialize state
  const [user, setUser] = useState<any>(null);

  // 2. Use useEffect to handle the async auth call
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchSession();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="sticky top-0 z-50 w-full flex justify-center p-4">
      <nav className="glass w-full max-w-7xl px-4 h-16 flex items-center justify-between rounded-2xl">
        <div className="flex items-center gap-2 m-3">
          <Link href="/" className="group flex items-center gap-1">
            <span className="relative text-gradient-peach italic text-4xl font-bold transform deg-45">
              G
              <span className="absolute inset-x-0 top-1/2 h-[2px] bg-primary/30 -rotate-12" />
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent"
                      )}
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* 3. Conditional Rendering based on Auth State */}
          {user ? (
            <>
            <div>
            <span className="flex items-center gap-2">
                  <Image
                  src={user.image}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
              />
                </span>
             <Button variant="ghost" onClick={() => authClient.signOut()}>
                Log out
             </Button>
             </div>
            </>
          ) : (
            <>
              <Button variant="ghost" className="hidden md:flex" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="rounded-full px-6" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="text-lg font-medium"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  );
}