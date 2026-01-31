"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, SendHorizonal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { id: string; title: string }[];
};

export function ChatModal() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    // Scroll lock
    document.body.style.overflow = "hidden";

    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }

    return () => {
      document.body.style.overflow = "";
    }
  }, [messages, open]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `m_${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        throw new Error("Chat failed");
      }

      const data = (await res.json()) as {
        answer: string;
        sources?: { id?: string; title?: string }[];
      };

      const assistantMessage: ChatMessage = {
        id: `m_${Date.now()}_assistant`,
        role: "assistant",
        content: data.answer ?? "No answer returned.",
        sources:
          data.sources
            ?.map((s, idx) => ({
              id: String(s.id ?? idx),
              title: s.title ?? "Untitled note",
            }))
            .filter((s) => !!s.title) ?? [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}_error`,
          role: "assistant",
          content: "There was a problem talking to your brain. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.25 }}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 left-[49%] z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_16px_40px_rgba(0,0,0,0.55)] cursor-pointer",
          "hover:scale-[1.03] active:scale-[0.97] transition",
        )}
        aria-label="Chat with your brain"
      >
        <Brain className="h-5 w-5" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-transparent" // Invisible backdrop for click-outside
            />
            <motion.div
              className="fixed bottom-24 right-[33%] z-50 w-full max-w-lg"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div className="overflow-hidden rounded-3xl border border-border bg-surface-solid shadow-[var(--shadow-elevated)] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] text-[color:var(--accent)]">
                      <Brain className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold tracking-tight">
                        Chat with your brain
                      </div>
                      <div className="text-xs text-[color:var(--color-muted-foreground)]">
                        Ask about anything you’ve captured.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full p-1.5 text-[color:var(--color-muted-foreground)] hover:bg-surface"
                    aria-label="Close chat"
                  >
                    <X className="h-5 w-5 cursor-pointer" />
                  </button>
                </div>

                <div
                  ref={listRef}
                  data-lenis-prevent
                  className="max-h-100 space-y-3 overflow-y-auto px-4 py-3 text-sm [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40"
                >
                  {messages.length === 0 && !isLoading ? (
                    <div className="rounded-2xl bg-surface px-3 py-2 text-xs text-[color:var(--color-muted-foreground)]">
                      Ask a question like{" "}
                      <span className="font-medium text-foreground">
                        “What are my recent ideas about AI strategy?”
                      </span>
                    </div>
                  ) : null}

                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex",
                        m.role === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                          m.role === "user"
                            ? "bg-accent text-accent-foreground rounded-br-sm"
                            : "bg-surface text-foreground rounded-bl-sm border border-border",
                        )}
                      >
                        <div className="whitespace-pre-line">{m.content}</div>
                        {m.role === "assistant" &&
                          m.sources &&
                          m.sources.length > 0 && (
                            <div className="mt-2 border-t border-border pt-2">
                              <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[color:var(--color-muted-foreground)]">
                                Sources
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {m.sources.map((s) => (
                                  <span
                                    key={s.id}
                                    className="rounded-full bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-2 py-1 text-[10px] text-[color:var(--color-muted-foreground)]"
                                  >
                                    {s.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-border bg-surface px-3 py-2 text-xs">
                        <div className="mb-1 text-[10px] uppercase tracking-wide text-[color:var(--color-muted-foreground)]">
                          Thinking…
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-3 w-32 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--foreground)_12%,transparent)]" />
                          <div className="h-3 w-40 animate-pulse rounded-full bg-[color-mix(in_oklab,var(--foreground)_10%,transparent)]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSend}
                  className="border-t border-border bg-[color-mix(in_oklab,var(--background)_96%,transparent)] px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask your brain anything…"
                      className="h-9 text-xs"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      variant="primary"
                      className="h-9 px-3"
                      disabled={!input.trim() || isLoading}
                    >
                      <SendHorizonal className="h-3 w-3" />
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

