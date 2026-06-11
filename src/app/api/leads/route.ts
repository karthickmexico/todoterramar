import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail, getAdminLeadNotificationEmail, getLeadAutoReplyEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const leadSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  interest: z.enum(["JOIN_TEAM", "BUY_PRODUCTS", "BOTH"]).default("BOTH"),
  source: z
    .enum(["GOOGLE", "FACEBOOK", "INSTAGRAM", "WHATSAPP", "REFERRAL", "OTHER"])
    .default("OTHER"),
  message: z.string().max(500).optional(),
  consent: z.boolean(),
  wantsPromos: z.boolean().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  // UTM tracking
  utmSource: z.string().max(100).optional().nullable(),
  utmMedium: z.string().max(100).optional().nullable(),
  utmCampaign: z.string().max(100).optional().nullable(),
  utmTerm: z.string().max(100).optional().nullable(),
  utmContent: z.string().max(100).optional().nullable(),
  referrerUrl: z.string().max(500).optional().nullable(),
  landingPage: z.string().max(500).optional().nullable(),
  // Honeypot
  website: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limiting: 5 submissions per minute per IP
    const { allowed } = checkRateLimit(ip, "leads", {
      maxRequests: 5,
      windowMs: 60_000,
    });

    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Por favor espera un momento." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const result = leadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    if (!data.consent) {
      return NextResponse.json(
        { error: "Se requiere aceptar el aviso de privacidad" },
        { status: 400 }
      );
    }

    // Save lead to database
    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        city: data.city || null,
        state: data.state || null,
        interest: data.interest,
        source: data.source,
        message: data.message || null,
        consentGiven: data.consent,
        wantsPromos: data.wantsPromos || false,
        productId: data.productId || null,
        productName: data.productName || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        utmTerm: data.utmTerm || null,
        utmContent: data.utmContent || null,
        referrerUrl: data.referrerUrl || null,
        landingPage: data.landingPage || null,
        status: "NEW",
      },
    });

    // Send notifications (fire and forget - don't await)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (adminEmail) {
      const { subject, html } = getAdminLeadNotificationEmail({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        city: data.city,
        state: data.state,
        interest: data.interest,
        source: data.source,
        message: data.message,
      });
      sendEmail({ to: adminEmail, subject, html }).catch(console.error);
    }

    // Auto-reply to lead if email provided
    if (data.email) {
      const { subject, html } = getLeadAutoReplyEmail({
        fullName: data.fullName,
        interest: data.interest,
      });
      sendEmail({ to: data.email, subject, html }).catch(console.error);
    }

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Admin-only endpoint
  const { searchParams } = new URL(request.url);

  try {
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const interest = searchParams.get("interest");
    const source = searchParams.get("source");
    const search = searchParams.get("q");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (interest) where.interest = interest;
    if (source) where.source = source;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { notes: { orderBy: { createdAt: "desc" }, take: 1 } },
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Leads fetch error:", error);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
