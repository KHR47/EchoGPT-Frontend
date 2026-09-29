"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Theme } from "@/shared/types";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "echogpt-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(STORAGE_KEY) as Theme) || "dark";
    }
    return "dark";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const stored = (localStorage.getItem(STORAGE_KEY) as Theme) || "dark";
      if (stored === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return stored === "light" ? "light" : "dark";
    }
    return "dark";
  });

  useEffect(() => {

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (localStorage.getItem(STORAGE_KEY) === "system") {
        const nextResolved = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(nextResolved);
        document.documentElement.setAttribute("data-theme", nextResolved);
        document.documentElement.classList.toggle("dark", nextResolved === "dark");
        document.documentElement.classList.toggle("light", nextResolved === "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const setTheme = (newTheme: Theme) => {

    document.documentElement.setAttribute("data-theme-transitioning", "true");
    setTimeout(() => {
      document.documentElement.removeAttribute("data-theme-transitioning");
    }, 200);

    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    let resolved: "dark" | "light" = "dark";
    if (newTheme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      resolved = newTheme;
    }
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.classList.toggle("light", resolved === "light");
  };

  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme }}
    >

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var stored = localStorage.getItem("${STORAGE_KEY}");
                var resolved = "dark";
                if (stored === "light" || stored === "dark") {
                  resolved = stored;
                } else if (stored === "system") {
                  resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                }
                document.documentElement.setAttribute("data-theme", resolved);
                if (resolved === "dark") {
                  document.documentElement.classList.add("dark");
                  document.documentElement.classList.remove("light");
                } else {
                  document.documentElement.classList.add("light");
                  document.documentElement.classList.remove("dark");
                }
              } catch (e) {}
            })();
          `,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
