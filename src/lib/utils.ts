import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | null,
  locale: string = "es-MX"
): string {
  if (!date) return "";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatCurrency(
  amount: number | null | undefined,
  currency = "MXN"
): string {
  if (amount === null || amount === undefined) return "";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

// Normalizes a Mexican phone number to the full international format (no +).
// wa.me requires digits only with country code.
// 10 digits            → "52" + digits   (e.g. 5512345678 → 525512345678)
// 12 digits, starts 52 → keep as-is      (e.g. 525512345678)
// 13 digits, starts 521→ keep as-is      (e.g. 5215512345678)
// Anything else        → strip non-digits and return
export function normalizeMxPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("521") && digits.length === 13) return digits;
  if (digits.startsWith("52") && digits.length === 12) return digits;
  if (digits.length === 10) return `52${digits}`;
  return digits;
}

export function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export function getVideoThumbnail(url: string): string {
  const ytId = extractYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  return "";
}

export function isVideoExpired(endDate: Date | null): boolean {
  if (!endDate) return false;
  return new Date(endDate) < new Date();
}
