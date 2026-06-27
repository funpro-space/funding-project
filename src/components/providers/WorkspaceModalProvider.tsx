"use client";

import React, { createContext, useContext, useState } from "react";

interface WorkspaceModalContextType {
  isOpen: boolean;
  openWorkspace: () => void;
  closeWorkspace: () => void;
  isUpdatesOpen: boolean;
  openUpdates: () => void;
  closeUpdates: () => void;
}

const WorkspaceModalContext = createContext<WorkspaceModalContextType | undefined>(undefined);

export function WorkspaceModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);

  const openWorkspace = () => setIsOpen(true);
  const closeWorkspace = () => setIsOpen(false);

  const openUpdates = () => setIsUpdatesOpen(true);
  const closeUpdates = () => setIsUpdatesOpen(false);

  return (
    <WorkspaceModalContext.Provider
      value={{
        isOpen,
        openWorkspace,
        closeWorkspace,
        isUpdatesOpen,
        openUpdates,
        closeUpdates,
      }}
    >
      {children}
    </WorkspaceModalContext.Provider>
  );
}

export function useWorkspaceModal() {
  const context = useContext(WorkspaceModalContext);
  if (!context) {
    throw new Error("useWorkspaceModal must be used within a WorkspaceModalProvider");
  }
  return context;
}
