
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  hasFile?: boolean;
  fileName?: string;
  fileType?: string;
  pdfLinks?: Array<{title: string, url: string}>;
}
