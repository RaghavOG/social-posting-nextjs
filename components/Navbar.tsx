import Link from "next/link";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";

const Navbar = async () => {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0].emailAddress.split("@")[0];
  if (user) await syncUser();

  return (
    <nav className="sticky top-0 w-full border-b border-border/40 bg-gradient-to-b from-background/95 to-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-primary hover:text-primary/80 font-mono tracking-wider transition-colors duration-200"
            >
              Socially
              {user && (
                <span className="ml-2 text-lg font-semibold text-secondary-foreground/70 font-mono">
                  @{userEmail}
                </span>
              )}
            </Link>
          </div>
          <div className="hidden md:block">
            <DesktopNavbar />
          </div>
          <div className="md:hidden">
            <MobileNavbar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

