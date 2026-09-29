"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/shared/components/ThemeProvider";
import { Button } from "@/shared/components/ui";
import { EchoLogo } from "@/shared/components/icons/EchoLogo";
import {
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

export function Navbar() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Chat Studio", href: "/app" },
    { label: "Model Arena", href: "/app/compare" },
    { label: "Extension", href: "/app/extension-preview" },
    { label: "Pricing", href: "/app/pricing" },
    { label: "Capabilities", href: "#features" },
  ];

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <nav aria-label="Main Navigation" className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-xs border-b border-border transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            aria-label="EchoGPT Homepage"
          >
            <EchoLogo className="w-7 h-7 shadow-2xs" size={28} />
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-base tracking-tight text-text">
                Echo<span className="text-primary">GPT</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-medium text-muted hover:text-text transition-colors focus:outline-none focus-visible:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-card border border-transparent hover:border-border transition-colors cursor-pointer"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            <Link href="/app">
              <Button
                variant="primary"
                size="sm"
                className="text-xs font-semibold px-4"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Launch App
              </Button>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg text-muted hover:text-text cursor-pointer"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="p-1.5 rounded-lg text-text hover:bg-surface cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-background px-4 py-3 space-y-2 text-xs">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-muted hover:text-text font-medium"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <Link href="/app" className="block w-full">
                <Button variant="primary" size="sm" className="w-full text-xs font-semibold">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
