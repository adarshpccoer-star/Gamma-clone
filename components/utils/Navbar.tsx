"use client";

import React from "react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navItems = [
  { title: "Home", href: "/" },
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
  { title: "About", href: "#about" },
];

export default function Navbar() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  // Use Dicebear as a fallback if no user image exists
  const userImage = user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "default"}`;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        },
      },
    });
  };

  return (
    <div className="sticky top-0 z-50 w-full flex justify-center p-4">
      <nav className="glass w-full max-w-7xl px-4 h-16 flex items-center justify-between rounded-2xl border bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-2 m-3">
          <Link href="/" className="group flex items-center gap-1">
            <span className="relative text-gradient-peach italic text-4xl font-bold">
              G
              <span className="absolute inset-x-0 top-1/2 h-0.5 bg-primary/30 -rotate-12" />
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
                      className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
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
          {isPending ? (
            <div className="h-10 w-10 animate-pulse bg-slate-200 rounded-xl" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative h-10 w-10 rounded-xl overflow-hidden cursor-pointer border-2 border-white shadow-sm hover:scale-105 transition-all">
                  {/* Note: Switched to Next.js Image component */}
                  <Image
                    src={userImage}
                    alt={user.name || "User"}
                    fill sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl">
                <DropdownMenuLabel className="flex flex-col p-3">
                  <span className="text-sm font-bold text-slate-900">{user.name}</span>
                  <span className="text-xs text-slate-400">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link href="/profile" className="flex items-center gap-2">
                    <User size={16} /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="rounded-lg cursor-pointer gap-2 text-rose-500 focus:bg-rose-50"
                >
                  <LogOut size={16} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="bg-slate-900 text-white hover:bg-orange-500 rounded-xl px-6 font-bold transition-all">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}