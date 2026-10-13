"use client";

import Script from "next/script";

export function Analytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

    return (
        <>
            {/* Google Analytics 4 Script */}
            {gaId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${gaId}', {
                                page_path: window.location.pathname,
                            });
                        `}
                    </Script>
                </>
            )}

            {/* Meta Pixel Script */}
            {metaPixelId && (
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
                        fbq('init', '${metaPixelId}');
                        fbq('track', 'PageView');
                    `}
                </Script>
            )}

            {/* TikTok Pixel Script */}
            {tiktokPixelId && (
                <Script id="tiktok-pixel" strategy="afterInteractive">
                    {`
                        !function (w, d, t) {
                            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                            ttq.load('${tiktokPixelId}');
                            ttq.page();
                        }(window, document, 'ttq');
                    `}
                </Script>
            )}
        </>
    );
}

/**
 * Functie universala de tracking pentru evenimente browser (GA4, Meta Pixel si TikTok)
 */
export const trackEvent = (
    eventName: string,
    params?: Record<string, unknown>,
    eventId?: string
) => {
    if (typeof window === "undefined") return;

    const win = window as unknown as {
        gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
        fbq?: (
            command: string,
            action: string,
            params?: Record<string, unknown>,
            options?: { eventID?: string }
        ) => void;
        ttq?: {
            track: (action: string, params?: Record<string, unknown>, options?: { event_id?: string }) => void;
        };
    };

    // Google Analytics 4
    if (win.gtag) {
        win.gtag("event", eventName, { ...params, transaction_id: eventId });
    }

    // Meta Pixel cu Event Deduplication (eventID)
    if (win.fbq) {
        if (eventId) {
            win.fbq("track", eventName, params, { eventID: eventId });
        } else {
            win.fbq("track", eventName, params);
        }
    }

    // TikTok Pixel
    if (win.ttq) {
        win.ttq.track(eventName, params, eventId ? { event_id: eventId } : undefined);
    }
};
