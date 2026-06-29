"use client";

import React from "react";
import { Modal, ModalContent } from "@/components/Modal";
import { useWorkspaceModal } from "@/components/providers/WorkspaceModalProvider";
import ProjectUpdatesView from "./ProjectUpdatesView";

export default function ProjectUpdatesModal() {
  const { isUpdatesOpen, closeUpdates } = useWorkspaceModal();

  return (
    <Modal open={isUpdatesOpen} onOpenChange={closeUpdates}>
      <ModalContent
        size="default"
        padding="none"
        showCloseButton={false}
        className="project-updates-modal-content"
      >
        <ProjectUpdatesView onClose={closeUpdates} />
      </ModalContent>
    </Modal>
  );
}
