import React from "react";
import {
  Layers,
  Swords,
  Layout,
} from "lucide-react";

export function CoreFeaturesSection() {
  const features = [
    {
      icon: <Layers className="w-5 h-5 text-primary" />,
      title: "Multi-Model Intelligence",
      description:
        "Switch seamlessly between Claude 3.5 Sonnet, DeepSeek R1, GPT-4o, and Gemini 1.5 in a single conversation thread.",
    },
    {
      icon: <Swords className="w-5 h-5 text-secondary" />,
      title: "Side-by-Side Arena",
      description:
        "Submit prompts to multiple models in parallel to evaluate reasoning depth, latency, and code accuracy head-to-head.",
    },
    {
      icon: <Layout className="w-5 h-5 text-emerald-400" />,
      title: "Ambient Chrome Side Panel",
      description:
        "Read documentation and research papers with automatic webpage context extraction directly in your browser.",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="font-heading font-medium text-2xl sm:text-3xl text-text tracking-tight">
          Built for Deep Work
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          All frontier intelligence unified under one streamlined canvas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className="p-5 rounded-2xl bg-card/60 hover:bg-card border border-border hover:border-border-strong transition-all space-y-3"
          >
            <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center">
              {f.icon}
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-text">{f.title}</h3>
            <p className="text-xs text-muted leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
