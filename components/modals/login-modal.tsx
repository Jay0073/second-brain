"use client";

import * as React from "react";
import { LogIn, UserPlus, Copy, CopyCheck, InfoIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUiStore } from "@/lib/store/uiStore";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

type Tab = "login" | "signup";

function DemoCredential({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex items-center group">
      <span
        className={cn(
          "px-2 py-1 rounded-md font-mono text-sm",
          "bg-[color:var(--color-surface-solid)] border border-[color:var(--color-border)]",
          "text-[color:var(--color-accent)]",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "ml-1 px-2 py-1 rounded transition text-xs font-medium",
          "bg-transparent hover:bg-[color:var(--color-accent)] hover:text-[color:var(--color-accent-foreground)]",
          "text-[color:var(--color-muted-foreground)]",
        )}
        aria-label={`Copy ${label.toLowerCase()}`}
        tabIndex={0}
      >
        {copied ? (
            <CopyCheck className="h-3 w-3" />
        ) : (
        <Copy className="h-3 w-3" />
        )}
      </button>
    </div>
  );
}

export function LoginModal() {
  const open = useUiStore((s) => s.loginOpen);
  const close = useUiStore((s) => s.closeLogin);
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [tab, setTab] = React.useState<Tab>("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (tab === "login") {
        const { error: err } = await signInWithEmail(email, password);
        if (err) {
          setError(err.message ?? "Sign in failed.");
          return;
        }
      } else {
        const { error: err } = await signUpWithEmail(email, password, {
          name: name.trim() || undefined,
        });
        if (err) {
          setError(err.message ?? "Sign up failed.");
          return;
        }
      }
      close();
      setEmail("");
      setPassword("");
      setName("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(o) => (o ? null : close())}
      title={tab === "login" ? "Welcome back" : "Create your account"}
      description="Sign in or sign up with email."
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 cursor-pointer rounded-full px-3 py-2 text-sm font-medium transition",
              tab === "login"
                ? "bg-[color:var(--color-toggle-thumb)] text-[color:var(--color-background)] shadow-sm"
                : "text-[color:var(--color-muted-foreground)] hover:text-foreground",
            )}
            aria-pressed={tab === "login"}
          >
            <LogIn className="h-4 w-4" />
            Login
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 cursor-pointer rounded-full px-3 py-2 text-sm font-medium transition",
              tab === "signup"
                ? "bg-[color:var(--color-toggle-thumb)] text-[color:var(--color-background)] shadow-sm"
                : "text-[color:var(--color-muted-foreground)] hover:text-foreground",
            )}
            aria-pressed={tab === "signup"}
          >
            <UserPlus className="h-4 w-4" />
            Signup
          </button>
        </div>
        {tab === "login" && (
          <div
            className={cn(
              "mt-4 rounded-xl px-5 py-2 flex flex-col gap-2",
              "bg-[color:var(--color-background)] shadow-sm",
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <InfoIcon className="h-4 w-4 text-blue" />
            <span className="text-sm text-[color:var(--color-muted-foreground)]">
              Use these credentials to log in and try out the app:
            </span>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <DemoCredential label="Email" value="demo@demo.com" />
              <DemoCredential label="Password" value="123456" />
            </div>
          </div>
        )}
        <div className="mt-5 space-y-3">
          {tab === "signup" ? (
            <Input
              placeholder="Name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : null}
          <Input
            placeholder="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            autoComplete={
              tab === "signup" ? "new-password" : "current-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error ? (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button type="button" variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Please wait…"
              : tab === "login"
                ? "Login"
                : "Create account"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
