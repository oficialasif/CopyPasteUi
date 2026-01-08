"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Layout, MousePointer2, Type, Box, Square, Layers, MessageSquare, DollarSign, HelpCircle, Columns } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
}

interface Component {
    id: string;
    name: string;
    slug: string;
    category: string;
    badge?: 'new' | 'updated' | null;
    isComingSoon?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
    Layout,
    MousePointer2,
    Type,
    Box,
    Square,
    Layers,
    MessageSquare,
    DollarSign,
    HelpCircle,
    Columns
};

export function Sidebar({ className }: { className?: string }) {
    const searchParams = useSearchParams();
    const currentSlug = searchParams.get("component");
    const [categories, setCategories] = useState<Category[]>([]);
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const categoriesSnap = await getDocs(collection(db, 'categories'));
                const categoriesData = categoriesSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Category[];
                setCategories(categoriesData);

                const componentsSnap = await getDocs(collection(db, 'components'));
                const componentsData = componentsSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Component[];
                setComponents(componentsData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getComponentsForCategory = (categorySlug: string) => {
        return components.filter(c => c.category === categorySlug);
    };

    if (loading) {
        return (
            <div className={cn("space-y-4", className)}>
                <div className="animate-pulse space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 bg-white/5 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* All Components Link */}
            <div>
                <Link
                    href="/components"
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        !currentSlug
                            ? "bg-white/10 text-white font-medium"
                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Layers className="w-4 h-4" />
                    All Components
                </Link>
            </div>

            {/* Categories with Components */}
            {categories.map((category, index) => {
                const categoryComponents = getComponentsForCategory(category.slug);

                if (categoryComponents.length === 0) return null;

                return (
                    <div key={category.id} className="space-y-1">
                        {/* Thin separator line between categories */}
                        {index > 0 && (
                            <div className="h-px bg-white/5 my-2" />
                        )}

                        {/* Category Header (Non-clickable) */}
                        <div className="px-3 py-1">
                            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
                                {category.name}
                            </h3>
                        </div>

                        {/* Component List (Always visible) */}
                        <div className="space-y-0.5 pl-[1px] border-l border-white/5">
                            {categoryComponents.map((component) => {
                                const isActive = currentSlug === component.slug;
                                const isDisabled = component.isComingSoon;

                                return (
                                    <Link
                                        key={component.id}
                                        href={isDisabled ? '#' : `/components/${category.slug}/${component.slug}`}
                                        className={cn(
                                            "group flex items-center justify-between pl-4 pr-3 py-2.5 text-[13px] transition-all duration-200 relative",
                                            isActive && "text-white font-medium",
                                            !isActive && !isDisabled && "text-zinc-400 hover:text-white",
                                            isDisabled && "text-zinc-700 cursor-not-allowed opacity-50"
                                        )}
                                        onClick={(e) => isDisabled && e.preventDefault()}
                                    >
                                        {/* Left Border Indicator */}
                                        <div className={cn(
                                            "absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-200",
                                            isActive ? "bg-indigo-500" : "bg-transparent group-hover:bg-zinc-600"
                                        )} />

                                        <span className={cn(
                                            "flex-1 transition-transform duration-200",
                                            !isDisabled && "group-hover:translate-x-0.5"
                                        )}>
                                            {component.name}
                                        </span>

                                        {/* Badges */}
                                        {component.badge === 'new' && (
                                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-400 border border-blue-500/40">
                                                New
                                            </span>
                                        )}
                                        {component.badge === 'updated' && (
                                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-400 border border-purple-500/40">
                                                Updated
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
