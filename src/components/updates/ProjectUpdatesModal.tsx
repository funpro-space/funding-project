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
        className="level2-modal-content workspace-modal-content border border-zinc-800 bg-[#090d16]/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <ProjectUpdatesView onClose={closeUpdates} />
      </ModalContent>
    </Modal>
  );
}
