"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash, ExternalLink } from "lucide-react";
import { Button } from "./forms/button";
import { ButtonRegular } from "./forms/button-regular";
import type { Folder, Note, NoteSourceItem, NoteSourceType } from "@/types";

interface SourcesListViewProps {
  note: Note | null;
  folders: Folder[];
  noteSources: NoteSourceItem[];
  sourcesBusy: boolean;
  setSourcesBusy: (value: boolean) => void;
  sourcesLastLoadedAt: number;
  loadSourcesForNote: (noteId: string) => Promise<void>;
  updateSourceOnNote: (
    noteId: string,
    input: {
      sourceId: string;
      name: string;
      tags: string[];
      keyConcepts: string[];
      description: string;
      aiUsageGuide: string;
      contentType: NoteSourceType;
      category: string;
      libraryFolderId: string;
      relatedAiModel: string;
      isPrimaryReference: boolean;
    },
  ) => Promise<void>;
  removeSourceFromNote: (noteId: string, sourceIds: string[]) => Promise<void>;
  onCreateFolder?: (name: string) => Promise<void>;
  aiModels: string[];
  setViewState: (val: "add" | "list") => void;
}

export function SourcesListView({
  note,
  noteSources,
  sourcesBusy,
  setSourcesBusy,
  sourcesLastLoadedAt,
  loadSourcesForNote,
  removeSourceFromNote,
  setViewState,
}: SourcesListViewProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <div className="space-y-4 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          {sourcesLastLoadedAt
            ? `Last refreshed ${new Date(sourcesLastLoadedAt).toLocaleTimeString()}`
            : ""}
        </div>
        <div className="flex items-center gap-2">
          <ButtonRegular
            disabled={!note || sourcesBusy}
            onClick={() => {
              if (!note) return;
              setSourcesBusy(true);
              void loadSourcesForNote(note.id)
                .then(() => toast.success("Refreshed!"))
                .catch(() => toast.error("Could not refresh sources"))
                .finally(() => setSourcesBusy(false));
            }}
          >
            Refresh List
          </ButtonRegular>
          <Button
            type="button"
            disabled={!note || sourcesBusy}
            onClick={() => setViewState("add")}
          >
            Add New Source
          </Button>
        </div>
      </div>

      {noteSources.length === 0 ? (
        <div className="rounded-md border bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground">
          No sources attached to this note yet. Click &quot;Add New Source&quot; above.
        </div>
      ) : (
        <div className="max-h-[45vh] overflow-y-auto rounded-md border bg-background">
          <ul className="divide-y">
            {noteSources.map((c) => (
              <li key={c.id} className="px-3 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{c.name || "Untitled Source"}</span>
                      {c.isPrimaryReference && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">
                          Primary Reference
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-mono max-w-[400px] mt-0.5">
                      {c.sourceUrl}
                    </p>
                    {c.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {c.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {c.sourceUrl && (
                      <a
                        href={c.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 hover:bg-accent hover:text-accent-foreground rounded-md text-muted-foreground transition-colors"
                        title="Open Source Link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      disabled={deletingId === c.id}
                      onClick={async () => {
                        if (!note) return;
                        setDeletingId(c.id);
                        try {
                          await removeSourceFromNote(note.id, [c.id]);
                          toast.success("Source removed!");
                        } catch (e: unknown) {
                          const err = e as { message?: string };
                          toast.error("Removal failed", { description: err?.message || "Unknown error" });
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      title="Remove Source"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
