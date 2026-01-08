"use client";

import Squares from "./Squares";

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#0a0a0a]">
            <Squares
                speed={0.5}
                squareSize={40}
                direction='diagonal'
                borderColor='#333'
                hoverFillColor='#222'
            />
            {/* Soft vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />
        </div>
    );
}
