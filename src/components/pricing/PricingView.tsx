"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSettingsStore } from "@/shared/stores/useSettingsStore";
import { useTheme } from "@/shared/components/ThemeProvider";
import { Badge, Button } from "@/shared/components/ui";
import { AppNavigationTabs } from "@/components/navigation/AppNavigationTabs";
import { EchoLogo } from "@/shared/components/icons/EchoLogo";
import {
  Check,
  X as XIcon,
  Sparkles,
  Zap,
  Shield,
  Crown,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Lock,
  ArrowLeft,
  Sun,
  Moon,
  Flame,
  CheckCircle2,
  Building,
} from "lucide-react";

type BillingCycle = "monthly" | "annual";
type Currency = "usd" | "bdt";

interface PlanTier {
  id: "free" | "plus" | "pro" | "max";
  name: string;
  badge?: string;
  isPopular?: boolean;
  isMax?: boolean;
  description: string;
  priceMonthlyUSD: number;
  priceAnnualUSD: number;
  priceMonthlyBDT: number;
  priceAnnualBDT: number;
  quota: string;
  modelsLabel: string;
  features: string[];
  ctaLabel: string;
}

const PLANS: PlanTier[] = [
  {
    id: "free",
    name: "Free",
    badge: "Starter",
    description: "Essential multi-model AI search, daily tasks & quick webpage summaries.",
    priceMonthlyUSD: 0,
    priceAnnualUSD: 0,
    priceMonthlyBDT: 0,
    priceAnnualBDT: 0,
    quota: "50 messages / 3 hours",
    modelsLabel: "5 Standard Models",
    features: [
      "Access to 5 standard models (GPT-4o mini, Haiku, Gemini Flash)",
      "50 messages every 3 hours (rolling window)",
      "Dual-model comparison arena (2 models side-by-side)",
      "Chrome side panel with webpage context",
      "8,000 token context window",
      "Standard community support",
    ],
    ctaLabel: "Get Started Free",
  },
  {
    id: "plus",
    name: "Plus",
    badge: "Students & Writers",
    description: "Accelerated intelligence for individuals, researchers, and content creators.",
    priceMonthlyUSD: 12,
    priceAnnualUSD: 10,
    priceMonthlyBDT: 1400,
    priceAnnualBDT: 1150,
    quota: "300 messages / 3 hours",
    modelsLabel: "150+ Curated Models",
    features: [
      "Priority access to 150+ curated AI models",
      "300 messages every 3 hours with fast queue",
      "3-Way simultaneous Battle Arena",
      "In-page floating AI editor & text rewriter",
      "32,000 token context memory",
      "5 Model Context Protocol (MCP) server connectors",
      "Export chats to Markdown & PDF",
      "Email support within 24 hours",
    ],
    ctaLabel: "Upgrade to Plus",
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Most Popular",
    isPopular: true,
    description: "Uncapped frontier reasoning for software engineers and power builders.",
    priceMonthlyUSD: 20,
    priceAnnualUSD: 16,
    priceMonthlyBDT: 2400,
    priceAnnualBDT: 1900,
    quota: "1,000 messages / 3 hours",
    modelsLabel: "All 320+ Frontier Models",
    features: [
      "Full access to 320+ Frontier Models (Claude 3.5 Sonnet, GPT-4o, DeepSeek R1)",
      "1,000 messages every 3 hours with unthrottled priority queue",
      "4-Way simultaneous Battle Arena",
      "Real-time latency and token cost telemetry",
      "Full MV3 Chrome Extension companion",
      "128,000 token deep reasoning context",
      "Unlimited MCP connectors & local bridges",
      "Code sandbox runner & artifact preview",
      "Priority 24/7 technical assistance",
    ],
    ctaLabel: "Get EchoGPT Pro",
  },
  {
    id: "max",
    name: "Max",
    badge: "Frontier Labs",
    isMax: true,
    description: "Maximum reasoning compute and unthrottled throughput for teams & AI labs.",
    priceMonthlyUSD: 60,
    priceAnnualUSD: 48,
    priceMonthlyBDT: 7200,
    priceAnnualBDT: 5750,
    quota: "Uncapped Reasoning",
    modelsLabel: "Frontier + Deep Reasoning",
    features: [
      "Highest compute priority: Zero wait queues",
      "Uncapped reasoning (Claude 3.7 Thinking, OpenAI o1/o3-max, DeepSeek R1)",
      "Automated multi-model benchmark evaluation runner",
      "1,000,000 token ultra-long memory window",
      "Dedicated API platform keys & webhooks",
      "Team workspace collaboration & shared history",
      "Custom model fine-tuning & BYO endpoint hosting",
      "Dedicated Slack channel & 99.9% uptime SLA",
    ],
    ctaLabel: "Get Max Access",
  },
];

