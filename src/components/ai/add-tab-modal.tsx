"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "./overlays/modal";
import { Button } from "./forms/button";

export interface AddTabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTab?: (name: string) => Promise<{ id: string; name: string }>;
  onAssignToTabChange?: (tab: { id: string; name: string } | null) => void;
}

export function AddTabModal({ open, onOpenChange, onCreateTab, onAssignToTabChange }: AddTabModalProps) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !onCreateTab) return;
    setBusy(true);
    try {
      const newTab = await onCreateTab(name.trim());
      onAssignToTabChange?.(newTab);
      onOpenChange(false);
      setName("");
    } catch {
      // Error handled by store/toast
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen: boolean) => {
        if (busy) return;
        onOpenChange(nextOpen);
        if (!nextOpen) setName("");
      }}
    >
      <ModalContent size="compact">
        <ModalHeader>
          <ModalTitle>Create new tab</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="py-2">
            <input
              autoFocus
              placeholder="Tab name..."
              className="w-full p-2 text-sm border rounded-md bg-background text-foreground"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSave();
                }
              }}
              disabled={busy}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="px-4 py-2 text-sm hover:bg-muted rounded-md transition-colors"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </button>
          <Button onClick={() => void handleSave()} disabled={busy || !name.trim()}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
