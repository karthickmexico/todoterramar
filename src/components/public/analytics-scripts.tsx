"use client";

import Script from "next/script";

interface AnalyticsScriptsProps {
  gaId?: string;
  metaPixelId?: string;
  gscVerification?: string;
}

export function AnalyticsScripts({
  gaId,
  metaPixelId,
}: AnalyticsScriptsProps) {
  const resolvedGaId = gaId || process.env.NEXT_PUBLIC_GA_ID;
  const resolvedPixelId = metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {resolvedGaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${resolvedGaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${resolvedGaId}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {resolvedPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${resolvedPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
