import React from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui";
import { ArrowRight } from "lucide-react";
import { ChromeIcon } from "@/shared/components/icons/ChromeIcon";

export function FinalCTASection() {
  return (
    <section className="py-16 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="rounded-2xl border border-border bg-card/60 p-8 sm:p-12 space-y-6">
        <h2 className="font-heading font-medium text-2xl sm:text-3xl md:text-4xl text-text tracking-tight">
          Ready to think across models?
        </h2>

        <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto leading-relaxed">
          Open EchoGPT in your browser or launch the ambient Chrome side panel.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/app" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto text-xs sm:text-sm font-semibold px-6"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Launch App
            </Button>
          </Link>
          <a
            href="https://chromewebstore.google.com/detail/echogpt-multi-ai-chat-sid/negimdcamohmoheiifgecbjgjepkcfhj"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="secondary"
              size="md"
              className="w-full sm:w-auto text-xs sm:text-sm font-medium px-5"
              leftIcon={<ChromeIcon className="w-3.5 h-3.5 text-primary" />}
            >
              Add to Chrome
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
