import React from "react";
import { Badge } from "@/shared/components/ui";
import { MessageSquarePlus, SplitSquareVertical, Compass, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: <MessageSquarePlus className="w-5 h-5 text-primary" />,
      title: "Choose Single Model or Battle Mode",
      description:
        "Select from 320+ models using instant search or Cmd+K. Choose 'Battle Mode' to submit a single prompt to multiple frontier models simultaneously.",
    },
    {
      step: "02",
      icon: <SplitSquareVertical className="w-5 h-5 text-secondary" />,
      title: "Cross-Examine & Synthesize Answers",
      description:
        "Watch responses stream in parallel. Spot factual discrepancies, compare code efficiency, and pick the best output with zero tab switching.",
    },
    {
      step: "03",
      icon: <Compass className="w-5 h-5 text-emerald-500" />,
      title: "Carry AI Across Your Entire Browser",
      description:
        "Use the EchoGPT Chrome Side Panel to summarize long articles, draft responses in web forms, and explain highlighted text on any webpage.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-card/30 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="primary" size="sm">
            Frictionless Workflow
          </Badge>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-text tracking-tight">
            How EchoGPT Amplifies Your Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            From quick questions to deep multi-model research, EchoGPT simplifies how you interact with artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="relative p-6 rounded-xl bg-surface border border-border shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center shadow-2xs">
                    {s.icon}
                  </div>
                  <span className="font-mono text-2xl font-extrabold text-primary/30">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-base text-text">{s.title}</h3>
                <p className="text-xs text-muted leading-relaxed">
                  {s.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-muted">
                  <ArrowRight className="w-5 h-5 text-border-strong" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
