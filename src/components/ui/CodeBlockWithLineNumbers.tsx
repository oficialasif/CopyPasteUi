import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CodeBlockWithLineNumbersProps {
    code: string;
    language?: string;
    showCopy?: boolean;
}

export function CodeBlockWithLineNumbers({
    code,
    language = "javascript",
    showCopy = true
}: CodeBlockWithLineNumbersProps) {
    const [copied, setCopied] = useState(false);

    const lines = code.split('\n');

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative">
            <pre className="p-6 overflow-x-auto no-scrollbar bg-[#050505] rounded-xl border border-white/5">
                <code className="text-[15px] font-mono leading-relaxed">
                    {lines.map((line, index) => (
                        <div key={index} className="flex">
                            {/* Line Number */}
                            <span className="select-none text-zinc-600 mr-6 text-right w-8 shrink-0">
                                {index + 1}
                            </span>
                            {/* Code Line */}
                            <span className="text-zinc-300 flex-1">
                                {line || ' '}
                            </span>
                        </div>
                    ))}
                </code>
            </pre>

            {showCopy && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={copyToClipboard}
                    className="absolute right-4 top-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 z-10"
                >
                    <AnimatePresence mode="wait">
                        {copied ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
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
            )}
        </div>
    );
}
