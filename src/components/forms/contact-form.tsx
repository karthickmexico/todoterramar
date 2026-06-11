"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, CheckCircle } from "lucide-react";

interface ContactFormProps {
  locale: string;
}

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(5),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations("contact");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (data.website) return;
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          message: data.message,
          interest: "BOTH",
          source: "OTHER",
          consent: true,
          landingPage: window.location.href,
        }),
      });
      if (res.ok) setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
        <p className="font-semibold text-green-800">{t("form.success")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h2 className="font-bold text-xl text-gray-900 mb-5">{t("form.title")}</h2>
      <input type="text" {...register("website")} className="hidden" tabIndex={-1} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Nombre completo</Label>
          <Input {...register("fullName")} className="mt-1" placeholder="Tu nombre" />
        </div>
        <div>
          <Label>Teléfono</Label>
          <Input {...register("phone")} className="mt-1" placeholder="Tu teléfono" type="tel" />
        </div>
        <div>
          <Label>Correo (opcional)</Label>
          <Input {...register("email")} className="mt-1" placeholder="tu@email.com" type="email" />
        </div>
        <div>
          <Label>Mensaje</Label>
          <Textarea {...register("message")} className="mt-1" placeholder="¿En qué podemos ayudarte?" rows={4} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" />Enviar mensaje</>}
        </Button>
      </form>
    </div>
  );
}
