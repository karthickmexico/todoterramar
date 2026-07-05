"use client";

import { useEffect } from "react";

interface HeadInjectorProps {
  code: string;
}

// Injects arbitrary HTML into document.head after hydration.
// Googlebot runs JavaScript, so this works for verification tags and tracking.
export function HeadInjector({ code }: HeadInjectorProps) {
  useEffect(() => {
    if (!code.trim()) return;

    const container = document.createElement("div");
    container.innerHTML = code;

    const injected: Node[] = [];
    Array.from(container.childNodes).forEach((node) => {
      const clone = node.cloneNode(true);
      document.head.appendChild(clone);
      injected.push(clone);
    });

    return () => {
      injected.forEach((node) => {
        try { document.head.removeChild(node); } catch { /* already removed */ }
      });
    };
  }, [code]);

  return null;
}
