"use client";

import { Brain, FolderKanban, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    title: "Capture",
    description:
      "Lightning-fast capture flows, designed for momentum and minimal friction.",
    icon: Brain,
  },
  {
    title: "Organize",
    description:
      "Tags and structure that stay out of your way—until you need them.",
    icon: FolderKanban,
  },
  {
    title: "AI Synthesis",
    description:
      "Summaries and suggested tags as a helper layer, not a black box.",
    icon: Sparkles,
  },
];

export function FeaturesSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">
            Built for clarity.
          </h2>
          <p className="mt-2 text-[color:var(--color-muted-foreground)]">
            A small, robust design system and a clean architecture you can ship.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((it) => (
            <Card key={it.title} className="bg-surface">
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] text-[color:var(--accent)]">
                    <it.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-base font-semibold tracking-tight">
                      {it.title}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-[color:var(--color-muted-foreground)]">
                      {it.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

