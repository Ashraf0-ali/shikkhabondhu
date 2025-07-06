
export interface SearchResult {
  id: string;
  title?: string;
  subject?: string;
  question?: string;
  content?: string;
  chapter?: string;
  board?: string;
  year?: number;
  class_level?: number | string | null;
  file_url?: string;
  type: 'mcq' | 'board' | 'nctb' | 'notes';
  icon: any;
  relevance: number;
}

export interface SearchFilters {
  classFilter: number | null;
}
