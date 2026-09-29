import React from "react";
import { Badge, Button } from "@/shared/components/ui";
import {
  Star,
  ExternalLink,
  MousePointer,
  FileText,
  Keyboard,
  Shield,
} from "lucide-react";
import { ChromeIcon } from "@/shared/components/icons/ChromeIcon";

export function ExtensionSection() {
  const perks = [
    {
      icon: <FileText className="w-4 h-4 text-primary" />,
      title: "1-Click Page Summaries",
      desc: "Instant executive briefings, TL;DRs, and bulleted takeaways on any article or documentation.",
    },
    {
      icon: <MousePointer className="w-4 h-4 text-secondary" />,
      title: "In-Page AI Assistant",
      desc: "Highlight text to rewrite, fix grammar, or translate right inside Gmail, Notion, GitHub, and Twitter.",
    },
    {
      icon: <Keyboard className="w-4 h-4 text-emerald-500" />,
      title: "Global Hotkey: Ctrl+Shift+E",
      desc: "Toggle your AI side panel from anywhere without interrupting your browsing flow.",
    },
    {
      icon: <Shield className="w-4 h-4 text-amber-500" />,
      title: "Shadow DOM Isolation",
      desc: "The floating assistant injects cleanly into webpages without CSS style conflicts or tracking.",
    },
  ];

  return (
    <section id="extension" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="sm">
                Chrome Extension & Side Panel
              </Badge>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>5.0 Rating on Web Store</span>
              </div>
            </div>

            <h2 className="font-heading font-normal sm:font-medium text-2xl sm:text-4xl text-text tracking-tight leading-tight">
              AI That Lives Right Alongside Your Browsing
            </h2>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Don’t break your concentration by flipping between tabs. The EchoGPT Chrome Side Panel docks natively into Google Chrome, reading your active tab in real time and drafting prose wherever your cursor lands.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {perks.map((p) => (
                <div key={p.title} className="p-3.5 rounded-lg bg-card/60 border border-border space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-text">
                    {p.icon}
                    <span>{p.title}</span>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <a
                href="https://chromewebstore.google.com/detail/echogpt-multi-ai-chat-sid/negimdcamohmoheiifgecbjgjepkcfhj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto font-bold shadow-xs"
                  leftIcon={<ChromeIcon className="w-4 h-4" />}
                  rightIcon={<ExternalLink className="w-3.5 h-3.5 opacity-70" />}
                >
                  Install Chrome Side Panel
                </Button>
              </a>

              <span className="text-xs text-muted">
                Free installation · Manifest V3 Verified
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-xl border border-border bg-surface p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border text-xs text-muted">
                <div className="flex items-center gap-1.5 font-semibold text-text">
                  <ChromeIcon className="w-4 h-4 text-primary" />
                  <span>Chrome Side Panel</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-500 font-bold">
                  ● ACTIVE
                </span>
              </div>

              <div className="p-3 rounded-lg bg-card border border-border space-y-2">
                <div className="text-xs font-bold text-text truncate">
                  Medium: Building Resilient Microfrontends
                </div>
                <p className="text-[11px] text-muted">
                  Page detected: 2,400 words · 8 min read
                </p>
                <Button variant="primary" size="xs" className="w-full text-[11px]">
                  ⚡ Generate 30-Second Summary
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-background border border-border space-y-1.5 text-[11px]">
                <div className="font-semibold text-primary flex items-center justify-between">
                  <span>GPT-4o Mini Output:</span>
                  <span className="text-[9px] text-muted font-mono">180ms</span>
                </div>
                <p className="text-muted leading-relaxed">
                  Key Takeaway: The author recommends using module federation over iframe isolation for performance-critical dashboard applications.
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] text-muted font-mono">
                <span>Shortcut: Ctrl+Shift+E</span>
                <span className="text-primary font-bold">320+ Models</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
