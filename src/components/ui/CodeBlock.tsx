"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "./Button";

export function CodeBlock({ code, language = "jsx" }: { code: string, language?: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative rounded-lg overflow-hidden border border-border bg-[#1e1e1e]">
            <div className="absolute right-2 top-2 z-10">
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                    onClick={copyToClipboard}
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: "1.5rem", background: "transparent", fontSize: "0.875rem", lineHeight: "1.5" }}
                wrapLines={true}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
