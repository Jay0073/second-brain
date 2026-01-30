"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUiStore } from "@/lib/store/uiStore";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

type Tab = "login" | "signup";

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
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface p-1">
          <button
            type="button"
            className={cn(
              "flex-1 rounded-full px-3 py-2 text-sm font-medium transition",
              tab === "login"
                ? "bg-surface-solid text-foreground shadow-sm"
                : "text-[color:var(--color-muted-foreground)] hover:text-foreground",
            )}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 rounded-full px-3 py-2 text-sm font-medium transition",
              tab === "signup"
                ? "bg-surface-solid text-foreground shadow-sm"
                : "text-[color:var(--color-muted-foreground)] hover:text-foreground",
            )}
            onClick={() => setTab("signup")}
          >
            Signup
          </button>
        </div>

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
            autoComplete={tab === "signup" ? "new-password" : "current-password"}
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
            {submitting ? "Please wait…" : tab === "login" ? "Login" : "Create account"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
