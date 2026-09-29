"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (index: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={className}>
      {parts.map((part, index) => {

        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const language = lines[0].includes(" ") ? "code" : lines[0] || "code";
          const codeContent = lines[0].includes(" ") ? lines.join("\n") : lines.slice(1).join("\n");

          return (
            <div
              key={index}
              className="my-3.5 rounded-xl border border-border/80 bg-surface/90 overflow-hidden shadow-xs"
            >
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-card/90 border-b border-border text-[11px] font-mono text-muted">
                <span className="flex items-center gap-1.5 uppercase font-semibold text-text">
                  <Terminal className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                  {language}
                </span>
                <button
                  type="button"
                  aria-label={`Copy ${language} code snippet`}
                  onClick={() => handleCopyCode(index, codeContent)}
                  className="flex items-center gap-1 text-muted hover:text-text px-2 py-0.5 rounded hover:bg-surface transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 text-xs font-mono text-text overflow-x-auto leading-relaxed whitespace-pre">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        const paragraphs = part.split("\n\n");
        return (
          <div key={index} className="space-y-3">
            {paragraphs.map((p, pIndex) => {
              const trimmed = p.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith(">")) {
                return (
                  <blockquote
                    key={pIndex}
                    className="pl-3.5 border-l-2 border-primary/60 italic text-muted text-sm sm:text-[15px]"
                  >
                    {trimmed.replace(/^>\s*/, "")}
                  </blockquote>
                );
              }

              if (trimmed.startsWith("|") && trimmed.includes("\n|")) {
                const rows = trimmed
                  .split("\n")
                  .map((r) => r.trim())
                  .filter((r) => r.startsWith("|") && !r.includes("---"));

                return (
                  <div key={pIndex} className="my-3 overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-xs">
                      <tbody>
                        {rows.map((row, rIdx) => {
                          const cells = row
                            .split("|")
                            .slice(1, -1)
                            .map((c) => c.trim());
                          return (
                            <tr
                              key={rIdx}
                              className={
                                rIdx === 0
                                  ? "bg-card font-bold border-b border-border text-text"
                                  : "border-b border-border/40 hover:bg-card/40 transition-colors"
                              }
                            >
                              {cells.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2.5">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={pIndex} className="text-base font-bold text-text mt-3 mb-1">
                    {trimmed.replace(/^###\s+/, "")}
                  </h3>
                );
              }
              if (trimmed.startsWith("#### ")) {
                return (
                  <h4 key={pIndex} className="text-sm font-bold text-text mt-2 mb-1">
                    {trimmed.replace(/^####\s+/, "")}
                  </h4>
                );
              }

              return (
                <p
                  key={pIndex}
                  className="leading-relaxed whitespace-pre-line text-sm sm:text-[15px] text-text"
                >
                  {trimmed}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
