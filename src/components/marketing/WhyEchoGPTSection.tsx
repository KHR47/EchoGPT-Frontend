import React from "react";
import { Badge, Button } from "@/shared/components/ui";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";

export function WhyEchoGPTSection() {
  const comparisonRows = [
    {
      feature: "Frontier Models Available",
      fragmented: "1 vendor only (e.g. OpenAI or Anthropic)",
      echogpt: "320+ Models (OpenAI, Anthropic, Google, DeepSeek, Meta, Mistral)",
      highlight: true,
    },
    {
      feature: "Parallel Multi-Model Battle Mode",
      fragmented: "Impossible (requires opening 3-4 separate browser windows)",
      echogpt: "Native 3–5 column side-by-side comparison stream",
      highlight: true,
    },
    {
      feature: "Switch Models Mid-Conversation",
      fragmented: "No (thread locked to original model)",
      echogpt: "Seamless (switch from Sonnet to R1 without lost context)",
      highlight: false,
    },
    {
      feature: "Ambient Chrome Side Panel",
      fragmented: "Basic popup or third-party paid extension",
      echogpt: "Full Manifest V3 side panel with 1-click page summarization",
      highlight: true,
    },
    {
      feature: "In-Page Text Rewriter & Assistant",
      fragmented: "Requires separate Grammarly / QuillBot subscriptions",
      echogpt: "Integrated floating toolbar with Shadow DOM isolation",
      highlight: false,
    },
    {
      feature: "Localized Billing (BDT & USD)",
      fragmented: "US Credit Cards only (international exchange fee)",
      echogpt: "Dual payment: Stripe USD & Bangladeshi Taka (SSLCommerz)",
      highlight: false,
    },
    {
      feature: "Monthly Financial Investment",
      fragmented: "$60 – $80 / month for 3-4 separate accounts",
      echogpt: "15 Free Models forever, or unified Pro tier",
      highlight: true,
    },
  ];

  return (
    <section id="why-echogpt" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="primary" size="sm">
          Why Choose EchoGPT
        </Badge>
        <h2 className="font-heading font-normal sm:font-medium text-2xl sm:text-4xl text-text tracking-tight">
          Stop Overpaying for Fragmented AI Accounts
        </h2>
        <p className="text-xs sm:text-sm text-muted leading-relaxed">
          Subscribing to ChatGPT Plus ($20), Claude Pro ($20), and Gemini Advanced ($20) costs over $60/month and locks you into siloed tabs. EchoGPT unifies the entire AI ecosystem into one workspace.
        </p>
      </div>

      <div className="sm:hidden flex items-center justify-center gap-1.5 text-[11px] text-muted font-medium pb-1">
        <span>← Swipe table horizontally to compare →</span>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-border bg-card/60">
                <th className="p-4 sm:p-5 text-xs font-bold text-muted uppercase tracking-wider w-2/5">
                  Capability / Dimension
                </th>
                <th className="p-4 sm:p-5 text-xs font-bold text-muted uppercase tracking-wider w-2/5">
                  Fragmented Subscriptions
                </th>
                <th className="p-4 sm:p-5 text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 border-l border-primary/20 w-1/5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>EchoGPT All-In-One</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs sm:text-sm">
              {comparisonRows.map((row) => (
                <tr
                  key={row.feature}
                  className={`hover:bg-card/40 transition-colors ${
                    row.highlight ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="p-4 sm:p-5 font-semibold text-text">
                    {row.feature}
                  </td>
                  <td className="p-4 sm:p-5 text-muted flex items-center gap-2">
                    <X className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{row.fragmented}</span>
                  </td>
                  <td className="p-4 sm:p-5 font-medium text-text bg-primary/5 border-l border-primary/20">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{row.echogpt}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <a href="/app">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Claim Your Free Multi-AI Workspace
          </Button>
        </a>
      </div>
    </section>
  );
}
