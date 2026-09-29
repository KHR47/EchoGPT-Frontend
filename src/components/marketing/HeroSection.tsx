import React from "react";
import { Button } from "@/shared/components/ui";
import { ArrowRight } from "lucide-react";
import { ChromeIcon } from "@/shared/components/icons/ChromeIcon";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 animate-page-enter">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h1 className="font-heading font-normal sm:font-medium text-4xl sm:text-5xl md:text-6xl tracking-tight text-text leading-[1.12]">
          One Workspace. <span className="text-primary italic">320+ AI Models.</span>
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
          Access frontier AI models in one unified studio and Chrome side panel.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <a href="/app" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto text-sm sm:text-base font-semibold px-8 shadow-xs"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Free in Browser
            </Button>
          </a>
          <a
            href="https://chromewebstore.google.com/detail/echogpt-multi-ai-chat-sid/negimdcamohmoheiifgecbjgjepkcfhj"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-sm sm:text-base font-medium px-6 shadow-xs"
              leftIcon={<ChromeIcon className="w-4 h-4 text-primary" />}
            >
              Add Chrome Side Panel
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
