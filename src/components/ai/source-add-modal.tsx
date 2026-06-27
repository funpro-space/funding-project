"use client";

import { useEffect, useState, type MutableRefObject } from "react";
// Adapt or map these imports to your project's overlays & buttons:
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
} from "./overlays/modal"; 
import { Sparkles, Check, Plus } from "lucide-react";
import { ButtonRegular } from "./forms/button-regular";
import { SourcesIcon } from "./display/sources-icon";
import { cn } from "@/lib/utils";
import {
  DotDropdown,
  DotDropdownItem,
  DotDropdownSeparator,
} from "./navigation/dot-dropdown";
import type { Folder, Note, NoteSourceItem, NoteSourceType } from "@/types";

// Stub helper function for TBD items extraction
const extractTbdLineItemsFromTabHtml = (html: string) => {
  if (!html) return [];
  const matches = html.match(/.+?\[TBD\].+?/gi) || [];
  return matches.map(l => l.replace(/<[^>]*>/g, "").trim());
};

import { SourcesAddView } from "./sources-add-view";
import { SourcesListView } from "./sources-list-view";
import { AddTabModal } from "./add-tab-modal";

export interface SourcesModalProps {
  note: Note | null;
  folders: Folder[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "view";
  sourcesInput: string;
  setSourcesInput: (value: string) => void;
  sourcesBusy: boolean;
  setSourcesBusy: (value: boolean) => void;
  noteSources: NoteSourceItem[];
  sourcesLastLoadedAt: number;
  loadSourcesForNote: (noteId: string) => Promise<void>;
  addSourcesToNote: (
    noteId: string,
    urls: string[],
    tab?: { sourceTabId: string; sourceTabName?: string | null } | null,
    librarySources?: Record<string, unknown>[],
  ) => Promise<void>;
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
  /** When set, new URLs are stored as attached to this note tab (sources library). */
  assignToTab?: { id: string; name: string } | null;
  onAssignToTabChange?: (tab: { id: string; name: string } | null) => void;
  tabs?: { id: string; name: string }[];
  onCreateTab?: (name: string) => Promise<{ id: string; name: string }>;
  bodyEditorApiRef?: MutableRefObject<unknown>;
  /** Plain-text excerpt from the Main tab for AI context. */
  mainTabContextPlainText?: string;
  /** HTML of the tab used for [TBD] detection. */
  tabHtmlForTbd?: string | null;
}

export function SourceAddModal({
  note,
  folders,
  open,
  onOpenChange,
  mode = "add",
  sourcesInput,
  setSourcesInput,
  sourcesBusy,
  setSourcesBusy,
  noteSources,
  sourcesLastLoadedAt,
  loadSourcesForNote,
  addSourcesToNote,
  updateSourceOnNote,
  removeSourceFromNote,
  onCreateFolder,
  assignToTab = null,
  onAssignToTabChange,
  tabs = [],
  onCreateTab,
  bodyEditorApiRef,
  mainTabContextPlainText = "",
  tabHtmlForTbd = null,
}: SourcesModalProps) {
  const [viewState, setViewState] = useState<"list" | "add">(mode === "add" ? "add" : "list");
  const [aiModels, setAiModels] = useState<string[]>([]);
  const [extractionPrompt, setExtractionPrompt] = useState("");
  const [promptApplied, setPromptApplied] = useState(false);
  const [tbdLines, setTbdLines] = useState<string[]>([]);
  const [urlQueueIndex, setUrlQueueIndex] = useState(0);
  const [acceptedPreviews, setAcceptedPreviews] = useState<unknown[]>([]);
  const [fetchPreview, setFetchPreview] = useState<{ title?: string; excerpt?: string; text?: string } | null>(null);
  const [addTabOpen, setAddTabOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => {
      setViewState(mode === "add" ? "add" : "list");
      setUrlQueueIndex(0);
      setFetchPreview(null);
      setAcceptedPreviews([]);
      setExtractionPrompt("Summarize key facts");
      setTbdLines(extractTbdLineItemsFromTabHtml(tabHtmlForTbd ?? ""));
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void fetch("/api/ai/settings")
      .then((r) => r.json())
      .then((data: { settings?: { availableModels?: string[] } }) => {
        if (cancelled) return;
        const m = data.settings?.availableModels;
        setAiModels(Array.isArray(m) ? m : []);
      })
      .catch(() => {
        if (!cancelled) setAiModels([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <>
    <Modal
      open={open}
      onOpenChange={(nextOpen: boolean) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          setSourcesInput("");
        }
      }}
    >
      <ModalContent size="wide" padding="none">
        <ModalHeader className={cn("p-4 top-bar-nav-bg active")}>
          <ModalTitle className="flex items-center gap-2.5">
            <SourcesIcon className="size-5 shrink-0" />
            {viewState === "add" ? "Add Sources" : "Sources"}
            
            {viewState === "add" && (
              <div className="ml-2 flex items-center">
                <DotDropdown asChild>
                  <ButtonRegular>
                    <span className="dot-dropdown__trigger-label mr-1">
                      {assignToTab ? (assignToTab.name.trim() || assignToTab.id) : "Main"}
                    </span>
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }} className="overflow-visible">
                      <rect
                        className="rect-dropdown__block rect-dropdown__block--1"
                        x="30"
                        y="32"
                        width="16"
                        height="16"
                      />
                      <rect
                        className="rect-dropdown__block rect-dropdown__block--2"
                        x="54"
                        y="32"
                        width="16"
                        height="16"
                      />
                      <rect
                        className="rect-dropdown__block rect-dropdown__block--3"
                        x="42"
                        y="52"
                        width="16"
                        height="16"
                      />
                    </svg>
                  </ButtonRegular>
                  {tabs.map(tab => (
                    <DotDropdownItem
                      key={tab.id}
                      onClick={() => onAssignToTabChange?.(tab)}
                      selected={assignToTab?.id === tab.id}
                    >
                      {tab.name || tab.id}
                      {assignToTab?.id === tab.id && <Check className="ml-auto h-3.5 w-3.5 opacity-50" />}
                    </DotDropdownItem>
                  ))}
                  <DotDropdownSeparator />
                  <DotDropdownItem onClick={() => setAddTabOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create new tab...
                  </DotDropdownItem>
                </DotDropdown>
              </div>
            )}
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          {note?.legacySources?.summaryAttribution ? (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="font-medium">AI summary in this note</div>
                <p className="break-all text-muted-foreground">
                  From{" "}
                  <a
                    href={note.legacySources.summaryAttribution.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    {note.legacySources.summaryAttribution.sourceUrl}
                  </a>
                </p>
              </div>
            </div>
          ) : null}

          {viewState === "add" ? (
            <SourcesAddView
              note={note}
              sourcesInput={sourcesInput}
              setSourcesInput={setSourcesInput}
              sourcesBusy={sourcesBusy}
              setSourcesBusy={setSourcesBusy}
              addSourcesToNote={addSourcesToNote}
              assignToTab={assignToTab}
              bodyEditorApiRef={bodyEditorApiRef}
              mainTabContextPlainText={mainTabContextPlainText}
              tabHtmlForTbd={tabHtmlForTbd}
              onDone={() => onOpenChange(false)}
              extractionPrompt={extractionPrompt}
              setExtractionPrompt={setExtractionPrompt}
              promptApplied={promptApplied}
              setPromptApplied={setPromptApplied}
              tbdLines={tbdLines}
              setTbdLines={setTbdLines}
              urlQueueIndex={urlQueueIndex}
              setUrlQueueIndex={setUrlQueueIndex}
              acceptedPreviews={acceptedPreviews}
              setAcceptedPreviews={setAcceptedPreviews}
              fetchPreview={fetchPreview}
              setFetchPreview={setFetchPreview}
              onViewList={() => setViewState("list")}
            />
          ) : (
            <SourcesListView
              note={note}
              folders={folders}
              noteSources={noteSources}
              sourcesBusy={sourcesBusy}
              setSourcesBusy={setSourcesBusy}
              sourcesLastLoadedAt={sourcesLastLoadedAt}
              loadSourcesForNote={loadSourcesForNote}
              updateSourceOnNote={updateSourceOnNote}
              removeSourceFromNote={removeSourceFromNote}
              onCreateFolder={onCreateFolder}
              aiModels={aiModels}
              setViewState={setViewState}
            />
          )}

        </ModalBody>
      </ModalContent>
    </Modal>
    <AddTabModal
      open={addTabOpen}
      onOpenChange={setAddTabOpen}
      onCreateTab={onCreateTab}
      onAssignToTabChange={onAssignToTabChange}
    />
    </>
  );
}
