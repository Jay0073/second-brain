"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUiStore } from "@/lib/store/uiStore";
import { cn } from "@/lib/utils";

type Tab = "login" | "signup";

export function LoginModal() {
  const open = useUiStore((s) => s.loginOpen);
  const close = useUiStore((s) => s.closeLogin);
  const [tab, setTab] = React.useState<Tab>("login");

  return (
    <Modal
      open={open}
      onOpenChange={(o) => (o ? null : close())}
      title={tab === "login" ? "Welcome back" : "Create your account"}
      description="This is a UI scaffold — wire auth later."
    >
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface p-1">
        <button
          className={cn(
            "flex-1 rounded-full px-3 py-2 text-sm font-medium transition",
            tab === "login"
              ? "bg-surface-solid text-foreground shadow-sm"
              : "text-[color:var(--color-muted-foreground)] hover:text-foreground",
          )}
          onClick={() => setTab("login")}
          type="button"
        >
          Login
        </button>
        <button
          className={cn(
            "flex-1 rounded-full px-3 py-2 text-sm font-medium transition",
            tab === "signup"
              ? "bg-surface-solid text-foreground shadow-sm"
              : "text-[color:var(--color-muted-foreground)] hover:text-foreground",
          )}
          onClick={() => setTab("signup")}
          type="button"
        >
          Signup
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {tab === "signup" ? (
          <Input placeholder="Name" autoComplete="name" />
        ) : null}
        <Input placeholder="Email" type="email" autoComplete="email" />
        <Input
          placeholder="Password"
          type="password"
          autoComplete={tab === "signup" ? "new-password" : "current-password"}
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            // stub
            close();
          }}
        >
          {tab === "login" ? "Login" : "Create account"}
        </Button>
      </div>
    </Modal>
  );
}

