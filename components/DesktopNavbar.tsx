"use client";

import { BellIcon, HomeIcon, UserIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { motion } from "framer-motion";

function DesktopNavbar() {
  const { user, isLoaded } = useUser();

  const menuItems = [
    { icon: HomeIcon, label: "Home", href: "/" },
    { icon: BellIcon, label: "Notifications", href: "/notifications" },
    { icon: UserIcon, label: "Profile", href: `/profile/${user?.username ?? user?.primaryEmailAddress?.emailAddress?.split("@")[0] ?? ''}` },
  ];

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      {menuItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button variant="ghost" className="flex items-center gap-2 transition-transform duration-200 hover:scale-105" asChild>
            <Link href={item.href}>
              <item.icon className="w-4 h-4" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          </Button>
        </motion.div>
      ))}

      {isLoaded && (
        user ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: menuItems.length * 0.1 }}
          >
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 transition-transform duration-200 hover:scale-110"
                }
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: menuItems.length * 0.1 }}
          >
            <SignInButton mode="modal">
              <Button variant="default" className="transition-transform duration-200 hover:scale-105">Sign In</Button>
            </SignInButton>
          </motion.div>
        )
      )}
    </div>
  );
}

export default DesktopNavbar;

