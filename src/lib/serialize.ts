/**
 * Serialization helpers — convert Prisma Decimal and Date objects to plain
 * JS primitives before they cross the Server→Client Component boundary.
 *
 * Next.js throws "Only plain objects can be passed to Client Components" when
 * Prisma Decimal class instances (or raw Date objects) are in props.
 */

type AnyDate = Date | string | null | undefined;

function sd(date: AnyDate): string | null {
  if (!date) return null;
  if (date instanceof Date) return date.toISOString();
  return date;
}

function sn(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface SerializedCategory {
  id: string;
  nameEs: string;
  nameEn: string | null;
  slug: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedProduct {
  id: string;
  nameEs: string;
  nameEn: string | null;
  descriptionEs: string | null;
  descriptionEn: string | null;
  price: number | null;
  categoryId: string | null;
  imageUrl: string | null;
  availability: "IN_STOCK" | "OUT_OF_STOCK" | "COMING_SOON";
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  category: SerializedCategory | null;
}

export interface SerializedPromotion {
  id: string;
  titleEs: string;
  titleEn: string | null;
  descriptionEs: string | null;
  descriptionEn: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedVideo {
  id: string;
  titleEs: string;
  titleEn: string | null;
  descriptionEs: string | null;
  descriptionEn: string | null;
  videoUrl: string | null;
  externalUrl: string | null;
  thumbnailUrl: string | null;
  category: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedLeadNote {
  id: string;
  leadId: string;
  content: string;
  createdAt: string;
}

export interface SerializedLead {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  state: string | null;
  interest: string;
  source: string;
  status: string;
  message: string | null;
  followUpDate: string | null;
  consentGiven: boolean;
  wantsPromos: boolean;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  referrerUrl: string | null;
  landingPage: string | null;
  productId: string | null;
  productName: string | null;
  createdAt: string;
  updatedAt: string;
  notes: SerializedLeadNote[];
}

export interface SerializedBlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  seoTitle: string | null;
  seoDesc: string | null;
  language: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Serializers ────────────────────────────────────────────────────────────

export function serializeCategory(c: {
  id: string; nameEs: string; nameEn: string | null; slug: string;
  sortOrder: number; createdAt: Date | string; updatedAt: Date | string;
}): SerializedCategory {
  return { ...c, createdAt: sd(c.createdAt)!, updatedAt: sd(c.updatedAt)! };
}

export function serializeProduct(p: {
  id: string; nameEs: string; nameEn: string | null;
  descriptionEs: string | null; descriptionEn: string | null;
  price: unknown; categoryId: string | null; imageUrl: string | null;
  availability: "IN_STOCK" | "OUT_OF_STOCK" | "COMING_SOON";
  isFeatured: boolean; isPublished: boolean; sortOrder: number;
  createdAt: Date | string; updatedAt: Date | string;
  category?: { id: string; nameEs: string; nameEn: string | null; slug: string; sortOrder: number; createdAt: Date | string; updatedAt: Date | string } | null;
}): SerializedProduct {
  return {
    ...p,
    price: sn(p.price),
    createdAt: sd(p.createdAt)!,
    updatedAt: sd(p.updatedAt)!,
    category: p.category ? serializeCategory(p.category) : null,
  };
}

export function serializePromotion(p: {
  id: string; titleEs: string; titleEn: string | null;
  descriptionEs: string | null; descriptionEn: string | null;
  imageUrl: string | null; pdfUrl: string | null;
  startDate: Date | string; endDate: Date | string | null;
  isActive: boolean; sortOrder: number;
  createdAt: Date | string; updatedAt: Date | string;
}): SerializedPromotion {
  return {
    ...p,
    startDate: sd(p.startDate)!,
    endDate: sd(p.endDate),
    createdAt: sd(p.createdAt)!,
    updatedAt: sd(p.updatedAt)!,
  };
}

export function serializeVideo(v: {
  id: string; titleEs: string; titleEn: string | null;
  descriptionEs: string | null; descriptionEn: string | null;
  videoUrl: string | null; externalUrl: string | null; thumbnailUrl: string | null;
  category: string | null; isFeatured: boolean; isPublished: boolean; sortOrder: number;
  createdAt: Date | string; updatedAt: Date | string;
}): SerializedVideo {
  return {
    ...v,
    createdAt: sd(v.createdAt)!,
    updatedAt: sd(v.updatedAt)!,
  };
}

export function serializeLead(l: {
  id: string; fullName: string; phone: string; email: string | null;
  city: string | null; state: string | null; interest: string; source: string;
  status: string; message: string | null; followUpDate: Date | string | null;
  consentGiven: boolean; wantsPromos: boolean;
  utmSource: string | null; utmMedium: string | null; utmCampaign: string | null;
  utmTerm: string | null; utmContent: string | null;
  referrerUrl: string | null; landingPage: string | null;
  productId: string | null; productName: string | null;
  createdAt: Date | string; updatedAt: Date | string;
  notes?: { id: string; leadId: string; content: string; createdAt: Date | string }[];
}): SerializedLead {
  return {
    ...l,
    followUpDate: sd(l.followUpDate),
    createdAt: sd(l.createdAt)!,
    updatedAt: sd(l.updatedAt)!,
    notes: (l.notes ?? []).map((n) => ({ ...n, createdAt: sd(n.createdAt)! })),
  };
}

export function serializeBlogPost(b: {
  id: string; title: string; slug: string; content: string;
  excerpt: string | null; coverImage: string | null;
  seoTitle: string | null; seoDesc: string | null; language: string;
  isPublished: boolean; publishedAt: Date | string | null;
  createdAt: Date | string; updatedAt: Date | string;
}): SerializedBlogPost {
  return {
    ...b,
    publishedAt: sd(b.publishedAt),
    createdAt: sd(b.createdAt)!,
    updatedAt: sd(b.updatedAt)!,
  };
}
