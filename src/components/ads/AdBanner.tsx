"use client";

import { useEffect } from "react";

interface AdBannerProps {
    dataAdSlot: string;
    dataAdFormat?: "auto" | "fluid" | "rectangle";
    dataFullWidthResponsive?: boolean;
    className?: string;
}

export function AdBanner({
    dataAdSlot,
    dataAdFormat = "auto",
    dataFullWidthResponsive = true,
    className
}: AdBannerProps) {

    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div className={`w-full overflow-hidden text-center my-4 ${className}`}>
            <span className="text-xs text-muted-foreground/50 block mb-1 uppercase tracking-widest">Advertisement</span>
            <ins
                className="adsbygoogle block bg-muted/30 min-h-[100px] flex items-center justify-center rounded-lg border border-border/50"
                style={{ display: "block" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXX" // TODO: Replace with actual Publisher ID
                data-ad-slot={dataAdSlot}
                data-ad-format={dataAdFormat}
                data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}
            >
                {/* Placeholder for development */}
                {process.env.NODE_ENV === 'development' && (
                    <span className="text-xs text-muted-foreground p-4">
                        AdSense Placeholder {dataAdSlot}
                    </span>
                )}
            </ins>
        </div>
    );
}