interface ComparisonCategory {
  name: string;
  rows: {
    feature: string;
    free: string | boolean;
    plus: string | boolean;
    pro: string | boolean;
    max: string | boolean;
  }[];
}

const COMPARISON_DATA: ComparisonCategory[] = [
  {
    name: "Model Access & Compute",
    rows: [
      {
        feature: "Total Catalog Size",
        free: "5 Standard",
        plus: "150+ Curated",
        pro: "320+ Frontier",
        max: "All 320+ & Custom",
      },
      {
        feature: "Claude 3.5 Sonnet & GPT-4o",
        free: false,
        plus: "Standard Priority",
        pro: "Highest Priority",
        max: "Unthrottled",
      },
      {
        feature: "Deep Reasoning Engines (o1, o3, R1)",
        free: false,
        plus: "Limited Preview",
        pro: "Full Access",
        max: "Extended Thinking",
      },
      {
        feature: "BYOK (Bring Your Own Keys)",
        free: true,
        plus: true,
        pro: true,
        max: true,
      },
    ],
  },
  {
    name: "Usage & Rate Limits",
    rows: [
      {
        feature: "3-Hour Window Quota",
        free: "50 messages",
        plus: "300 messages",
        pro: "1,000 messages",
        max: "Unthrottled",
      },
      {
        feature: "Queue Priority",
        free: "Standard",
        plus: "Fast",
        pro: "Priority",
        max: "Dedicated Node",
      },
      {
        feature: "Max Context Window",
        free: "8,000 tokens",
        plus: "32,000 tokens",
        pro: "128,000 tokens",
        max: "1,000,000 tokens",
      },
    ],
  },
  {
    name: "Arena & Browser Extension",
    rows: [
      {
        feature: "Simultaneous Arena Slots",
        free: "2 Models",
        plus: "3 Models",
        pro: "4 Models",
        max: "Automated Matrix",
      },
      {
        feature: "Latency & Cost Breakdown",
        free: false,
        plus: "Basic",
        pro: true,
        max: true,
      },
      {
        feature: "Chrome Side Panel",
        free: "Basic Summaries",
        plus: "Full Studio",
        pro: "Full Studio",
        max: "Multi-Window Sync",
      },
      {
        feature: "In-Page Floating AI Editor",
        free: false,
        plus: true,
        pro: true,
        max: true,
      },
    ],
  },
  {
    name: "Developer Tools & MCP",
    rows: [
      {
        feature: "MCP Server Connectors",
        free: false,
        plus: "5 Servers",
        pro: "Unlimited",
        max: "Unlimited + Custom",
      },
      {
        feature: "Code Execution Sandbox",
        free: false,
        plus: "Basic",
        pro: true,
        max: "Isolated Node",
      },
      {
        feature: "Team Collaboration & Roles",
        free: false,
        plus: false,
        pro: "Up to 3 members",
        max: "Unlimited Seats",
      },
      {
        feature: "Support SLA",
        free: "Community",
        plus: "24h Email",
        pro: "24/7 Priority",
        max: "Dedicated Slack",
      },
    ],
  },
];

