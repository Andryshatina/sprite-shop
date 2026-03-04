"use client";

import { useCartStore } from "@/store/use-cart-store";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Library,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Header() {
  const items = useCartStore((state) => state.cartItems);
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
            Sprite Shop
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative rounded-xl hover:bg-muted transition-colors"
          >
            <Link href="/cart" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center leading-none animate-in zoom-in duration-200">
                  {items.length > 99 ? "99+" : items.length}
                </span>
              )}
            </Link>
          </Button>

          {/* Auth */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:bg-muted transition-colors relative"
                >
                  {/* Avatar circle */}
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-52 rounded-xl p-1.5 shadow-lg"
              >
                <DropdownMenuLabel className="px-2 py-1.5">
                  <p className="text-xs text-muted-foreground font-normal">
                    Signed in as
                  </p>
                  <p className="text-sm font-semibold truncate">
                    {user?.email ?? "My Account"}
                  </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-1" />

                {user?.role === "ADMIN" && (
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer gap-2.5"
                  >
                    <Link href="/admin/create">
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                {user?.role === "USER" && (
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer gap-2.5"
                  >
                    <Link href="/library">
                      <Library className="w-4 h-4 text-muted-foreground" />
                      My Library
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  onClick={logout}
                  className="rounded-lg cursor-pointer gap-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-xl gap-1.5 px-4">
              <Link href="/login">
                <User className="w-4 h-4" />
                Sign in
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
