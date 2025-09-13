export interface APIReport {
  id: string;
  createdAt: string;
  metadata?: Record<string, string>;
  entries: APIEntry[];
}

export interface APIEntry {
  value?: number;
  tags?: string[];
  subentries?: APISubEntry[];
}

export interface APISubEntry {
  label?: string;
  dataPoints?: {
  timestamp: string;
  value: number;
}[];
}