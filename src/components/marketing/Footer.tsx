import React from "react";
import Link from "next/link";
import { EchoLogo } from "@/shared/components/icons/EchoLogo";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-8 text-xs text-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <EchoLogo className="w-5 h-5 shadow-2xs" size={20} />
          <span className="font-heading font-semibold text-text">EchoGPT</span>
          <span>·</span>
          <span>Unified Multi-Model Intelligence</span>
        </div>

        <div className="flex items-center gap-5 text-muted">
          <Link href="/app" className="hover:text-text transition-colors">
            Chat Studio
          </Link>
          <Link href="/app/compare" className="hover:text-text transition-colors">
            Model Arena
          </Link>
          <Link href="/app/extension-preview" className="hover:text-text transition-colors">
            Extension
          </Link>
          <Link href="/app/settings" className="hover:text-text transition-colors">
            Settings
          </Link>
        </div>
      </div>
    </footer>
  );
}
