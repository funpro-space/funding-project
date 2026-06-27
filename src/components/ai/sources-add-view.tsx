"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "./forms/button";
import { ButtonRegular } from "./forms/button-regular";
import { AiProcessingDetails } from "./ai-processing-details";
import type { Note } from "@/types";

function normalizeSourceUrl(raw: string) {
  const v = raw.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (/^\/\//.test(v)) return `https:${v}`;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return v;
  return `https://${v.replace(/^\/*/, "")}`;
}

interface SourcesAddViewProps {
  note: Note | null;
  sourcesInput: string;
  setSourcesInput: (value: string) => void;
  sourcesBusy: boolean;
  setSourcesBusy: (value: boolean) => void;
  addSourcesToNote: (
    noteId: string,
    urls: string[],
    tab?: { sourceTabId: string; sourceTabName?: string | null } | null,
    librarySources?: Record<string, unknown>[],
  ) => Promise<void>;
  assignToTab?: { id: string; name: string } | null;
  bodyEditorApiRef?: unknown;
  mainTabContextPlainText?: string;
  tabHtmlForTbd?: string | null;
  onDone: () => void;
  onViewList: () => void;
  extractionPrompt: string;
  setExtractionPrompt: (val: string) => void;
  promptApplied: boolean;
  setPromptApplied: (val: boolean) => void;
  tbdLines: string[];
  setTbdLines: React.Dispatch<React.SetStateAction<string[]>>;
  urlQueueIndex: number;
  setUrlQueueIndex: React.Dispatch<React.SetStateAction<number>>;
  acceptedPreviews: unknown[];
  setAcceptedPreviews: React.Dispatch<React.SetStateAction<unknown[]>>;
  fetchPreview: { title?: string; excerpt?: string; text?: string } | null;
  setFetchPreview: React.Dispatch<React.SetStateAction<{ title?: string; excerpt?: string; text?: string } | null>>;
}

export function SourcesAddView({
  note,
  sourcesInput,
  setSourcesInput,
  sourcesBusy,
  setSourcesBusy,
  addSourcesToNote,
  assignToTab,
  mainTabContextPlainText = "",
  onViewList,
  extractionPrompt,
  setExtractionPrompt,
  promptApplied,
  setPromptApplied,
  fetchPreview,
  setFetchPreview,
}: SourcesAddViewProps) {
  const [fetchStartTime, setFetchStartTime] = useState<number | null>(null);

  const parsedUrls = useMemo(() => {
    return sourcesInput
      .split(/\r?\n/)
      .map(normalizeSourceUrl)
      .filter(Boolean)
      .slice(0, 10); // Batch limit
  }, [sourcesInput]);

  const currentQueueUrl = parsedUrls[0] ?? "";

  const removeCurrentUrlFromInput = () => {
    const updatedInput = sourcesInput
      .split(/\r?\n/)
      .filter((line) => normalizeSourceUrl(line) !== currentQueueUrl)
      .join("\n");
    setSourcesInput(updatedInput);
  };

  const handleFetch = (usePrompt: boolean) => {
    if (!note || !currentQueueUrl) return;
    
    if (usePrompt) {
      setPromptApplied(true);
    }
    
    const finalPrompt = usePrompt ? extractionPrompt : "";

    setFetchStartTime(Date.now());
    setSourcesBusy(true);
    void fetch("/api/sources/fetch-for-insert", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: currentQueueUrl,
        userPrompt: finalPrompt,
        mainTabContext: mainTabContextPlainText,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Fetch failed");
        
        setFetchPreview(data);
        toast.success("Source successfully fetched!");
      })
      .catch((err: unknown) => {
        const error = err as { message?: string };
        toast.error("Source fetching failed", { description: error?.message || "Unknown error" });
      })
      .finally(() => {
        setSourcesBusy(false);
      });
  };

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Web Link / Article Address</h3>
        <ButtonRegular type="button" onClick={onViewList}>
          Back to list
        </ButtonRegular>
      </div>

      <div className="space-y-2">
        <textarea
          placeholder="Paste URL addresses here (one per line)..."
          className="w-full h-24 p-2 text-sm border rounded-md font-mono bg-background text-foreground"
          value={sourcesInput}
          onChange={(e) => setSourcesInput(e.target.value)}
          disabled={sourcesBusy}
        />
        <p className="text-xs text-muted-foreground">
          Enter up to 10 absolute web link URLs. Press submit to trigger AI metadata processing.
        </p>
      </div>

      {currentQueueUrl && (
        <div className="p-3 border rounded-lg bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Currently processing:
            </span>
            <span className="text-xs font-mono break-all font-semibold max-w-[250px] truncate">
              {currentQueueUrl}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Custom Prompt / Extraction Target (Optional)</label>
            <input
              type="text"
              className="w-full p-2 text-xs border rounded-md"
              placeholder="e.g., Focus on financial figures, summarize main thesis..."
              value={extractionPrompt}
              onChange={(e) => setExtractionPrompt(e.target.value)}
              disabled={sourcesBusy}
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="w-full"
              onClick={() => handleFetch(true)}
              disabled={sourcesBusy}
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              Analyze with AI
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => handleFetch(false)}
              disabled={sourcesBusy}
            >
              Default Fetch
            </Button>
          </div>
        </div>
      )}

      {sourcesBusy && currentQueueUrl && fetchStartTime && (
        <AiProcessingDetails
          url={currentQueueUrl}
          prompt={promptApplied ? extractionPrompt : ""}
          startTime={fetchStartTime}
          isComplete={false}
        />
      )}

      {fetchPreview && (
        <div className="p-4 border rounded-lg space-y-3 bg-card shadow-sm animate-in fade-in">
          <h4 className="font-semibold text-sm">{fetchPreview.title || "No Title"}</h4>
          <p className="text-xs text-muted-foreground line-clamp-3">{fetchPreview.excerpt || fetchPreview.text}</p>
          <div className="flex justify-end gap-2">
            <ButtonRegular
              onClick={() => {
                setFetchPreview(null);
                setPromptApplied(false);
              }}
            >
              Discard
            </ButtonRegular>
            <Button
              onClick={async () => {
                setSourcesBusy(true);
                try {
                  const tabPayload = assignToTab ? { sourceTabId: assignToTab.id, sourceTabName: assignToTab.name } : null;
                  await addSourcesToNote(note?.id || "", [currentQueueUrl], tabPayload, [fetchPreview]);
                  removeCurrentUrlFromInput();
                  setFetchPreview(null);
                  setPromptApplied(false);
                  toast.success("Added to note!");
                } catch (e: unknown) {
                  const error = e as { message?: string };
                  toast.error("Failed to append source", { description: error?.message || "Unknown error" });
                } finally {
                  setSourcesBusy(false);
                }
              }}
            >
              Save to Note
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
