"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  User,
} from "lucide-react";

const accountLinks = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-2">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs uppercase tracking-wide text-primary">
                {user.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <nav className="space-y-1">
        {accountLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/account" && pathname.startsWith(link.href));

          return (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                "w-full justify-start gap-2",
                isActive && "bg-muted font-medium"
              )}
            >
              <Link href={link.href}>
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          );
        })}

        {user.role === "admin" && (
          <Button
            variant="ghost"
            asChild
            className={cn(
              "w-full justify-start gap-2",
              pathname.startsWith("/admin") && "bg-muted font-medium"
            )}
          >
            <Link href="/admin">
              <LayoutDashboard className="h-4 w-4" />
              Admin Panel
            </Link>
          </Button>
        )}

        <Separator />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </nav>
    </div>
  );
}
