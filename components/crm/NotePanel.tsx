"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import Button from "@/components/Button/Button";
import type { Communication, Activity } from "@/types/crm";

const DRAFT_KEY_PREFIX = "tally-note-draft-";
const DRAFT_SAVE_MS = 2500;

function formatTimestamp(): string {
  return new Date().toISOString();
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface NotePanelProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
  caseNumber: string;
  /** Current user name for note attribution */
  currentUser?: string;
  onSave: (payload: { communication: Communication; activity: Activity }) => void;
}

export default function NotePanel({
  open,
  onClose,
  caseId,
  caseNumber,
  currentUser = "Current User",
  onSave,
}: NotePanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [position, setPosition] = React.useState<{ x: number; y: number } | null>(null);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [attachments, setAttachments] = React.useState<{ name: string; size: string }[]>([]);
  const [saving, setSaving] = React.useState(false);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const draftKey = `${DRAFT_KEY_PREFIX}${caseId}`;

  const [dragState, setDragState] = React.useState<{
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  React.useEffect(() => {
    if (!dragState) return;
    const panel = panelRef.current;
    const w = typeof window !== "undefined" ? window : null;
    if (!panel || !w) return;

    const move = (e: MouseEvent) => {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      let x = dragState.startLeft + dx;
      let y = dragState.startTop + dy;
      const rect = panel.getBoundingClientRect();
      const margin = 16;
      x = Math.max(margin, Math.min(x, w.innerWidth - rect.width - margin));
      y = Math.max(margin, Math.min(y, w.innerHeight - rect.height - margin));
      setPosition({ x, y });
    };
    const up = () => setDragState(null);
    w.addEventListener("mousemove", move);
    w.addEventListener("mouseup", up);
    return () => {
      w.removeEventListener("mousemove", move);
      w.removeEventListener("mouseup", up);
    };
  }, [dragState]);

  const startDrag = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const left = position?.x ?? rect.left;
    const top = position?.y ?? rect.top;
    setPosition({ x: left, y: top });
    setDragState({
      startX: e.clientX,
      startY: e.clientY,
      startLeft: left,
      startTop: top,
    });
  };

  // Load draft from localStorage when opening
  React.useEffect(() => {
    if (open && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(draftKey);
        if (saved) {
          const parsed = JSON.parse(saved) as {
            title?: string;
            body?: string;
            attachments?: { name: string; size: string }[];
          };
          setTitle(parsed.title ?? "");
          setBody(parsed.body ?? "");
          setAttachments(parsed.attachments ?? []);
          if (editorRef.current) {
            editorRef.current.innerHTML = parsed.body ?? "";
          }
        } else {
          setTitle("");
          setBody("");
          setAttachments([]);
          if (editorRef.current) editorRef.current.innerHTML = "";
        }
      } catch {
        setTitle("");
        setBody("");
        setAttachments([]);
      }
    }
  }, [open, draftKey]);

  // Sync editor content to state for draft
  const syncBodyFromEditor = React.useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setBody(html);
      return html;
    }
    return body;
  }, [body]);

  // Auto-save draft to localStorage
  React.useEffect(() => {
    if (!open) return;
    const t = setInterval(() => {
      const html = syncBodyFromEditor();
      if (typeof window !== "undefined" && (title || html || attachments.length > 0)) {
        try {
          localStorage.setItem(
            draftKey,
            JSON.stringify({ title, body: html, attachments })
          );
        } catch {}
      }
    }, DRAFT_SAVE_MS);
    return () => clearInterval(t);
  }, [open, draftKey, title, attachments, syncBodyFromEditor]);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value ?? undefined);
    editorRef.current?.focus();
  };

  const handleInsertLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) handleFormat("createLink", url);
  };

  const handleInsertSnippet = () => {
    const text = window.prompt("Snippet text:");
    if (text && editorRef.current) {
      document.execCommand(
        "insertHTML",
        false,
        `<span class="bg-gray-100 dark:bg-gray-800 px-1 rounded">${escapeHtml(text)}</span>&nbsp;`
      );
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      setAttachments((prev) => [
        ...prev,
        { name: f.name, size: f.size < 1024 ? `${f.size} B` : `${(f.size / 1024).toFixed(1)} KB` },
      ]);
    }
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const html = syncBodyFromEditor();
    const plainText = editorRef.current?.innerText ?? "";
    const subject =
      title.trim() || plainText.slice(0, 80).replace(/\n/g, " ") || "Note";
    setSaving(true);
    const timestamp = formatTimestamp();
    const comm: Communication = {
      id: generateId("comm"),
      type: "Note",
      direction: "Internal",
      from: currentUser,
      to: "",
      subject,
      body: html,
      timestamp,
      attachments: attachments.map((a, i) => ({
        id: generateId("att"),
        name: a.name,
        type: "file",
        size: a.size,
        uploadedBy: currentUser,
        uploadedDate: timestamp,
      })),
    };
    const activity: Activity = {
      id: generateId("act"),
      type: "Comment",
      description: plainText.slice(0, 120) ? `${plainText.slice(0, 120)}${plainText.length > 120 ? "…" : ""}` : "Added a note",
      user: currentUser,
      timestamp,
    };
    Promise.resolve(onSave({ communication: comm, activity })).finally(() => {
      setSaving(false);
      try {
        localStorage.removeItem(draftKey);
      } catch {}
      setTitle("");
      setBody("");
      setAttachments([]);
      if (editorRef.current) editorRef.current.innerHTML = "";
      onClose();
      setIsExpanded(false);
    });
  };

  const toolbarButtons = (
    <>
      <button
        type="button"
        onClick={() => handleFormat("bold")}
        className="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Bold"
      >
        <Icon name="format_bold" size={18} />
      </button>
      <button
        type="button"
        onClick={() => handleFormat("italic")}
        className="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Italic"
      >
        <Icon name="format_italic" size={18} />
      </button>
      <button
        type="button"
        onClick={() => handleFormat("underline")}
        className="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Underline"
      >
        <Icon name="format_underlined" size={18} />
      </button>
      <button
        type="button"
        onClick={handleInsertLink}
        className="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Insert link"
      >
        <Icon name="link" size={18} />
      </button>
      <div className="h-5 w-px bg-gray-300 dark:bg-gray-600" />
      <button
        type="button"
        onClick={handleInsertSnippet}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Insert snippet"
      >
        <Icon name="code" size={16} />
        Snippet
      </button>
      <button
        type="button"
        onClick={() =>
          handleFormat("insertImage", window.prompt("Image URL:") ?? undefined)
        }
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Insert image"
      >
        <Icon name="image" size={16} />
        Image
      </button>
      <button
        type="button"
        onClick={handleUploadClick}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Upload file"
      >
        <Icon name="upload_file" size={16} />
        File
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
      />
    </>
  );

  const titleSection = (
    <div className="px-4 pt-3 pb-1">
      <input
        id="note-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#006180] dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
      />
    </div>
  );

  const bottomBar = (
    <div className="shrink-0 px-4 pb-3">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex flex-wrap items-center gap-1">
          {toolbarButtons}
        </div>
        {attachments.length > 0 && (
          <>
            <div className="h-5 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="flex flex-wrap gap-2">
              {attachments.map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                >
                  <Icon name="attach_file" size={14} />
                  {a.name} ({a.size})
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                    className="ml-0.5 rounded p-0.5 text-muted-foreground hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    aria-label="Remove"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const editorArea = (
    <>
      {titleSection}
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-2">
        <div
          ref={editorRef}
          contentEditable
          data-placeholder="Add your note…"
          className="min-h-[180px] flex-1 overflow-y-auto rounded-md border border-border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[#006180] dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 [&:empty::before]:content-[attr(data-placeholder)] [&:empty::before]:text-muted-foreground"
          style={{ fontSize: "var(--tally-font-size-sm)" }}
          onBlur={syncBodyFromEditor}
        />
      </div>
      {bottomBar}
    </>
  );

  const header = (
    <div className="flex cursor-default select-none items-center justify-between border-b border-border px-4 py-3 dark:border-gray-700">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span
          role="button"
          tabIndex={0}
          onMouseDown={startDrag}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") e.preventDefault();
          }}
          className="flex cursor-grab touch-none items-center justify-center rounded p-1 text-muted-foreground hover:bg-gray-100 hover:text-gray-900 active:cursor-grabbing dark:hover:bg-gray-700 dark:hover:text-gray-100"
          title="Drag to move"
          aria-label="Drag to move panel"
        >
          <Icon name="drag_indicator" size={20} />
        </span>
        <h2 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">New note</h2>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {!isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            title="Expand"
          >
            <Icon name="open_in_full" size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            title="Minimise"
          >
            <Icon name="minimize" size={18} />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          title="Close"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-2 border-t border-border px-4 py-3 dark:border-gray-700">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button
        disabled={saving}
        onClick={handleSave}
        className="bg-[#006180] text-white hover:bg-[#0091BF] dark:bg-[#0091BF] dark:hover:bg-[#00C1FF]"
      >
        {saving ? "Saving…" : "Save note"}
      </Button>
    </div>
  );

  if (!open) return null;

  const panelContent = (
    <>
      {header}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {editorArea}
      </div>
      {footer}
    </>
  );

  const isPositioned = position !== null;
  const basePanelClass =
    "fixed z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";
  const minimisedClass = "max-h-[70vh] w-full max-w-md";
  const expandedClass = "max-h-[95vh] w-full max-w-4xl";

  if (isExpanded) {
    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/50"
          aria-hidden
          onClick={() => setIsExpanded(false)}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-label="New note (expanded)"
          className={cn(basePanelClass, expandedClass)}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {panelContent}
        </div>
      </>
    );
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="New note"
      className={cn(basePanelClass, minimisedClass)}
      style={
        isPositioned
          ? { left: position.x, top: position.y }
          : { right: 24, bottom: 24 }
      }
    >
      {panelContent}
    </div>
  );
}

function escapeHtml(s: string): string {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}
