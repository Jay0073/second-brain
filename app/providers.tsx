"use client";

import * as React from "react";
import { LoginModal } from "@/components/modals/login-modal";
import { AddNoteSheet } from "@/components/modals/add-note-sheet";
import { ChatModal } from "@/components/modals/chat-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LoginModal />
      <AddNoteSheet />
      <ChatModal />
    </>
  );
}

