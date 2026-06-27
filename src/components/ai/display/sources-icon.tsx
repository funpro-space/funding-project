"use client";

import React from "react";
import { FolderGit } from "lucide-react";

export function SourcesIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return <FolderGit className={className} size={size} />;
}