const FAQS = [
  {
    question: "Can I switch or cancel my plan at any time?",
    answer:
      "Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from the settings or pricing page. Changes take effect immediately, and any unused prepaid time is credited towards your account balance.",
  },
  {
    question: "What happens if I reach my message limit in a 3-hour window?",
    answer:
      "EchoGPT operates on a rolling 3-hour window. If your quota is reached, you can continue conversing using standard models, wait for the window to reset, or provide your own API keys in Settings to enjoy unlimited direct inference.",
  },
  {
    question: "Do you support local payment methods like bKash and Nagad?",
    answer:
      "Yes! In addition to international credit/debit cards, Apple Pay, and Google Pay through Stripe, we natively support local payment methods including bKash, Nagad, and Rocket via SSLCommerz for smooth local checkout.",
  },
  {
    question: "What is the key difference between Pro and Max?",
    answer:
      "Pro is crafted for individual software engineers and researchers who need complete access to 320+ frontier models and high throughput. Max is tailored for AI labs and teams requiring unthrottled extended reasoning (Claude 3.7 Thinking, o1/o3-max), a 1M token context window, team workspaces, and dedicated engineering support.",
  },
  {
    question: "Can I use my own API keys (BYOK)?",
    answer:
      "Yes! All plans, including Free, support Bring Your Own Key (BYOK) for OpenAI, Anthropic, Google, and DeepSeek in Settings. Requests routed through your personal keys do not consume your EchoGPT plan quota.",
  },
  {
    question: "How do Model Context Protocol (MCP) connectors work?",
    answer:
      "EchoGPT natively implements the open Model Context Protocol. You can connect your local or remote MCP servers (like GitHub, PostgreSQL, Notion, and local filesystems) to allow any connected AI model to securely read files and execute tasks.",
  },
];

