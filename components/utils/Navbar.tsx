"use client";
import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { title: "Home", href: "/" },
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
  { title: "About", href: "#about" },
];

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full flex justify-center p-4 ">
      {/* Container with your custom Glass effect */}
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
       {/* Desktop Navigation */}
<div className="hidden md:flex">
  <NavigationMenu>
    <NavigationMenuList>
      {navItems.map((item) => (
        <NavigationMenuItem key={item.title}>
          {/* 1. We use asChild on the NavigationMenuLink */}
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
          <Button variant="ghost" className="hidden md:flex">
            Log in
          </Button>
          <Button className="rounded-full px-6">Get Started</Button>

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
