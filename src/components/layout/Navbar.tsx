"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LayoutGrid, Home, Github, Terminal, Heart } from "lucide-react";
import { useLikes } from "@/contexts/LikesContext";

export function Navbar() {
    const pathname = usePathname();
    const { getTotalLikes, mounted } = useLikes();

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Components", href: "/components", icon: LayoutGrid },
    ];

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="pointer-events-auto mx-4 w-full max-w-3xl rounded-full border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl supports-[backdrop-filter]:bg-[#0a0a0a]/60"
            >
                <div className="flex h-12 items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-lg transition-transform group-hover:scale-110">
                            C
                            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="hidden font-bold sm:inline-block text-white">CopyPasteUI</span>
                    </Link>

                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                                        isActive
                                            ? "text-white"
                                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 rounded-full bg-white/10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <item.icon className="w-4 h-4" />
                                    <span className="hidden sm:inline-block">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                        <ThemeToggle />

                        {/* Likes Counter - Pill Style */}
                        {mounted && (
                            <div
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 transition-all hover:bg-red-500/20 hover:border-red-500/50"
                                style={{ cursor: 'default' }}
                            >
                                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                                <span className="text-red-500 text-sm font-semibold">
                                    {getTotalLikes()}
                                </span>
                            </div>
                        )}

                        <Link
                            href="https://github.com/oficialasif"
                            target="_blank"
                            className="p-2 transition-colors text-muted-foreground hover:text-white hover:bg-white/10 rounded-full"
                            aria-label="GitHub"
                        >
                            <Github className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </motion.header>
        </div>
    );
}
