export type NoteSourceType = 'web' | 'text' | 'file' | 'pdf';

export interface NoteSourceItem {
  id: string;
  name: string;
  url: string;
  sourceUrl?: string; // added for compatibility
  tags: string[];
  keyConcepts: string[];
  description: string;
  aiUsageGuide: string;
  contentType: NoteSourceType;
  category: string;
  libraryFolderId: string;
  relatedAiModel: string;
  isPrimaryReference: boolean;
}

export interface Folder {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  name?: string;
  content?: string;
  sourceItems?: NoteSourceItem[];
  legacySources?: {
    summaryAttribution?: {
      sourceUrl?: string;
    };
  };
}
