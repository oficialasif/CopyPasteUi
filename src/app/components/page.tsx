"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { getComponents, seedComponents, ComponentData } from "@/lib/services";
// import { components } from "@/lib/components-data"; // Removed static data import
import { Card } from "@/components/ui/Card";
import { Code2, ArrowRight, Search, Play, Sparkles, Heart } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useLikes } from "@/contexts/LikesContext";

// Category style mapping
const categoryStyles: Record<string, { color: string; border: string; bg: string; glow: string }> = {
    navbar: { color: "text-blue-400", border: "hover:border-blue-500/40", bg: "bg-blue-500/10", glow: "to-blue-500/20" },
    hero: { color: "text-indigo-400", border: "hover:border-indigo-500/40", bg: "bg-indigo-500/10", glow: "to-indigo-500/20" },
    footers: { color: "text-purple-400", border: "hover:border-purple-500/40", bg: "bg-purple-500/10", glow: "to-purple-500/20" },
    buttons: { color: "text-pink-400", border: "hover:border-pink-500/40", bg: "bg-pink-500/10", glow: "to-pink-500/20" },
    cards: { color: "text-rose-400", border: "hover:border-rose-500/40", bg: "bg-rose-500/10", glow: "to-rose-500/20" },
    stats: { color: "text-orange-400", border: "hover:border-orange-500/40", bg: "bg-orange-500/10", glow: "to-orange-500/20" },
    testimonials: { color: "text-green-400", border: "hover:border-green-500/40", bg: "bg-green-500/10", glow: "to-green-500/20" },
    pricing: { color: "text-emerald-400", border: "hover:border-emerald-500/40", bg: "bg-emerald-500/10", glow: "to-emerald-500/20" },
    faq: { color: "text-teal-400", border: "hover:border-teal-500/40", bg: "bg-teal-500/10", glow: "to-teal-500/20" },
    modals: { color: "text-cyan-400", border: "hover:border-cyan-500/40", bg: "bg-cyan-500/10", glow: "to-cyan-500/20" },
};

const defaultStyle = { color: "text-violet-400", border: "hover:border-violet-500/40", bg: "bg-violet-500/10", glow: "to-violet-500/20" };

// Simplified Spotlight Card with cleaner dark theme
// Simplified Spotlight Card with cleaner dark theme - REMOVED


function ComponentsList() {
    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const [fetchedComponents, setFetchedComponents] = useState<ComponentData[]>([]);
    const [loading, setLoading] = useState(true);
    const { toggleLike, isLiked, getTotalLikes, getLikeCount, fetchLikeCount } = useLikes();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Seed if necessary (safe to call, service checks duplicates)
                await seedComponents();
                const data = await getComponents();
                console.log("Fetched components:", data);
                console.log("Number of components:", data.length);
                setFetchedComponents(data);
            } catch (error) {
                console.error("Failed to load components", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filtered = fetchedComponents
        .filter(c => category ? c.category.toLowerCase() === category.toLowerCase() : true)
        .filter(c => searchQuery ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) : true);

    console.log("Filtered components:", filtered);
    console.log("Loading state:", loading);
    console.log("Category filter:", category);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", damping: 20 } as any
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* Fixed Header Section */}
            <div className="shrink-0 pb-6 pt-4 pr-2">
                {/* Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl border border-white/10 p-8 mb-8 flex items-center justify-between shadow-2xl group"
                >
                    {/* Animated Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-xy blur-xl opacity-50 transition-opacity duration-500 group-hover:opacity-80" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 uppercase tracking-wider">
                                New
                            </span>
                            <h2 className="text-2xl font-bold text-white">CopyPasteUI Pro</h2>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition-colors cursor-pointer">
                            <span className="text-sm">Get lifetime access to premium components</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/20 hover:border-white/30 transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]"
                    >
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    </motion.div>
                </motion.div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-extrabold tracking-tight text-white mb-1"
                        >
                            All Components
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-muted-foreground text-sm"
                        >
                            {filtered.length} components ready to ship.
                        </motion.p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search components..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-[#111] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 w-64 text-white placeholder:text-zinc-600 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 overflow-y-auto pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pr-2 relative"
            >
                {/* Clean Dark Background (No global wash) - matching sidebar */}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                style={{
                                    height: '320px',
                                    backgroundColor: '#1a1625',
                                    border: '1px solid #2d2640',
                                    borderRadius: '16px'
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((component) => (
                            <Link
                                key={component.id}
                                href={`/components/${component.category}/${component.slug}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div
                                    style={{
                                        height: '320px',
                                        backgroundColor: '#1a1625',
                                        border: '1px solid #2d2640',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4d4060'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2d2640'}
                                >
                                    {/* Header */}
                                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{
                                                color: '#ffffff',
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                margin: '0 0 4px 0'
                                            }}>
                                                {component.name}
                                            </h3>
                                            <p style={{
                                                color: '#a1a1aa',
                                                fontSize: '14px',
                                                margin: 0,
                                                textTransform: 'capitalize'
                                            }}>
                                                {component.category}
                                            </p>
                                        </div>

                                        {/* Like Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleLike(component.id);
                                            }}
                                            onMouseEnter={() => fetchLikeCount(component.id)}
                                            style={{
                                                background: isLiked(component.id) ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                                                border: '1px solid',
                                                borderColor: isLiked(component.id) ? '#ef4444' : '#3f3f46',
                                                borderRadius: '20px',
                                                cursor: 'pointer',
                                                padding: '6px 12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                color: isLiked(component.id) ? '#ef4444' : '#a1a1aa',
                                                transition: 'all 0.2s',
                                                fontSize: '13px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            <Heart
                                                style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    fill: isLiked(component.id) ? '#ef4444' : 'none',
                                                    transition: 'all 0.3s',
                                                    transform: isLiked(component.id) ? 'scale(1.1)' : 'scale(1)'
                                                }}
                                            />
                                            <span style={{
                                                transition: 'all 0.3s',
                                                transform: isLiked(component.id) ? 'scale(1.1)' : 'scale(1)'
                                            }}>
                                                {getLikeCount(component.id) || 0}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Preview Area */}
                                    <div style={{
                                        height: '220px',
                                        backgroundColor: '#000000',
                                        margin: '0 12px 12px 12px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Code2 style={{ width: '48px', height: '48px', color: '#52525b' }} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {filtered.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-muted-foreground"
                    >
                        <Sparkles className="w-12 h-12 text-indigo-500/20 mb-4" />
                        <p>No components found. Try adjusting your search.</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default function ComponentsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ComponentsList />
        </Suspense>
    );
}
