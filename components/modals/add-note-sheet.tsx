"use client";

import * as React from "react";
import { Wand2, Paperclip, Loader2, X } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUiStore } from "@/lib/store/uiStore";
import { createClient } from "@/lib/supabase/client";

export function AddNoteSheet() {
  const open = useUiStore((s) => s.addNoteOpen);
  const close = useUiStore((s) => s.closeAddNote);

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [type, setType] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [generating, setGenerating] = React.useState(false);
  
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [attachmentUrl, setAttachmentUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const saveNote = (title: string, content: string, type: string, tags: string[], file_url?: string | null, file_name?: string | null) => {
    fetch("/api/notes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, content, type, tags, file_url, file_name }),
    });
  };

  const reset = () => {
    setTitle("");
    setContent("");
    setType("");
    setTags([]);
    setGenerating(false);
    setFile(null);
    setAttachmentUrl(null);
    setUploading(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploading(true);

      try {
        const supabase = createClient();
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${(await supabase.auth.getUser()).data.user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("attachments")
          .upload(filePath, selectedFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("attachments")
          .getPublicUrl(filePath);

        setAttachmentUrl(publicUrl);
      } catch (error) {
        console.error("Upload failed", error);
        alert("Upload failed");
        setFile(null);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          close();
          reset();
        }
      }}
      title="New note"
      description="Draft a thought, then let AI suggest tags."
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="text-sm font-medium">Title</div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A clear, specific title…"
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Content</div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note…"
            className="min-h-44 w-full resize-y rounded-3xl border border-border bg-surface-solid p-4 text-sm outline-none transition focus:ring-2 focus:ring-[color:var(--color-ring)]"
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Type</div>
          <div className="flex items-center space-x-4">
            <label htmlFor="note" className="cursor-pointer">
              <input
                type="radio"
                id="note"
                value="note"
                checked={type === "note"}
                onChange={(e) => setType(e.target.value)}
              />
              &nbsp;Note
            </label>
            <label htmlFor="link" className="cursor-pointer">
              <input
                type="radio"
                id="link"
                value="link"
                checked={type === "link"}
                onChange={(e) => setType(e.target.value)}
              />
              &nbsp;Link
            </label>
            <label htmlFor="insight" className="cursor-pointer">
              <input
                type="radio"
                id="insight"
                value="insight"
                checked={type === "insight"}
                onChange={(e) => setType(e.target.value)}
              />
              &nbsp;Insight
            </label>
          </div>
        </div>

        <div>
           <div className="flex items-center gap-2 mb-2">
             <Button
               variant="secondary"
               size="sm"
               className="gap-2"
               onClick={() => fileInputRef.current?.click()}
               disabled={uploading}
             >
               <Paperclip className="h-4 w-4" />
               {uploading ? "Uploading..." : "Attach File"}
             </Button>
             <input
               type="file"
               ref={fileInputRef}
               className="hidden"
               onChange={handleFileSelect}
               accept="image/*,application/pdf,text/*" 
             />
           </div>
           
           {file && (
             <div className="flex items-center gap-2 text-sm bg-surface-solid border border-border px-3 py-2 rounded-lg">
               <span className="truncate max-w-[200px]">{file.name}</span>
               {uploading ? (
                 <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
               ) : (
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     setFile(null);
                     setAttachmentUrl(null);
                     if (fileInputRef.current) fileInputRef.current.value = "";
                   }}
                   className="text-muted-foreground hover:text-foreground"
                 >
                    <X className="h-3 w-3" />
                 </button>
               )}
             </div>
           )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tags.length ? (
            tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-[color:var(--color-muted-foreground)]"
              >
                {t}
              </span>
            ))
          ) : (
            <div className="text-sm text-[color:var(--color-muted)]">
              No tags yet.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={async () => {
                setGenerating(true);
                try {
                  const res = await fetch("/api/ai/summarize", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ text: content || title }),
                  });
                  const data = (await res.json()) as { tags?: string[] };
                  setTags(data.tags ?? ["ai", "draft"]);
                } finally {
                  setGenerating(false);
                }
              }}
              disabled={generating}
            >
              <Wand2 className="h-4 w-4" />
              {generating ? "Generating…" : "Generate Tags"}
            </Button>
            <Button
              onClick={() => {
                saveNote(title, content, type, tags, attachmentUrl, file?.name);
                close();
                reset();
              }}
              disabled={!title.trim() && !content.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
