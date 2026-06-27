"use client";

import React from "react";
import { Modal, ModalContent } from "@/components/Modal";
import { useWorkspaceModal } from "@/components/providers/WorkspaceModalProvider";
import WorkspaceView from "./M_WorkspaceView";

export default function WorkspaceModal() {
  const { isOpen, closeWorkspace } = useWorkspaceModal();

  return (
    <Modal open={isOpen} onOpenChange={closeWorkspace}>
      <ModalContent size="wide" showCloseButton={false}>
        <WorkspaceView onClose={closeWorkspace} />
      </ModalContent>
    </Modal>
  );
}
