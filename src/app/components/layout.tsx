import { Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Sponsors } from "@/components/layout/Sponsors";

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen flex flex-col bg-[#050505]">
            <Navbar />
            <div className="flex flex-1 container mx-auto px-4 pt-20 h-full gap-6 overflow-hidden">
                <Suspense fallback={<div className="hidden lg:block w-64 border-r border-border h-full sticky top-0 p-6" />}>
                    <aside className="hidden lg:block w-64 shrink-0 h-full overflow-y-auto no-scrollbar pb-10">
                        <Sidebar />
                    </aside>
                </Suspense>

                <main className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden no-scrollbar w-full min-w-0 relative">
                    {children}
                </main>

                <aside className="hidden xl:block w-64 shrink-0 h-full overflow-y-auto no-scrollbar pb-10">
                    <Sponsors />
                </aside>
            </div>
        </div>
    );
}
