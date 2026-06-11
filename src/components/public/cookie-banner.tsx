"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

interface CookieBannerProps {
  locale: string;
}

export function CookieBanner({ locale }: CookieBannerProps) {
  const t = useTranslations("cookies");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-950/95 backdrop-blur-sm border-t border-gray-800 animate-in slide-in-from-bottom-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            {t("message")}{" "}
            <Link
              href={`/${locale}/privacidad`}
              className="hover:underline" style={{ color: "#d7a84f" }}
            >
              {t("learnMore")}
            </Link>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={decline}
            className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
          >
            {t("decline")}
          </Button>
          <Button size="sm" onClick={accept}>
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
