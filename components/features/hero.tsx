"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUiStore } from "@/lib/store/uiStore";
// import { useAuth } from "@/components/auth-provider";

function FloatingNote({
  title,
  body,
  tags,
  style,
}: {
  title: string;
  body: string;
  tags: string[];
  style?: React.CSSProperties;
}) {
  return (
    <Card
      className="w-60 bg-[color-mix(in_oklab,var(--surface-solid)_70%,transparent)]"
      style={style}
    >
      <CardHeader className="pb-2">
        <div className="text-sm font-semibold tracking-tight">{title}</div>
        <div className="mt-1 line-clamp-2 text-xs text-[color:var(--color-muted-foreground)]">
          {body}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-surface px-2 py-1 text-[10px] text-[color:var(--color-muted-foreground)]"
            >
              {t}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function Hero() {
  // const openAddNote = useUiStore((s) => s.openAddNote);
  // const { user } = useAuth();
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 600], [0, 80]);
  const y2 = useTransform(scrollY, [0, 600], [0, 130]);
  const y3 = useTransform(scrollY, [0, 600], [0, 170]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -left-20 -top-28 h-80 w-80 rounded-full bg-[color-mix(in_oklab,var(--accent)_20%,transparent)] blur-3xl aurora-blob" />
        <div className="absolute right-70 top-28 h-100 w-100 rounded-full bg-[color-mix(in_oklab,var(--accent)_20%,transparent)] blur-3xl aurora-blob" />
        <div className="absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-[color-mix(in_oklab,var(--foreground)_6%,transparent)] blur-3xl aurora-blob" />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs text-[color:var(--color-muted-foreground)]">
            <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
            AI-ready notes, built to scale
          </div>
          {/* <h3 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
            {user ? `Good ${new Date().getHours() < 12 ? "morning" : "evening"}, ${user.user_metadata?.full_name?.split(" ")[0] ?? "friend"}.` : "Your Infrastructure for Thought."}
          </h3> */}
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
            Your Infrastructure for Thought.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--color-muted-foreground)] md:text-lg">
            Capture fast, organize effortlessly, and synthesize with AI. A modern
            second brain that feels calm, precise, and production-ready.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/dashboard">
              <Button>
                New note <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary">Open dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="relative hidden min-h-[420px] md:block">
          <motion.div
            style={{ y: y1 }}
            className="absolute left-10 top-6 rotate-[-6deg]"
          >
            <FloatingNote
              title="Capture"
              body="One-click capture. Zero ceremony."
              tags={["inbox", "quick"]}
            />
          </motion.div>

          <motion.div
            style={{ y: y2 }}
            className="absolute right-6 top-24 rotate-[5deg]"
          >
            <FloatingNote
              title="Organize"
              body="Tags and structure without friction."
              tags={["tags", "folders"]}
            />
          </motion.div>

          <motion.div
            style={{ y: y3 }}
            className="absolute left-24 top-56 rotate-[2deg]"
          >
            <FloatingNote
              title="AI Synthesis"
              body="Summaries, links, and insights — on demand."
              tags={["ai", "summary"]}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

