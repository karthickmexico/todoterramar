"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, Send } from "lucide-react";
import { MEXICAN_STATES } from "@/lib/constants";

interface RegistrationFormProps {
  locale: string;
  interest?: "JOIN_TEAM" | "BUY_PRODUCTS" | "BOTH";
}

export function RegistrationForm({ locale, interest }: RegistrationFormProps) {
  const t = useTranslations("register.form");
  const tv = useTranslations("register.validation");
  const tr = useTranslations("register");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const schema = z.object({
    fullName: z
      .string()
      .min(1, tv("fullNameRequired"))
      .min(2, tv("fullNameMin")),
    phone: z
      .string()
      .min(1, tv("phoneRequired"))
      .regex(/^\+?[\d\s\-()]{10,}$/, tv("phoneInvalid")),
    email: z.string().email(tv("emailInvalid")).optional().or(z.literal("")),
    city: z.string().optional(),
    state: z.string().optional(),
    interest: z.enum(["JOIN_TEAM", "BUY_PRODUCTS", "BOTH"]),
    source: z.enum(
      ["GOOGLE", "FACEBOOK", "INSTAGRAM", "WHATSAPP", "REFERRAL", "OTHER"]
    ),
    message: z.string().optional(),
    consent: z.boolean().refine((val) => val === true, tv("consentRequired")),
    wantsPromos: z.boolean().optional(),
    // Honeypot
    website: z.string().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      interest: interest || "BOTH",
      consent: false,
      wantsPromos: false,
    },
  });

  const watchConsent = watch("consent");

  const onSubmit = async (data: FormData) => {
    // Honeypot check
    if (data.website) return;

    setLoading(true);
    setError("");

    try {
      // Get UTM params from URL
      const urlParams = new URLSearchParams(window.location.search);
      const payload = {
        ...data,
        utmSource: urlParams.get("utm_source"),
        utmMedium: urlParams.get("utm_medium"),
        utmCampaign: urlParams.get("utm_campaign"),
        utmTerm: urlParams.get("utm_term"),
        utmContent: urlParams.get("utm_content"),
        referrerUrl: document.referrer,
        landingPage: window.location.href,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("error"));
      }

      // Track conversion
      if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).gtag) {
        ((window as unknown as Record<string, unknown>).gtag as (...args: unknown[]) => void)(
          "event",
          "conversion",
          { event_category: "lead", event_label: "registration" }
        );
      }
      if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).fbq) {
        ((window as unknown as Record<string, unknown>).fbq as (...args: unknown[]) => void)(
          "track",
          "Lead"
        );
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-green-200 text-center shadow-lg">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("successTitle")} 🎉
        </h2>
        <p className="text-gray-600">{t("successMessage")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-100 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {tr("title")}
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        {tr("subtitle")}
      </p>

      {/* Honeypot - hidden field */}
      <input
        type="text"
        {...register("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Full Name */}
        <div>
          <Label htmlFor="fullName">{t("fullName")} *</Label>
          <Input
            id="fullName"
            placeholder={t("fullNamePlaceholder")}
            {...register("fullName")}
            className="mt-1"
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">{t("phone")} *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("phonePlaceholder")}
            {...register("phone")}
            className="mt-1"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
            className="mt-1"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* City & State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">{t("city")}</Label>
            <Input
              id="city"
              placeholder={t("cityPlaceholder")}
              {...register("city")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="state">{t("state")}</Label>
            <Select onValueChange={(val) => setValue("state", val)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t("statePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {MEXICAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Interest */}
        <div>
          <Label>{t("interest")} *</Label>
          <RadioGroup
            className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2"
            defaultValue={interest || "BOTH"}
            onValueChange={(val) =>
              setValue("interest", val as "JOIN_TEAM" | "BUY_PRODUCTS" | "BOTH")
            }
          >
            {[
              { value: "JOIN_TEAM", label: t("interestJoin") },
              { value: "BUY_PRODUCTS", label: t("interestBuy") },
              { value: "BOTH", label: t("interestBoth") },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-rose-400 transition-colors has-[:checked]:border-rose-600 has-[:checked]:bg-rose-50"
              >
                <RadioGroupItem value={opt.value} />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
          {errors.interest && (
            <p className="text-xs text-red-500 mt-1">{errors.interest.message}</p>
          )}
        </div>

        {/* Source */}
        <div>
          <Label htmlFor="source">{t("source")} *</Label>
          <Select onValueChange={(val) => setValue("source", val as "GOOGLE" | "FACEBOOK" | "INSTAGRAM" | "WHATSAPP" | "REFERRAL" | "OTHER")}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={t("source")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GOOGLE">{t("sourceGoogle")}</SelectItem>
              <SelectItem value="FACEBOOK">{t("sourceFacebook")}</SelectItem>
              <SelectItem value="INSTAGRAM">{t("sourceInstagram")}</SelectItem>
              <SelectItem value="WHATSAPP">{t("sourceWhatsApp")}</SelectItem>
              <SelectItem value="REFERRAL">{t("sourceReferral")}</SelectItem>
              <SelectItem value="OTHER">{t("sourceOther")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.source && (
            <p className="text-xs text-red-500 mt-1">{errors.source.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message">{t("message")}</Label>
          <Textarea
            id="message"
            placeholder={t("messagePlaceholder")}
            {...register("message")}
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Consent */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={watchConsent}
              onCheckedChange={(checked) =>
                setValue("consent", checked === true)
              }
              className="mt-0.5"
            />
            <label htmlFor="consent" className="text-sm text-gray-600 cursor-pointer">
              {t("consent")}{" "}
              <Link
                href={`/${locale}/privacidad`}
                className="text-rose-600 underline"
                target="_blank"
              >
                Aviso de Privacidad
              </Link>
            </label>
          </div>
          {errors.consent && (
            <p className="text-xs text-red-500">{errors.consent.message}</p>
          )}

          <div className="flex items-start gap-3">
            <Checkbox
              id="wantsPromos"
              onCheckedChange={(checked) =>
                setValue("wantsPromos", checked === true)
              }
            />
            <label htmlFor="wantsPromos" className="text-sm text-gray-600 cursor-pointer">
              {t("promos")}
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              {t("submit")}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
