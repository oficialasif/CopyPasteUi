import Link from "next/link";
import { Github, Twitter, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Footer() {
    return (
        <footer className="w-full bg-black border-t border-white/10 pt-20 pb-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-2 w-fit">
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-lg text-white">
                                C
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                CopyPasteUI
                            </span>
                        </Link>
                        <p className="text-zinc-400 leading-relaxed max-w-sm">
                            Beautiful, accessible, and high-performance React components built with Tailwind CSS. Copy, paste, and ship faster.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="https://twitter.com" target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all hover:scale-110">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="https://github.com/Start-Up-Consultant-Services/CopyPasteUi" target="_blank" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all hover:scale-110">
                                <Github className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h3 className="font-semibold text-white">Product</h3>
                        <div className="flex flex-col gap-3 text-sm text-zinc-400">
                            <Link href="/components" className="hover:text-indigo-400 transition-colors w-fit">Components</Link>
                            <Link href="#" className="hover:text-indigo-400 transition-colors w-fit">Templates</Link>
                            <Link href="#" className="hover:text-indigo-400 transition-colors w-fit">Showcase</Link>
                        </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h3 className="font-semibold text-white">Resources</h3>
                        <div className="flex flex-col gap-3 text-sm text-zinc-400">
                            <Link href="#" className="hover:text-indigo-400 transition-colors w-fit">Documentation</Link>
                            <Link href="#" className="hover:text-indigo-400 transition-colors w-fit">Blog</Link>
                            <Link href="#" className="hover:text-indigo-400 transition-colors w-fit">Changelog</Link>
                        </div>
                    </div>

                    {/* Newsletter/Updates Column */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <h3 className="font-semibold text-white">Stay Updated</h3>
                        <p className="text-sm text-zinc-400 mb-2">Get the latest components and updates right to your inbox.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                            <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-zinc-500 text-sm">
                        &copy; {new Date().getFullYear()} CopyPasteUI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-sm text-zinc-500">
                        <span>Made by</span>
                        <a href="https://github.com/oficialasif" target="_blank" className="text-white hover:underline decoration-indigo-500 font-medium">
                            Cholo JS
                        </a>
                    </div>
                </div>

                {/* Big Watermark Text */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
                    <span className="text-[12rem] md:text-[18rem] font-bold leading-none tracking-tighter whitespace-nowrap">
                        CopyPasteUI
                    </span>
                </div>
            </div>
        </footer>
    );
}
