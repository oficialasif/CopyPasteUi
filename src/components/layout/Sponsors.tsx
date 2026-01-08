import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Star } from "lucide-react";

export function Sponsors() {
    return (
        <div className="w-full h-full pl-6 border-l border-white/5">
            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-2">Our Sponsors</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Help us maintain and grow CopyPasteUI, keeping it free for devs worldwide.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Diamond</h4>
                    <div className="space-y-3">
                        <div className="bg-[#111] border border-white/10 rounded-lg p-4 hover:border-primary/50 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                                    <Star className="w-3 h-3 text-primary fill-primary" />
                                </div>
                                <span className="font-bold text-sm">DevScale</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Scale your dev team instantly.</p>
                        </div>
                        <div className="bg-[#111] border border-white/10 rounded-lg p-4 hover:border-primary/50 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                </div>
                                <span className="font-bold text-sm">CloudFlow</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Serverless simplified.</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Platinum <span className="ml-2 font-normal text-[10px] opacity-70">2 spots left</span></h4>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <Button className="w-full bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                        Become a Sponsor
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                        Get your brand in front of 50k+ devs.
                    </p>
                </div>
            </div>
        </div>
    );
}