export function PricingView() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
  const [currency, setCurrency] = useState<Currency>("usd");
  const [showComparison, setShowComparison] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [checkoutPlan, setCheckoutPlan] = useState<PlanTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "local">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();
  const settings = useSettingsStore();

  const currentPlanName = settings.plan.toLowerCase();

  const isCurrentPlan = (plan: PlanTier) => {
    if (plan.id === "free" && currentPlanName.includes("free")) return true;
    if (plan.id === "plus" && currentPlanName.includes("plus")) return true;
    if (plan.id === "pro" && (currentPlanName.includes("pro") && !currentPlanName.includes("max"))) return true;
    if (plan.id === "max" && currentPlanName.includes("max")) return true;
    return false;
  };

  const getPrice = (plan: PlanTier) => {
    if (currency === "usd") {
      return billingCycle === "annual" ? plan.priceAnnualUSD : plan.priceMonthlyUSD;
    }
    return billingCycle === "annual" ? plan.priceAnnualBDT : plan.priceMonthlyBDT;
  };

  const getCurrencySymbol = () => (currency === "usd" ? "$" : "৳");

  const handleOpenCheckout = (plan: PlanTier) => {
    setCheckoutPlan(plan);
    setCheckoutSuccess(false);
  };

  const handleConfirmSubscription = () => {
    if (!checkoutPlan) return;
    setIsProcessing(true);

    setTimeout(() => {
      let newMessages = 100;
      if (checkoutPlan.id === "free") newMessages = 50;
      if (checkoutPlan.id === "plus") newMessages = 300;
      if (checkoutPlan.id === "pro") newMessages = 1000;
      if (checkoutPlan.id === "max") newMessages = 5000;

      settings.updateAccount({
        plan: `${checkoutPlan.name} Plan`,
        messagesRemaining: newMessages,
      });

      setIsProcessing(false);
      setCheckoutSuccess(true);

      setTimeout(() => {
        setCheckoutPlan(null);
        setCheckoutSuccess(false);
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col animate-page-enter">
      <header className="h-16 px-4 sm:px-8 border-b border-border/80 bg-surface/85 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="p-2 rounded-xl text-muted hover:text-text hover:bg-card border border-border/60 transition-colors cursor-pointer"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-text">Plans & Pricing</h1>
              <Badge variant="primary" size="xs">
                {settings.plan}
              </Badge>
            </div>
            <p className="text-[11px] text-muted hidden sm:block">
              Choose the ideal reasoning compute and model access for your workflow.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center">
          <AppNavigationTabs activePage="pricing" />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl text-muted hover:text-text hover:bg-card border border-border/60 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>
        </div>
      </header>

      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-text">
            Choose your intelligence tier
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto">
            From quick daily searches to multi-model battle arenas and unthrottled reasoning labs, select the capacity tailored to you.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="inline-flex items-center p-1 rounded-xl bg-card border border-border text-xs">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-surface text-text shadow-2xs font-semibold"
                    : "text-muted hover:text-text"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-surface text-text shadow-2xs font-semibold"
                    : "text-muted hover:text-text"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
                  Save 20%
                </span>
              </button>
            </div>

            <div className="inline-flex items-center p-1 rounded-xl bg-card border border-border text-xs">
              <button
                type="button"
                onClick={() => setCurrency("usd")}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  currency === "usd"
                    ? "bg-surface text-text shadow-2xs font-semibold"
                    : "text-muted hover:text-text"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("bdt")}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  currency === "bdt"
                    ? "bg-surface text-text shadow-2xs font-semibold"
                    : "text-muted hover:text-text"
                }`}
              >
                BDT (৳)
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan) => {
            const price = getPrice(plan);
            const active = isCurrentPlan(plan);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-200 ${
                  plan.isPopular
                    ? "bg-card border-2 border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/20 scale-[1.02]"
                    : plan.isMax
                    ? "bg-card border border-amber-500/40 shadow-lg shadow-amber-500/5"
                    : "bg-card/70 border border-border hover:border-border-strong hover:bg-card"
                } p-6`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                {plan.isMax && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>{plan.badge}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-text">{plan.name}</h3>
                      <p className="text-xs text-muted mt-1 min-h-[32px]">{plan.description}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
                        {getCurrencySymbol()}{price}
                      </span>
                      {plan.id !== "free" && (
                        <span className="text-xs text-muted font-medium">
                          / month {billingCycle === "annual" ? "(billed yearly)" : ""}
                        </span>
                      )}
                    </div>
                    {plan.id === "free" && (
                      <span className="text-xs text-muted font-medium block">
                        Free forever, no credit card required
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface/70 border border-border/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-muted">
                      <span>Allowance:</span>
                      <span className="font-semibold text-text">{plan.quota}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted">
                      <span>Access:</span>
                      <span className="font-semibold text-primary">{plan.modelsLabel}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                      Included features
                    </div>
                    <ul className="space-y-2 text-xs">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            plan.isPopular ? "text-primary" : plan.isMax ? "text-amber-400" : "text-emerald-400"
                          }`} />
                          <span className="text-muted leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-border/50">
                  <Button
                    variant={plan.isPopular ? "primary" : plan.isMax ? "outline" : active ? "secondary" : "outline"}
                    className={`w-full text-xs font-semibold cursor-pointer ${
                      plan.isMax ? "border-amber-500/40 hover:bg-amber-500/10 text-amber-300" : ""
                    }`}
                    onClick={() => handleOpenCheckout(plan)}
                    disabled={active}
                  >
                    {active ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Current Plan</span>
                      </span>
                    ) : (
                      plan.ctaLabel
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card hover:bg-card-hover border border-border text-xs font-semibold text-text transition-colors cursor-pointer"
          >
            <span>{showComparison ? "Hide Detailed Feature Matrix" : "Compare All Plans in Detail"}</span>
            {showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showComparison && (
          <div className="rounded-2xl border border-border bg-card overflow-hidden animate-in fade-in-0 duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    <th className="p-4 font-bold text-text min-w-[200px]">Features & Limits</th>
                    <th className="p-4 font-bold text-text text-center min-w-[120px]">Free</th>
                    <th className="p-4 font-bold text-text text-center min-w-[120px]">Plus</th>
                    <th className="p-4 font-bold text-primary text-center min-w-[120px]">Pro</th>
                    <th className="p-4 font-bold text-amber-400 text-center min-w-[120px]">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {COMPARISON_DATA.map((cat, catIdx) => (
                    <React.Fragment key={catIdx}>
                      <tr className="bg-surface/80">
                        <td colSpan={5} className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-muted">
                          {cat.name}
                        </td>
                      </tr>
                      {cat.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-card-hover/50 transition-colors">
                          <td className="py-3 px-4 text-text font-medium">{row.feature}</td>
                          <td className="py-3 px-4 text-center text-muted">
                            {typeof row.free === "boolean" ? (
                              row.free ? (
                                <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                              ) : (
                                <XIcon className="w-4 h-4 text-muted/40 mx-auto" />
                              )
                            ) : (
                              row.free
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-muted">
                            {typeof row.plus === "boolean" ? (
                              row.plus ? (
                                <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                              ) : (
                                <XIcon className="w-4 h-4 text-muted/40 mx-auto" />
                              )
                            ) : (
                              row.plus
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-text font-medium bg-primary/5">
                            {typeof row.pro === "boolean" ? (
                              row.pro ? (
                                <Check className="w-4 h-4 text-primary mx-auto" />
                              ) : (
                                <XIcon className="w-4 h-4 text-muted/40 mx-auto" />
                              )
                            ) : (
                              row.pro
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-muted">
                            {typeof row.max === "boolean" ? (
                              row.max ? (
                                <Check className="w-4 h-4 text-amber-400 mx-auto" />
                              ) : (
                                <XIcon className="w-4 h-4 text-muted/40 mx-auto" />
                              )
                            ) : (
                              row.max
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="pt-6 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-heading text-2xl font-bold text-text">Frequently Asked Questions</h3>
            <p className="text-xs text-muted">Everything you need to know about subscriptions and billing.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-3.5 px-4 text-left flex items-center justify-between gap-3 text-xs font-semibold text-text cursor-pointer hover:bg-card-hover"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-muted leading-relaxed border-t border-border/40 pt-2 animate-in fade-in-0 duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Building className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold text-text">Need Custom Enterprise Deployment?</h4>
            </div>
            <p className="text-xs text-muted max-w-xl">
              We offer dedicated VPC deployments, SOC2 Type II compliance reports, custom data retention agreements, and high-volume billing for organizations.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="mailto:enterprise@echogpt.live"
              className="px-4 py-2 rounded-xl bg-card hover:bg-card-hover border border-border text-xs font-semibold text-text transition-colors"
            >
              Contact Sales
            </Link>
            <Link
              href="/app"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold transition-colors"
            >
              Open Studio
            </Link>
          </div>
        </div>
      </main>

      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => {
                if (!isProcessing) {
                  setCheckoutPlan(null);
                  setCheckoutSuccess(false);
                }
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-text hover:bg-card cursor-pointer"
              aria-label="Close modal"
            >
              <XIcon className="w-4 h-4" />
            </button>

            {checkoutSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-text">Subscription Updated!</h3>
                <p className="text-xs text-muted">
                  You are now on the <span className="font-bold text-text">{checkoutPlan.name} Plan</span>. Your quota and capabilities have been updated.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <EchoLogo className="w-5 h-5" size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text">Subscribe to {checkoutPlan.name}</h3>
                    <p className="text-xs text-muted">
                      {billingCycle === "annual" ? "Annual Billing (Billed Yearly)" : "Monthly Billing"}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Selected Tier:</span>
                    <span className="font-bold text-text">{checkoutPlan.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Price:</span>
                    <span className="font-bold text-primary text-sm">
                      {getCurrencySymbol()}{getPrice(checkoutPlan)} / month
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Allowance:</span>
                    <span className="font-semibold text-text">{checkoutPlan.quota}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted uppercase block">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                        paymentMethod === "card"
                          ? "bg-primary/10 border-primary text-primary font-semibold"
                          : "bg-card border-border text-muted hover:text-text"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("wallet")}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                        paymentMethod === "wallet"
                          ? "bg-primary/10 border-primary text-primary font-semibold"
                          : "bg-card border-border text-muted hover:text-text"
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      <span>Apple/Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("local")}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                        paymentMethod === "local"
                          ? "bg-primary/10 border-primary text-primary font-semibold"
                          : "bg-card border-border text-muted hover:text-text"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>bKash/Nagad</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-muted flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>256-bit encrypted checkout. Cancel anytime with 1-click.</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs cursor-pointer"
                    onClick={() => setCheckoutPlan(null)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 text-xs font-semibold cursor-pointer"
                    onClick={handleConfirmSubscription}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Confirm ${checkoutPlan.name}`}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
