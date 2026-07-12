export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  summary?: string;
  language: "ar" | "en";
  pageCount: number;
  wordCount: number;
  publicationYear?: string;
  category: string;
  keyThemes: string[];
  size: string;
  status: "uploaded" | "processing" | "analyzed";
  coverColor: string;
  content: string;
  collectionId?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  bookCount: number;
}

export interface Chunk {
  id: string;
  bookId: string;
  bookTitle: string;
  pageNumber: number;
  text: string;
  vector: number[];
}

export interface Citation {
  bookId: string;
  bookTitle: string;
  pageNumber: number;
  text: string;
  matchScore: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Citation[];
}

export interface ModelInfo {
  id: string;
  name: string;
  type: "llm" | "embedding" | "ocr" | "vector-db";
  status: "online" | "offline" | "loading";
  version: string;
  usage: string; // e.g. "Qwen 3.5 Instruct", "bge-m3", "DeepSeek-OCR"
  vram?: string;
}

export interface RAGConfig {
  chunkSize: number;
  chunkOverlap: number;
  searchLimit: number;
  systemPromptAr: string;
  systemPromptEn: string;
  activeModelId: string;
  activeEmbeddingId: string;
  ollamaEndpoint: string;
  ollamaModel: string;
  ollamaMode: "server" | "browser";
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "success" | "error";
  message: string;
  module: "OCR" | "CHUNKER" | "VECTOR" | "LLM" | "SYSTEM";
}
