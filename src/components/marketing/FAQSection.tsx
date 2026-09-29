"use client";

import React, { useState } from "react";
import { Badge } from "@/shared/components/ui";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does EchoGPT provide 320+ AI models in one place?",
      answer:
        "EchoGPT aggregates the world's leading foundational models through direct high-speed API connections to OpenRouter and proprietary model clusters. Instead of subscribing individually to OpenAI, Anthropic, Google, and others, you get unified access to every major LLM with a single balance and unified interface.",
    },
    {
      question: "Is there a free tier? Do I need a credit card to get started?",
      answer:
        "Yes! EchoGPT provides 15 free models (including Llama 3.3 70B, Gemini 1.5 Flash, DeepSeek V3, and GPT-4o Mini) completely free without needing to enter a credit card. You can immediately launch the studio and start chatting or comparing responses.",
    },
    {
      question: "How does Multi-Model Comparison (Battle Mode) work?",
      answer:
        "Battle Mode allows you to submit one single prompt and stream parallel answers from 3 to 5 different models side-by-side. It features consensus diff highlighting to reveal where models agree on facts and where their reasoning diverges, saving hours of manual cross-referencing.",
    },
    {
      question: "Can I connect my own custom MCP servers or external tools?",
      answer:
        "Absolutely. EchoGPT natively supports the open Model Context Protocol (MCP). You can connect your local or remote MCP servers via the Connectors Hub to give all 320+ models secure access to your internal databases, GitHub repositories, and custom APIs.",
    },
    {
      question: "Is my browsing data private when using the Chrome Extension?",
      answer:
        "Yes, privacy is a fundamental design principle. The Chrome Side Panel only reads the text content of your active tab when you explicitly click 'Summarize Page' or highlight text. Your data is never sold, and prompts are processed securely over encrypted TLS connections.",
    },
    {
      question: "What currencies and payment methods are supported?",
      answer:
        "We support both global credit/debit cards via Stripe (in USD) and localized payments in Bangladeshi Taka (BDT) via SSLCommerz (bKash, Nagad, Rocket, and local debit/credit cards). Upgrade seamlessly regardless of your banking region.",
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3">
        <Badge variant="primary" size="sm">
          Got Questions?
        </Badge>
        <h2 className="font-heading font-normal sm:font-medium text-2xl sm:text-4xl text-text tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          Everything you need to know about EchoGPT models, extensions, and billing.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="rounded-xl border border-border bg-surface transition-colors overflow-hidden shadow-2xs"
            >
              <button
                id={`faq-btn-${index}`}
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="font-bold text-sm sm:text-base text-text">
                  {faq.question}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`w-4 h-4 text-muted shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-btn-${index}`}
                  className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted leading-relaxed border-t border-border/40 pt-3 animate-slide-down"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
