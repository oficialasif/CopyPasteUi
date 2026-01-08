"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Heart, Github, Copy, Check, Eye, Code as CodeIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CodeBlockWithLineNumbers } from "@/components/ui/CodeBlockWithLineNumbers";

interface Component {
    id: string;
    name: string;
    slug: string;
    category: string;
    description: string;
    previewCode?: string;
    previewImage?: string;
    codeTypes: Record<string, string>;
    availableCodeTypes: string[];
    // Keep old fields for type safety during migration, though we'll normalize them
    htmlCode?: string;
    tailwindCode?: string;
    reactCode?: string;
    installationCode?: string;
    usageCode?: string;
}

export default function ComponentDetailPage() {
    const params = useParams();
    const { category, slug } = params as { category: string; slug: string };
    const [component, setComponent] = useState<Component | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
    const [installTab, setInstallTab] = useState<"cli" | "manual">("cli");
    const [packageManager, setPackageManager] = useState<"pnpm" | "npm" | "yarn" | "bun">("npm");
    const [codeLanguage, setCodeLanguage] = useState<string>("React");
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
    const [expandedCode, setExpandedCode] = useState(false);

    useEffect(() => {
        const fetchComponent = async () => {
            try {
                const q = query(
                    collection(db, 'components'),
                    where('slug', '==', slug)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const data = doc.data();
                    const componentData = {
                        id: doc.id,
                        ...data,
                        ...data,
                        previewImage: data.previewImage || data.previewCode || '',
                        codeTypes: data.codeTypes || {},
                        availableCodeTypes: data.availableCodeTypes || []
                    } as Component;

                    // Backward compatibility: Populate codeTypes from old fields if missing
                    if (!componentData.codeTypes['React'] && data.reactCode) {
                        componentData.codeTypes['React'] = data.reactCode;
                        if (!componentData.availableCodeTypes.includes('React')) componentData.availableCodeTypes.push('React');
                    }
                    if (!componentData.codeTypes['HTML'] && data.htmlCode) {
                        componentData.codeTypes['HTML'] = data.htmlCode;
                        if (!componentData.availableCodeTypes.includes('HTML')) componentData.availableCodeTypes.push('HTML');
                    }
                    if (!componentData.codeTypes['Tailwind'] && data.tailwindCode) {
                        componentData.codeTypes['Tailwind'] = data.tailwindCode;
                        if (!componentData.availableCodeTypes.includes('Tailwind')) componentData.availableCodeTypes.push('Tailwind');
                    }

                    // Set initial code language
                    if (componentData.availableCodeTypes.length > 0) {
                        setCodeLanguage(componentData.availableCodeTypes[0]);
                    }

                    setComponent(componentData);
                }
            } catch (error) {
                console.error('Error fetching component:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComponent();
    }, [slug]);

    const copyToClipboard = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedStates({ ...copiedStates, [key]: true });
        setTimeout(() => {
            setCopiedStates({ ...copiedStates, [key]: false });
        }, 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full"
                />
            </div>
        );
    }

    if (!component) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[50vh] text-center"
            >
                <h2 className="text-2xl font-bold mb-2">Component Not Found</h2>
                <p className="text-muted-foreground">The component you are looking for does not exist.</p>
            </motion.div>
        );
    }

    const getInstallCommands = () => {
        if (component.installationCode) {
            const cmd = component.installationCode;
            // Basic heuristic to convert npm commands to others
            if (cmd.startsWith('npm install ') || cmd.startsWith('npm i ')) {
                const pkg = cmd.replace(/^npm (install|i) /, '');
                return {
                    npm: cmd,
                    pnpm: `pnpm add ${pkg}`,
                    yarn: `yarn add ${pkg}`,
                    bun: `bun add ${pkg}`
                };
            }
            if (cmd.startsWith('npx ')) {
                // For npx, pnpm uses dlx, bun uses x, yarn uses dlx or create
                // But simplified: keep npx for most, or try to adapt
                return {
                    npm: cmd,
                    pnpm: cmd.replace(/^npx /, 'pnpm dlx '),
                    yarn: cmd,
                    bun: cmd.replace(/^npx /, 'bun x ')
                };
            }
            // Fallback: use same command for all
            return {
                npm: cmd,
                pnpm: cmd,
                yarn: cmd,
                bun: cmd
            };
        }
        return {
            npm: `npm install ${component.slug}`,
            pnpm: `pnpm add ${component.slug}`,
            yarn: `yarn add ${component.slug}`,
            bun: `bun add ${component.slug}`
        };
    };

    const installCommands = getInstallCommands();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl mx-auto space-y-6 pb-20 px-4 pt-4"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between sticky top-0 z-10 bg-[#050505]/95 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-white/5"
            >
                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab("preview")}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                            activeTab === "preview"
                                ? "bg-white/10 text-white shadow-lg shadow-white/5"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab("code")}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                            activeTab === "code"
                                ? "bg-white/10 text-white shadow-lg shadow-white/5"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <CodeIcon className="w-4 h-4" />
                        Code
                    </motion.button>
                </div>

                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 border border-white/10"
                    >
                        <Heart className="w-4 h-4" />
                        <span className="hidden sm:inline">Like</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300 border border-white/10"
                    >
                        <Github className="w-4 h-4" />
                        <span className="hidden sm:inline">Contribute</span>
                    </motion.button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {activeTab === "preview" ? (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl"
                        >
                            <div className="p-0 bg-[#0A0A0A] flex items-center justify-center min-h-[400px] w-full overflow-hidden relative">
                                {(() => {
                                    const url = component.previewImage || component.previewCode;
                                    if (!url) return <div className="text-zinc-500 font-medium">No preview available</div>;

                                    // Google Drive (Auto-convert view/sharing links to preview)
                                    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);

                                    // YouTube
                                    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);

                                    // Dropbox
                                    const dropboxMatch = url.match(/dropbox\.com\/.+/);

                                    // Render Logic
                                    if (driveMatch) {
                                        // Try video tag first for clean look, fall back to iframe if it fails (common with Drive)
                                        const videoUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;

                                        return (
                                            <div className="w-full h-full flex items-center justify-center bg-black">
                                                <iframe
                                                    src={`https://drive.google.com/file/d/${driveMatch[1]}/preview`}
                                                    className="w-full h-[500px] border-0"
                                                    allow="autoplay"
                                                />
                                            </div>
                                        );
                                    }

                                    if (youtubeMatch) {
                                        return (
                                            <iframe
                                                src={`https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeMatch[1]}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
                                                className="w-full h-[500px] border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        );
                                    }

                                    if (dropboxMatch) {
                                        const rawUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
                                        return (
                                            <video
                                                src={rawUrl}
                                                className="w-full max-h-[600px] object-contain"
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                            />
                                        );
                                    }

                                    // Generic Video file (MP4, WebM, Ogg) - supports Firebase Storage URLs
                                    if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
                                        return (
                                            <video
                                                src={url}
                                                className="w-full max-h-[600px] object-contain"
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                            />
                                        );
                                    }

                                    // Default to Image (and handle HTML code fallback if it's actually code)
                                    // Check if it looks like HTML (starts with <)
                                    if (url.trim().startsWith('<')) {
                                        return <div dangerouslySetInnerHTML={{ __html: url }} className="w-full p-8 bg-[#0A0A0A]" />;
                                    }

                                    return (
                                        <img
                                            src={url}
                                            alt={component.name}
                                            className="w-full h-auto max-h-[600px] object-contain"
                                        />
                                    );
                                })()}
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="code"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        {/* Install Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-3"
                        >
                            <h2 className="text-2xl font-bold text-white tracking-tight">Install</h2>
                            <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-xl">
                                <div className="flex items-center justify-between p-4 border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setInstallTab("cli")}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                                                installTab === "cli"
                                                    ? "bg-white/10 text-white"
                                                    : "text-zinc-400 hover:text-white"
                                            )}
                                        >
                                            CLI
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setInstallTab("manual")}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                                                installTab === "manual"
                                                    ? "bg-white/10 text-white"
                                                    : "text-zinc-400 hover:text-white"
                                            )}
                                        >
                                            Manual
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        {(["pnpm", "npm", "yarn", "bun"] as const).map((pm, idx) => (
                                            <motion.button
                                                key={pm}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setPackageManager(pm)}
                                                className={cn(
                                                    "px-3 py-1 rounded text-xs font-medium transition-all duration-200",
                                                    packageManager === pm
                                                        ? "text-white underline underline-offset-4"
                                                        : "text-zinc-500 hover:text-zinc-300"
                                                )}
                                            >
                                                {pm}
                                            </motion.button>
                                        ))}
                                    </div>

                                    <motion.div
                                        layout
                                        className="relative rounded-xl bg-[#050505] border border-white/5 p-4 group overflow-x-auto no-scrollbar"
                                    >
                                        <code className="text-sm text-zinc-300 font-mono">
                                            {installCommands[packageManager]}
                                        </code>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => copyToClipboard(installCommands[packageManager], 'install')}
                                            className="absolute right-3 top-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
                                        >
                                            <AnimatePresence mode="wait">
                                                {copiedStates['install'] ? (
                                                    <motion.div
                                                        key="check"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                    >
                                                        <Check className="w-4 h-4 text-green-400" />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="copy"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                    >
                                                        <Copy className="w-4 h-4 text-zinc-400" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Usage Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-3"
                        >
                            <h2 className="text-2xl font-bold text-white tracking-tight">Usage</h2>
                            <CodeBlockWithLineNumbers
                                code={component.usageCode || `import ${component.name.replace(/\s+/g, '')} from './${component.slug}';

<${component.name.replace(/\s+/g, '')}
  // Add your props here
/>`}
                                language="jsx"
                            />
                        </motion.div>

                        {/* Code Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-3"
                        >
                            <h2 className="text-2xl font-bold text-white tracking-tight">Code</h2>

                            {/* Language Tabs */}
                            {/* Language Tabs */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {component.availableCodeTypes.map((lang, idx) => (
                                    <motion.button
                                        key={lang}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + idx * 0.05 }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCodeLanguage(lang)}
                                        className={cn(
                                            "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border",
                                            codeLanguage === lang
                                                ? "bg-white/10 text-white border-white/20 shadow-lg shadow-white/5"
                                                : "text-zinc-400 hover:text-white border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        {lang}
                                    </motion.button>
                                ))}{component.availableCodeTypes.length === 0 && (
                                    <div className="text-zinc-500 text-sm">No code available</div>
                                )}
                            </div>

                            {/* Code Display */}
                            <motion.div
                                layout
                                className="relative"
                            >
                                <div className={cn(
                                    "transition-all duration-300",
                                    !expandedCode && "max-h-[500px] overflow-hidden relative"
                                )}>
                                    <CodeBlockWithLineNumbers
                                        code={component.codeTypes[codeLanguage] || "// Code not available"}
                                        language={codeLanguage.toLowerCase()}
                                    />

                                    {!expandedCode && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none"
                                        />
                                    )}
                                </div>

                                {!expandedCode && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setExpandedCode(true)}
                                        className="mt-4 w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        Expand Snippet
                                        <ChevronDown className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
