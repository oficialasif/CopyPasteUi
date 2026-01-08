"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function StickyAd() {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg p-2 md:hidden">
            <div className="relative flex items-center justify-center min-h-[50px]">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 -top-2 h-6 w-6 rounded-full bg-background border shadow-sm"
                    onClick={() => setVisible(false)}
                >
                    <X className="w-3 h-3" />
                </Button>
                {/* AdSense Unit */}
                <ins
                    className="adsbygoogle inline-block w-[320px] h-[50px] bg-muted/50"
                    style={{ display: "inline-block", width: "320px", height: "50px" }}
                    data-ad-client="ca-pub-XXXXXXXXXXXXXX"
                    data-ad-slot="STICKY_SLOT_ID"
                />
                {process.env.NODE_ENV === 'development' && (
                    <span className="text-xs text-muted-foreground">Mobile Sticky Ad</span>
                )}
            </div>
        </div>
    );
}
