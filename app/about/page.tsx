"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { 
  Brain, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  ArrowRightLeft, 
  Workflow, 
  Database, 
  Search, 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image"; // Keep for when you add real images

// --- Utility Components ---

/**
 * A reusable placeholder for where images/videos should go.
 * It describes the visual intent.
 */
function VisualPlaceholder({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <div className="group relative flex h-full min-h-[320px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface-solid/50 p-8 text-center transition-colors hover:bg-surface-solid/80">
      <div className="z-10 flex flex-col items-center">
        <div className="mb-4 rounded-full bg-accent/10 p-4 text-accent">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
        <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
      </div>
      {/* Subtle grid pattern in background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </div>
  );
}

/**
 * Wrapper for scroll animations
 */
function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

// --- Main Page Component ---

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax transforms
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <div ref={containerRef} className="relative overflow-hidden text-foreground">
      
      {/* 1. Background Blobs (Matches Hero.tsx) */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute -left-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] blur-[100px] aurora-blob" />
        <div className="absolute -right-[10%] top-[40%] h-[600px] w-[600px] rounded-full bg-[color-mix(in_oklab,var(--foreground)_5%,transparent)] blur-[100px] aurora-blob" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-16 md:pt-24">
        
        {/* 2. Intro Section */}
        <section className="mx-auto max-w-3xl text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-normal text-muted-foreground">
              Our Vision
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl mb-6">
              You aren't losing your memory. <br />
              <span className="text-muted-foreground">You're missing a system.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The world is drowning in information. Free your biological brain from the burden of remembering everything. Let it focus on creating, not storing.
            </p>
          </motion.div>
        </section>

        {/* 3. Mission Section (Grid Layout) */}
        <FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
            <div className="order-2 md:order-1 space-y-6">
              <h2 className="text-3xl font-semibold tracking-tight">From Chaos to Cathedral</h2>
              <p className="text-muted-foreground leading-7">
                Most notes apps are warehouses—static, dusty, and hard to search. 
                We are building a <strong>digital cathedral</strong> for your thoughts. 
                Where every idea is connected, every insight is surfaced by AI, and nothing gets lost in the noise.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-500 mt-1">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="block text-sm font-medium">Traditional Way</strong>
                    <span className="text-sm text-muted-foreground">Folders, manual tagging, "Where did I put that?"</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-500 mt-1">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <strong className="block text-sm font-medium">Second Brain</strong>
                    <span className="text-sm text-muted-foreground">Knowledge graph, AI synthesis, Context-aware search.</span>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div style={{ y: ySlow }} className="order-1 md:order-2">
              <VisualPlaceholder 
                title="Visual: The Knowledge Graph"
                description="A video or GIF showing nodes connecting in 3D space (like the dashboard graph), transitioning from a messy pile to a beautiful constellation."
                icon={Workflow}
              />
            </motion.div>
          </div>
        </FadeInSection>

        {/* 4. Philosophy Section (Cards) */}
        <section className="mb-32">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold mb-4">Built on Proven Frameworks</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We didn't invent note-taking. We automated the best methodologies so you don't have to maintain them manually.
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "C.O.D.E.", 
                desc: "Capture, Organize, Distill, Express. The lifecycle of an idea.", 
                color: "bg-blue-500/10 text-blue-500" 
              },
              { 
                title: "P.A.R.A.", 
                desc: "Projects, Areas, Resources, Archives. A universal system for organization.", 
                color: "bg-purple-500/10 text-purple-500" 
              },
              { 
                title: "Just-in-Time", 
                desc: "Surface information exactly when you need it, not when you file it.", 
                color: "bg-orange-500/10 text-orange-500" 
              }
            ].map((item, i) => (
              <FadeInSection delay={i * 0.1} key={i}>
                <Card className="h-full bg-surface/50 border-border backdrop-blur-sm hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <div className={`w-fit p-2 rounded-md mb-2 ${item.color}`}>
                      <Database className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </section>

        {/* 5. The AI Edge (Big Feature Section) */}
        <FadeInSection>
          <div className="rounded-3xl border border-border bg-gradient-to-b from-surface to-surface-solid p-8 md:p-16 mb-32 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium">
                  <Sparkles className="h-3 w-3 text-accent" />
                  The AI Advantage
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold">It understands, <br/>so you don't have to file.</h2>
                <ul className="space-y-4">
                  {[
                    "Semantic Search: Find 'that recipe with tomatoes' without the exact keyword.",
                    "Auto-Tagging: The AI reads your note and categorizes it for you.",
                    "Synthesis: Ask questions to your notes like 'What did I learn about React last month?'"
                  ].map((feat, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full">
                <motion.div style={{ y: yFast }}>
                  <VisualPlaceholder 
                    title="Visual: AI Chat / Search"
                    description="A clean UI mockup showing a user typing a natural language query and the system surfacing relevant note cards instantly."
                    icon={Search}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* 6. Integrations & Security (Split) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <FadeInSection>
            <div className="h-full rounded-2xl border border-border bg-surface/50 p-8">
               <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                 <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                 Seamless Integrations
               </h3>
               <p className="text-muted-foreground text-sm mb-6">
                 Your brain doesn't live in a silo. Neither should your notes. We sync with the tools you already use.
               </p>
               {/* Integration Icons Grid */}
               <div className="grid grid-cols-3 gap-4">
                  {["Notion", "Slack", "Drive", "Linear", "Obsidian", "Chrome"].map((tool) => (
                    <div key={tool} className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-solid border border-border/50">
                      {/* Replace with actual SVGs later */}
                      <div className="h-6 w-6 rounded-full bg-foreground/10 mb-2" />
                      <span className="text-[10px] font-medium">{tool}</span>
                    </div>
                  ))}
               </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="h-full rounded-2xl border border-border bg-surface/50 p-8 flex flex-col justify-center text-center md:text-left">
               <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500 self-center md:self-start">
                 <ShieldCheck className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
               <p className="text-muted-foreground text-sm leading-relaxed">
                 Your thoughts are private. We use <strong>AES-256 encryption</strong> at rest and TLS in transit. 
                 Our business model is simple: you pay us, we provide a service. We do not sell your data or train public models on your private notes.
               </p>
            </div>
          </FadeInSection>
        </div>

        {/* 7. Footer / CTA */}
        <FadeInSection>
          <div className="text-center py-12 border-t border-border/50">
            <h2 className="text-2xl font-semibold mb-4">Ready to upgrade your mind?</h2>
            <p className="text-muted-foreground mb-8">Join the journey from information exhaustion to creative mastery.</p>
            {/* Assuming you have a Button component wrapper or use standard HTML for now */}
            <div className="flex justify-center gap-4">
              <Link href="/dashboard"  className="px-6 py-2.5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition" >
              Get Started
              </Link>
            </div>
          </div>
        </FadeInSection>

      </div>
    </div>
  );
}