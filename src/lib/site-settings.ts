import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SETTINGS } from "@/lib/constants";

export type SiteSettings = typeof DEFAULT_SETTINGS;

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((s) => [s.key, s.value]));
    return { ...DEFAULT_SETTINGS, ...map } as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
});
