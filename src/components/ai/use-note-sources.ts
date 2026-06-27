"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { Note, NoteSourceItem, NoteSourceType } from "@/types";

interface UseNoteSourcesProps {
  note: Note | null;
  loadNotes: () => Promise<void>;
  noteTabs: { id: string; name?: string; content?: string }[] | null;
  activeTabId: string | null;
  activeTabHtml: string;
}

export function useNoteSources({
  note,
  loadNotes,
  noteTabs,
  activeTabHtml,
}: UseNoteSourcesProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [sourcesModalMode, setSourcesModalMode] = useState<"add" | "view">("add");
  const [sourcesInput, setSourcesInput] = useState("");
  const [sourcesBusy, setSourcesBusy] = useState(false);
  const [noteSources, setNoteSources] = useState<NoteSourceItem[]>([]);
  const [sourcesLastLoadedAt, setSourcesLastLoadedAt] = useState<number>(0);
  const [sourcesAssignTab, setSourcesAssignTab] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!note?.id) return;
    const items = note.sourceItems;
    setTimeout(() => {
      setSourcesInput("");
      if (Array.isArray(items) && items.length > 0) {
        setNoteSources(items);
        setSourcesLastLoadedAt(Date.now());
      } else {
        setNoteSources([]);
        setSourcesLastLoadedAt(0);
      }
    }, 0);
  }, [note?.id, note?.sourceItems]);

  const loadSourcesForNote = useCallback(async (noteId: string) => {
    const res = await fetch(`/api/sources?noteId=${encodeURIComponent(noteId)}&_t=${Date.now()}`, {
      credentials: "include",
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as { sources?: NoteSourceItem[]; error?: string };
    if (!res.ok) throw new Error(data.error || "Failed to load sources");
    setNoteSources(Array.isArray(data.sources) ? data.sources : []);
    setSourcesLastLoadedAt(Date.now());
  }, []);

  const addSourcesToNote = useCallback(
    async (
      noteId: string,
      urls: string[],
      tab?: { sourceTabId: string; sourceTabName?: string | null } | null,
      librarySources?: Record<string, unknown>[],
    ) => {
      const tabPayload =
        tab?.sourceTabId && tab.sourceTabId.trim().length > 0
          ? { sourceTabId: tab.sourceTabId.trim(), sourceTabName: tab.sourceTabName ?? null }
          : {};
      const body =
        Array.isArray(librarySources) && librarySources.length > 0
          ? { noteId, sources: librarySources, ...tabPayload }
          : { noteId, urls, ...tabPayload };
      const res = await fetch("/api/sources", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { sources?: NoteSourceItem[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to add sources");
      setNoteSources(Array.isArray(data.sources) ? data.sources : []);
      setSourcesLastLoadedAt(Date.now());
      void loadNotes();
    },
    [loadNotes],
  );

  const removeSourcesFromNote = useCallback(
    async (noteId: string, sourceIds: string[]) => {
      const res = await fetch("/api/sources", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, removeSourceIds: sourceIds }),
      });
      const data = (await res.json().catch(() => ({}))) as { sources?: NoteSourceItem[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to remove sources");
      if (Array.isArray(data.sources)) {
        setNoteSources(data.sources);
      } else {
        setNoteSources((prev) => prev.filter((c) => !sourceIds.includes(c.id)));
      }
      setSourcesLastLoadedAt(Date.now());
      void loadNotes();
    },
    [loadNotes],
  );

  const updateSourceOnNote = useCallback(
    async (
      noteId: string,
      input: {
        sourceId: string;
        tags: string[];
        description: string;
        aiUsageGuide: string;
        contentType: NoteSourceType;
        category: string;
        libraryFolderId: string;
        relatedAiModel: string;
        isPrimaryReference: boolean;
      },
    ) => {
      const res = await fetch("/api/sources", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId,
          updateSource: {
            sourceId: input.sourceId,
            tags: input.tags,
            description: input.description,
            aiUsageGuide: input.aiUsageGuide,
            contentType: input.contentType,
            category: input.category || null,
            libraryFolderId: input.libraryFolderId || null,
            relatedAiModel: input.relatedAiModel || null,
            isPrimaryReference: input.isPrimaryReference,
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { sources?: NoteSourceItem[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to update source");
      if (Array.isArray(data.sources)) {
        setNoteSources(data.sources);
      } else {
        await loadSourcesForNote(noteId);
      }
      setSourcesLastLoadedAt(Date.now());
      void loadNotes();
    },
    [loadSourcesForNote, loadNotes],
  );

  const mainTabContextPlainText = useMemo(() => {
    if (!note) return "";
    let html = "";
    if (Array.isArray(noteTabs) && noteTabs.length > 0) {
      const main = noteTabs.find((t) => t.id === "main");
      html = main?.content ?? noteTabs[0]?.content ?? "";
    } else {
      html = note.content ?? "";
    }
    return String(html).slice(0, 12_000); // Truncate content for extraction efficiency
  }, [note, noteTabs]);

  const tabHtmlForTbd = useMemo(() => {
    if (!note) return null;
    if (sourcesAssignTab && Array.isArray(noteTabs) && noteTabs.length > 0) {
      const t = noteTabs.find((x) => x.id === sourcesAssignTab.id);
      if (t?.content != null) return t.content;
    }
    return activeTabHtml || null;
  }, [note, noteTabs, sourcesAssignTab, activeTabHtml]);

  const openSourcesAdd = useCallback(() => {
    if (!note) return;
    setSourcesAssignTab(null);
    setSourcesModalMode("add");
    setSourcesOpen(true);
    void loadSourcesForNote(note.id).catch(() => undefined);
  }, [note, loadSourcesForNote]);

  const openSourcesAddForActiveTab = useCallback((uploadSourceTabForEditor: { id: string, name: string } | null) => {
    if (!note || !uploadSourceTabForEditor?.id) return;
    setSourcesAssignTab({
      id: uploadSourceTabForEditor.id,
      name:
        (uploadSourceTabForEditor.name || "").trim() ||
        (uploadSourceTabForEditor.id === "main" ? "Main" : uploadSourceTabForEditor.id),
    });
    setSourcesModalMode("add");
    setSourcesOpen(true);
    void loadSourcesForNote(note.id).catch(() => undefined);
  }, [note, loadSourcesForNote]);

  return {
    sourcesOpen,
    setSourcesOpen,
    sourcesModalMode,
    setSourcesModalMode,
    sourcesInput,
    setSourcesInput,
    sourcesBusy,
    setSourcesBusy,
    noteSources,
    sourcesLastLoadedAt,
    loadSourcesForNote,
    addSourcesToNote,
    removeSourcesFromNote,
    updateSourceOnNote,
    mainTabContextPlainText,
    tabHtmlForTbd,
    sourcesAssignTab,
    setSourcesAssignTab,
    openSourcesAdd,
    openSourcesAddForActiveTab,
  };
}
