"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const isLoggedIn = Boolean(session?.user);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <nav className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow z-10 fixed top-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center min-w-0">
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white truncate"
            >
              Ethara AI
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="ml-8 lg:ml-10 flex items-baseline space-x-4">
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Dashboard
              </Link>
            </div>
            {isLoggedIn ? (
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            ) : (
              <Link
                href="/login"
                className="px-3 py-2 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition"
              >
                Login
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center gap-2">
            {isLoggedIn ? (
              <Button onClick={handleLogout} variant="outline" size="sm" className="text-xs h-8">
                Logout
              </Button>
            ) : (
              <Link
                href="/login"
                className="px-2 py-1.5 rounded-md text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
