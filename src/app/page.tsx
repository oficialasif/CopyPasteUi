"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, Layers, Zap, Copy as CopyIcon, Layout, Monitor, Github, Sparkles, Box, Palette, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      // @ts-ignore - Spring type is valid in framer-motion but TS definition can be strict
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const features = [
    { icon: <CopyIcon className="w-5 h-5 text-indigo-400" />, title: "Copy & Paste", desc: "Simply copy the code and paste it into your project. No dependencies to install.", colSpan: "col-span-1" },
    { icon: <Layers className="w-5 h-5 text-purple-400" />, title: "Component Based", desc: "Modular architecture. Use only what you need, leave the bloat.", colSpan: "col-span-1 md:col-span-2" },
    { icon: <Zap className="w-5 h-5 text-yellow-500" />, title: "Fully Customizable", desc: "Built with Tailwind CSS. Easily adapt components to your brand.", colSpan: "col-span-1" },
    { icon: <Layout className="w-5 h-5 text-emerald-400" />, title: "Responsive", desc: "Every component is fully responsive and mobile-first.", colSpan: "col-span-1" },
    { icon: <Monitor className="w-5 h-5 text-blue-400" />, title: "Dark Mode", desc: "Built-in support for light and dark modes out of the box.", colSpan: "col-span-1 md:col-span-2" },
    { icon: <Code2 className="w-5 h-5 text-purple-500" />, title: "Framework Ready", desc: "Get code for React, HTML/CSS, and Tailwind.", colSpan: "col-span-1 md:col-span-3" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black selection:bg-purple-500/30 selection:text-purple-200 relative overflow-hidden">

      {/* Interactive Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base Grid - Darker */}
        <div
          className="absolute inset-0 z-0 opacity-[0.15]"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Spotlight Reveal Grid - Colored */}
        <div
          className="absolute inset-0 z-10 opacity-50"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
            WebkitMaskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`
          }}
        />
      </div>

      <Navbar />

      <main className="flex-1 w-full flex flex-col items-center overflow-x-hidden relative z-10">

        {/* Hero Section */}
        <section className="w-full pt-48 pb-24 px-4 flex flex-col items-center justify-center text-center relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-200 mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span>v1.0 is now live!</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 max-w-5xl leading-[0.9] text-white"
            >
              Copy. Paste. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">Build Faster.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mb-12 leading-relaxed"
            >
              A free, open-source collection of beautiful UI components built with Tailwind CSS.
              Ready to drop into your Next.js projects to speed up development.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link href="/components">
                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 font-semibold text-base shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95">
                  Browse Components <Layers className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="https://github.com/Start-Up-Consultant-Services/CopyPasteUi" target="_blank">
                <Button size="lg" variant="ghost" className="h-14 px-8 rounded-full text-white border border-white/10 hover:bg-white/5 transition-all">
                  <Github className="w-5 h-5 mr-2" /> GitHub Repo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Built for Shipping Section */}
        <section className="w-full py-24 px-4 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6"
              >
                <Sparkles className="w-3 h-3" /> Production Ready
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Shipping</span></h2>
              <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
                Stop wasting time on boilerplate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[250px]">
              {/* Card 1: Components Count - Resized to row-span-1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="col-span-1 md:col-span-2 row-span-1 relative overflow-hidden rounded-3xl border border-white/10 bg-[#050505] p-8 flex items-center justify-between group hover:border-purple-500/50 transition-colors duration-500"
              >
                {/* Colorful Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-100" />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

                <div className="relative z-10 flex flex-col justify-center h-full">
                  <h3 className="text-7xl font-bold font-mono text-white tracking-tighter mb-2">110+</h3>
                  <p className="text-xl font-medium text-purple-200">Creative Components</p>
                </div>

                <div className="relative z-10 opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                  <Box className="w-40 h-40 text-purple-500" />
                </div>
              </motion.div>

              {/* Card 2: Terminal/Deployment Visual - Resized to row-span-1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="col-span-1 md:col-span-2 row-span-1 relative overflow-hidden rounded-3xl border border-white/10 bg-[#050505] p-6 group hover:border-indigo-500/50 transition-colors duration-500 flex flex-col"
              >
                {/* Colorful Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-100" />

                <div className="relative z-10 w-full mb-4">
                  <div className="w-full h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2 rounded-t-lg">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                </div>

                <div className="font-mono text-sm text-zinc-400 space-y-2 relative z-10 overflow-hidden">
                  <p><span className="text-indigo-400">➜</span>  <span className="text-purple-400">~</span> npx install copypaste-ui</p>
                  <div className="flex items-center gap-3">
                    <p className="text-green-400">✔ Added 12 components</p>
                    <div className="h-1.5 w-24 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                  </div>
                  <p className="text-zinc-500 text-xs">Build finished in 0.42s</p>
                </div>
              </motion.div>

              {/* Card 3: Variants - 1 col */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="col-span-1 row-span-1 relative overflow-hidden rounded-3xl border border-white/10 bg-[#050505] p-8 flex flex-col justify-between group hover:border-pink-500/50 transition-colors duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-transparent opacity-100" />
                <Palette className="w-10 h-10 text-pink-400 mb-4" />
                <div>
                  <h3 className="text-4xl font-bold text-white mb-1">4</h3>
                  <p className="text-pink-200/70 text-sm">Variants Available</p>
                </div>
              </motion.div>

              {/* Card 4: Open Source - 2 col */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -5 }}
                className="col-span-1 md:col-span-2 row-span-1 relative overflow-hidden rounded-3xl border border-white/10 bg-[#050505] p-8 flex items-center justify-between group hover:border-emerald-500/50 transition-colors duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-transparent to-transparent opacity-100" />

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-white mb-2">Open Source</h3>
                  <p className="text-emerald-200/70 text-sm text-balance">Completely free for personal and commercial use.</p>
                </div>
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-lg shadow-emerald-500/10">
                  <Github className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* Card 5: Tools - 1 col */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -5 }}
                className="col-span-1 row-span-1 relative overflow-hidden rounded-3xl border border-white/10 bg-[#050505] p-8 flex flex-col justify-between group hover:border-blue-500/50 transition-colors duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent opacity-100" />
                <Wrench className="w-10 h-10 text-blue-400 mb-4" />
                <div>
                  <h3 className="text-4xl font-bold text-white mb-1">3</h3>
                  <p className="text-blue-200/70 text-sm">Essential Tools</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid - Redesigned */}
        <section className="w-full py-24 px-4 bg-zinc-900/20 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16 gap-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why CopyPasteUI?</h2>
                <p className="text-zinc-400 max-w-xl mx-auto text-lg text-balance">
                  We didn't just build components. We built a workflow enhancement system.
                </p>
              </div>
            </div>

            {/* Features List - Stylish Text Based */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ staggerChildren: 0.1 }}
              className="flex flex-wrap justify-center gap-x-12 gap-y-10 max-w-6xl mx-auto"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
                    visible: { opacity: 1, scale: 1, filter: "blur(0px)" }
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="group flex flex-col items-center text-center w-full sm:w-[calc(50%-24px)] lg:w-[calc(33.33%-32px)]"
                >
                  <div className="mb-4 inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-white/10 group-hover:border-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-500/0 group-hover:shadow-purple-500/20">
                    {feature.icon as React.ReactNode}
                  </div>

                  <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400 group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-zinc-500 text-sm leading-relaxed max-w-xs group-hover:text-zinc-300 transition-colors">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 px-4 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto relative rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-b from-[#111] to-black p-8 md:p-12 text-center"
          >
            {/* Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to speed up your workflow?</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Browse our library of fully responsive, accessible, and customizable components.
                It's completely free.
              </p>

              <Link href="/components">
                <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20 text-base font-semibold">
                  Start Building Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
